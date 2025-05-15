/*
Container Class to manage Color
    - Manage HSL and RGB transformations
    - Manage gradual transformation of one property (like red or lightness) or a color.
*/


// Main ------------------------------------------------------------------------
export class Color {

    // Static Methods ----------------------------------------------------------
    static isColorFormat(inputValue){
        if (inputValue == null) return false;
        if (inputValue.length !== 3) return false;
        return typeof(inputValue[0]) == "number" && typeof(inputValue[1]) == "number" && typeof(inputValue[2]) == "number"; 
    }

    // Constructor -------------------------------------------------------------
    constructor(r, g, b){
        r = Color._safe_get(r);
        g = Color._safe_get(g);
        b = Color._safe_get(b); 
        this._arr = [r/255, g/255, b/255];
    }

    // Gettets -----------------------------------------------------------------
    get red(){
        return Color._safe_get(this._arr[0]*255);
    }

    get green(){
        return Color._safe_get(this._arr[1]*255);
    }

    get blue(){
        return Color._safe_get(this._arr[2]*255);
    }

    get RGB(){
        return [this.red, this.green, this.blue];
    }

    get HSL(){
        const [r, g, b] = this.RGB;
        const [h ,s, l] = Color.RGBToHSL(r, g, b);
        return [Color._safe_get(h), Color._safe_get(s), Color._safe_get(l)];
    }

    get hue(){
        return this.HSL[0];
    }

    get saturation(){
        return this.HSL[1];
    }

    get lightness(){
        return this.HSL[2];
    }

    // Copy and Copy With Updates ------------------------------------------------
    copy(){
        return new Color(this._arr[0]*255, this._arr[1]*255, this._arr[2]*255);
    }

    updatedRed(updateValue){
        const [r, g, b] = this._arr;
        return new Color(Color._smoothUpdate(r, updateValue)*255, g*255, b*255);
    }

    updatedGreen(updateValue){
        const [r, g, b] = this._arr;
        return new Color(r*255, Color._smoothUpdate(g, updateValue)*255, b*255);
    }

    updatedBlue(updateValue){
        const [r, g, b] = this._arr;
        return new Color(r*255, g*255, Color._smoothUpdate(b, updateValue)*255);
    }

    updatedHue(updateValue){
        const [r, g, b] = this.RGB;
        const [h ,s, l] = Color.RGBToHSL(r, g, b);
        return new Color(...Color.HSLToRGB(Color._smoothUpdate(h/255, updateValue) *255), s, l);
    }

    updatedSaturation(updateValue){
        const [r, g, b] = this.RGB;
        const [h ,s, l] = Color.RGBToHSL(r, g, b);
        return new Color(...Color.HSLToRGB(h, Color._smoothUpdate(s/100, updateValue) *100), l);
    }

    updatedLightness(updateValue){
        const [r, g, b] = this.RGB;
        const [h ,s, l] = Color.RGBToHSL(r, g, b);
        return new Color(...Color.HSLToRGB(h, s, Color._smoothUpdate(l/100, updateValue) *100));
    }

    // Dependencies --------------------------------------------------------------
    static _safe_get(value){
        return Math.min(Math.max(Math.round(value), 0), 255);
    }

    static _sigmoid(x){
        return 1 / (1 + (Math.E** -x));
    }

    static _inverseSignmoid(x){
        return -Math.log((1/x) - 1);
    }

    static _smoothUpdate(x, updateValue){
        return Color._sigmoid(Color._inverseSignmoid(x) + updateValue);
    }

    static RGBToHSL(r, g, b){
        // From: https://www.30secondsofcode.org/js/s/rgb-to-hsl/
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s
            ? l === r
                ? (g - b) / s
                : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
            : 0;
        return [
            60 * h < 0 ? 60 * h + 360 : 60 * h,
            100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
            (100 * (2 * l - s)) / 2,
        ];
    };

    static HSLToRGB(h, s, l){
        // From: https://www.30secondsofcode.org/js/s/hsl-to-rgb/
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [255 * f(0), 255 * f(8), 255 * f(4)];
    };

}
