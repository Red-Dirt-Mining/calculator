import { Heading, Text, Link } from "@chakra-ui/react"

export const BasicBlurb = () => {
  return (
    <div>
      <Heading
        as={'h1'}
        textAlign='center'
        color="white"
        mb={-4}
        fontSize={48}
        lineHeight={1}
        fontWeight={600}
        fontFamily={'Montserrat'}
        
      >
        THE OPEN SOURCE MINING CALCULATOR
      </Heading>
      <br />
      <Text
        textAlign='center'
        color="white"
        lineHeight={1.1}
        fontWeight= 'bold'
        fontFamily={'Montserrat'}
        fontSize={20}
        
      >
        The <Link color='#70443C' href='#'>
          FOSS
        </Link>, bitcoin-denominated profitability calculator.
      </Text>
    </div>
  )
}