const Vector2d = require("../lib/Vector2d.js")

const SIZE_FACTOR = 100
const STROKE_WIDTH = .02

function degToRad(degrees) {
    return degrees * Math.PI / 180
}

class Element {
    constructor(from, to) {
        this.from = from
        this.to = to
    }

    equals(element) {
        if (this.from.equals(element.from) && this.to.equals(element.to)) {
            return true
        }
        
        if (this.from.equals(element.to) && this.to.equals(element.from)) {
            return true
        }

        return false
    }
}

class Model {
    static getDiff(firstModel, secondModel) {
        const diff = []

        for (let firstElement of firstModel.elements) {
            for (let secondElement of secondModel.elements) {
                if (!firstElement.equals(secondElement)) {
                    diff.push(secondElement)
                }
            }
        }

        return diff
    }

    static fromElements(elements) {
        const model = new Model([])
        model.elements = elements
        return model
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

            startPosition.roundTo(1000)
            endPosition.roundTo(1000)

            this.elements.push(new Element(startPosition, endPosition))

            depthPositionMap.set(move.depth, endPosition)
        }
    }

    generateSVG() {
        const xs = this.elements.map(e => [e.from, e.to].map(vector => vector.value[0])).flat()
        const ys = this.elements.map(e => [e.from, e.to].map(vector => vector.value[1])).flat()
        
        const minX = Math.min(...xs)
        const maxX = Math.max(...xs)
        
        const minY = Math.min(...ys)
        const maxY = Math.max(...ys)
        
        const width = Math.abs(minX) + Math.abs(maxX) + STROKE_WIDTH / 2
        const height = Math.abs(minY) + Math.abs(maxY) + STROKE_WIDTH / 2

        return `
            <svg width="${width * SIZE_FACTOR}" height="${height * SIZE_FACTOR}" viewBox="${minX} ${minY} ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                ${this.elements.map(({ from, to }) => (
                    `<path d="M ${from.value[0]} ${from.value[1]} L ${to.value[0]} ${to.value[1]}" stroke="black" stroke-width="${STROKE_WIDTH}"/>`
                )).join("\n    ")}
            </svg>
        `
    }
}

module.exports = Model