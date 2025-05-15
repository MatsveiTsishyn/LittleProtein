/*
Contained Class for a protein Residue
    - Manages data from residue: AA-type + coordinates + resid
    - Manage display of a residue: color, size, ...
*/

// Imports ---------------------------------------------------------------------
import { LinAlg } from "../utils/LinAlg.js";
import { Color } from "../utils/Color.js";
import { AminoAcid } from "./AminoAcid.js";


// Residue ---------------------------------------------------------------------
export class Residue {
    

    // Constants ---------------------------------------------------------------
    static DEFAULT_COLOR_VALUE = [45, 45, 45];

    // Constructor -------------------------------------------------------------
    constructor(resid, aa, c_alpha, color=null) {
        this.resid = resid;
        this.aa = aa;
        this.c_alpha = c_alpha;
        this.color = color === null ? new Color(...Residue.DEFAULT_COLOR_VALUE) : color;
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
        console.log(`Residue ${this.aa} at ${this.resid}`);
        return this;
    }

    // Mutation Methods --------------------------------------------------------
    transform(matrix){
        this.c_alpha = LinAlg.dim3.mult(this.c_alpha, matrix);
        return this;
    }

    setCoord(c_alpha){
        this.c_alpha = c_alpha;
        return this;
    }

    setColor(color_arr){
        this.color = new Color(...color_arr);
        return this;
    }

}