const fs = require("fs")
const path = require("path")
const Model = require("./Model.js")

const inputFileNumber = process.argv[2] || 0

function convertTXTToModel(path) {
    const content = fs.readFileSync(path, "utf-8")
    const lines = content.replace(/\r/g, "").split("\n")
    return new Model(lines)
}

const DATA_DIR = path.join(__dirname, "beispieldaten", "" + inputFileNumber)

const fromModel = convertTXTToModel(path.join(DATA_DIR, "from.txt"))
const toModel = convertTXTToModel(path.join(DATA_DIR, "to.txt"))

if (fromModel.elements.length < toModel.elements.length) {
    throw new Error("Das Rätsel ist nicht lösbar, da nachher mehr Streichhölzer vorhanden sein sollen als vorher.")
}

fs.writeFileSync(path.join(DATA_DIR, "from.svg"), fromModel.generateSVG())
fs.writeFileSync(path.join(DATA_DIR, "to.svg"), toModel.generateSVG())

fs.writeFileSync(path.join(DATA_DIR, "solution.svg"), Model.generateSolution(fromModel, toModel))