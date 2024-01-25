import combination from '@/assets/json/combination.json'

// 全パルリスト
export const palList = combination[0].slice(1)
palList.sort()

const combinationPalSet = new Set()
combination.slice(1).forEach((comb: string[]) => {
  comb.slice(1).forEach((pal: string) => {
    combinationPalSet.add(pal)
  })
})
// 配合で作成可能なパルのリスト
export const combinationPalList = Array.from(combinationPalSet)
combinationPalList.sort()

type Node = {
  name: string
  parents: Node[]
  parentNames: Set<string>
}

// Nodeの初期化
const nameNodeMap = {} as { [key: string]: Node }
palList.forEach((name: string) => {
  nameNodeMap[name] = {
    name,
    parents: [] as Node[],
    parentNames: new Set(),
  }
})

for (let i = 0; i < palList.length; i++) {
  for (let j = i + 1; j < palList.length; j++) {
    const parentA = combination[i + 1][0]
    const parentB = combination[0][j + 1]
    const child = combination[i + 1][j + 1]
    const parentANode = nameNodeMap[parentA]
    const parentBNode = nameNodeMap[parentB]
    const childNode = nameNodeMap[child]
    if (!childNode.parentNames.has(parentA)) {
      childNode.parentNames.add(parentA)
      childNode.parents.push(parentANode)
    }
    if (!childNode.parentNames.has(parentB)) {
      childNode.parentNames.add(parentB)
      childNode.parents.push(parentBNode)
    }
  }
}

// 配合ルートの探索
// 世代数が同じ結果が複数ある場合がある
// 結果はmermaid用のグラフ文字列の配列で返す
export const searchCombinationRoute = (target: string, source: string) => {
  const results = [] as string[][]
  const used = new Set()
  const queue = [{ name: target, depth: 0, ancestors: [] as string[] }]
  let found = false
  let foundDepth = -1
  while (queue.length > 0) {
    const item = queue.shift()!
    if (found && item.depth > foundDepth) {
      break
    }
    const node = nameNodeMap[item.name]
    for (const parent of node.parents) {
      if (used.has(parent.name)) {
        continue
      } else {
        used.add(parent.name)
      }
      if (parent.name === source) {
        found = true
        foundDepth = item.depth
        results.push([...item.ancestors, item.name, parent.name])
      }
      if (!found) {
        queue.push({ name: parent.name, depth: item.depth + 1, ancestors: [...item.ancestors, item.name] })
      }
    }
  }
  return results.map(result => {
    const lines = ['graph LR'] as string[]
    for (let i = 0; i < result.length - 1; i++) {
      const fr = result[i + 1]
      const to = result[i]
      const formattedFr = fr.replace(/[（）]/g, '')
      const formattedTo = to.replace(/[（）]/g, '')
      lines.push(`  ${formattedFr} --> ${formattedTo}`)
      // 配合の選択肢を追加
      const buddy = searchBuddy(fr, to).join(',').replace(/[（）]/g, '')
      lines.push(`  ${buddy} --> ${formattedTo}`)
    }
    return lines.join('\n')
  })
}

// もう片方の親の配列を返す
const searchBuddy = (parent: string, child: string) => {
  const result = [] as string[]
  const index = combination[0].indexOf(parent)
  const row = combination[index]
  row.forEach((name, i) => {
    if (name === child && i !== 0) {
      result.push(combination[0][i])
    }
  })
  return result
}
