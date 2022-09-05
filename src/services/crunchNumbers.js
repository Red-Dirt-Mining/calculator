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

const createDataSet = (values = initialValues) => {
  const annualDifficultyIncrease = values.networkDifficulty * values.difficultyIncrement / 100 // TODO: calculate per epoch
  const difficultyIncrementPerEpoch = 0
  const annualPriceIncrease = values.priceIncrement * values.initialPrice / 100
  const priceIncrementPerBlock = annualPriceIncrease / constants.blocksPerYear
  const hwDepreciationPerMonth = values.hwValue * (values.hwDepreciation / 12) / 100
  const infraDepreciationPerMonth = values.infraValue * (values.infraDepreciation / 12) / 100
  const networkHashrate = (difficulty) => {
    return difficulty * Math.pow(2, 32) / 600
  }
  const hourlyPowerDraw = values.powerConsumption / 1000
  const powerCostPerHour = values.powerCostPerKwh * hourlyPowerDraw
  const powerCostPerDay = powerCostPerHour * 24

  const startUpPosition = values.hwValue + values.infraValue - values.capex
  const capitalGoods = values.hwValue + values.infraValue

  let satsMined = 0
  let runningCostDollars = 0
  let runningPL = 0
  let breakevenMonth = 0

  let lowestMonthProfit = 0
  let breakevenElectricity = 0

  const timeSeriesData = Array.apply(null, Array(values.months)).map(function (x, i) { return { month: i + 1 } })
  timeSeriesData.forEach((d, i) => {
    const exchangeRate = values.initialPrice + ((annualPriceIncrease / 12) * i)
    const hashrate = networkHashrate(values.networkDifficulty + ((annualDifficultyIncrease / 12) * i))
    const hashrateShare = values.hashrate * constants.terraUnit / hashrate

    const depreciationCalculation = hwDepreciationPerMonth * i + infraDepreciationPerMonth * i // FIXME: these can depreciate at different rates
    const cumulativeDepreciation = depreciationCalculation > capitalGoods ? capitalGoods : depreciationCalculation

    const hwDepreciationCalculation = hwDepreciationPerMonth * i
    const hwValue = hwDepreciationCalculation > values.hwValue ? 0 : values.hwValue - hwDepreciationCalculation

    // Net Profit Calculation
    const blockHeight = 736292 + (i * constants.blocksPerMonth)
    const subsidy = calculateSubsidy(blockHeight)
    const monthlyRevenue = hashrateShare * constants.blocksPerMonth * (subsidy + values.txFees) * constants.satsPerBtc
    satsMined += monthlyRevenue
    const monthlyPowerExpense = (powerCostPerDay * constants.daysPerMonth) / exchangeRate * constants.satsPerBtc
    const monthlyFees = (values.otherFees + values.poolFee) / 100 * monthlyRevenue
    const monthlyOpex = values.opex / exchangeRate * constants.satsPerBtc
    const monthlyExpenses = monthlyPowerExpense + monthlyFees + monthlyOpex
    runningCostDollars += (monthlyExpenses / constants.satsPerBtc * exchangeRate)
    const netProfit = monthlyRevenue - monthlyExpenses
    runningPL += netProfit

    // Power Cost Breakeven Calculation
    if (netProfit === 0 && netProfit < lowestMonthProfit) {
      lowestMonthProfit = netProfit
      breakevenElectricity = values.powerCostPerKwh
    }
    if (lowestMonthProfit === 0 || netProfit < lowestMonthProfit) {
      lowestMonthProfit = netProfit
      const breakevenMonthlyPowerExpenses = monthlyPowerExpense + netProfit
      breakevenElectricity = breakevenMonthlyPowerExpenses / constants.satsPerBtc * exchangeRate / constants.daysPerMonth / 24 / hourlyPowerDraw
    }

    // Breakeven Month Calculation
    if (runningPL >= values.capex && breakevenMonth === 0) {
      breakevenMonth = i + 1
    }

    d.netProfitCumulative = runningPL
    d.grossProfitCumulative = runningPL - cumulativeDepreciation
    // Line charts
    d.hwValue = hwValue
    d.cashflow = runningPL + startUpPosition
    d.netPosition = runningPL + capitalGoods - cumulativeDepreciation
    d.breakeven = values.capex
    // Bar charts
    d.monthlyRevenue = monthlyRevenue
    d.netMonthlyProfit = netProfit
  })

  if (breakevenMonth === 0 && runningPL > 0) {
    let breakevenPL = runningPL
    for (let i = values.months; breakevenPL < values.capex; i++) {
      const exchangeRate = values.initialPrice + ((annualPriceIncrease / 12) * i)
      const hashrate = networkHashrate(values.networkDifficulty + ((annualDifficultyIncrease / 12) * i))
      const hashrateShare = values.hashrate * constants.terraUnit / hashrate

      const monthlyRevenue = hashrateShare * constants.blocksPerMonth * (values.blockSubsidy + values.txFees) * constants.satsPerBtc
      const monthlyPowerExpense = (powerCostPerDay * constants.daysPerMonth) / exchangeRate * constants.satsPerBtc
      const monthlyFees = (values.otherFees + values.poolFee) / 100 * monthlyRevenue
      const monthlyOpex = values.opex / exchangeRate * constants.satsPerBtc
      const monthlyExpenses = monthlyPowerExpense + monthlyFees + monthlyOpex
      breakevenPL += (monthlyRevenue - monthlyExpenses)
      if (breakevenPL >= values.capex) {
        breakevenMonth = i + 1
        break
      }
    }
  }

  const otherData = {
    costOfProduction: (satsMined / (runningCostDollars)).toFixed(2),
    breakevenElectricity: breakevenElectricity.toFixed(2),
    breakevenMonth,
    endPL: runningPL.toFixed(0),
    totalMined: satsMined.toFixed(0),
    satsPerTh: (satsMined / values.hashrate).toFixed(0),
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
