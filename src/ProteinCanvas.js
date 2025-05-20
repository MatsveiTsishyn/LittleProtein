/*
ProteinCanvas: Manage interaction between the canvas (html page) and the ProteinDrawer
    - Move with mouse and other interactions with canvas
    - Load structure as:
        - fetch from PDB or AlphaFoldDB
        - from demo structures
        - from input string in code
        - from drag and drop
*/


// Imports ---------------------------------------------------------------------
import './libs/p5.min.js';
import { demoProtein } from './protein/demo-protein.js';
import { ProteinDrawer } from './protein/ProteinDrawer.js';
import { ProteinStructure } from './protein/ProteinStructure.js';
import { fetch_pdb, fetch_uniprot } from './utils/fetch.js';


// Main ------------------------------------------------------------------------
class ProteinCanvas {


    // Constructor -------------------------------------------------------------
    constructor(containerSelector, X, Y, options = {}) {

        // Init Drawer Object and canvas base properties
        this.containerSelector = containerSelector;
        this.X = X; // canvas width
        this.Y = Y; // canvas height
        this.previousMousePosition = [X/2, Y/2]; // mouse tracker
        this.forceDrawNextFrame = false; // Parameter to force draw() for the next frame

        // Init Protein Structure
        let structure = ProteinStructure.empty_structure();

        // Init Drawer
        this.drawer = new ProteinDrawer(structure, X, Y, options);

        // Init p5 canvas
        this.p5Instance = new p5((sketch) => {
            
            // Init sketch
            this.sketch = sketch;
        
            // Setup (function that runs once)
            // init canvas and draw the first protein frame
            sketch.setup = () => {

                // Init canvas
                const container = document.querySelector(containerSelector);
                const canvas = sketch.createCanvas(this.X, this.Y);
                if (container) canvas.parent(container);

                // First frame draw
                this.drawer.draw(sketch);

                // Enable drag & drop on the canvas and bind it to this method
                canvas.drop(this.handleFile.bind(this));

            };
        
            // Draw (function that runs at each frame)
            // Record mouse movements if required and draw protein
            sketch.draw = () => {

                // Trigger forceDrawNextFrame
                if (this.forceDrawNextFrame) {
                    this.forceDrawNextFrame = false;
                    this.drawer.draw(sketch);
                }

                // Mouse movement trigger
                const mouseX = sketch.mouseX;
                const mouseY = sketch.mouseY;
                if(sketch.mouseIsPressed && this.drawer.isOnCanvas(mouseX, mouseY)){
                    const deltaMouse = [mouseX - this.previousMousePosition[0], mouseY - this.previousMousePosition[1]];
                    if(deltaMouse[0] != 0 || deltaMouse[1] != 0){

                        // Case: protein translation when hold Shift or Control
                        if(sketch.keyIsPressed && (sketch.key == "Shift" || sketch.key == "Control")){
                            this.drawer.updateTranslationCenter(deltaMouse);
                        
                        // Case: rotation by default
                        }else{
                            const rotationAngle = [deltaMouse[0]*Math.PI/this.X, deltaMouse[1]*Math.PI/this.Y];
                            this.drawer.updateRotation(rotationAngle[0], rotationAngle[1]);
                        }

                        this.drawer.draw(sketch);
                    }
                    this.previousMousePosition = [mouseX, mouseY];
                }
            };

            // Mause Wheel
            // Update Zoom or Projection factor
            sketch.mouseWheel = (event) => {
                if(this.drawer.isOnCanvas(sketch.mouseX, sketch.mouseY)){
                    event.preventDefault(); // Prevent scrolling by default
                    const updateFactor = Math.sign(event.delta) * 0.05; // Compute the 'ammount' of change

                    // Case: update view distance (how much image is deformed by projection)
                    if(sketch.keyIsPressed && (sketch.key == "Shift" || sketch.key == "Control")){
                        this.drawer.updateViewDistance(updateFactor);

                    // Case: update Zoom by default
                    }else{
                        this.drawer.updateZoom(updateFactor);
                    }
                    this.drawer.draw(sketch);
                }
            }

            // Mause Pressed ---------------------------------------------------
            // Perform a first update of mouse position before sketch.draw() to keep coherence
            sketch.mousePressed = () => {
                this.previousMousePosition = [sketch.mouseX, sketch.mouseY];
            }
        
        });
    }


    // Structure Loaders -------------------------------------------------------

    // Fetch from PDB or AlphaFoldDB
    async fetch(pdb_id){

        // Init
        this.drawer.setEmptyDisplayText(`fetch('${pdb_id}') ...`);
        this.drawer.clear();
        this.forceDrawNextFrame = true;

        // Fetch from PDB
        let pdb_str;
        try {
            // String test
            if (typeof(pdb_id) !== "string") {
                throw new Error(`ERROR in LittleProtein::fetch('${pdb_id}'): invalid ID for PDB and for UniProt (AlphaFoldDB).`);
            }
            if (pdb_id.length == 4) {
                pdb_str = await fetch_pdb(pdb_id);
            } else {
                pdb_str = await fetch_uniprot(pdb_id);
            }
        } catch(error) {
            this.logError(`ERROR in ProteinCanvas.fetch('${pdb_id}'): fetch failed from PDB: \n${error.message}`);
            return null;
        }

        // Display
        const proteinStructure = ProteinStructure.parse_pdb(pdb_id, pdb_str);
        this.drawer.setEmptyDisplayText("");
        this.drawer.setProteinStructure(proteinStructure);
        this.forceDrawNextFrame = true;

    }

    // Handle file from drag and drop
    handleFile(file) {

        // Init
        const file_name = file.name;
        this.drawer.setEmptyDisplayText(`handleFile('') from drag and drop file '${file_name}' ...`);
        this.drawer.clear();
        this.forceDrawNextFrame = true;

        // File extention error
        if (!file_name.endsWith(".pdb")){
            this.logError(`ERROR in LittleProtein::handleFile() from drag and drop file '${file_name}': must be a '.pdb' file.`);
            return null;
        }

        // Convert file
        let pdb_str;
        try {
            pdb_str = atob(file.data.split(',')[1]); // wtf ???
        } catch(error) {
            this.logError(`ERROR in LittleProtein::handleFile() from drag and drop file '${file_name}': file decoding failed.`);
            return null;
        }

        // Load .pdb file
        this.fromString(pdb_str, file_name);

    }

    // Load structure from input string
    fromString(pdb_str, pdb_name="protein_structure_string"){

        // Init
        this.drawer.setEmptyDisplayText(`from_string('${pdb_name}'): Load PDB ...`);
        this.drawer.clear();
        this.forceDrawNextFrame = true;

        // Display
        try {
            if (typeof(pdb_str) !== "string") {
                throw new Error(`ERROR in LittleProtein::from_string('${pdb_name}'): input must be a string.`);
            }
            const proteinStructure = ProteinStructure.parse_pdb(pdb_name, pdb_str);
            this.drawer.setEmptyDisplayText("");
            this.drawer.setProteinStructure(proteinStructure);
            this.forceDrawNextFrame = true;
        } catch(error) {
            this.logError(`ERROR in ProteinCanvas.from_string('${pdb_name}'): Failed: \n${error.message}`);
            return null;
        }

    }

    // Load demo protein
    loadDemoProtein(){
        this.fromString(demoProtein, "demo");
    }

    // Structure getter shortcut
    get proteinStructure(){
        return this.drawer.proteinStructure;
    }
    

    // Drawer settings ---------------------------------------------------------
    setColorsList(colorsList){
        this.drawer.setColorsList(colorsList);
        this.forceDrawNextFrame = true;
    }

    setColorsMap(colorsMap){
        this.drawer.setColorsMap(colorsMap);
        this.forceDrawNextFrame = true;
    }

    setBackgroundColor(colorRGB){
        this.drawer.setBackgroundColor(colorRGB);
        this.forceDrawNextFrame = true;
    }

    setDepthShadeFactor(depthShadeFactor){
        this.drawer.setDepthShadeFactor(depthShadeFactor);
        this.forceDrawNextFrame = true;
    }

    setViewDistance(viewDistance){
        this.drawer.setViewDistance(viewDistance);
        this.forceDrawNextFrame = true;
    }

    setResiduesScale(residuesScale){
        this.drawer.setResiduesScale(residuesScale);
        this.forceDrawNextFrame = true;
    }

    setResidueColor(resid, colorRGB){
        this.drawer.setResidueColor(resid, colorRGB);
        this.forceDrawNextFrame = true;
    }

    setChainColor(chain, colorRGB){
        this.drawer.setChainColor(chain, colorRGB);
        this.forceDrawNextFrame = true;
    }


    // Dependencies ------------------------------------------------------------
    logError(error_message){
        this.drawer.setEmptyDisplayText(error_message);
        console.error(error_message);
        this.forceDrawNextFrame = true;
    }

}


// Expose as global API --------------------------------------------------------
window.LittleProteinStarter = {
  start: (selector, X, Y, options) => new ProteinCanvas(selector, X, Y, options),
};
