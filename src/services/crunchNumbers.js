const constants = require("../helpers/constants")
const initialValues = require("../helpers/initialValues")

const calculateSubsidy = (blockHeight) => {
  // TODO: Cut off at end of emission schedule
  const epoch = Math.floor(blockHeight / constants.halvingEpoch)
  return 50 / Math.pow(2, epoch)
}

const calculateHalvingProgress = (blockHeight) => {
  const epoch = Math.floor(blockHeight / constants.halvingEpoch)
  const epochStart = epoch * constants.halvingEpoch
  const epochEnd = (epoch + 1) * constants.halvingEpoch
  const blocksLeft = epochEnd - blockHeight
  const epochProgress = blockHeight - epochStart
  const epochLength = epochEnd - epochStart
  return { halvingProgress: epochProgress / epochLength, halvingBlocks: blocksLeft }
}

const convertToTerra = (value) => {
  return Math.round( (value / Math.pow(10, 12)) * 1e2 ) / 1e2
}

const convertUnits = (value) => {
  if (value >= 1000000000000) {
    return `${(value / 1000000000000).toFixed(0)}T`
  }
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(0)}B`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  if (value <= -1000000000000) {
    return `${(value / 1000000000000).toFixed(0)}T`
  }
  if (value <= -1000000000) {
    return `${(value / 1000000000).toFixed(0)}B`
  }
  if (value <= -1000000) {
    return `${(value / 1000000).toFixed(0)}M`
  }
  if (value <= -1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value
}

const createDataSet = ({ values = initialValues, height }) => {
  const parsedValues = Object.keys(values).reduce((acc, key) => {
    acc[key] = parseFloat(values[key])
    return acc
  }, {})

  const annualDifficultyIncrease = parsedValues.networkDifficulty * parsedValues.difficultyIncrement / 100 // TODO: calculate per epoch
  // const difficultyIncrementPerEpoch = 0
  const annualPriceIncrease = parsedValues.priceIncrement * parsedValues.initialPrice / 100
  // const priceIncrementPerBlock = annualPriceIncrease / constants.blocksPerYear
  const hwDepreciationSatsPerMonth = parsedValues.hwValue * (parsedValues.hwDepreciation / 12) / 100
  const infraDepreciationSatsPerMonth = parsedValues.infraValue * (parsedValues.infraDepreciation / 12) / 100
  const networkHashrate = (difficulty) => {
    return difficulty * Math.pow(2, 32) / 600
  }
  const hourlyPowerDraw = parsedValues.powerConsumption / 1000
  const powerCostPerHourDollars = parsedValues.powerCostPerKwh * hourlyPowerDraw
  const powerCostPerDayDollars = powerCostPerHourDollars * 24

  const startUpPositionSats = parsedValues.hwValue + parsedValues.infraValue - parsedValues.capex
  const capitalGoodsSats = parsedValues.hwValue + parsedValues.infraValue

  let satsMined = 0
  let runningCostDollars = 0
  let runningPL = 0
  let breakevenMonth = 0

  let lowestMonthProfit = 0
  let breakevenElectricity = 0

  const timeSeriesData = Array.apply(null, Array(parsedValues.months)).map(function (x, i) { return { month: i + 1 } })

  timeSeriesData.forEach((d, i) => {
    const exchangeRate = parsedValues.initialPrice + ((annualPriceIncrease / 12) * i)
    const hashrate = networkHashrate(parsedValues.networkDifficulty + ((annualDifficultyIncrease / 12) * i))
    const hashrateShare = parsedValues.hashrate * constants.terraUnit / hashrate

    const depreciationCalculationSats = hwDepreciationSatsPerMonth * i + infraDepreciationSatsPerMonth * i // FIXME: these can depreciate at different rates
    const cumulativeDepreciationSats = depreciationCalculationSats > capitalGoodsSats ? capitalGoodsSats : depreciationCalculationSats

    const hwdepreciationCalculationSats = hwDepreciationSatsPerMonth * i
    const hwValueSats = hwdepreciationCalculationSats > parsedValues.hwValue ? 0 : parsedValues.hwValue - hwdepreciationCalculationSats

    // Net Profit Calculation
    const blockHeight = height + (i * constants.blocksPerMonth)
    const subsidy = calculateSubsidy(blockHeight)
    const monthlyRevenueSats = hashrateShare * constants.blocksPerMonth * (subsidy + parsedValues.txFees) * constants.satsPerBtc
    satsMined += monthlyRevenueSats
    const monthlyPowerExpenseSats = (powerCostPerDayDollars * constants.daysPerMonth) / exchangeRate * constants.satsPerBtc
    const monthlyFeesSats = (parsedValues.otherFees + parsedValues.poolFee) / 100 * monthlyRevenueSats
    const monthlyOpexSats = parsedValues.opex / exchangeRate * constants.satsPerBtc
    const monthlyExpensesSats = monthlyPowerExpenseSats + monthlyFeesSats + monthlyOpexSats
    runningCostDollars += ((monthlyExpensesSats / constants.satsPerBtc) * exchangeRate)
    const grossProfitSats = monthlyRevenueSats - monthlyExpensesSats
    runningPL += grossProfitSats

    // Power Cost Breakeven Calculation
    if (grossProfitSats === 0 && grossProfitSats < lowestMonthProfit) {
      lowestMonthProfit = grossProfitSats
      breakevenElectricity = parsedValues.powerCostPerKwh
    }
    if (lowestMonthProfit === 0 || grossProfitSats < lowestMonthProfit) {
      lowestMonthProfit = grossProfitSats
      const breakevenMonthlyPowerExpenses = monthlyPowerExpenseSats + grossProfitSats
      breakevenElectricity = breakevenMonthlyPowerExpenses / constants.satsPerBtc * exchangeRate / constants.daysPerMonth / 24 / hourlyPowerDraw
    }

    // Breakeven Month Calculation
    if (runningPL >= parsedValues.capex && breakevenMonth === 0) {
      breakevenMonth = i + 1
    }

    d.grossProfitCumulative = runningPL
    d.netProfitCumulative = runningPL - cumulativeDepreciationSats
    // Line charts
    d.hwValue = hwValueSats
    d.cashflow = runningPL + startUpPositionSats
    d.netPosition = runningPL + capitalGoodsSats - cumulativeDepreciationSats
    d.breakeven = parsedValues.capex
    // Bar charts
    d.monthlyRevenue = monthlyRevenueSats
    d.grossMonthlyProfit = grossProfitSats
  })

  if (breakevenMonth === 0 && runningPL > 0) {
    let breakevenPL = runningPL
    for (let i = parsedValues.months; breakevenPL < parsedValues.capex; i++) {
      const exchangeRate = parsedValues.initialPrice + ((annualPriceIncrease / 12) * i)
      const hashrate = networkHashrate(parsedValues.networkDifficulty + ((annualDifficultyIncrease / 12) * i))
      const hashrateShare = parsedValues.hashrate * constants.terraUnit / hashrate

      const monthlyRevenueSats = hashrateShare * constants.blocksPerMonth * (parsedValues.blockSubsidy + parsedValues.txFees) * constants.satsPerBtc
      const monthlyPowerExpenseSats = (powerCostPerDayDollars * constants.daysPerMonth) / exchangeRate * constants.satsPerBtc
      const monthlyFeesSats = (parsedValues.otherFees + parsedValues.poolFee) / 100 * monthlyRevenueSats
      const monthlyOpexSats = parsedValues.opex / exchangeRate * constants.satsPerBtc
      const monthlyExpensesSats = monthlyPowerExpenseSats + monthlyFeesSats + monthlyOpexSats
      breakevenPL += (monthlyRevenueSats - monthlyExpensesSats)
      if (breakevenPL >= parsedValues.capex) {
        breakevenMonth = i + 1
        break
      }
    }
  }

  const otherData = {
    costOfProduction: ((runningCostDollars) / (satsMined/constants.satsPerBtc)).toFixed(2),
    breakevenElectricity: breakevenElectricity.toFixed(2),
    breakevenMonth,
    endPL: runningPL.toFixed(0),
    totalMined: satsMined.toFixed(0),
    satsPerTh: (runningPL / parsedValues.hashrate).toFixed(0),
  }

  const data = {
    timeSeriesData,
    otherData,
  }

  return data
}

module.exports = {
  calculateSubsidy,
  calculateHalvingProgress,
  convertToTerra,
  convertUnits,
  createDataSet,
}
