const clickMap = new Map();
clickMap.set("backBtn", "back-to-previous")
clickMap.set("viewToQueryBtn", "change-view-to-query")
clickMap.set("viewToPairsBtn", "change-view-to-pairs")
clickMap.set("viewToInspectBtn", "change-view-to-inspect")


document.body.addEventListener('click', function (event) {
    const namedId = event.target.id;
    if (!(clickMap.has(namedId))){
        return
    }
    api.send(`${clickMap.get(event.target.id)}`);
});

function optionFillViewer(idName){
    var names = window.api.getDistinctDatasets();
    let divNames = document.getElementById(idName);
    let nameString = names.map((elem) => {
        console.log(elem.hic_path)
        return elem.hic_path
    }).join("<option />")
    divNames.innerHTML =  "<option />" + nameString;
};

function queryToSelectbox(search){
    // var search = document.getElementById('left-select').value;
    // var names = functionMapped[keyname](search);
    var names = window.api.getHiCPath(search);
    // let divNames = document.getElementById("populate-left");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    return nameString;
    // divNames.innerHTML = "<option />" + nameString;
}

function selectionToView(keyname){
    var search = document.getElementById('left-select').value;
    // var names = functionMapped[keyname](search);
    var names = window.api.getHiCPath(search);
    let divNames = document.getElementById("populate-left");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
}


function kronecker(inputArray, scaleFactor) {
    const rows = inputArray.length;
    const cols = inputArray[0].length;

    // Initialize the output array with the new dimensions
    const outputArray = Array(rows * scaleFactor)
        .fill(0)
        .map(() => Array(cols * scaleFactor).fill(0));

    // Fill the output array by repeating values
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const value = inputArray[i][j];
            for (let di = 0; di < scaleFactor; di++) {
                for (let dj = 0; dj < scaleFactor; dj++) {
                    outputArray[i * scaleFactor + di][j * scaleFactor + dj] = value;
                }
            }
        }
    }

    return outputArray;
}


function normalizeToImageData(reshapedArray, vMax, canvas) {
    const rows = reshapedArray.length;
    const cols = reshapedArray[0].length;

    // Step 1: Find the min and max values in the array
    const flatArray = reshapedArray.flat();
    const min = Math.min(...flatArray);
    const max = Math.max(...flatArray);

    // Step 2: Normalize values to the 0-255 range
    const normalized = flatArray.map(value => Math.round(((value - min) / (vMax - min)) * 255));

    // Step 3: Convert to RGBA format
    const imageDataArray = new Uint8ClampedArray(rows * cols * 4);
    for (let i = 0; i < normalized.length; i++) {
        const value = normalized[i];
        imageDataArray[i * 4] = value;     // Red
        imageDataArray[i * 4 + 1] = value; // Green
        imageDataArray[i * 4 + 2] = value; // Blue
        imageDataArray[i * 4 + 3] = 255;   // Alpha (fully opaque)
    }

    // Step 4: Draw on the canvas
    const ctx = canvas.getContext("2d");
    const imageData = new ImageData(imageDataArray, cols, rows);
    ctx.putImageData(imageData, 0, 0);
}

function prePopulateCanvas(elementId) {
    const canvas = document.getElementById(elementId);
    const ctx = canvas.getContext('2d');
    canvas.width = 250;
    canvas.height = 250;

    const size = 227.5; // Canvas size
    const tileSize = 4; // Tile size
    const numTiles = size / tileSize;

    // Draw the checkerboard pattern
    for (let row = 0; row < numTiles; row++) {
        for (let col = 0; col < numTiles; col++) {
            // Alternate between black and white
            const isBlack = (row + col) % 2 === 0;
            ctx.fillStyle = isBlack ? 'black' : 'white';
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

// // Example: Assuming the data represents a 64x64 image
// const width = 64;
// const height = 64;
// const canvas = createGrayscaleImage(normalizedData, width, height);

// // Append the canvas to the body to view the image
// document.body.appendChild(canvas);


document.addEventListener('DOMContentLoaded', async () => {
    optionFillViewer("left-select");
    optionFillViewer("right-select");

    var search = document.getElementById('left-select').value;
    var nameString = queryToSelectbox(search);
    var leftdivNames = document.getElementById("populate-left");
    leftdivNames.innerHTML = "<option />" + nameString;
    prePopulateCanvas('canvas-left');

    search = document.getElementById('right-select').value;
    nameString = queryToSelectbox(search);
    let rightdivNames = document.getElementById("populate-right");
    rightdivNames.innerHTML = "<option />" + nameString;
    prePopulateCanvas('canvas-right');
});


document.querySelector('#left-select').addEventListener('change', async () => {
    var search = document.getElementById('left-select').value;
    console.log(search);
    let nameString = queryToSelectbox(search);
    console.log(nameString);
    let divNames = document.getElementById("populate-left");
    divNames.innerHTML = "<option />" + nameString;
});

document.querySelector('#right-select').addEventListener('change', async () => {
    var search = document.getElementById('right-select').value;
    console.log(search);
    let nameString = queryToSelectbox(search);
    console.log(nameString);
    let divNames = document.getElementById("populate-right");
    divNames.innerHTML = "<option />" + nameString;
});


//image does not display correctly. how did we viz in matplotlib. logscale?
document.querySelector('#leftViewBtn').addEventListener('click', async () => {
    var nameToSearch = document.getElementById('populate-left').value;
    var names = window.api.getNames(nameToSearch);
    let arrStr = names.map((elem) => {
        return elem.numpyarr
    }).join("");
    let dimensionStr = names.map((elem) => {
        return elem.dimensions
    }).join("");
    let vMax = names.map((elem) => {
        return elem.viewing_vmax
    }).join("");

    const decodedBytes = Uint8Array.from(atob(arrStr), c => c.charCodeAt(0));
    const float32Array = new Float32Array(decodedBytes.buffer);
    const rows = dimensionStr, cols = dimensionStr;
    const reshapedArray = [];
    for (let i = 0; i < rows; i++) {
        reshapedArray.push(float32Array.slice(i * cols, (i + 1) * cols));
    }

    const canvas = document.getElementById('canvas-left');
    canvas.width = 250;
    canvas.height = 250;
    let finalarr = kronecker(reshapedArray,Math.floor(250/dimensionStr))
    normalizeToImageData(finalarr, vMax, canvas);

});



document.querySelector('#rightViewBtn').addEventListener('click', async () => {
    var nameToSearch = document.getElementById('populate-right').value;
    var names = window.api.getNames(nameToSearch);
    let arrStr = names.map((elem) => {
        return elem.numpyarr
    }).join("");
    let dimensionStr = names.map((elem) => {
        return elem.dimensions
    }).join("");
    let vMax = names.map((elem) => {
        return elem.viewing_vmax
    }).join("");

    const decodedBytes = Uint8Array.from(atob(arrStr), c => c.charCodeAt(0));
    const float32Array = new Float32Array(decodedBytes.buffer);

    // Step 2: Reshape into the original 33x33 structure
    const rows = dimensionStr, cols = dimensionStr;
    const reshapedArray = [];
    for (let i = 0; i < rows; i++) {
        reshapedArray.push(float32Array.slice(i * cols, (i + 1) * cols));
    }

    const canvas = document.getElementById('canvas-right');
    canvas.width = 250;
    canvas.height = 250;
    let finalarr = kronecker(reshapedArray,Math.floor(250/dimensionStr))
    normalizeToImageData(finalarr, vMax, canvas);

});


// document.querySelector('#queryBtn').addEventListener('click', async () => {
//     var fieldSelect = document.getElementById("field-select");
//     var value = fieldSelect.value;
//     var text = fieldSelect.options[fieldSelect.selectedIndex].text;
//     query_with_textbox(text);
// });





