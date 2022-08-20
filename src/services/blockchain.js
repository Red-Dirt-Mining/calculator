const mempoolUrl = 'https://mempool.space/api/';

const blockHeight = 'blocks/tip/height'
const hashrate = 'v1/mining/hashrate/3d'
const difficultyAdjustment = 'v1/difficulty-adjustment'

const getBlockHeight = async () => {
  const response = await fetch(mempoolUrl + blockHeight)
  .catch(err => {
    console.err(err, {message: err.message})
  })
  const data = await response.json()
  return data
}

const getHashrate = async () => {
  const response = await fetch(mempoolUrl + hashrate)
  .catch(err => {
    console.err(err, {message: err.message})
  })
  const data = await response.json()
  return data
}

const getDifficultyAdjustment = async () => {
  const response = await fetch(mempoolUrl + difficultyAdjustment)
  .catch(err => {
    console.err(err, {message: err.message})
  })
  const data = await response.json()
  return data
}

module.exports = {
  getBlockHeight,
  getHashrate,
  getDifficultyAdjustment
}