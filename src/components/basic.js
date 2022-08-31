import React, { useState, useEffect } from "react"

import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  tooltipClasses,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar
} from "@mui/material"
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { Form, Formik } from "formik"
import { BasicBlurb } from "./basicBlurb"
import { BasicGraph } from './basicGraph'
import { BasicStats } from './basicStats'
import { BasicFomo } from './basicFomo'
import { getBlockHeight, getHashrate, getDifficultyAdjustment } from "../services/blockchain"
import logo from './logo.jpg'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const initialValues = {
  months: 24,
  initialPrice: 30000,
  networkDifficulty: 28587155782195,
  abbreviatedDifficulty: 28.55,
  hashrate: 1200,
  powerConsumption: 35000,
  powerCostPerKwh: 0.06,
  blockSubsidy: 6.25,
  poolFee: 2,
  txFees: 0.1,
  otherFees: 0,
  difficultyIncrement: 50,
  priceIncrement: 100,
  capex: 0,
  opex: 0,
  hwValue: 0,
  hwDepreciation: 20,
  infraValue: 0,
  infraDepreciation: 0,
  hodlRatio: 0,
  discountRate: 0,
}

const constants = {
  rdmColors: {
    cream: 'f1ece4',
    red: '#7d443b',
    black: '#050e0f',
    yellow: '#e8cea5',
    purple: '#3a355a',
    gradient: 'linear-gradient(180deg, rgba(58,53,90,1) 0%, rgba(125,68,59,1) 100%)',
  },
  blockTime: 10,
  difficultyEpoch: 2016,
  halvingEpoch: 210000,
  blocksPerDay: 24 * 60 / 10,
  blocksPerMonth: 30 * 24 * 60 / 10,
  blocksPerYear: 365 * 24 * 60 / 10,
  daysPerMonth: 30,
  satsPerBtc: 100000000,
  terraUnit: 1000000000000,
}

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

const createDataSet = (values = initialValues) => {
  console.log({ values })
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
  console.log({ data })
  return data
}

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))

// V1 MUST-HAVES
// FIXME: Block based time period – Nonce
// TODO: Halving adjustment – Nonce to check what I mean here
// TODO: Toggle graph options – RDM Outlaw https://recharts.org/en-US/examples/LegendEffectOpacity 
// TODO: Hide "advanced" options – Do we need? Sensible defaults instead?
// TODO: Copy for hover state on input fields – RDM Outlaw
// TODO: Review field names – RDM Outlaw
// TODO: Populate initial difficulty from API – Nonce

// V1 COSMETIC
// FIXME: Remove number input adornment – RDM Outlaw
// TODO: Decide on data series colors – Put to Storm/Jack
// TODO: onClick show full number, otherwise show abbreviated – RDM Outlaw
// TODO: Pull out data to the side to income statement instead of tooltip – Nonce

// WISHLIST
// TODO: Add block height, current hash rate cards – Nonce
// TODO: An average difficulty adjustment per epoch instead of annual change (e.g. 2% average upward difficulty per epoch) – Think about the UX of this
// TODO: Presets e.g. hashrate growth, price growth, etc.
// TODO: Calculate for reinvesting in new HR
// TODO: Mark where net position begins to decline when depreciation is higher than net profit
// TODO: Switch between sats and dollars
// TODO: Can we do real-time graph updates as you scroll values on a given field? Helps get a sense of how certain inputs are affecting profitability
// TODO: Depreciation toggle against lifetime sats production. i.e. if half of sats are produced year 1, then ASICs depreciate by half that year
// Toggle should change to time period


let data = createDataSet(initialValues)

const Basic = () => {
  const [height, setHeight] = useState(0)
  const [difficultyProgress, setDifficultyProgress] = useState(0)
  const [difficultyBlocks, setDifficultyBlocks] = useState(0)
  const [currentDifficulty, setCurrentDifficulty] = useState(0)
  const [halvingProgress, setHalvingProgress] = useState(0)

  const loadData = async () => {
    const height = await getBlockHeight()
    const hashrate = await getHashrate()
    const difficulty = await getDifficultyAdjustment()
    setHalvingProgress(calculateHalvingProgress(height))
    setHeight(height)
    setDifficultyProgress(difficulty.progressPercent)
    setDifficultyBlocks(difficulty.remainingBlocks)
    setCurrentDifficulty(hashrate.currentDifficulty)
  }
  useEffect(() => {
    loadData()
    return () => { }
  }, [height])

  //modify network difficulty input
  const difficultyShortened = currentDifficulty.toString().length - 5;
  const difficultyDecimal = currentDifficulty / Math.pow(10, difficultyShortened)
  const difficultyFinal = difficultyDecimal.toFixed(2)

  return (


    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        const dataSet = createDataSet(values)
        data = dataSet
        console.log({ dataSet })
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, values, handleChange }) => (
        <ThemeProvider theme={darkTheme}>
          <Box sx={{ flexGrow: 1, pb: 3, }}>
            <AppBar position="static" sx={{ backgroundColor: constants.rdmColors.red }}>
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="home"
                  sx={{ mr: 2 }}
                >
                  <Avatar alt="Red Dirt Mining" src={logo} />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Difficulty Adjusted Calculator
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
          <Form>
            <Grid container spacing={3} backgroundColor="grey.900" padding="20px">
              <Grid item lg={2} xs={12}>
                <Typography variant="h6" component="h2" color="text.secondary" >Inputs</Typography>
                <br />
                <div className="form-group">
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Time Period</Typography>
                        {"The length of time to calculate profitability for in months."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Time Period"
                      id="months"
                      name="months"
                      value={values.months}
                      onChange={handleChange}
                      size="small"
                      // disabled
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">months</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Initial Price</Typography>
                        {"Price of Bitcoin in USD at the beginning of the time period."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Initial Price"
                      id="initialPrice"
                      name="initialPrice"
                      value={values.initialPrice}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Network Difficulty</Typography>
                        {"Difficulty to mine the next block."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Network Difficulty"
                      id="networkDifficulty"
                      name="networkDifficulty"
                      value={difficultyFinal}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">T</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Hashrate</Typography>
                        {"Size of mining operation in TH/s."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Hashrate"
                      id="hashrate"
                      name="hashrate"
                      value={values.hashrate}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">TH/s</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Power Consumption</Typography>
                        {"Total amount of power consumed in a given time period in Watts."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Power Consumption"
                      id="powerConsumption"
                      name="powerConsumption"
                      value={values.powerConsumption}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">W</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Power Rate</Typography>
                        {"Power price denominated in USD per Kwh."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Power Rate"
                      id="powerCostPerKwh"
                      name="powerCostPerKwh"
                      value={values.powerCostPerKwh}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Block Subsidy</Typography>
                        {"Amount of new Bitcoin minted per block."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Block Subsidy"
                      id="blockSubsidy"
                      name="blockSubsidy"
                      value={values.blockSubsidy}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Pool Fee</Typography>
                        {"Percentage fees paid to a mining pool."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Pool Fee"
                      id="poolFee"
                      name="poolFee"
                      value={values.poolFee}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Average Transaction Fees</Typography>
                        {"Average value of transaction fees per block mined."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Avg. TX Fees"
                      id="txFees"
                      name="txFees"
                      value={values.txFees}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Other Fees</Typography>
                        {"Additional operational expenses such as dev fees for firmware, management and hosting fees, etc."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Other Fees"
                      id="otherFees"
                      name="otherFees"
                      value={values.otherFees}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                </div>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h6" component="h2" color="text.secondary" >Advanced</Typography>
                <br />
                <div className="form-group">
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Difficulty Increment</Typography>
                        {"Percentage change in difficulty per year."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Difficulty Increment"
                      id="difficultyIncrement"
                      name="difficultyIncrement"
                      value={values.difficultyIncrement}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">%/year</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Price Increment</Typography>
                        {"Percentage change in price per year."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Price Increment"
                      id="priceIncrement"
                      name="priceIncrement"
                      value={values.priceIncrement}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">%/year</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Capital Expenditure</Typography>
                        {"Initial capital expenditure denominated in sats."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="CAPEX"
                      id="capex"
                      name="capex"
                      value={values.capex}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">sats</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Monthly Operating Expenses</Typography>
                        {"Monthly operating expenses denominated in USD."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Monthly OPEX"
                      id="opex"
                      name="opex"
                      value={values.opex}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Initial Hardware Value</Typography>
                        {"Value of hardware at time of purchase denominated in sats."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Initial Hardware Value"
                      id="hwValue"
                      name="hwValue"
                      value={values.hwValue}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">sats</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Change in Hardware Value</Typography>
                        {"Percentage appreciation or depreciation per year in hardware."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Change in Hardware Value"
                      id="hwDepreciation"
                      name="hwDepreciation"
                      value={values.hwDepreciation}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">%/year</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Initial Infrastructure Value</Typography>
                        {"Value of infrastructure at time of purchase denominated in sats."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Initial Infrastructure Value"
                      id="infraValue"
                      name="infraValue"
                      value={values.infraValue}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">sats</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Change in Hardware Value</Typography>
                        {"Percentage appreciation or depreciation per year in infrastructure"}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Change in Infrastructure Value"
                      id="infraDepreciation"
                      name="infraDepreciation"
                      value={values.infraDepreciation}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">%/year</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                  <br /><br />
                
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">Discount Rate</Typography>
                        {"Interest rate used to discount future cashflows to present value."}
                      </React.Fragment>
                    }
                  >
                    <TextField
                      label="Discount Rate"
                      id="discountRate"
                      name="discountRate"
                      value={values.discountRate}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      type='number'
                      InputProps={{
                        inputMode: 'numeric', pattern: '[0-9]*',
                        endAdornment: <InputAdornment position="end">%/year</InputAdornment>,
                      }}
                    />
                  </HtmlTooltip>
                </div>
                <br />
                <Button type="submit" fullWidth variant="outlined" disabled={isSubmitting}>
                  Update
                </Button>
              </Grid>
              <Grid item xs={6}>
                <BasicBlurb />
                {/* <BasicFomo
                  height={height}
                  difficultyProgress={difficultyProgress}
                  difficultyBlocks={difficultyBlocks}
                  halvingProgress={halvingProgress.halvingProgress}
                  halvingBlocks={halvingProgress.halvingBlocks}
                /> */}
                <BasicGraph data={data.timeSeriesData} />
                <BasicStats data={data.otherData} />
              </Grid>
            </Grid>
          </Form>
        </ThemeProvider>
      )}
    </Formik>
  )
}



export default Basic