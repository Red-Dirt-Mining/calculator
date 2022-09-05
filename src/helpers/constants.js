const constants = {
  rdmColors: {
    cream: 'f1ece4',
    red: '#7d443b',
    black: '#050e0f',
    yellow: '#e8cea5',
    purple: '#3a355a',
    gradient: 'linear-gradient(180deg, rgba(58,53,90,1) 0%, rgba(125,68,59,1) 100%)',
  },
  blockTime: 10,
  difficultyEpoch: 2016,
  halvingEpoch: 210000,
  blocksPerDay: 24 * 60 / 10,
  blocksPerMonth: 30 * 24 * 60 / 10,
  blocksPerYear: 365 * 24 * 60 / 10,
  daysPerMonth: 30,
  satsPerBtc: 100000000,
  terraUnit: 1000000000000,
}

module.exports = constants
