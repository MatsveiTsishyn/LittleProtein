/*
Container Class to draw ProteinStructure
    - Manages canvas properties like size and projections and so on ...
    - Manages projections and transformations of ProteinStructure
    - Link between the canvas and the ProteinStructure object
*/


// Imports ---------------------------------------------------------------------
import { Color } from '../utils/Color.js';
import { LinAlg } from '../utils/LinAlg.js';
import { ProteinStructure } from './ProteinStructure.js';


// Main ------------------------------------------------------------------------
export class ProteinDrawer {


    // Constants ---------------------------------------------------------------

    // Drawer constant properties
    static C_ALPHA_DISTANCE = 3.8;
    static PROJECT_LINK = "github.com/MatsveiTsishyn/LittleProtein"
    static EMPTY_DISPLAY_TEXT = "Drag and Drop your '.pdb' file here \n(you can find some at 'https://www.rcsb.org/')"

    // Default parameters values
    static COLORS_LIST = [
        [  0,  95, 115],
        [238, 155,   0],
        [225,   0,  12],
        [ 44, 160,  44],
        [148, 103, 189],
        [140,  86,  75],
        [227, 119, 194],
        [127, 127, 127],
        [188, 189,  34],
        [ 23, 190, 207],
    ];
    static BACKGROUND_COLOR = [220, 220, 220];
    static FONT_COLOR = [45, 45, 45];
    static DEPTH_SHADE_FACTOR = 1.0;
    static DEPTH_SHADE_FACTOR_RANGE = [-10.0, 10.0];
    static VIEW_DISTANCE = 5.0;
    static VIEW_DISTANCE_RANGE = [0.50, 100.00];
    static RESIDUEE_SCALE = 1.0;
    static RESIDUEE_SCALE_RANGE = [0.05, 10.00];


    // Constructor -------------------------------------------------------------
    constructor(structure, X, Y, options = {}) {

        // Init Canvas Properties
        this.X = X;
        this.Y = Y;
        this.translationCenter = [X/2, Y/2];
        this.translationCenterRange = [-0.5 * Math.max(X, Y), 1.5 * Math.max(X, Y)];
        this.zoom = Math.min(X, Y)*0.80;
        this.zoomRange = [Math.min(X, Y)*0.05, Math.max(X, Y)*4];

        // Init options
        this.options = options;

        this.colorsList = ProteinDrawer.COLORS_LIST;
        if ("colorsList" in options) this.setColorsList(options["colorsList"]);

        this.colorsMap = {};
        if ("colorsMap" in options) this.setColorsMap(options["colorsMap"]);
        
        this.backgroundColor = ProteinDrawer.BACKGROUND_COLOR;
        this.fontColor = ProteinDrawer.FONT_COLOR;
        if ("backgroundColor" in options) this.setBackgroundColor(options["backgroundColor"]);

        this.depthShadeFactor = ProteinDrawer.DEPTH_SHADE_FACTOR
        if ("depthShadeFactor" in options) this.setDepthShadeFactor(options["depthShadeFactor"]);

        this.viewDistance = ProteinDrawer.VIEW_DISTANCE;
        if ("viewDistance" in options) this.setViewDistance(options["viewDistance"]);

        this.residuesScale = ProteinDrawer.RESIDUEE_SCALE;
        if ("residuesScale" in options) this.setResiduesScale(options["residuesScale"]);

        this.emptyDisplayText = ProteinDrawer.EMPTY_DISPLAY_TEXT;
        if ("emptyDisplayText" in options) this.setEmptyDisplayText(options["emptyDisplayText"]);

        // Init structure
        this.setProteinStructure(structure);

    }


    // Set Drawer properties ---------------------------------------------------
    setProteinStructure(proteinStructure){

        // Set structure
        this.proteinStructure = proteinStructure;

        // Set Color
        const nColors = this.colorsList.length;
        const colorsMapFallback = {}
        let i = 0;
        this.proteinStructure.residues.forEach( res => {
            const chain = res.chain;
            // Case: chain is in colorsMap
            if (chain in this.colorsMap) {
                res.setColor(this.colorsMap[chain]);
            // Case: fallback to colorsList, but the chain has already been assigned a color
            } else if (chain in colorsMapFallback) {
                res.setColor(colorsMapFallback[chain]);
            // Case: fallback to colorsList and it is an new (unseen) chain
            } else {
                const newColor = this.colorsList[i%nColors];
                res.setColor(newColor)
                colorsMapFallback[chain] = newColor;
                i += 1;
            }
        });
    }

    clear() {
        this.setProteinStructure(ProteinStructure.empty_structure());
    }

    setResidueColor(resid, color_arr){

        // Guardians
        const residue = this.proteinStructure.getResidue(resid);
        if (residue == null) {
            console.warn(`ERROR in ProteinDrawer.setResidueColor(): resid='${resid}' does not exists in current protein structure.`);
            return null;
        }
        if (!Color.isColorFormat(color_arr)){
            console.warn(`ERROR in ProteinDrawer.setResidueColor(): invalid color_arr='${color_arr}'.`);
            return null;
        }

        // Set Color
        residue.setColor(color_arr);
    }

    setChainColor(chain, color_arr){

        // Guardians
        if (!Color.isColorFormat(color_arr)){
            console.warn(`ERROR in ProteinDrawer.setChainColor(): invalid color_arr='${color_arr}'.`);
            return null;
        }

        // Set color
        this.proteinStructure.residues.forEach( res => {
            if (res.chain == chain) res.setColor(color_arr);
        })
    }

    setColorsList(colorsList){

        // Guardian
        if (colorsList == null || colorsList.length < 1) {
            console.warn("ProteinDrawer.setColorsList() Failed: incorrect input colorsList.");
            return null;
        }
        if (!colorsList.every(color => Color.isColorFormat(color))) {
            console.warn("ProteinDrawer.setColorsList() Failed: incorrect input colorsList.");
            return null;
        }

        // Set colors list
        this.colorsList = colorsList;
    }

    setColorsMap(colorsMap){

        // Guardian
        if (colorsMap.constructor !== Object) { // check it is a dictionary (JavaScript is doomed ...)
            console.warn("");
            return null;
        }
        if (!Object.entries(colorsMap).every(([key, value]) => typeof(key) == "string" && key.length == 1 && Color.isColorFormat(value))) {
            console.warn("");
            return null;
        }

        // Set Colors Map
        this.colorsMap = colorsMap;
    }

    setBackgroundColor(color_rbg){

        // Verify coherence
        if (!Color.isColorFormat(color_rbg)){
            console.warn("ProteinDrawer.setBackgroundColor() Failed: incorrect input color.");
            return null;
        }

        // Normalize color
        this.backgroundColor = color_rbg;

        // Set font color
        const backgroundMean = (color_rbg[0] + color_rbg[1] + color_rbg[2]) / 3;
        if (backgroundMean < 128) {
            this.fontColor = [210, 210, 210];
        } else {
            this.fontColor = [45, 45, 45];
        }
    }

    setDepthShadeFactor(depthShadeFactor){
        if (typeof(depthShadeFactor) !== "number") {
            console.warn("ProteinDrawer.setDepthShadeFactor() Failed: input depthShadeFactor should be a number.");
            return null;
        }
        this.depthShadeFactor = this._boundedValue(depthShadeFactor, ProteinDrawer.DEPTH_SHADE_FACTOR_RANGE);
    }

    setViewDistance(viewDistance){
        if (typeof(viewDistance) !== "number") {
            console.warn("ProteinDrawer.setViewDistance() Failed: input viewDistance should be a number.");
            return null;
        }
        this.viewDistance = this._boundedValue(viewDistance, ProteinDrawer.VIEW_DISTANCE_RANGE);
    }

    setResiduesScale(residuesScale){
        if (typeof(residuesScale) !== "number") {
            console.warn("ProteinDrawer.setResiduesScale() Failed: input residuesScale should be a number.");
            return null;
        }
        this.residuesScale = this._boundedValue(residuesScale, ProteinDrawer.RESIDUEE_SCALE_RANGE);
    }

    setEmptyDisplayText(emptyDisplayText=""){
        if (emptyDisplayText == "") {
            this.emptyDisplayText = ProteinDrawer.EMPTY_DISPLAY_TEXT;
        } else {
            this.emptyDisplayText = String(emptyDisplayText);
        }
    }


    // Draw protein Methods ----------------------------------------------------
    draw(sketch){

        // Background
        this.drawBackground(sketch);

        // Sort residues for depth
        this.proteinStructure.residues.sort((r1, r2) => r1.c_alpha[2] - r2.c_alpha[2]);

        // Draw residues
        const strokeWeightResidue = this.strokeWeightResidue()
        this.proteinStructure.residues.forEach(residue => {
            const coord = residue.c_alpha;
            const proj = LinAlg.dim3.project2D(coord, this.viewDistance);
            const proj_scaled = LinAlg.dim2.scalMult(this.zoom, proj);
            const proj_centered = LinAlg.dim2.sum(proj_scaled, this.translationCenter);
            sketch.stroke(...residue.color.updatedLightness(coord[2]*2.0*this.depthShadeFactor).RGB);
            sketch.strokeWeight(strokeWeightResidue);
            sketch.point(proj_centered[0], proj_centered[1]);
        })

    }

    drawBackground(sketch){

        // Background Color
        sketch.background(this.backgroundColor);

        // Init canvas text parameters
        sketch.fill(this.fontColor);
        sketch.strokeWeight(0);

        // Draw no structure message
        if (this.proteinStructure.isEmpty()){
            sketch.textAlign(sketch.CENTER);
            sketch.textSize(15);
            sketch.text("LittleProtein: No Protein Structure loaded.\n" + this.emptyDisplayText, this.X/2, this.Y/2);
        }

        // Inject link
        sketch.textAlign(sketch.RIGHT);
        sketch.textSize(13);
        sketch.text(ProteinDrawer.PROJECT_LINK, this.X - 13, this.Y - 13);

    }


    // Properties --------------------------------------------------------------
    isOnCanvas(x, y){
        return 0 <= x && x <= this.X && 0 <= y && y <= this.Y;
    }

    strokeWeightResidue(){
        // Here is a magic function so that the strokeWeight of a residue is constant
        // whaterver the zoom or the size of the canvas or the size of the protein structure
        // This indeed appears strange, but do not think too much about it
        return 1.6 * this.residuesScale * ProteinDrawer.C_ALPHA_DISTANCE * this.zoom / this.proteinStructure.scale
    }


    // Update Drawer -----------------------------------------------------------
    updateRotation(angleXZ, angleYZ){
        this.proteinStructure.rotate(angleXZ, angleYZ);
        return this;
    }

    updateTranslationCenter(translation){
        const translationCenterNew = LinAlg.dim2.sum(this.translationCenter, translation);
        this.translationCenter = translationCenterNew.map(t => this._boundedValue(t, this.translationCenterRange));
        return this;
    }

    updateZoom(variation){
        const zoomNew = this.zoom * (1.0 + variation);
        this.zoom = this._boundedValue(zoomNew, this.zoomRange);
        return this;
    }

    updateViewDistance(variation){
        const viewDistanceNew = this.viewDistance * (1.0 + variation);
        this.setViewDistance(viewDistanceNew)
        return this;
    }


    // Dependencies ------------------------------------------------------------
    _boundedValue(value, bounds){
        return Math.min(Math.max(value, bounds[0]), bounds[1]);
    }

}