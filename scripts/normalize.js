import combination from '../assets/json/combination.json' assert { type: 'json' }

const palList = combination[0].slice(1)
for (let i = 0; i < palList.length; i++) {
  for (let j = 0; j < palList.length; j++) {
    const p1 = palList[i]
    const p2 = palList[j]
    const c = combination[i + 1][j + 1]
    console.log([p1, p2, c].join(','))
  }
}
