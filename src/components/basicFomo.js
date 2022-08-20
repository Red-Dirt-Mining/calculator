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
        <Typography variant="body2" color="text.secondary">{`~ ${props.countdown} days left`}</Typography>
      </Box>
    </Box>
  );
}

const calculateDaysFromBlocks = (blocks) => {
  return ((blocks*10)/60/24).toFixed(1)
}

export const BasicFomo = (props) => {
  const { height, difficultyProgress, difficultyBlocks, halvingProgress, halvingBlocks } = props

  return (
    <Grid container spacing={1} style={{ paddingBottom: "5vh" }}>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Progress to next halving
            </Typography>
            <LinearProgressWithLabel value={halvingProgress * 100} countdown={calculateDaysFromBlocks(halvingBlocks)} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Progress to difficulty adjustment
            </Typography>
            <LinearProgressWithLabel value={difficultyProgress} countdown={calculateDaysFromBlocks(difficultyBlocks)} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
