/**
 * Textdatei einlesen und die Dreiecke in ein Array separieren
 */

const fs = require("fs")
const path = require("path")

const inputFileNumber = process.argv[2] || 0

const content = fs.readFileSync(path.join(__dirname, "beispieldaten", `puzzle${inputFileNumber}.txt`), "utf-8")

let [m, n, ...triangles] = content.replace(/\r/g, "").split("\n")

// Entferne letzte Zeile der Datei, da diese leer ist
triangles.pop()

triangles = triangles.map(sides => sides.split(" ").map(z => parseInt(z)))

/**
 * Lösen des Puzzles
 */