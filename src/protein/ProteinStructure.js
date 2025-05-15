/*
Container Class to handle ProteinStructure object
    - Store, Parse and Transform ProteinStructure coordinates
*/


// Imports ---------------------------------------------------------------------
import { LinAlg } from "../utils/LinAlg.js";
import { AminoAcid } from "./AminoAcid.js";
import { Residue } from "./Residue.js";


// Protein ---------------------------------------------------------------------
export class ProteinStructure {

    // Constructor -------------------------------------------------------------
    constructor(name, residues, scale){

        // Init base properties
        this.name = name;
        this.residues = residues;
        this.scale = scale;

        // Init dependency properties
        this.chains = Array.from(new Set(this.residues.map(res => res.chain)));
        this.residues_map = Object.fromEntries(
            this.residues.map(res => [res.resid, res])
        );

    }

    static empty_structure() {
        return new ProteinStructure("EmptyStructure", [], 1.0, []);
    }
    
    static parse_pdb(name, pdb_string) {

        // Init
        const residues = [];
        let modelCounter = 0;
        let currentChain = null;
        const closedChains = new Set();
        const pdb_lines = pdb_string.split("\n");

        // Parse PDB string and generate residues list
        for (const line of pdb_lines) {

            // Init
            const prefix = line.substring(0, 6);

            // Case: ATOM line
            if ((prefix === "ATOM  " || prefix === "HETATM") && line.substring(13, 15) === "CA") {
                const chain = line[21];
                if (closedChains.has(chain)) continue;

                const resid = line.substring(21, 27).replace(/\s+/g, ''); // JavaScript is doomed
                const cAlpha = [
                    parseFloat(line.substring(30, 38)),
                    parseFloat(line.substring(38, 46)),
                    parseFloat(line.substring(46, 54)),
                ];

                const aaStr = line.substring(17, 20);
                const aa = new AminoAcid(aaStr);
                const residue = new Residue(resid, aa, cAlpha);
                residues.push(residue);
                currentChain = chain;
                continue;
            }

            // Case: MODEL line
            if (prefix === "MODEL ") {
                modelCounter += 1;
                if (modelCounter > 1) break;
                continue;
            }

            // Case: End chain line
            if (prefix.startsWith("TER")) {
                if (currentChain !== null) {
                    closedChains.add(currentChain);
                }
                continue;
            }
        }

        // Scale protein to fit the box
        const c_alpha_arr = residues.map(res => res.c_alpha);
        const box3D = [[-0.5, 0.5], [-0.5, 0.5], [-0.5, 0.5]];
        const [c_alpha_arr_centered, coeff] = LinAlg.dim3.mapToBox(c_alpha_arr, box3D);
        
        residues.forEach((residue, i) => {
            residue.c_alpha = c_alpha_arr_centered[i];
        });

        // Generate ProteinStructure and return
        return new ProteinStructure(name, residues, coeff);
    }

    // Mutation Methods --------------------------------------------------------
    rotate(angleXZ, angleYZ){
        const rotationMatrix = LinAlg.dim3.getRotationMatrix(angleXZ, angleYZ);
        this.residues.forEach(residue => residue.transform(rotationMatrix));
        return this;
    }

    // Get Methods -------------------------------------------------------------
    getResidue(resid){
        if (resid in this.residues_map) {
            return this.residues_map[resid];
        }
        return null;
    }

    get length(){
        return this.residues.length;
    }

    isEmpty(){
        return this.residues.length == 0;
    }

    print(){
        console.log(`Protein '${this.name}' with ${this.length} elements.`);
        return this;
    }

    getCoord(){
        return this.residues.map(res => res.coord);
    }

    getResids(){
        return this.residues.map(res => res.resid);
    }

}