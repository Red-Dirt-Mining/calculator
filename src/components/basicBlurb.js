import { Heading, Text } from "@chakra-ui/react"

export const BasicBlurb = () => {
  return (
    <div>
      <Heading as={'h1'} size={'xl'} textAlign='center' color="white" sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>THE OPEN SOURCE MINING CALCULATOR</Heading>
      <br />
      <Text textAlign='center' color="white" sx={{ fontFamily: "Montserrat", fontWeight: 500 }}>
        Welcome to the Red Dirt Mining sats-denominated mining calculator.
      </Text>
      <br />
    </div>
  )
}