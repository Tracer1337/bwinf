class Player {
    constructor(strength, index) {
        this.strength = strength
        this.index = index
    }
}

/**
 * Textdatei einlesen
 */

const fs = require("fs")
const path = require("path")

const inputFileNumber = process.argv[2] || 1

const content = fs.readFileSync(path.join(__dirname, "beispieldaten", `spielstaerken${inputFileNumber}.txt`), "utf-8")

let [n, ...players] = content.replace(/\r/g, "").split("\n")

players.pop()
players = players.map((strength, i) => new Player(parseInt(strength), i))

/**
 * Lösung
 */

const randomizeArray = require("../lib/randomizeArray.js")

const strongestPlayer = players.reduce((strongest, current) => current.strength > strongest.strength ? strongest = current : strongest, players[0])

function simluateMatch(firstPlayer, secondPlayer) {
    return Math.random() <= (firstPlayer.strength / (firstPlayer.strength + secondPlayer.strength)) ? 0 : 1
}

function simulateLeague() {
    const playerWins = {}

    for (let i = 0; i < players.length; i++) {
        playerWins[i] = 0
    }
    
    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players.length; j++) {
            if (i === j) {
                break
            }

            const winner = simluateMatch(players[i], players[j])

            if (winner === 0) {
                playerWins[i]++
            } else if(winner === 1) {
                playerWins[j]++
            }
        }
    }

    let winner = players[0]
    for (let index in playerWins) {
        // Hier wird bewusst nicht >= verwendet, da mit > gewährleistet wird, dass bei gleichen Spielständen
        // der Spieler mit der kleinsten Spielernummer gewinnt
        if (playerWins[index] > playerWins[winner.index]) {
            winner = players[index]
        }
    }

    return winner
}

function simulateKO() {
    let tournamentPlayers = randomizeArray(players)

    for (let i = 0; i < Math.sqrt(players.length); i++) {
        const winners = []

        for (let j = 0; j < tournamentPlayers.length; j += 2) {
            const winner = simluateMatch(tournamentPlayers[j], tournamentPlayers[j + 1])

            if (winner === 0) {
                winners.push(tournamentPlayers[j])
            } else if (winner === 1) {
                winners.push(tournamentPlayers[j + 1])
            }
        }

        tournamentPlayers = winners
    }

    return tournamentPlayers[0]
}

function simulateKOx5() {
    let tournamentPlayers = randomizeArray(players)

    for (let i = 0; i < Math.sqrt(players.length); i++) {
        const winners = []

        for (let j = 0; j < tournamentPlayers.length; j += 2) {
            const playerWins = {
                [j]: 0,
                [j + 1]: 0
            }
            
            for (let k = 0; k < 5; k++) {
                const winner = simluateMatch(tournamentPlayers[j], tournamentPlayers[j + 1])

                if (winner === 0) {
                    playerWins[j]++
                } else if (winner === 1) {
                    playerWins[j + 1]++
                }
            }

            if (playerWins[j] > playerWins[j + 1]) {
                winners.push(tournamentPlayers[j])
            } else {
                winners.push(tournamentPlayers[j + 1])
            }
        }

        tournamentPlayers = winners
    }

    return tournamentPlayers[0]
}

function simulateTournamentVariant(tournamentFunction, iterations) {
    let strongestPlayerWins = 0

    for (let i = 0; i < iterations; i++) {
        const winner = tournamentFunction()

        if (winner.index === strongestPlayer.index) {
            strongestPlayerWins++
        }
    }

    return strongestPlayerWins / iterations
}

const iterations = 1e5

const ligaPercentage = simulateTournamentVariant(simulateLeague, iterations)
const koPercentage = simulateTournamentVariant(simulateKO, iterations)
const kox5Percentage = simulateTournamentVariant(simulateKOx5, iterations)

console.log("Iterationen:", iterations)

console.table({
    "Liga": {
        "Durchschnitt (%)": Math.round(ligaPercentage * 100)
    },

    "KO": {
        "Durchschnitt (%)": Math.round(koPercentage * 100)
    },

    "KOx5": {
        "Durchschnitt (%)": Math.round(kox5Percentage * 100)
    },
})