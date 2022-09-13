import * as yup from 'yup'

export const validationSchema = yup.object().shape({
  months: yup.number().required('Required field').max(360, 'Max 360 months'),
  initialPrice: yup.number().required('Required field').max(100000000, 'Max $100,000,000'),
  networkDifficulty: yup.number().required('Required field').max(999999999999999, 'Max 999,999,999,999,999'),
  hashrate: yup.number().required('Required field').max(999999999999999, 'Max 999,999,999,999,999'),
  powerConsumption: yup.number().required('Required field').max(999999999999999, 'Max 999,999,999,999,999'),
  powerCostPerKwh: yup.number().required('Required field').max(20, 'Max $20/kWh'),
  blockSubsidy: yup.number().required('Required field').max(50, 'Max 50 BTC'),
  poolFee: yup.number().required('Required field').max(100, 'Max 100%'),
  txFees: yup.number().required('Required field').max(21000000, 'Max 21,000,000 BTC'),
  otherFees: yup.number().required('Required field').max(21000000, 'Max 21,000,000 BTC'),
  difficultyIncrement: yup.number().required('Required field').max(10000000, 'Max 10,000,000%'),
  priceIncrement: yup.number().required('Required field').max(10000000, 'Max 10,000,000%'),
  capex: yup.number().required('Required field').max(999999999999999, 'Max 999,999,999,999,999'),
  opex: yup.number().required('Required field').max(999999999999999, 'Max 999,999,999,999,999'),
  hwValue: yup.number().required('Required field').max(999999999999999, 'Max 999,999,999,999,999'),
  hwDepreciation: yup.number().required('Required field').max(100, 'Max 100%'),
  infraValue: yup.number().required('Required field').max(999999999999999, 'Max 999,999,999,999,999'),
  infraDepreciation: yup.number().required('Required field').max(100, 'Max 100%'),
  discountRate: yup.number().required('Required field').max(100, 'Max 100%'),
})
