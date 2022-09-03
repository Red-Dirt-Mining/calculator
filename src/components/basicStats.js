import React from "react"
import { Box, Center, SimpleGrid } from "@chakra-ui/react"

const StatsCard = ({ title, stat }) => {
  return (
    <Box maxW={'xs'} borderRadius={6} overflow='hidden' backgroundColor={'black'} color={'white'} textAlign={'center'} boxShadow={'dark-lg'} sx={{boxShadow: '4 4 10px 0 rgba(0,0,0,0.5)'}}>
      <Box p='3'>
        <Box
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
          sx={{ fontFamily: "Montserrat", fontWeight: 500, fontSize: 14, lineHeight: '150%' }}
        >
          {title}
        </Box>
        <Box sx={{ fontFamily: "Montserrat", fontWeight: 600, fontSize: 24, lineHeight: '150%' }}>
          {stat}
        </Box>
      </Box>
    </Box>
  )
}

export const BasicStats = ({ data }) => {
  
  const addCommas = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <Center w={'100%'} h={'100%'} p={4}>
    <SimpleGrid columns={3} spacing={5} maxW={'3xl'}>
      <StatsCard title={"Avg. Cost of Production"} stat={`${addCommas(data.costOfProduction)} USD`} />
      <StatsCard title={"Electricity Break Even"} stat={`${data.breakevenElectricity} USD/kWh`} />
      <StatsCard title={"CAPEX Break Even"} stat={`${data.breakevenMonth} Months`} />
      <StatsCard title={"End Profit/Loss"} stat={`${addCommas(data.endPL)} sats`} />
      <StatsCard title={"Total BTC Mined"} stat={`${addCommas(data.totalMined)} sats`} />
      <StatsCard title={"Performance"} stat={`${addCommas(data.satsPerTh)} sats/TH`} />
    </SimpleGrid>
    </Center>
  )
}
