/*
Container Class to handle ProteinStructure object
    - Store, Parse and Transform ProteinStructure coordinates
*/


// Imports ---------------------------------------------------------------------
import { LinAlg } from "../utils/LinAlg.js";
import { Atom } from "./Atom.js";
import { AminoAcid } from "./AminoAcid.js";
import { Residue } from "./Residue.js";


// Protein ---------------------------------------------------------------------
export class ProteinStructure {

    // Constructor -------------------------------------------------------------
    constructor(
        name,
        residues,
        scale,
    ){

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
    
    static parse_pdb(
        name,
        pdb_string,
        ignoreWater=true,
        ignoreHydrogen=true,
        ignoreLigands=false,
        ignoreHeteroatoms=false,
    ){

        // Select coordinates lines and group by resid
        const pdb_lines = pdb_string.split("\n");
        let modelCounter = 0;
        let currentChain = null;
        const closedChains = new Set();
        const resid_lines = {};
        for (const line of pdb_lines) {

            // Manage coord lines
            const prefix = line.substring(0, 6);
            if (prefix === "ATOM  " || (prefix === "HETATM" && !ignoreHeteroatoms)) {
                const chain = line[21];
                if (closedChains.has(chain) && ignoreLigands) continue;
                const resid = line.substring(21, 27).replace(/\s+/g, ''); // Delete all " " from string (JavaScript is doomed ...)
                if (!resid_lines.hasOwnProperty(resid)) {
                    resid_lines[resid] = [];
                }
                resid_lines[resid].push(line);
                currentChain = chain;
            }

            // Case: MODEL line
            else if (prefix === "MODEL ") {
                modelCounter += 1;
                if (modelCounter > 1) break;
            }

            // Case: End chain line
            else if (prefix.startsWith("TER")) {
                if (currentChain !== null) {
                    closedChains.add(currentChain);
                }
            }

        }

        // Create residues
        const residues = [];
        const HYDROGEN_PREFIXES = ["H", "1H", "2H", "3H"];
        for (const [resid, resLines] of Object.entries(resid_lines)) {

            // Parse aa
            const aa = new AminoAcid(resLines[0].substring(17, 20));
            if (ignoreWater && aa.three == 'HOH') continue;

            // Parse coords
            const atomsList = [];
            for (const line of resLines) {
                const atomType = line.substring(12, 16).replace(/\s+/g, '');
                if (ignoreHydrogen && HYDROGEN_PREFIXES.some(hp => atomType.startsWith(hp))) {
                    continue;
                }
                const x = parseFloat(line.substring(30, 38).trim());
                const y = parseFloat(line.substring(38, 46).trim());
                const z = parseFloat(line.substring(46, 54).trim());
                if (isNaN(x) || isNaN(y) || isNaN(z)) continue;
                const atom = new Atom(atomType, [x, y, z]);
                atomsList.push(atom);
            }
            if (atomsList.length > 0) {
                const residue = new Residue(resid, aa, atomsList);
                residues.push(residue);
            }
        }

        // Scale protein to fit the box
        const all_atoms_coords = residues.flatMap(res =>
            res.atomsList.map(atom => atom.coord)
        );
        const box3D = [[-0.5, 0.5], [-0.5, 0.5], [-0.5, 0.5]];
        const [all_atoms_centered, scale] = LinAlg.dim3.mapToBox(all_atoms_coords, box3D);
        let atomIndex = 0;
        residues.forEach(residue => {
            residue.atomsList.forEach(atom => {
                atom.coord = all_atoms_centered[atomIndex];
                atomIndex++;
            });
        });

        // Generate ProteinStructure and return
        return new ProteinStructure(name, residues, scale);
    }

    // Mutation Methods --------------------------------------------------------
    rotate(angleXZ, angleYZ){
        const rotationMatrix = LinAlg.dim3.getRotationMatrix(angleXZ, angleYZ);
        this.residues.forEach(residue => residue.transform(rotationMatrix));
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
    }

}