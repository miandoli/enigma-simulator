/* Rotor
* Author: Matt Iandoli
*/

class Rotor {
    constructor(rotStr, setting, position) {
        // Wiring of the different rotors
        const sub1 = str2arr("EKMFLGDQVZNTOWYHXUSPAIBRCJ");
        const sub2 = str2arr("AJDKSIRUXBLHWTMCQGZNPYFVOE");
        const sub3 = str2arr("BDFHJLCPRTXVZNYEIWGAKMUSQO");
        const sub4 = str2arr("ESOVPZJAYQUIRHXLNFTGKDCMWB");
        const sub5 = str2arr("VZBRGITYUPSDNHLXAWMJQOFECK");
        const arrSub = [sub1, sub2, sub3, sub4, sub5];
        // Roman numberal to index value
        const arrStr = ["I", "II", "III", "IV", "V"];
        const rotNum = arrStr.indexOf(rotStr);
        this.sub = arrSub[rotNum]; // Wires
        this.setting = setting; // Ring setting
        this.position = position; // Ground position

        // Mnemonic used to remember turnover positions (I: R, II: F, ...)
        const turnMnemonic = ["Royal", "Flags", "Wave", "Kings", "Above"];
        // Map index to turnover position
        var arrTurn = [];
        for (var i = 0; i < turnMnemonic.length; i++) {
            arrTurn.push(letter2num(turnMnemonic[i]));
        }
        this.turnOver = arrTurn[rotNum]; // Turnover value
    }

    /* Rotates the rotor
    * @return If the position is at its turnover
    */
    rotate() {
        // Increments rotor and wraps back around if "overflowed": (N + 1) Mod 26
        this.position = (this.position + 1) % 26;
        return (this.position == this.turnOver);
    }

    /* Checks if is at turnover, if so rotate. Used as the double-step, when middle rotor gets
    * turned to its turnover position, it turns again.
    * @return If rotor is at turnover
    */
    middleCheck() {
        // Keeps track of initial check
        const check = (this.position + 1 == this.turnOver);
        //
        if (check) {
            this.position = (this.position + 1) % 26;
        }
        return check;
    }

    /* Simulates letter going into the rotor (L - R + P)
    * @param letter The letter being inputted
    * @return Mapped letter
    */
    lIn(letter) {
        // Note: adds 26 to avoid JavaScript non-mathematical modulo of negative numbers
        const newLetter = (letter - this.setting + this.position + 26) % 26;
        return newLetter;
    }

    /* Simulates letter going thru wire in rotor
    * @param letter The letter traveling into the wire
    * @param first If the current is going L <- R (first time)
    * @return Mapped letter
    */
    lWire(letter, first) {
        var newLetter;
        if (first) { // First travel thru rotor (L <- R)
            newLetter = this.sub[letter];
        } else { // Second travel thru rotor (L -> R)
            // IndexOf for arrays
            newLetter = this.sub.findIndex(function(element) {
                return element == letter;
            });
        }
        return newLetter;
    }

    /* Simulates letter going out of rotor (L + R - P)
    * @letter The letter being outputted
    * @return Mapped letter
    */
    lOut(letter) {
        const newLetter = (letter + this.setting - this.position + 26) % 26;
        return newLetter;
    }

    /* Encrpyts letter thru the rotor (substitution)
    * @param letter The letter to be encrypted
    * @param first If first time traveling thru this rotor
    * @return Mapped letter
    */
    encrypt(letter, first) {
        letter = this.lIn(letter);
        letter = this.lWire(letter, first);
        letter = this.lOut(letter);
        return letter;
    }

    /* Gets current position of rotor
    * @return Position
    */
    getPos() {
        return this.position;
    }

    /* Changes value of position of rotor
    * @param val Value to change position to
    */
    changePos(val) {
        this.position = val;
    }

    /* Gets current ring setting of rotor
    * @return Ring setting
    */
    getSet() {
        return this.setting;
    }

    /* Changes value of ring setting of rotor
    * @param val Value to change ring setting to
    */
    changeSet(val) {
        this.setting = val;
    }
}
