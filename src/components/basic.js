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
  Flex
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
      width={208}
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
      width={{xl: 208, lg: 140, md: 208, sm: 208, base: 208}}
      padding={{xl: 2, lg: 2, md: 2, sm: 2, base: 2}}
      mb={2}
      as={Input}
      rounded={'md'}
      bg={'#181919'}
      color={'white'}
      opacity={0.6}
      size={'sm'}
      type='number'
      {...props}
    >
      {children}
    </Field>
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
                <VStack spacing={1} width={{xl: 208, lg: 140, md: 208, sm: 208, base: 208}} >
                <Heading size='sm' pb={2} textAlign={'center'} w={208} as="h2" sx={{ fontFamily: "Montserrat", fontWeight: 600 }} >INPUTS</Heading>
                <StyledTooltip
                  title='Time Period'
                  blurb='The time period for which you wish to calculate profitability.'
                >
                  <FormControl>
                    <FormLabel htmlFor="months" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Time Period</FormLabel>
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
                    <FormLabel htmlFor="initialPrice" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Initial Price</FormLabel>
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
                    <FormLabel htmlFor="networkDifficulty" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Network Difficulty</FormLabel>
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
                    <FormLabel htmlFor="hashrate" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Hashrate</FormLabel>
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
                    <FormLabel htmlFor="powerConsumption" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Power Consumption</FormLabel>
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
                    <FormLabel htmlFor="powerCostPerKwh" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Power Rate</FormLabel>
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
                    <FormLabel htmlFor="blockSubsidy" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Block Subsidy</FormLabel>
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
                    <FormLabel htmlFor="poolFee" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Pool Fee</FormLabel>
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
                    <FormLabel htmlFor="txFees" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Avg. Transaction Fees</FormLabel>
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
                    <FormLabel htmlFor="otherFees" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Other Fees</FormLabel>
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
              <Heading size='sm' pb={2} textAlign={'center'} w={208} as="h2" sx={{ fontFamily: "Montserrat", fontWeight: 600 }} >ADVANCED</Heading>
                <VStack spacing={1} width={{xl: 208, lg: 140, md: 208, sm: 208, base: 208}}>
                  <StyledTooltip
                    title='Difficulty Increment'
                    blurb='Percentage change in difficulty per year.'
                  >
                    <FormControl>
                      <FormLabel htmlFor="difficultyIncrement" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Difficulty Increment</FormLabel>
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
                      <FormLabel htmlFor="priceIncrement" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Price Increment</FormLabel>
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
                      <FormLabel htmlFor="capex" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Capital Expenditure</FormLabel>
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
                      <FormLabel htmlFor="opex" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Monthly OpEx</FormLabel>
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
                      <FormLabel htmlFor="hwValue" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Hardware Value</FormLabel>
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
                      <FormLabel htmlFor="hwDepreciation" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Hardware Depr.</FormLabel>
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
                      <FormLabel htmlFor="infraValue" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Infrastructure Value</FormLabel>
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
                      <FormLabel htmlFor="infraDepreciation" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Infrastructure Depr.</FormLabel>
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
                      <FormLabel htmlFor="discountRate" mb={0} sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>Discount Rate</FormLabel>
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
      w={'full'}
      h={'full'}
      bgGradient="linear(180deg, #181919 18.75%, #7D443C 100%)"
      >
      <BasicBlurb />
      <Container maxW={'7xl'} color={'white'} mt={-20}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', lg: 'row' }}>
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <FormComponent setData={setData} />
            <IncomeStatement active={active} payload={payload} label={label} />
          </Stack>
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Box
              p={-4}
              m={-4}
              height={400}
              width={{xl: 740, lg: 658, md: 568, sm: 686, base: 416}}
              overflow={'hidden'}>
              <BasicGraph data={data.timeSeriesData} setActive={setActive} setPayload={setPayload} setLabel={setLabel} />
            </Box>
            <BasicStats data={data.otherData} />
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}



export default Basic
