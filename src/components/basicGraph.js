import React from 'react'
import { convertUnits } from '../services/crunchNumbers'
import { Text, HStack, Box } from '@chakra-ui/react'
import {
  ResponsiveContainer,
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
  hardware: '#07535F',
  netPosition: '#2F8F9E',
  breakeven: '#7D443C',
  netMonthlyProfit: '#638269',
  monthlyRevenue: '#FAF4D4',
  netProfitCumulative: '#777696',
  grossProfitCumulative: '#CD5C5C',
}

const renderCusomLegend = (props) => {
  const { payload } = props
  return (
    <div className="customized-legend">
      <Box
        width={{ base: '91%' }}
        backgroundColor={'#181919'}
        border={'1px solid white'}
        borderRadius={'lg'}
        p={2}
        display={{ lg: 'none' }}
      >
        <HStack>
        {
          payload.map((entry) => {
            const { dataKey, value, color } = entry
            return (
                <span className="legend-item" key={dataKey}>
                  <Text fontSize={{sm: 10, base: 8}} fontFamily={'Montserrat'} fontWeight={600} color={color} textAlign={'center'}>{value}</Text>
                </span>
            )
          })
        }
        </HStack>
      </Box>
    </div>
  )
}

const CustomTooltip = (data) => {
  const { active, payload, label, setActive, setPayload, setLabel } = data
  setActive(active)
  if (active && payload && payload.length) {
    setPayload(payload)
    setLabel(label)
    return null
  }

  return null;
};

const CustomLabel = (props) => {
  const { y, width } = props.viewBox
  return (
    <g>
      <rect x={(width / 2)} y={y-27} width="111" height="25" rx="6" fill="#181919"/>
      <rect x={(width / 2)} y={y-27} width="110" height="24" rx="5.5" fill="#181919" stroke="white" strokeOpacity="0.8"/>
      <text
        x={55+(width / 2)}
        y={y-14}
        fill='white'
        fontSize={11}
        fontFamily='Montserrat'
        fontWeight={600}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        CAPEX Breakeven
      </text>
    </g>
  )
}

export const BasicGraph = ({ data, setActive, setPayload, setLabel }) => {
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
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            left: 20,
          }}
        >
          <XAxis
            dataKey="month"
            tick={null}
          />
          <YAxis 
            unit={' sats'}
            stroke='#FFFFFF'
            style={{ fontSize: '14px', fontFamily: 'Montserrat', fontWeight: '500' }}
            tickFormatter={tick => convertUnits(tick)}
          />
          <YAxis yAxisId="right" orientation="right" tick={null} />
          <CartesianGrid stroke="#D9D9D9B2" fill='#181919' />
          <Tooltip
            content={<CustomTooltip setActive={setActive} setPayload={setPayload} setLabel={setLabel} />}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Bar dataKey="monthlyRevenue" name='Net Monthly Revenue' barSize={20} fill={graphColors.monthlyRevenue} yAxisId='right' />
          <Bar dataKey="netMonthlyProfit" name='Net Monthly Profit' barSize={20} fill={graphColors.netMonthlyProfit} yAxisId='right' />
          <Line type="monotone" dataKey="hwValue" name='Hardware Value' stroke={graphColors.hardware} fill={graphColors.hardware} strokeWidth={3} dot={null} />
          <Line type="monotone" dataKey="cashflow" name='Free Cashflow' stroke={graphColors.cashflow} fill={graphColors.cashflow} strokeWidth={3} dot={null} />
          <Line type="monotone" dataKey="netPosition" name='Net Position' stroke={graphColors.netPosition} fill={graphColors.netPosition} strokeWidth={3} dot={null} />
          <Line type="monotone" dataKey="netProfitCumulative" name='Cumulative Net Profit' stroke={graphColors.netProfitCumulative} fill={graphColors.netProfitCumulative} strokeWidth={3} dot={null} />
          <Line type="monotone" dataKey="grossProfitCumulative" name='Cumulative Gross Profit' stroke={graphColors.grossProfitCumulative} fill={graphColors.grossProfitCumulative} strokeWidth={3} dot={null} />
          <ReferenceLine y={breakeven} stroke={graphColors.breakeven} strokeWidth={2} strokeDasharray="4 4">
            <Label fill={graphColors.breakeven} position='top' content={CustomLabel}></Label>
          </ReferenceLine>
          <Legend onClick={selectSeries} content={renderCusomLegend} />
        </ComposedChart>
      </ResponsiveContainer>
  )
}
