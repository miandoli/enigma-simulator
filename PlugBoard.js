class PlugBoard {
    constructor() {
        // Initialize an array to [0,1,...,25]
        this.sub = [];
        for (var i = 0; i < 26; i++) {
            this.sub.push(i);
        }
    }

    /* Simulates the current thru the plugboard
    * @param letter The inputted letter
    * @return Mapped letter
    */
    encrypt(letter) {
        // Get the letter at the given index
        return this.sub[letter];
    }

    /* Adds one plug connection to the board
    * @param val1 Value of first connection
    * @param val2 Value of second connection
    */
    addPlugs(val1, val2) {
        // "Swap"
        this.sub[val1] = val2;
        this.sub[val2] = val1;
    }

    /* Removes a plug connection from the board
    * @param val1 Value of first connection
    * @param val2 Value of second connection
    */
    removePlugs(val1, val2) {
        // Un-"swap"
        this.sub[val1] = val1;
        this.sub[val2] = val2;
    }
}
