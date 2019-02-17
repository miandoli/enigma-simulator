# Enigma Machine Simulator
### Author: Matt Iandoli
### Date: February 2019

## Description
Replica of the M3 Army and Airforce that the Nazis used in WWII. The simulator tries to keep a similar feel to the real enigma machine, compartments open and close, etc. It can be used to encrypt and decrypt messages with given settings. The goal is to use this to encrypt messages and create Alan Turing's Bombe machine to crack the messages. The Bombe will be created in JavaScript like the enigma machine was created in. The code for the enigma machine will be the foundation of the Bombe (solved with cribs and plugboard contradictions).

## How it Works?
### Enigma machine details
1. General details can be found at https://en.wikipedia.org/wiki/Enigma_machine
2. More specific details at http://users.telenet.be/d.rijmenants/en/enigmatech.htm

### Simulation details
1. All the individual components are matched to be the same as a real enigma
2. The machine simulates the current running thru each component
3. Key -> Plugboard -> Rotor 1 -> R2 -> R3 -> Reflector -> R3 -> R2 -> R1 -> P -> Lamp

## How to Use it?
### Encrypting
1. Type the message on the key board (make sure to only click one key at a time)
2. Only letters from A-Z and "space" will be encrypted ("space" -> X)

### Settings
1. Rotor positions can be changed from the outside of the machine by scrolling on the letter with the mouse wheel
2. By opening the inside compartment, rotors can be swapped by clicking on them
3. Each rotor's ring setting can be changed by clicking on the rotor
4. Reflectors can be swapped by clicking on it
5. By opening the front compartment, plugs can be connected on the plugboard

## Note:
This web-app was created to be used as a simulator and pair with the Bombe I'm going to create. This means I did not design the HTML/graphics for all screens/web deployment. The machine should work on all browsers and screen sizes but some graphics (specifically plugboard lines) might appear slightly off.
