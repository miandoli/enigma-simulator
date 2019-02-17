/* Enigma Machine Simulator
Author: Matt Iandoli
Date: 2/15/2019

This enigma machine is a replica of the M3 Army and Airforce that the Nazis used in WWIIs
*/

// Creates a new enigma with default settings
var enigma = newEnigma("III", "II", "I", "A", "A", "A", "A", "A", "A", "B");

// Records the encrypted string, spaces between every 4 letters
var tape = "";
var tapeLength = 0;

// Keeps track of which key is pressed, only allows one key at a time
var press = -1;
var ePress = -1;

// Colors
const colorLight = "#fff38c";
const colorWhite = "#ffffff";
const colorBlack = "#000000";
const colorGray = "#646464";

// Detects key presses (down) on valid characters (A-Z,' ')
document.addEventListener("keydown", function(event) {
    var key = event.keyCode;

    // Ignore holding key down
    if (press == -1) {
        // Translate so A is 0, space becomes 'X' (note: 32 is spacebar)
        var entry = (key != 32) ? key - "A".charCodeAt(0) : letter2num("X");

        // Check if character if from alphabet
        if (entry >= 0 && entry < 26) {
            press = key; // Keeps track of which key was pressed

            // Encrypts the letter and displays it
            ePress = num2letter(enigma.encrypt(entry));
            changeColor(ePress, colorLight);

            // Records the letter to the "tape" with spaces every 4 characters
            if ((tape.length != 0) && (tapeLength % 4 == 0)) {
                tape += " ";
            }
            tapeLength++;
            tape += ePress;
            document.getElementById("tapeText").innerHTML = tape;

            // Update the display values after the enigma was changed
            updateVals();
        }
    }
});

// Detects key releases (up) on valid characters (A-Z,' ')
document.addEventListener("keyup", function(event) {
    var key = event.keyCode;

    // Checks if keyup is same as keydown
    if (press == key) {
        // Reset keydown and change color back
        press = -1;
        changeColor(ePress, colorWhite);
    }
});

// Detects scrolling for rotor positions and rings
function scrollEvents() {
    // Gets all position elements and adds wheel event
    var rotorVals = document.getElementsByClassName("rotorVal");
    for (var i = 0; i < rotorVals.length; i++) {
        rotorVals[i].addEventListener("wheel", function(event) {
            var up = event.deltaY > 0; // If scroll is "up"
            scroll(this, up, true); // Changes enigma ground/position settings
            updateVals(); // Updates display
        });
    }

    // Gets all ring elements and adds wheel event
    // (actually parent of the ring elemenent to allow for easier scrolling)
    var ringVals = document.getElementsByClassName("rotorWheel");
    for (var i = 0; i < ringVals.length; i++) {
        ringVals[i].addEventListener("wheel", function (event) {
            var up = event.deltaY > 0;
            scroll(this.childNodes[3], up, false);
            updateVals();
        });
    }
}

/* Changes the position or ring values of the enigma
* @param el The HTML element being scrolled
* @param up If the scroll is "up", in terms of the enigma it is opposite than normal
* @param isPos If changing position settings
*/
function scroll(el, up, isPos) {
    // Gets index of rotor (every element id is in the form (*n) where n is 1,2,3)
    var rot = el.id.substring(el.id.length - 1) - 1;
    var num = letter2num(el.innerHTML); // Gets current value of element
    // Increments or decrements the value
    if (up) {
        num++;
    } else {
        num--;
    }
    // Changes the value in the enigma machine
    if (isPos) {
        enigma.changeRotPos(rot, num);
    } else {
        enigma.changeRotSet(rot, num);
    }
}

// Swap element display styles
function flip(type) {
    var eOut = document.getElementById(type + "Out");
    var eIn = document.getElementById(type + "In");
    const temp = eOut.style.display;
    eOut.style.display = eIn.style.display;
    eIn.style.display = temp;
}

// Show inside of enigma
function flipIn(type) {
    flip(type);
}

// Show outside of enigma
function flipOut(type) {
    // Don't flip for inner elements such as plugs and wheels
    const name = event.target.className;
    if (name == "plugLetter") { // "Connect" plug
        plugged(event.target.parentElement);
    } else if ((name != "refWheel") && (name != "refVal")
            && (name != "rotorWheel") && (name != "wheelVal")) { // Flip panel
        flip(type);
    }
}

// Plugged in letters to keep track of
var pluggedIn = [];
var lastPlugged = "";
// Handles a plug being clicked
function plugged(el) {
    const numPairs = 10; // Enigma machine only had 10 wires
    // Get value of plug clicked
    const letter = el.childNodes[0].innerHTML;
    const index = pluggedIn.indexOf(letter);
    if (index != -1) { // Remove plug
        if (pluggedIn.length % 2 == 0) { // None selected
            // If none are selected, also have to remove its pair, rather than keeping it
            // Especially difficult and unnecessary if multiple plug connections are disconnected

            // Pairs will be in the array in the following format (A,A,B,B,C,C...)
            var pair = ""; // Find the pair of the selected plug
            if (index % 2 == 0) { // First in order
                pluggedIn.splice(index, 1); // Remove selected
                pair = pluggedIn.splice(index, 1)[0]; // Remove its pair
            } else { // Second in order
                pluggedIn.splice(index, 1); // Remove selected
                pair = pluggedIn.splice(index - 1, 1)[0]; // Remove its pair
            }
            // Change colors of plugs
            el.style.backgroundColor = colorBlack;
            const elPair = document.getElementById("plug_" + pair);
            elPair.style.backgroundColor = colorBlack;
            // Remove wire drawing (removes all of them and re-draws the remaining)
            redrawWires();
            // Remove the plug connection from the enigma machine
            enigma.removePlugs(letter2num(letter), letter2num(pair));
        } else { // One selected
            // Remove from array
            pluggedIn.splice(index, 1);
            // Don't need to remove the connection from the enigma b/c a pair wasn't made
            el.style.backgroundColor = colorBlack;
        }
    } else if (pluggedIn.length < 2 * numPairs) { // Add plug
        if (pluggedIn.length % 2 == 0) { // None selected
            lastPlugged = letter;
        } else { // One selected
            // Add plug connection to the enigma machine and draw the wire
            enigma.addPlugs(letter2num(lastPlugged), letter2num(letter));
            drawWire(lastPlugged, letter);
        }
        // Add plug to array and change plug color
        pluggedIn.push(letter);
        el.style.backgroundColor = colorGray;
    }
}

// Swaps the current rotor out for the next rotor (I -> II)
function swapRotor(val) {
    // Gets current rotor value
    var el = document.getElementById("wheelVal" + val);
    const current = el.innerHTML;
    const states = ["I", "II", "III", "IV", "V"];
    // Increases the rotor value by 1
    const nIndex = (states.indexOf(current) + 1) % states.length;
    const next = states[nIndex];
    el.innerHTML = next;
    // Updates the rotor in the enigma machine
    enigma.changeRotors(val, next, letter2num("A"), letter2num("A"));
}

// Swaps the current reflector for the other reflector (B <-> C)
function swapReflector() {
    // Gets current reflector
    var el = document.getElementById("refVal");
    var state = "";
    // Gets the other reflector
    if (el.innerHTML == "B") {
        state = "C";
    } else {
        state = "B";
    }
    el.innerHTML = state;
    // Updates teh reflector in the enigma machine
    enigma.changeReflector(state);
}

// Changes the color of a lamp with its respective letter
function changeColor(key, color) {
    var name = "key_" + key;
    document.getElementById(name).style.backgroundColor = color;
}

// Creates a new enigma with the given settings
function newEnigma(r1, r2, r3, s1, s2, s3, p1, p2, p3, refLetter) {
    // Create plugboard
    const plug = new PlugBoard();

    // Create rotors
    const rotor1 = new Rotor(r1, letter2num(s1), letter2num(p1));
    const rotor2 = new Rotor(r2, letter2num(s2), letter2num(p2));
    const rotor3 = new Rotor(r3, letter2num(s3), letter2num(p3));

    // Create reflector
    const ref = new Reflector(refLetter);
    return new Enigma(plug, rotor1, rotor2, rotor3, ref);
}

// Helper function to take a string of letters into an array of numbers
function str2arr(str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
        arr.push(letter2num(str[i]));
    }
    return arr;
}

// Helper function to take a letter and gives its number (A->0, Z->25)
function letter2num(letter) {
    return (letter.charCodeAt(0) - "A".charCodeAt(0));
}

// Helper function to get letter from number (0->A, 25->Z)
function num2letter(num) {
    num = (num + 26) % 26; // Simulates overflow
    return String.fromCharCode(num + "A".charCodeAt(0));
}

// Updates the display to correspond with the enigma settings
function updateVals() {
    // Update rotor positions
    var pos = enigma.getRotPos();
    for (var i = 0; i < 3; i++) {
        document.getElementById("rotorVal" + (i + 1)).innerHTML = num2letter(pos[i]);
    }

    // Update ring settings
    var set = enigma.getRotSet();
    for (var i = 0; i < 3; i++) {
        document.getElementById("ringVal" + (i + 1)).innerHTML = num2letter(set[i]);
    }
}

// Erases all the lines on the canvas
function clearCanvas() {
    var c = document.getElementById("plugCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
}

// Removes all the lines and re-draws the remaining lines
function redrawWires() {
    clearCanvas();
    for (var i = 0; i < pluggedIn.length; i += 2) {
        drawWire(pluggedIn[i], pluggedIn[i + 1]);
    }
}

// Draws a single line from two co-ordinates
function drawWire(val1, val2) {
    // Get canvas and its 2d context
    var c = document.getElementById("plugCanvas");
    var ctx = c.getContext("2d");

    // Get position of the two plugs
    const pos1 = letter2pos(val1);
    const pos2 = letter2pos(val2);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(pos1[0], pos1[1]);
    ctx.lineTo(pos2[0], pos2[1]);
    ctx.strokeStyle = colorBlack;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// "Hard-coded" positions of the plugs on the canvas
// note: the canvas is actually underneath the plugs so there is not a concrete connection
function letter2pos(letter) {
    // Rows of letters
    const row1 = "QWERTYUIOP";
    const row2 = "ASDFGHJKL";
    const row3 = "ZXCVBNM";

    // Get height and width of canvas
    // note: canvas is set up so the edges lie in the middle of the outer plugs (Q: (0, 0))
    const c = document.getElementById("plugCanvas");
    const width = c.width;
    const height = c.height;
    var xPos = 0;
    var yPos = 0;
    const edgeBuffer = 2; // Line will get cut off b/c stroke size > 1

    // Each row has its own function
    if (row1.indexOf(letter) != -1) { // Row 1
        // Nine spaces between the plugs
        const fraction = 1/9;
        const index = row1.indexOf(letter);
        const scalar = index * fraction;
        xPos = scalar * width;
        yPos = 0 + edgeBuffer; // Lies at the top of the canvas
    } else if (row2.indexOf(letter) != -1) { // Row 2
        // Nine spaces except first plug is half a space
        // Doubling allows every odd multiple of 1/18 to lie a plug
        const fraction = 1/18;
        const index = row2.indexOf(letter);
        const scalar = (2 * index + 1) * fraction;
        xPos = scalar * width;
        yPos = height / 2; // Lies in the middle of the canvas
    } else { // Row 3
        // Same as row 2 but has 2 less plus, so starts an extra space (1/9) over
        const fraction = 1/18;
        const index = row3.indexOf(letter);
        const scalar = (2 * index + 3) * fraction;
        xPos = scalar * width;
        yPos = height - edgeBuffer; // Lies at bottom of the canvas
    }
    // Resolution for canvases are better at (x.5, y.5)
    return [Math.floor(xPos) + 0.5, Math.floor(yPos) + 0.5];
}


// Clears the tape and copies the text to the clipboard
function clearTape() {
    // Clear tape
    tape = "";
    tapeLength = 0;

    // Creates a new element with same text, selects and copies it, removes element
    var el = document.getElementById("tapeText"); // Current element
    var copyEl = document.createElement("input"); // Creates temporary element
    copyEl.setAttribute("value", el.innerHTML); // Places text into element
    document.body.appendChild(copyEl); // Adds the element to the document
    copyEl.select(); // Selects the text
    document.execCommand("copy"); // Copies the text to the clipboard
    document.body.removeChild(copyEl); // Removes the element from the document
    el.innerHTML = "";
}
