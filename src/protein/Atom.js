/*
Container Class for an Atom with its 3D coordiantes
    - name ::str atom type name
    - coord ::[flota, float, float] atom 3D coordinates
*/

// Imports ---------------------------------------------------------------------
import { LinAlg } from "../utils/LinAlg.js";


// Atom ------------------------------------------------------------------------
export class Atom {
    
    // Constructor -------------------------------------------------------------
    constructor(name, coord) {
        if (typeof name !== 'string') {
            throw new Error("Atom name must be a string.");
        }
        if (!Array.isArray(coord) || coord.length !== 3 ||
            !coord.every(c => typeof c === 'number' && !isNaN(c))) {
            throw new Error("Atom coord must be an array of 3 numbers.");
        }
        this.name = name;
        this.coord = coord;
    }

    // Methods -----------------------------------------------------------------
    print(){
        console.log(`Atom '${this.name}'`);
    }

    transform(matrix){
        this.coord = LinAlg.dim3.mult(this.coord, matrix);
    }

}