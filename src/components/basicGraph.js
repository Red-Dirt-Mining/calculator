import React from 'react'
import {
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Bar,
  Line,
  ReferenceLine,
  Label,
  Legend,
} from 'recharts'

const graphColors = {
  cashflow: '#B04231',
  hardware: '#053A42',
  netPosition: '#2F8F9E',
  breakeven: '#7D443C',
  netMonthlyProfit: '#638269',
  monthlyRevenue: '#FAF4D4',
}

export const BasicGraph = ({ data }) => {
  const breakeven = data[0].breakeven

  const selectSeries = (event) => {
    let updatedLabels = [];
    for (let i = 0; i < this.state.labels.length; i++) {
      let label = this.state.labels[i];
      if (label.key !== event.dataKey) {
        updatedLabels.push(label);
      } else {
        if (/\s/.test(label.key)) {
          let newLabel = { key: label.key.trim(), color: label.color };
          updatedLabels.push(newLabel);
        } else {
          let newLabel = { key: label.key + " ", color: label.color };
          updatedLabels.push(newLabel);
        }
      }
    }
    this.setState({
      labels: updatedLabels
    });
  }

  return (
    <div style={{ width: 900, height: 600 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 80,
            bottom: 40,
            left: 100,
          }}
        >
          <XAxis
            dataKey="month"
            tick={null}
          />
          <YAxis 
            unit=" sats"
            stroke='#FFFFFF'
          />
          <YAxis yAxisId="right" orientation="right" tick={null} />
          <CartesianGrid stroke="#D9D9D9B2" />
          <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value) =>
                  new Intl.NumberFormat(undefined, {
                  }).format(value)
              }
              labelFormatter={(label) =>
                new Intl.NumberFormat(undefined, {
                }).format(label)
              }
          />
          <defs>
              <linearGradient
                  id="colorUv"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
              >
                  <stop
                      offset="5%"
                      stopColor="#8884d8"
                      stopOpacity={0.8}
                  />
                  <stop
                      offset="95%"
                      stopColor="#8884d8"
                      stopOpacity={0}
                  />
              </linearGradient>
          </defs>
          <Bar dataKey="monthlyRevenue" name='Net Monthly Revenue' barSize={20} fill={graphColors.monthlyRevenue} yAxisId='right' />
          <Bar dataKey="netMonthlyProfit" name='Net Monthly Profit' barSize={20} fill={graphColors.netMonthlyProfit} yAxisId='right' />
          <Line type="monotone" dataKey="hwValue" name='Hardware Value' stroke={graphColors.hardware} fill={graphColors.hardware} strokeWidth={3} dot={null} />
          <Line type="monotone" dataKey="cashflow" name='Cashflow' stroke={graphColors.cashflow} fill={graphColors.cashflow} strokeWidth={3} dot={null} />
          <Line type="monotone" dataKey="netPosition" name='Net Position' stroke={graphColors.netPosition} fill={graphColors.netPosition} strokeWidth={3} dot={null} />
          <ReferenceLine y={breakeven} stroke={graphColors.breakeven} strokeDasharray="4 4">
            <Label fill={graphColors.breakeven} position='top'>CAPEX breakeven</Label>
          </ReferenceLine>
          <Area
              type="monotone"
              dataKey="netProfitCumulative"
              name='Cumulative Net Profit'
              stroke="#8884d8"
              strokeWidth={2}
              fill="url(#colorUv)"
          />
          <Area
              type="monotone"
              dataKey="grossProfitCumulative"
              name='Cumulative Gross Profit'
              stroke="#orange"
              strokeWidth={2}
              fill="url(#colorUv)"
          />
          <Legend onClick={selectSeries} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
