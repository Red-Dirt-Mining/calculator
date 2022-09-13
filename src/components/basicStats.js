import React from "react"
import { Box, SimpleGrid, Tooltip } from "@chakra-ui/react"
import { convertUnits } from '../services/crunchNumbers'

const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const StatsCard = ({ title, stat, leftUnit, rightUnit }) => {
  return (
    <Tooltip
      width={208}
      bg={'#181919'}
      color={'white'}
      borderRadius={'lg'}
      borderColor={'white'}
      borderWidth={1}
      opacity={0.8}
      textAlign={'center'}
      label={`${leftUnit ?? ''}${addCommas(stat)}${rightUnit ?? ''}`}
    >
      <Box
        maxW={'xs'}
        borderRadius={6}
        overflow='hidden'
        backgroundColor={'black'}
        color={'white'}
        textAlign={'center'}
        boxShadow={'2xl'}
      >
        <Box p='3'>
          <Box
            mt='1'
            fontWeight='semibold'
            as='h4'
            lineHeight='150%'
            noOfLines={1}
            sx={{ fontFamily: "Montserrat", fontWeight: 500 }}
            fontSize={{xl: '11px', lg: '9px', md: '12px', sm: '10px', base: '8px'}}
          >
            {title}
          </Box>
          <Box
            sx={{ fontFamily: "Montserrat", fontWeight: 600 }}
            fontSize={{xl: '20px', lg: '15px', md: '20px', sm: '18px', base: '12px'}}
            lineHeight={'150%'}
          >
            {leftUnit}{convertUnits(stat)}{rightUnit}
          </Box>
        </Box>
      </Box>
    </Tooltip>
  )
}

export const BasicStats = ({ data }) => {

  return (
    <SimpleGrid columns={3} spacing={5} maxW={'3xl'}>
      <StatsCard title={"Avg. Cost of Production"} stat={data.costOfProduction} leftUnit={'$'} />
      <StatsCard title={"Electricity Break Even"} stat={data.breakevenElectricity} leftUnit={'$'} rightUnit={'/kWh'} />
      <StatsCard title={"CAPEX Break Even"} stat={data.breakevenMonth} rightUnit={data.breakevenMonth === 1 ? ' month' : ' months'} />
      <StatsCard title={"End Profit/Loss"} stat={data.endPL} rightUnit={' sats'} />
      <StatsCard title={"Total BTC Mined"} stat={data.totalMined} rightUnit={' sats'} />
      <StatsCard title={"Hashrate Profitability"} stat={data.satsPerTh} rightUnit={' sats/TH'} />
    </SimpleGrid>
  )
}
