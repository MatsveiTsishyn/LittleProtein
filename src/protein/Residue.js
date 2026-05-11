/*
Contained Class for a protein Residue
    - Manages data from residue: AA-type + coordinates + resid
    - Manage display of a residue: color, size, ...
*/

// Imports ---------------------------------------------------------------------
import { Atom } from "./Atom.js";
import { AminoAcid } from "./AminoAcid.js";
import { Color } from "../utils/Color.js";


// Residue ---------------------------------------------------------------------
export class Residue {
    

    // Constants ---------------------------------------------------------------
    static DEFAULT_COLOR_VALUE = [45, 45, 45];

    // Constructor -------------------------------------------------------------
    constructor(resid, aa, atomsList=[], color=null) {
        
        // Type checking
        if (typeof resid !== 'string' || resid.length < 2) {
            throw new Error("Residue ID (resid) must be a string of length 2 or more (like 'A15').");
        }
        if (!(aa instanceof AminoAcid)) {
            throw new Error("Amino acid (aa) must be an instance of AminoAcid.");
        }
        if (!Array.isArray(atomsList) || !atomsList.every(atom => atom instanceof Atom)) {
            throw new Error("atomsList must be an array of Atom instances.");
        }
        if (color !== null && !(color instanceof Color)) {
            throw new Error("color must be an instance of Color or null.");
        }

        // Set
        this.resid = resid;
        this.aa = aa;
        this.atomsList = atomsList;
        this.color = color === null ? new Color(...Residue.DEFAULT_COLOR_VALUE) : color;
        this.atomCalpha = null;
        this.atomsList.forEach(atom => {
            if (atom.name == 'CA') {
                this.atomCalpha = atom;
            }
        })

    }

    // Getters -----------------------------------------------------------------
    get chain(){
        return this.resid[0];
    }

    get position(){
        return this.resid.slice(1);
    }

    // Methods -----------------------------------------------------------------
    print(){
        console.log(`Residue '${this.aa}' at ${this.resid}`);
    }

    // Mutation Methods --------------------------------------------------------
    transform(matrix){
        this.atomsList.forEach(atom => atom.transform(matrix));
    }

    setColor(color_arr){
        this.color = new Color(...color_arr);
    }

}