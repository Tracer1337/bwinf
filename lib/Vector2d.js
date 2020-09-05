class Vector2d {
    constructor(value) {
        this.value = value
    }

    add(vector) {
        this.value[0] += vector.value[0]
        this.value[1] += vector.value[1]
        return this
    }

    subtract(vector) {
        this.value[0] -= vector.value[0]
        this.value[1] -= vector.value[1]
        return this
    }

    mult(scalar) {
        this.value[0] *= scalar
        this.value[1] *= scalar
        return this
    }

    rotate(angle) {
        const newX = this.value[0] * Math.cos(angle) - this.value[1] * Math.sin(angle)
        const newY = this.value[0] * Math.sin(angle) + this.value[1] * Math.cos(angle)
        this.value = [newX, newY]
        return this
    }

    abs() {
        return Math.sqrt(this.value[0] ** 2 + this.value[1] ** 2)
    }

    setMag(magnitude) {
        const factor = magnitude / this.abs()
        this.value = [this.value[0] * factor, this.value[1] * factor]
        return this
    }

    getAngle(vector = new Vector2d([1, 0])) {
        return Math.atan2(this.value[1], this.value[0]) - Math.atan2(vector.value[1], vector.value[0])
    }

    clone() {
        return new Vector2d([...this.value])
    }

    equals(vector) {
        return this.value[0] === vector.value[0] && this.value[1] === vector.value[1]
    }

    roundTo(factor) {
        this.value[0] = Math.floor(this.value[0] * factor) / factor
        this.value[1] = Math.floor(this.value[1] * factor) / factor
        return this
    }
}

module.exports = Vector2d