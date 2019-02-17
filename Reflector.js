class Reflector {
    constructor(refLetter) {
        // Wiring of different reflectors
        const refSubB = str2arr("YRUHQSLDPXNGOKMIEBFZCWVJAT");
        const refSubC = str2arr("FVPJIAOYEDRZXWGCTKUQSBNMHL");
        // note: sub is an array of values from 0-25 and not letters
        this.sub = (refLetter == "B") ? refSubB : refSubC;
    }

    /* Simulates the current thru the reflector
    * @param letter The inputted letter
    * @return Mapped letter
    */
    reflect(letter) {
        // "Reflect" the letter by returning letter at that index
        return this.sub[letter];
    }
}
