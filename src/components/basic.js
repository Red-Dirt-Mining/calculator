import React, { useState, useEffect } from "react"
import { Flex, Tooltip, Input, Heading, Text, Button, FormControl, FormLabel, Box, VStack, InputRightElement, InputGroup } from "@chakra-ui/react"
// import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { Form, Formik, Field } from "formik"
import { BasicBlurb } from "./basicBlurb"
import { BasicGraph } from './basicGraph'
import { BasicStats } from './basicStats'
import { getBlockHeight, getHashrate, getDifficultyAdjustment } from "../services/blockchain"
import initialValues from "../helpers/initialValues"
const { createDataSet, calculateHalvingProgress/* , convertToTerra */ } = require("../services/crunchNumbers")

/* const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
})) */

// V1 MUST-HAVES
// FIXME: Block based time period – Nonce
// TODO: Halving adjustment – Nonce to check what I mean here
// TODO: Toggle graph options – RDM Outlaw https://recharts.org/en-US/examples/LegendEffectOpacity 
// TODO: Populate initial difficulty from API – Nonce
// TODO: Sensible input validation limits – Nonce

// V1 COSMETIC
// TODO: Pull out data to the side to income statement instead of tooltip – Nonce

// WISHLIST
// TODO: Add block height, current hash rate cards – Nonce
// TODO: onClick show full number, otherwise show abbreviated – RDM Outlaw
// TODO: An average difficulty adjustment per epoch instead of annual change (e.g. 2% average upward difficulty per epoch) – Think about the UX of this
// TODO: Presets e.g. hashrate growth, price growth, etc.
// TODO: Calculate for reinvesting in new HR
// TODO: Mark where net position begins to decline when depreciation is higher than net profit
// TODO: Switch between sats and dollars
// TODO: Can we do real-time graph updates as you scroll values on a given field? Helps get a sense of how certain inputs are affecting profitability
// TODO: Depreciation toggle against lifetime sats production. i.e. if half of sats are produced year 1, then ASICs depreciate by half that year. Toggle should change to time period
// TODO: Hide "advanced" options – Do we need? Sensible defaults instead?


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

  initialValues.networkDifficulty = Math.round(currentDifficulty) // convertToTerra(currentDifficulty)

  return (
    <Box
      w={'full'}
      h={'100vh'}
      bgGradient="linear(180deg, #181919 18.75%, #7D443C 100%)"
      >
      <BasicBlurb />
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
            <Form>
              <Flex
                w={'full'}
                h={'full'}
                direction={'row'}
                align={'center'}
                justify={'center'}
                color={'white'}
                >
                <Box flex={1} p={4}>
                  <Heading size='sm' textAlign={'center'} as="h2" color={'white'} sx={{ fontFamily: "Montserrat", fontWeight: 600 }} >INPUTS</Heading>
                  <div className="form-group">
                    <VStack spacing={1} >
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color={'white'}>Time Period</Text>
                          <Text color={'white'}>The time period you want to calculate profitability for.</Text>
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="months" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Time Period</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="months"
                            name="months"
                            value={values.months}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement
                            children="months"
                            color={'white'}
                            opacity={0.6}
                            pb={4}
                            pr={6}
                          />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color={'white'}>Initial Price</Text>
                          {"Price of Bitcoin in USD at the beginning of the time period."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="initialPrice" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Initial Price</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="initialPrice"
                            name="initialPrice"
                            value={values.initialPrice}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement color={'white'} opacity={0.6} pb='4' children={'USD'} />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color={'white'}>Network Difficulty</Text>
                          {"Difficulty to mine the next block."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="networkDifficulty" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Network Difficulty</FormLabel>
                        <Field
                          as={Input}
                          rounded={'md'}
                          color={'white'}
                          opacity={0.6}
                          id="networkDifficulty"
                          name="networkDifficulty"
                          value={values.networkDifficulty}
                          onChange={handleChange}
                          size={'sm'}
                          type='number'
                        />
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color="inherit">Hashrate</Text>
                          {"Size of mining operation in TH/s."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="hashrate" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Hashrate</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="hashrate"
                            name="hashrate"
                            value={values.hashrate}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement color={'white'} opacity={0.6} pb='4' children={'TH/s'} />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color="inherit">Power Consumption</Text>
                          {"Total amount of power consumed in a given time period in Watts."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="powerConsumption" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Power Consumption</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="powerConsumption"
                            name="powerConsumption"
                            value={values.powerConsumption}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement color={'white'} opacity={0.6} pb='4' mr={-2} children={'W'} />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color="inherit">Power Rate</Text>
                          {"Power price denominated in USD per Kwh."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="powerCostPerKwh" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Power Rate</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="powerCostPerKwh"
                            name="powerCostPerKwh"
                            value={values.powerCostPerKwh}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement color={'white'} opacity={0.6} pb='4' children={'USD'} />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color="inherit">Block Subsidy</Text>
                          {"Amount of new Bitcoin minted per block."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="blockSubsidy" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Block Subsidy</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="blockSubsidy"
                            name="blockSubsidy"
                            value={values.blockSubsidy}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement color={'white'} opacity={0.6} pb='4' children={'BTC'} />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color="inherit">Pool Fee</Text>
                          {"Percentage fees paid to a mining pool."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="poolFee" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Pool Fee</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="poolFee"
                            name="poolFee"
                            value={values.poolFee}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement color={'white'} opacity={0.6} pb='4' mr={-2} children={'%'} />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color="inherit">Average Transaction Fees</Text>
                          {"Average value of transaction fees per block mined."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="txFees" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Average Transaction Fees</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="txFees"
                            name="txFees"
                            value={values.txFees}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement color={'white'} opacity={0.6} pb='4' children={'BTC'} />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                    <Tooltip
                      label={
                        <React.Fragment>
                          <Text color="inherit">Other Fees</Text>
                          {"Additional operational expenses such as dev fees for firmware, management and hosting fees, etc."}
                        </React.Fragment>
                      }
                    >
                      <FormControl>
                        <FormLabel htmlFor="otherFees" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Other Fees</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            rounded={'md'}
                            color={'white'}
                            opacity={0.6}
                            id="otherFees"
                            name="otherFees"
                            value={values.otherFees}
                            onChange={handleChange}
                            size={'sm'}
                            type='number'
                          />
                          <InputRightElement color={'white'} opacity={0.6} pb='4' mr={-2} children={'%'} />
                        </InputGroup>
                      </FormControl>
                    </Tooltip>
                  </VStack>
                  </div>
                </Box>
                <Box flex={1} p={4}>
                <Heading size='sm' textAlign={'center'} as="h2" sx={{ fontFamily: "Montserrat", fontWeight: 600 }} >ADVANCED</Heading>
                  <div className="form-group">
                    <VStack spacing={1}>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="inherit">Difficulty Increment</Text>
                            {"Percentage change in difficulty per year."}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="difficultyIncrement" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Difficulty Increment</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="difficultyIncrement"
                              name="difficultyIncrement"
                              value={values.difficultyIncrement}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' pr={4} children={'%/year'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="inherit">Price Increment</Text>
                            {"Percentage change in price per year."}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="priceIncrement" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Price Increment</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="priceIncrement"
                              name="priceIncrement"
                              value={values.priceIncrement}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' pr={4} children={'%/year'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="inherit">Capital Expenditure</Text>
                            {"Initial capital expenditure denominated in sats."}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="capex" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Capital Expenditure</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="capex"
                              name="capex"
                              value={values.capex}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' children={'sats'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="inherit">Monthly Operating Expenses</Text>
                            {"Monthly operating expenses denominated in USD."}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="opex" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Monthly OpEx</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="opex"
                              name="opex"
                              value={values.opex}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' children={'USD'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="white">Initial Hardware Value</Text>
                            {"Value of hardware at time of purchase denominated in sats."}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="hwValue" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Initial Hardware Value</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="hwValue"
                              name="hwValue"
                              value={values.hwValue}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' children={'sats'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="inherit">Change in Hardware Value</Text>
                            {"Percentage appreciation or depreciation per year in hardware."}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="hwDepreciation" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Change in hardware value</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="hwDepreciation"
                              name="hwDepreciation"
                              value={values.hwDepreciation}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' pr={4} children={'%/year'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="inherit">Initial Infrastructure Value</Text>
                            {"Value of infrastructure at time of purchase denominated in sats."}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="infraValue" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Initial Infrastructure Value</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="infraValue"
                              name="infraValue"
                              value={values.infraValue}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' children={'sats'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="inherit">Change in Infrastructure Value</Text>
                            {"Percentage appreciation or depreciation per year in infrastructure"}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="infraDepreciation" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Change in Infrastructure Value</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="infraDepreciation"
                              name="infraDepreciation"
                              value={values.infraDepreciation}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' pr={4} children={'%/year'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Tooltip
                        label={
                          <React.Fragment>
                            <Text color="inherit">Discount Rate</Text>
                            {"Interest rate used to discount future cashflows to present value."}
                          </React.Fragment>
                        }
                      >
                        <FormControl>
                          <FormLabel htmlFor="discountRate" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Discount Rate</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              rounded={'md'}
                              color={'white'}
                              opacity={0.6}
                              id="discountRate"
                              name="discountRate"
                              value={values.discountRate}
                              onChange={handleChange}
                              size={'sm'}
                              type='number'
                              mb={6}
                            />
                            <InputRightElement color={'white'} opacity={0.6} pb='4' pr={4} children={'%/year'} />
                          </InputGroup>
                        </FormControl>
                      </Tooltip>
                      <Button type="submit" size={'sm'} width={'100%'} variant={'solid'} backgroundColor={'#638269'} border={'1px'} borderColor={'white'} _hover={{bg: '#FAF4D4', color: '#638269'}}>
                        Update
                      </Button>
                    </VStack>
                  </div>
                </Box>
                <Box flex={4} p={2} maxW={['-moz-fit-content', '-webkit-fit-content']}>
                  <BasicGraph data={data.timeSeriesData} />
                  <BasicStats data={data.otherData} />
                </Box>
              </Flex>
            </Form>
        )}
      </Formik>
    </Box>
  )
}



export default Basic
