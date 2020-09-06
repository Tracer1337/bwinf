const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const inputFileNumber = process.argv[2] || 1

const content = fs.readFileSync(path.join(__dirname, "beispieldaten", `wichteln${inputFileNumber}.txt`), "utf-8")

const [n, ...lines] = content.split("\r\n")

lines.pop()

const players = lines.map(line => line.trim().split(/\s+/).map(e => parseInt(e)))

/**
 * Generate distribution
 */

const distribution = {}

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < players.length; j++) {
        if (j in distribution) {
            continue
        }
        
        const wish = players[j][i]

        if (Object.values(distribution).indexOf(wish) === -1) {
            distribution[j] = wish
        }
    }
}

/**
 * Give missing players a value
 */

const leftoverValues = []

for (let i = 1; i <= players.length; i++) {
    if (Object.values(distribution).indexOf(i) === -1) {
        leftoverValues.push(i)
    }
}

for (let i = 0; i < players.length; i++) {
    if (i in distribution) {
        continue
    }

    distribution[i] = leftoverValues.shift()
}

fs.writeFileSync(path.join(__dirname, "beispieldaten", `wichteln${inputFileNumber}.json`), JSON.stringify(distribution, null, 4))

for (let player in distribution) {
    console.log(`Schüler ${chalk.bold(player)} erhält den Gegenstand ${chalk.bold(distribution[player])}`)
}