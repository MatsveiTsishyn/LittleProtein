
# LittleProtein

[![License: GPL](https://img.shields.io/badge/License-GPL-green.svg)](https://opensource.org/licenses/MIT)

TO BE WRITTEN

    - Complete README description
    - Add image logo with examples of strucures.
    - Explain parametrization

Author: Matsvei Tsishyn

## Usage

### (1) Just play

Just open `demo.html` on a web brawser.
You will see an example of a 3D protein structure, but you can draw and drop any '.pdb' file to display it instead.
Use mouse left click, mouse wheel and Shift button to interact with the canvas.

### (2) Include in you own web page

To include in your own web site, just include `littleprotein.js` in your project.
You can then create a LittleProtein canvas with a few lines of HTML:

```html
<!DOCTYPE html>
<head>
  <script src="littleprotein.js"></script>
</head>
<body>

  <div id="LittleProteinCanvas1"></div>  
  <script>
    const lpCanvas = LittleProteinStarter.start(
      "#LittleProteinCanvas1", // ID to catch the div where to generate the canvas
      "demo1",                 // Protein to draw among null, 'demo1', 'demo2', 'demo3'
      1200,                    // width (X coord) of the canvas
      800,                     // height (Y coord) of the canvas
    );
  </script>

</body>
</html>
```

### (3) Parametrize you canvas

XXX.

## Build from source

It may be strange to execute someone else code on your web browser.
So here is how to build `littleprotein.js` from source.

- First download `p5.min.js` from the p5 web page and place it in `./src/libs/`.

- Use `node` and `npm` to install the `rollup` node package.
```bash
npm init
npm install --save-dev rollup
```

- Bundle all scripts from `./src/` to a single portable file `littleprotein.js` with
```bash
npx rollup -c
```
