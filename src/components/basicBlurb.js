import { Typography } from "@mui/material"

export const BasicBlurb = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" color="text.secondary">The Open Source Mining Calculator</Typography>
      <br />
      <Typography variant="body1" component="p" color="text.secondary">
        Welcome to the Red Dirt Mining sats-denominated mining calculator.
      </Typography>
      <br />
    </div>
  )
}