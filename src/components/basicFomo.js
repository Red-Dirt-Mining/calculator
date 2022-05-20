import React from "react"

import { Card, CardContent, Typography, Grid, LinearProgress, Box } from "@mui/material"

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value * 10
        ) / 10}%`}</Typography>
        <Typography variant="body2" color="text.secondary">{`${props.countdown} days left`}</Typography>
      </Box>
    </Box>
  );
}

export const BasicFomo = () => {

  return (
    <Grid container spacing={1} style={{ paddingBottom: "5vh" }}>
      <Grid item xs={8}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Progress to next halving
            </Typography>
            <LinearProgressWithLabel value={49.9} countdown={729} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Exchange Rate
            </Typography>
            <Typography variant="h7" component="div">
              1 sat = 1 sat
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
