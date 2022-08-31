import { Typography } from "@mui/material"

export const BasicBlurb = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" color="text.primary" sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>THE OPEN SOURCE MINING CALCULATOR</Typography>
      <br />
      <Typography variant="body1" component="p" color="text.primary" sx={{ fontFamily: "Montserrat", fontWeight: 500 }}>
        Welcome to the Red Dirt Mining sats-denominated mining calculator.
      </Typography>
      <br />
    </div>
  )
}