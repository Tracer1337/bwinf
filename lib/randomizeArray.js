function randomizeArray(array) {
    array = [...array]

    const newArray = []

    while(array.length > 0) {
        const index = Math.floor(Math.random() * array.length)
        newArray.push(array[index])
        array.splice(index, 1)
    }

    return newArray
}

module.exports = randomizeArray