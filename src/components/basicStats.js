import React from "react"

import { Card, CardContent, Typography, Grid } from "@mui/material"

export const BasicStats = ({ data }) => {
  
  const addCommas = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Avg. Cost of Production
            </Typography>
            <Typography variant="h5" component="div">
              {addCommas(data.costOfProduction)} USD
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Electricity Break Even
            </Typography>
            <Typography variant="h5" component="div">
              {data.breakevenElectricity} USD/kWh
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              CAPEX Break Even
            </Typography>
            <Typography variant="h5" component="div">
              {data.breakevenMonth} Months
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              End Profit/Loss
            </Typography>
            <Typography variant="h5" component="div">
              {addCommas(data.endPL)} sats
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Total BTC Mined
            </Typography>
            <Typography variant="h5" component="div">
              {addCommas(data.totalMined)} sats
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Performance
            </Typography>
            <Typography variant="h5" component="div">
              {addCommas(data.satsPerTh)} sats/TH
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
