import { Heading, Text, Link } from "@chakra-ui/react"

export const BasicBlurb = () => {
  return (
    <div>
      <Heading
        as={'h1'}
        textAlign='center'
        color="white"
        mb={-4}
        fontSize={{ base: '22px', md: '30px', lg: '36px' }}
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
        fontWeight= {500}
        fontFamily={'Montserrat'}
        fontSize={{ base: '14px', md: '16px', lg: '20px' }}
        
      >
        The <Link color='#70443C' href='https://github.com/Red-Dirt-Mining/calculator' target={'_blank'} rel={'noopener noreferrer'}>
          FOSS
        </Link>, bitcoin-denominated profitability calculator.
      </Text>
    </div>
  )
}
