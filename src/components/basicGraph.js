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
              label={{ value: 'Time Period', offset: -20, position: 'insideBottom', fill: "#ff7300" }}
          />
          <YAxis 
            unit=" sats"
            /* label={{ value: 'Cumulative Profit', offset: -80, angle: -90, position: 'insideLeft', fill: "#ff7300" }} */
          />
          <CartesianGrid stroke="#f5f5f5" />
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
          <Bar dataKey="monthlyRevenue" name='Net Monthly Revenue' barSize={20} fill="#413ea0" />
          <Bar dataKey="netMonthlyProfit" name='Net Monthly Profit' barSize={20} fill="grey" />
          <Line type="monotone" dataKey="hwValue" name='Hardware Value' stroke="#ff7300" fill="#ff7300" />
          <Line type="monotone" dataKey="cashflow" name='Cashflow' stroke="#ff7300" fill="#ff7300" />
          <Line type="monotone" dataKey="netPosition" name='Net Position' stroke="#ff7300" fill="#ff7300" />
          <ReferenceLine y={breakeven} stroke="red" strokeDasharray="3 3">
            <Label fill='red' position='top'>CAPEX breakeven</Label>
          </ReferenceLine>
          <Legend onClick={selectSeries} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
