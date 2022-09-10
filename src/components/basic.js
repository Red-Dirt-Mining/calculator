import React, { useState, useEffect } from "react"
import {
  Tooltip,
  Input,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Box,
  VStack,
  InputRightElement,
  InputGroup,
  HStack,
  Container,
  Stack,
  Flex,
  Spacer
} from "@chakra-ui/react"
import { Form, Formik, Field } from "formik"
import { BasicBlurb } from "./basicBlurb"
import { BasicGraph } from './basicGraph'
import { BasicStats } from './basicStats'
import { getHashrate, getBlockHeight/* , getDifficultyAdjustment */ } from "../services/blockchain"
import initialValues from "../helpers/initialValues"
const { createDataSet, convertUnits/* , calculateHalvingProgress, convertToTerra */ } = require("../services/crunchNumbers")

const StyledTooltip = ({ children, title, blurb, ...props }) => {
  return (
    <Tooltip
      width={{xl: 208, lg: 140, sm: 208, base: 140}}
      bg={'#181919'}
      color={'white'}
      borderRadius={'lg'}
      borderColor={'white'}
      borderWidth={1}
      opacity={0.8}
      placement={'bottom-start'}
      label={
        <React.Fragment>
          <Text sx={{ fontFamily: "Montserrat", fontWeight: 600, fontSize: '14px', lineHeight: '21px' }}>{title}</Text>
          <Text sx={{ fontFamily: "Montserrat", fontWeight: 600, fontSize: '12px', lineHeight: '18px' }}>{blurb}</Text>
        </React.Fragment>
      }
      {...props}
    >
      {children}
    </Tooltip>
  )
}

const StyledField = ({ children, ...props }) => {
  return (
    <Field
      width={{xl: 208, lg: 140, sm: 208, base: 140}}
      py={{base: 2}}
      mb={2}
      as={Input}
      rounded={'md'}
      bg={'#181919'}
      color={'white'}
      opacity={0.6}
      size={'sm'}
      type='number'
      focusBorderColor='#3A355A'
      {...props}
    >
      {children}
    </Field>
  )
}

const StyledFormLabel = ({ children, ...props }) => {
  return (
    <FormLabel
      mb={0}
      sx={{ fontFamily: "Montserrat", fontWeight: 600 }}
      fontSize={{xl: '16px', lg: '12px', sm: '16px', base: '12px'}}
      {...props}
    >
      {children}
    </FormLabel>
  )
}

const FormComponent = ({setData}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        const dataSet = createDataSet(values)
        setData(dataSet)
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, values, handleChange }) => (
        <Form>
          <HStack spacing={4} p={2}>
            <Box p={4}>
              <VStack spacing={1} width={{xl: 208, lg: 140, md: 208, sm: 208, base: 140}} >
                <Heading size='sm' pb={2} textAlign={'center'} w={208} as="h2" sx={{ fontFamily: "Montserrat", fontWeight: 600 }} >INPUTS</Heading>
                <StyledTooltip
                  title='Time Period'
                  blurb='The time period for which you wish to calculate profitability.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="months">Time Period</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="months"
                        name="months"
                        value={values.months}
                        onChange={handleChange}
                      />
                      <InputRightElement
                        children="months"
                        color={'white'}
                        opacity={0.6}
                        pb={3}
                        pr={6}
                      />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Initial Price'
                  blurb='Price of Bitcoin in USD at the beginning of the Time Period.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="initialPrice">Initial Price</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="initialPrice"
                        name="initialPrice"
                        value={values.initialPrice}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={1} children={'USD'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Network Difficulty'
                  blurb='Current difficulty to mine the next block.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="networkDifficulty">Network Difficulty</StyledFormLabel>
                    <StyledField
                      id="networkDifficulty"
                      name="networkDifficulty"
                      value={values.networkDifficulty}
                      onChange={handleChange}
                    />
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Hashrate'
                  blurb='Size of mining operation in TH/s.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="hashrate">Hashrate</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="hashrate"
                        name="hashrate"
                        value={values.hashrate}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={1} children={'TH/s'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Power Consumption'
                  blurb='Total amount of power consumed in a given time period in Watts.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="powerConsumption">Power Consumption</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="powerConsumption"
                        name="powerConsumption"
                        value={values.powerConsumption}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3'pr={1} mr={-2} children={'W'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Power Rate'
                  blurb='Price of power denominated in USD per kWh.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="powerCostPerKwh">Power Rate</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="powerCostPerKwh"
                        name="powerCostPerKwh"
                        value={values.powerCostPerKwh}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={1} children={'USD'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Block Subsidy'
                  blurb='Current amount of new Bitcoin minted per block.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="blockSubsidy">Block Subsidy</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="blockSubsidy"
                        name="blockSubsidy"
                        value={values.blockSubsidy}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={1} children={'BTC'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Pool Fee'
                  blurb='Percentage fee paid to a mining pool.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="poolFee">Pool Fee</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="poolFee"
                        name="poolFee"
                        value={values.poolFee}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' mr={-2} pr={1} children={'%'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Average Transaction Fees'
                  blurb='Average value of transaction fees per block.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="txFees">Avg. Transaction Fee</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="txFees"
                        name="txFees"
                        value={values.txFees}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={1} children={'BTC'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Other Fees'
                  blurb='Additional operational expenses such as dev fees for firmware, management and hosting fees, etc.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="otherFees">Other Fees</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="otherFees"
                        name="otherFees"
                        value={values.otherFees}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' mr={-2} pr={1} children={'%'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
              </VStack>
            </Box>
            <Box p={4}>
              <VStack spacing={1} width={{xl: 208, lg: 140, md: 208, sm: 208, base: 140}}>
                <Heading size='sm' pb={2} textAlign={'center'} w={208} as="h2" sx={{ fontFamily: "Montserrat", fontWeight: 600 }} >ADVANCED</Heading>
                <StyledTooltip
                  title='Difficulty Increment'
                  blurb='Percentage change in difficulty per year.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="difficultyIncrement">Difficulty Increment</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="difficultyIncrement"
                        name="difficultyIncrement"
                        value={values.difficultyIncrement}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={6} children={'%/year'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Price Increment'
                  blurb='Percentage change in price per year.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="priceIncrement">Price Increment</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="priceIncrement"
                        name="priceIncrement"
                        value={values.priceIncrement}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={6} children={'%/year'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Capital Expenditure'
                  blurb='Initial capital expenditure denominated in sats.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="capex">Capital Expenditure</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="capex"
                        name="capex"
                        value={values.capex}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={1} children={'sats'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Monthly Operating Expenses'
                  blurb='Monthly operating expenses denominated in USD.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="opex">Monthly OpEx</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="opex"
                        name="opex"
                        value={values.opex}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={1} children={'USD'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Initial Hardware Value'
                  blurb='Value of hardware at time of purchase denominated in sats.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="hwValue">Hardware Value</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="hwValue"
                        name="hwValue"
                        value={values.hwValue}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3'pr={1} children={'sats'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Change in Hardware Value'
                  blurb='Percentage appreciation or depreciation per year in hardware.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="hwDepreciation">Hardware Depr.</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="hwDepreciation"
                        name="hwDepreciation"
                        value={values.hwDepreciation}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={6} children={'%/year'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Initial Infrastructure Value'
                  blurb='Value of infrastructure at time of purchase denominated in sats.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="infraValue">Infrastructure Value</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="infraValue"
                        name="infraValue"
                        value={values.infraValue}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={1} children={'sats'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Change in Infrastructure Value'
                  blurb='Percentage appreciation or depreciation per year in infrastructure.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="infraDepreciation">Infrastructure Depr.</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="infraDepreciation"
                        name="infraDepreciation"
                        value={values.infraDepreciation}
                        onChange={handleChange}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={6} children={'%/year'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <StyledTooltip
                  title='Discount Rate'
                  blurb='Interest rate used to discount future cashflows to present value.'
                >
                  <FormControl>
                    <StyledFormLabel htmlFor="discountRate">Discount Rate</StyledFormLabel>
                    <InputGroup>
                      <StyledField
                        id="discountRate"
                        name="discountRate"
                        value={values.discountRate}
                        onChange={handleChange}
                        mb={8}
                      />
                      <InputRightElement color={'white'} opacity={0.6} pb='3' pr={6} children={'%/year'} />
                    </InputGroup>
                  </FormControl>
                </StyledTooltip>
                <FormControl>
                  <Button type="submit" mb={2} size={'sm'} width={'100%'} variant={'solid'} backgroundColor={'#3A355A'} border={'1px'} borderColor={'white'} _hover={{bg: '#322b64',}}>
                    Update
                  </Button>
                </FormControl>
              </VStack>
            </Box>
          </HStack>
        </Form>
      )}
    </Formik>
  )
}

const IncomeStatement = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        position={'absolute'}
        left={{ '2xl': '20%', xl: '14%', lg: '13%', md: '25%', sm: '20%', base: '5%' }}
        zIndex={2}
        backgroundColor={'#181919'}
        border={'1px solid white'}
        borderRadius={'lg'}
        fontFamily={'Montserrat'}
        p={2}
        px={6}
        pt={4}
      >
        <Heading textAlign={'center'} size={'sm'} fontWeight={500}>INCOME STATEMENT</Heading>
        <Text textAlign={'center'} mb={8}>{`Month ${label}`}</Text>
        <Box
          backgroundColor={payload[0].color}
          color={'#181919'}
          borderRadius={'lg'}
          width={{base: '290px', md: '375px', lg: '290px', xl: '375px'}}
          fontSize={14}
          fontWeight={600}
          p={2}
          mb={8}
        >
          <Flex justifyContent={'space-between'}>
            <Text>{`${payload[0].name}:`}</Text>
            <Text>{`${convertUnits(payload[0].value)} sats`}</Text>
          </Flex>
        </Box>
        <Box
          backgroundColor={payload[1].color}
          borderRadius={'lg'}
          width={{base: '290px', md: '375px', lg: '290px', xl: '375px'}}
          fontSize={14}
          fontWeight={600}
          p={2}
          mb={8}
        >
          <Flex justifyContent={'space-between'}>
            <Text>{`${payload[1].name}:`}</Text>
            <Text>{`${convertUnits(payload[1].value)} sats`}</Text>
          </Flex>
        </Box>
        <Box
          backgroundColor={payload[2].color}
          borderRadius={'lg'}
          width={{base: '290px', md: '375px', lg: '290px', xl: '375px'}}
          fontSize={14}
          fontWeight={600}
          p={2}
          mb={8}
        >
          <Flex justifyContent={'space-between'}>
            <Text>{`${payload[2].name}:`}</Text>
            <Text>{`${convertUnits(payload[2].value)} sats`}</Text>
          </Flex>
        </Box>
        <Box
          backgroundColor={payload[3].color}
          borderRadius={'lg'}
          width={{base: '290px', md: '375px', lg: '290px', xl: '375px'}}
          fontSize={14}
          fontWeight={600}
          p={2}
          mb={8}
        >
          <Flex justifyContent={'space-between'}>
            <Text>{`${payload[3].name}:`}</Text>
            <Text>{`${convertUnits(payload[3].value)} sats`}</Text>
          </Flex>
        </Box>
        <Box
          backgroundColor={payload[4].color}
          borderRadius={'lg'}
          width={{base: '290px', md: '375px', lg: '290px', xl: '375px'}}
          fontSize={14}
          fontWeight={600}
          p={2}
          mb={8}
        >
          <Flex justifyContent={'space-between'}>
            <Text>{`${payload[4].name}:`}</Text>
            <Text>{`${convertUnits(payload[4].value)} sats`}</Text>
          </Flex>
        </Box>
        <Box
          backgroundColor={payload[5].color}
          borderRadius={'lg'}
          width={{base: '290px', md: '375px', lg: '290px', xl: '375px'}}
          fontSize={14}
          fontWeight={600}
          p={2}
          mb={8}
        >
          <Flex justifyContent={'space-between'}>
            <Text>{`${payload[5].name}:`}</Text>
            <Text>{`${convertUnits(payload[5].value)} sats`}</Text>
          </Flex>
        </Box>
        <Box
          backgroundColor={payload[6].color}
          borderRadius={'lg'}
          width={{base: '290px', md: '375px', lg: '290px', xl: '375px'}}
          fontSize={14}
          fontWeight={600}
          p={2}
          mb={8}
        >
          <Flex justifyContent={'space-between'}>
            <Text>{`${payload[6].name}:`}</Text>
            <Text>{`${convertUnits(payload[6].value)} sats`}</Text>
          </Flex>
        </Box>
      </Box>
    );
  }

  return null;
};

const Basic = () => {
  const [data, setData] = useState(createDataSet(initialValues))
  const [currentDifficulty, setCurrentDifficulty] = useState(0)
  const [height, setHeight] = useState(0)
  // const [difficultyProgress, setDifficultyProgress] = useState(0)
  // const [difficultyBlocks, setDifficultyBlocks] = useState(0)
  // const [halvingProgress, setHalvingProgress] = useState(0)

  const [active, setActive] = useState(false)
  const [payload, setPayload] = useState([])
  const [label, setLabel] = useState(null)

  const loadData = async () => {
    const hashrate = await getHashrate()
    setCurrentDifficulty(hashrate.currentDifficulty)
    const height = await getBlockHeight()
    setHeight(height)
    // const difficulty = await getDifficultyAdjustment()
    // setHalvingProgress(calculateHalvingProgress(height))
    // setDifficultyProgress(difficulty.progressPercent)
    // setDifficultyBlocks(difficulty.remainingBlocks)
  }
  useEffect(() => {
    loadData()
    setData(createDataSet(initialValues))
    return () => { }
  }, [height])

  initialValues.networkDifficulty = Math.round(currentDifficulty) // convertToTerra(currentDifficulty)

  return (
    <Box
      bgGradient="linear(180deg, #181919 18.75%, #7D443C 100%)"
      pt={5}
      >
      <BasicBlurb />
      <Container maxW={'7xl'} color={'white'} mt={-20} overflow={'hidden'}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', lg: 'row' }}>
            <Spacer />
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <FormComponent setData={setData} />
            <IncomeStatement active={active} payload={payload} label={label} />
          </Stack>
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Box
              p={-4}
              m={-4}
              ml={{ sm: 19, lg: 0 }}
              height={{xl: 400, lg: 310, md: 330, sm: 300, base: 280}}
              width={{xl: 730, lg: 570, md: 600, sm: 540, base: 416}}
              overflow={'hidden'}>
              <BasicGraph data={data.timeSeriesData} setActive={setActive} setPayload={setPayload} setLabel={setLabel} />
            </Box>
            <BasicStats data={data.otherData} />
          </Stack>
          <Spacer />
        </Stack>
      </Container>
    </Box>
  )
}



export default Basic
