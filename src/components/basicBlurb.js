import { Heading, Text } from "@chakra-ui/react"

export const BasicBlurb = () => {
  return (
    <div>
      <Heading
        as={'h1'}
        textAlign='center'
        color="white"
        mb={-4}
        fontSize={{ base: 'xl', sm: '2xl', lg: '4xl' }}
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
        fontWeight={500}
        fontFamily={'Montserrat'}
      >
        Welcome to the Red Dirt Mining sats-denominated mining calculator.
      </Text>
      <br />
    </div>
  )
}