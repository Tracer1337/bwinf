const Vector2d = require("../lib/Vector2d.js")

const STROKE_WIDTH = .02
const FLOATING_POINT_PRECISION = 100
const SVG_MARGIN = 0.1
const SVG_SIZE_FACTOR = 250

function degToRad(degrees) {
    return degrees * Math.PI / 180
}

function generateSVGTag(elements) {
    const xs = elements.map(e => [e.from, e.to].map(vector => vector.value[0])).flat()
    const ys = elements.map(e => [e.from, e.to].map(vector => vector.value[1])).flat()

    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)

    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const width = Math.abs(minX) + Math.abs(maxX) + STROKE_WIDTH / 2
    const height = Math.abs(minY) + Math.abs(maxY) + STROKE_WIDTH / 2

    return `
        <svg
            width="${width * SVG_SIZE_FACTOR}"
            height="${height * SVG_SIZE_FACTOR}"
            viewBox="${minX - SVG_MARGIN} ${minY - SVG_MARGIN} ${width + SVG_MARGIN * 2} ${height + SVG_MARGIN * 2}"
            xmlns="http://www.w3.org/2000/svg"
        >
    `
}

class Element {
    constructor(from, to) {
        this.from = from
        this.to = to
    }
}

class Model {
    static fromElements(elements) {
        const model = new Model([])
        model.elements = elements
        return model
    }

    static generateSolution(fromModel, toModel) {
        function renderElements(elements, color) {
            return elements.map(({ from, to }) => (
                `<path d="M ${from.value[0]} ${from.value[1]} L ${to.value[0]} ${to.value[1]}" stroke="${color}" stroke-width="${STROKE_WIDTH}"/>`
            )).join("\n")
        }

        return `
            ${generateSVGTag([...fromModel.elements, ...toModel.elements])}
                ${renderElements(fromModel.elements, "rgba(255, 0, 0, .5)")}
                ${renderElements(toModel.elements, "rgba(0, 255, 0, .5)")}

                ${renderElements(fromModel.elements, "rgba(255, 0, 0, .5)")}
                ${renderElements(toModel.elements, "rgba(0, 255, 0, .5)")}

                ${renderElements(fromModel.elements, "rgba(255, 0, 0, .5)")}
                ${renderElements(toModel.elements, "rgba(0, 255, 0, .5)")}
            </svg>
        `
    }

    constructor(lines) {
        this.lines = lines

        this.createElements()
    }

    createElements() {
        const moves = this.lines.map(line => ({
            angle: parseInt(line.match(/-?\d+/)[0]),
            depth: (line.match(/\s/g) || []).length / 4
        }))

        const depthPositionMap = new Map()
        this.elements = []

        for (let move of moves) {
            const startPosition = move.depth > 0 ? depthPositionMap.get(move.depth - 1) : new Vector2d([0, 0])

            const endPosition = startPosition.clone().add(new Vector2d([1, 0]).rotate(degToRad(-move.angle)))

            startPosition.roundTo(FLOATING_POINT_PRECISION)
            endPosition.roundTo(FLOATING_POINT_PRECISION)

            this.elements.push(new Element(startPosition, endPosition))

            depthPositionMap.set(move.depth, endPosition)
        }
    }

    generateSVG() {
        return `
            ${generateSVGTag(this.elements)}
                ${this.elements.map(({ from, to }) => (
                    `<path d="M ${from.value[0]} ${from.value[1]} L ${to.value[0]} ${to.value[1]}" stroke="black" stroke-width="${STROKE_WIDTH}"/>`
                    // + `
                    // <text x="${from.value[0]}" y="${from.value[1]}" font-size=".1">${from.value}</text>
                    // <text x="${to.value[0]}" y="${to.value[1]}" font-size=".1">${to.value}</text>
                    // `
                )).join("\n")}
            </svg>
        `
    }
}

module.exports = Model