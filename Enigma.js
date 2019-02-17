/* Enigma
 Author: Matt Iandoli
*/

class Enigma {
    constructor(plug, rotor1, rotor2, rotor3, ref) {
        this.plug = plug;
        this.rotors = [rotor1, rotor2, rotor3];
        this.ref = ref;
    }

    /* Simulates running current thru all of the enigma components
    * @param letter The letter to be encrypted (0-25)
    * @return The encrypted letter (0-25)
    */
    encrypt(letter) {
        // Odometer (with double-step)
        if (this.rotors[0].rotate()) {
            this.rotors[1].rotate();
        } else if (this.rotors[1].middleCheck()) {
            this.rotors[2].rotate();
        }

        // Current thru plugboard
        letter = this.plug.encrypt(letter);

        // Current thru rotors L <- R
        letter = this.rotors[0].encrypt(letter, true);
        letter = this.rotors[1].encrypt(letter, true);
        letter = this.rotors[2].encrypt(letter, true);

        // Current thru reflector
        letter = this.ref.reflect(letter);

        // Current back thru rotors L -> R
        letter = this.rotors[2].encrypt(letter, false);
        letter = this.rotors[1].encrypt(letter, false);
        letter = this.rotors[0].encrypt(letter, false);

        // Current back thru plugboard
        letter = this.plug.encrypt(letter);

        return letter;
    }

    /* Gets the current positions of the rotors
    * @return Array containing the positions (0-25)
    */
    getRotPos() {
        var pos = [];
        pos.push(this.rotors[0].getPos());
        pos.push(this.rotors[1].getPos());
        pos.push(this.rotors[2].getPos());
        return pos;
    }

    /* Changes the given rotor's positon
    * @param rotor Which rotor to change
    * @param val The value to change the position to
    */
    changeRotPos(rotor, val) {
        this.rotors[rotor].changePos(val);
    }

    /* Gets the current ring settings of the rotors
    * @return Array containing the ring settings (0-25)
    */
    getRotSet() {
        var set = [];
        set.push(this.rotors[0].getSet());
        set.push(this.rotors[1].getSet());
        set.push(this.rotors[2].getSet());
        return set;
    }

    /* Changes the given rotor's ring setting
    * @param rotor Which rotor to change
    * @param val The value to change the ring to
    */
    changeRotSet(rotor, val) {
        this.rotors[rotor].changeSet(val);
    }

    /* Adds the set of plug configurations to the set
    * @param val1 First plug value
    * @param val2 Second plug value
    */
    addPlugs(val1, val2) {
        this.plug.addPlugs(val1, val2);
    }

    /* Removes the set of plugs from the set
    * @param val1 First plug value
    * @param val2 Second plug value
    */
    removePlugs(val1, val2) {
        this.plug.removePlugs(val1, val2);
    }

    /* Swap the old rotor for the new rotor
    * @param posNum Which rotor slot to swap
    * @param rotNum Which rotor number to place in (I, II, ...)
    * @param setting Ring setting of the rotor
    * @param position Ground position of rotor
    */
    changeRotors(posNum, rotNum, setting, position) {
        const newRotor = new Rotor(rotNum, setting, position);
        this.rotors[posNum - 1] = newRotor;
    }

    /* Swap out reflectors
    * @param refNum Reflector number (B or C)
    */
    changeReflector(refNum) {
        const newRef = new Reflector(refNum);
        this.ref = newRef;
    }
}
