const backButton = document.getElementById('backBtn');
backButton.addEventListener('click',()=>{
    api.signalToMain('dialog:callInspectTools', false)
    api.send('back-to-previous');
});

const viewToQueryButton = document.getElementById('viewToQueryBtn');
viewToQueryButton.addEventListener('click',()=>{
    api.signalToMain('dialog:callInspectTools', false)
    api.send('change-view-to-query');
});

const viewToInspectButton = document.getElementById('viewToInspectBtn');
viewToInspectButton.addEventListener('click',()=>{
    // api.send('change-view-to-inspect');
    return
});

const viewToViewerButton = document.getElementById('viewToViewerBtn');
viewToViewerButton.addEventListener('click',()=>{
    api.signalToMain('dialog:callInspectTools', false)
    api.send('change-view-to-viewer');
});

const viewToPairsButton = document.getElementById('viewToPairsBtn');
viewToPairsButton.addEventListener('click',()=>{
    api.signalToMain('dialog:callInspectTools', false)
    api.send('change-view-to-pairs');
});


/* Submit API call to renderer/main*/

window.api.recieve("talk-to-main",() => {
    window.api.talkToPBoard(window.id);
});

/* Recieve Call from main */
window.api.recieve("paste-board-to-noWindow",(values) => {
    var names = values[0];
    var fieldSelect = document.getElementById("field-select")
    if (fieldSelect.value != "Pasteboard"){
        let divNames = document.getElementById("names-field");
        divNames.innerHTML = "";
        fieldSelect.value="Pasteboard";
        if (names.length === 0) {
        return
        }
        let nameString = names.map((elem) => {
            return elem
        }).join("<option />")
        divNames.innerHTML = "<option />" + nameString;
        return}

    var namesMemory = new Map();
    const selection = document.getElementById('names-field');

    if (selection.options.length>0) {
        let storedNames = [...selection.options].map(o => o.text);
        for (i=0;i<storedNames.length;i++){
            if (namesMemory.has(storedNames[i])){
                continue
            } else {
                namesMemory.set(storedNames[i], 2)
            }
        }
    }

    let nameString = names.map((elem) => {
        return elem
    })

    for(i=0;i<nameString.length;i++){
        if (namesMemory.has(nameString[i])){
            continue
        } else {
            namesMemory.set(nameString[i], 2)
        }
    }

    let payload = [...namesMemory.keys()]
    let divNames = document.getElementById("names-field");
    divNames.innerHTML = "<option />" + payload.join("<option />")
});




var stName;
var stPUB_ID;
var stCondition;
var stCoordinates;
var stDataset;
var stDimensions;
var stHic_path;
var stNumpyArr;
var stViewing_vmax;

let inspectedImageArray = {
    "name": stName,
    "PUB_ID": stPUB_ID,
    "condition": stCondition,
    "coordinates": stCoordinates,
    "dataset": stDataset,
    "dimensions": stDimensions,
    "hic_path": stHic_path,
    "numpyarr": stNumpyArr,
    "viewing_vmax": stViewing_vmax}

function optionFillViewer(idName){
    var names = window.api.getDistinctDatasets();
    let divNames = document.getElementById(idName);
    let nameString = names.map((elem) => {
        return elem.hic_path
    }).join("<option />")
    divNames.innerHTML =  "<option />" + nameString + "<option /> Pasteboard";
};

function tailOfSQLClick(){
    var names = window.api.getTail();
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
};

function defaultRender(){
    var names = window.api.pragma();
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("");
    divNames.innerHTML = nameString;
};

function singlularQuery(name){
    var names = window.api.getNames(name);
    let nameString = names.map((elem) => {
        return elem
    });
    return nameString;
}

function queryToSelectbox(search){
    var names = window.api.getHiCPath(search);
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    return nameString;
}


function query_with_textbox(keyname){
    var search = document.getElementById('sqlite3-query').value;
    var names = functionMapped[keyname](search);
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
}

function normalizeToImageData(reshapedArray, vMin, vMax, canvas) {
    const rows = reshapedArray.length;
    const cols = reshapedArray[0].length;

    // Step 1: Find the min and max values in the array
    const flatArray = reshapedArray.flat();
    const normalized = flatArray.map(value => Math.round(((value - vMin) / (vMax - vMin)) * 255));

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


document.addEventListener('DOMContentLoaded', async () => {
    window.api.signalToMain('dialog:callInspectTools', true);
    optionFillViewer("field-select");
    var search = document.getElementById('field-select').value;
    var nameString = queryToSelectbox(search);
    var divNames = document.getElementById("names-field");
    divNames.innerHTML = "<option />" + nameString;
    var divNames = document.getElementById("names-field");
    divNames.innerHTML = "<option />" + nameString;

    const canvas = document.getElementById('canvas-inspect');
    const ctx = canvas.getContext('2d');
    canvas.width = 450;
    canvas.height = 450;

    const size = 450; // Canvas size
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

    const popcanvas = document.querySelector('canvas#canvas-pop');
    const popctx = popcanvas.getContext('2d');
    popcanvas.width = 325;
    popcanvas.height = 325;

    for (let row = 0; row < numTiles; row++) {
        for (let col = 0; col < numTiles; col++) {
            // Alternate between black and white
            const isBlack = (row + col) % 2 === 0;
            popctx.fillStyle = isBlack ? 'black' : 'white';
            popctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }



});

document.querySelector('#field-select').addEventListener('change', async () => {
    var search = document.getElementById('field-select').value;
    let nameString = queryToSelectbox(search);
    let divNames = document.getElementById("names-field");
    divNames.innerHTML = "<option />" + nameString;
});


document.querySelector('#names-field').addEventListener('change', async () => {
    // var search = document.getElementById('field-select');
    // let nameString = queryToSelectbox(search);
    let selection = document.getElementById("names-field");
    var value = selection.value;
    var queryName = selection.options[selection.selectedIndex].text;
    var valueArr = singlularQuery(queryName);

    var preloadedValues = JSON.parse(JSON.stringify(valueArr))[0];
    const name         = preloadedValues.name;
    const PUB_ID       = preloadedValues.PUB_ID;
    const condition    = preloadedValues.condition;
    const coordinates  = preloadedValues.coordinates;
    const dataset      = preloadedValues.dataset;
    const dimensions   = preloadedValues.dimensions;
    const hic_path     = preloadedValues.hic_path;
    const numpyArr     = preloadedValues.numpyarr;
    const viewing_vmax = preloadedValues.viewing_vmax;

    inspectedImageArray["name"]=name
    inspectedImageArray["PUB_ID"]=PUB_ID
    inspectedImageArray["condition"]=condition
    inspectedImageArray["coordinates"]=coordinates
    inspectedImageArray["dataset"]=dataset
    inspectedImageArray["dimensions"]=dimensions
    inspectedImageArray["hic_path"]=hic_path
    inspectedImageArray["numpyarr"]=numpyArr
    inspectedImageArray["viewing_vmax"]=viewing_vmax

    //set input#filter1.value
    var pixelMax = document.querySelector("input#filter1")
    pixelMax.value = viewing_vmax;

    //set canvas
    const decodedBytes = Uint8Array.from(atob(numpyArr), c => c.charCodeAt(0));
    const float32Array = new Float32Array(decodedBytes.buffer);
    const rows = dimensions, cols = dimensions;
    const reshapedArray = [];
    for (let i = 0; i < rows; i++) {
        reshapedArray.push(float32Array.slice(i * cols, (i + 1) * cols));
    }

    const canvas = document.getElementById('canvas-inspect');
    canvas.width = 450;
    canvas.height = 450;
    let finalarr = kronecker(reshapedArray,Math.floor(448/dimensions))
    normalizeToImageData(finalarr, 0, viewing_vmax, canvas);
    let divNames = document.getElementById("sql-query-payload");
    let splitCoords = inspectedImageArray["coordinates"].split(',');
    inspectedImageArray["coordinates"]= `${splitCoords[0]}: ${splitCoords[1]}–${splitCoords[2]}<p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[3]}: ${splitCoords[4]}–${splitCoords[5]}</p>`
    divNames.innerHTML = `<p style="-webkit-user-select: text;margin-bottom: 1px"><class "s">${inspectedImageArray["dataset"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${inspectedImageArray["name"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${inspectedImageArray["coordinates"]}</p>`
});

document.querySelector('input#filter1').addEventListener('change', async () => {
    //load vmax value as default into pixelMax
    var pixelMaxValue = document.querySelector("input#filter1").value;
    var numpyArr = inspectedImageArray["numpyarr"]
    var dimensions = inspectedImageArray["dimensions"]
    const decodedBytes = Uint8Array.from(atob(numpyArr), c => c.charCodeAt(0));
    const float32Array = new Float32Array(decodedBytes.buffer);
    const rows = dimensions, cols = dimensions;
    const reshapedArray = [];
    for (let i = 0; i < rows; i++) {
        reshapedArray.push(float32Array.slice(i * cols, (i + 1) * cols));
    }

    const canvas = document.getElementById('canvas-inspect');
    canvas.width = 450;
    canvas.height = 450;
    let finalarr = kronecker(reshapedArray,Math.floor(448/dimensions))
    normalizeToImageData(finalarr, 0, pixelMaxValue, canvas);
});


document.querySelector('#popViewBtn').addEventListener('click', () => {
  const viewPortWindow = document.querySelector('#viewPortWindow.content')
  if (viewPortWindow.classList.contains('hidden')){ 
    viewPortWindow.classList.toggle('hidden');
    };
});


window.api.recieve("closePopView", (message) =>{
    //is the element hidden? (TRUE)
    const reply = viewPortWindow.classList.contains('hidden');
    console.log(reply)
    if (!reply){
        //true means visible
        viewPortWindow.classList.toggle('hidden')
    };
    console.log(reply)
    window.api.signalToMain("closeWindowConfirm",reply)
});

document.querySelector('#viewPortWindow .close-box').addEventListener('click', () => {
  const viewPortWindow = document.querySelector('#viewPortWindow.content')
  viewPortWindow.classList.toggle('hidden');
});

