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

// Die Funktion habe ich selber geschrieben aber ausgelagert
const randomizeArray = require("../lib/randomizeArray.js")

// Den stärksten Spieler bestimmen
const strongestPlayer = players.reduce((strongest, current) => current.strength > strongest.strength ? strongest = current : strongest, players[0])

// Partie
function simluateMatch(firstPlayer, secondPlayer) {
    return Math.random() <= (firstPlayer.strength / (firstPlayer.strength + secondPlayer.strength)) ? 0 : 1
}

// Variante: Liga
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

// Variante: KO
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

// Variante: KO x 5
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

// Bestimme, wie oft der stärkste Spieler im Durchschnitt gewinnt
function getTournamentWinrate(tournamentFunction, iterations) {
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

const ligaPercentage = getTournamentWinrate(simulateLeague, iterations)
const koPercentage = getTournamentWinrate(simulateKO, iterations)
const kox5Percentage = getTournamentWinrate(simulateKOx5, iterations)

console.log("Die Gewinnrate für 'Liga' beträgt", Math.round(ligaPercentage * 100) + "%")
console.log("Die Gewinnrate für 'KO' beträgt", Math.round(koPercentage * 100) + "%")
console.log("Die Gewinnrate für 'KOx5' beträgt", Math.round(kox5Percentage * 100) + "%")