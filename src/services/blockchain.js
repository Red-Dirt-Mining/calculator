const mempoolUrl = process.env.REACT_APP_MEMPOOL_SPACE_HOST && process.env.REACT_APP_MEMPOOL_SPACE_PORT
  ? URL.parse(`${process.env.REACT_APP_MEMPOOL_SPACE_HOST}:${process.env.REACT_APP_MEMPOOL_SPACE_PORT}/api/`)
  : process.env.REACT_APP_MEMPOOL_SPACE_BASEURL

const blockHeight = 'blocks/tip/height'
const hashrate = 'v1/mining/hashrate/3d'
const difficultyAdjustment = 'v1/difficulty-adjustment'

export const getBlockHeight = async () => {
  const response = await fetch(mempoolUrl + blockHeight)
  .catch(err => {
    console.err(err, {message: err.message})
  })
  const data = await response.json()
  return data
}

export const getHashrate = async () => {
  const response = await fetch(mempoolUrl + hashrate)
  .catch(err => {
    console.err(err, {message: err.message})
  })
  const data = await response.json()
  return data
}

export const getDifficultyAdjustment = async () => {
  const response = await fetch(mempoolUrl + difficultyAdjustment)
  .catch(err => {
    console.err(err, {message: err.message})
  })
  const data = await response.json()
  return data
}
