/**
 * Textdatei einlesen und den Lückentext von den Wörtern trennen. Die Wörter werden in ein Array separiert.
 */

const fs = require("fs")
const path = require("path")

const inputFileNumber = process.argv[2] || 0

const content = fs.readFileSync(path.join(__dirname, "beispieldaten", `raetsel${inputFileNumber}.txt`), "utf-8")

let [text, words] = content.replace(/\r/g, "").split("\n")

words = words.split(" ")

/**
 * Lösen des Lückentextes
 */

while(words.length !== 0) {
    text = text.replace(/_*(\w?)_*/g, (match, letter) => {
        let possibleWords = words.filter(word => word.length === match.length)
        possibleWords = Array.from(new Set(possibleWords))

        if (letter) {
            possibleWords = possibleWords.filter(word => word[match.indexOf(letter)] === letter)
        }

        if (possibleWords.length === 1) {
            const result = possibleWords[0]
            words.splice(words.indexOf(result), 1)
            return result
        }

        return match
    })
}

console.log(text)