import * as yup from 'yup'

export const validationSchema = yup.object().shape({
  months: yup.number().required('Required field').max(360, 'Max 360 months').typeError('Must be a number'),
  initialPrice: yup.number().required('Required field').max(100000000, 'Max $100,000,000').typeError('Must be a number'),
  networkDifficulty: yup.number().required('Required field').max(999999999999999, 'Max 999,999,999,999,999').typeError('Must be a number'),
  hashrate: yup.number().required('Required field').max(999999999999, 'Max 999,999,999,999').typeError('Must be a number'),
  powerConsumption: yup.number().required('Required field').max(999999999, 'Max 999,999,999').typeError('Must be a number'),
  powerCostPerKwh: yup.number().required('Required field').max(20, 'Max $20/kWh').typeError('Must be a number'),
  blockSubsidy: yup.number().required('Required field').max(50, 'Max 50 BTC').typeError('Must be a number'),
  poolFee: yup.number().required('Required field').max(100, 'Max 100%').typeError('Must be a number'),
  txFees: yup.number().required('Required field').max(21000000, 'Max 21,000,000 BTC').typeError('Must be a number'),
  otherFees: yup.number().required('Required field').max(100, 'Max 100%').typeError('Must be a number'),
  difficultyIncrement: yup.number().required('Required field').max(10000, 'Max 10,000%').typeError('Must be a number'),
  priceIncrement: yup.number().required('Required field').max(10000, 'Max 10,000%').typeError('Must be a number'),
  capex: yup.number().required('Required field').max(4000000000, 'Max 4,000,000,000').typeError('Must be a number'),
  opex: yup.number().required('Required field').max(999999999, 'Max 999,999,999').typeError('Must be a number'),
  hwValue: yup.number().required('Required field').max(4000000000, 'Max 4,000,000,000').typeError('Must be a number'),
  hwDepreciation: yup.number().required('Required field').max(100, 'Max 100%').typeError('Must be a number'),
  infraValue: yup.number().required('Required field').max(4000000000, 'Max 4,000,000,000').typeError('Must be a number'),
  infraDepreciation: yup.number().required('Required field').max(100, 'Max 100%').typeError('Must be a number'),
  discountRate: yup.number().required('Required field').max(100, 'Max 100%').typeError('Must be a number'),
})
