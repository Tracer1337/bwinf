```js
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
```

Folgende Annahmen über die Beispieldateien wurden getroffen:

    * Jedes Wort im Lückentext hat entweder genau einen, oder keinen vorgegebenen Buchstaben
    * Alle Wörter können und müssen genau einmal verwendet werden

Pseudocode:
    Wiederhole solange nicht alle Wörter verwendet wurden
        Für jedes Wort im Lückentext
            Filtere die Wörter, die die gleiche Länge wie das gesuchte Wort haben
            Filtere Duplikate aus dieser Liste heraus
            Wenn ein Buchstabe vorgegeben ist
                Filtere alle Wörter aus der Liste heraus, die einen anderen Buchstaben an der Stelle besitzen
            Wenn nur noch ein Wort in der Liste übrig bleibt
                Entferne das Wort aus den verfügbaren Wörtern
                Ersetze das gesuchte Wort im Lückentext mit diesem Wort
        