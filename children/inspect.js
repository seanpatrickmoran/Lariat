var stName0="";
var stPUB_ID0="";
var stCondition0="";
var stCoordinates0="";
var stDataset0="";
var stDimensions0="";
var stHic_path0="";
var stNumpyArr0="";
var stViewing_vmax0="";

var stName1="";
var stPUB_ID1="";
var stCondition1="";
var stCoordinates1="";
var stDataset1="";
var stDimensions1="";
var stHic_path1="";
var stNumpyArr1="";
var stViewing_vmax1="";

var persistent_state = 0;

/*
current state is persistent_state, last 
invocation to inspect image is persistent_state^=1
*/

var state0 ={
    "name": stName0,
    "PUB_ID": stPUB_ID0,
    "condition": stCondition0,
    "coordinates": stCoordinates0,
    "dataset": stDataset0,
    "dimensions": stDimensions0,
    "hic_path": stHic_path0,
    "numpyarr": stNumpyArr0,
    "viewing_vmax": stViewing_vmax0}

var state1 = {
    "name": stName1,
    "PUB_ID": stPUB_ID1,
    "condition": stCondition1,
    "coordinates": stCoordinates1,
    "dataset": stDataset1,
    "dimensions": stDimensions1,
    "hic_path": stHic_path1,
    "numpyarr": stNumpyArr1,
    "viewing_vmax": stViewing_vmax1}


let inspectedImageArray = Array(state0, state1)


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


const toggleViewPortVisibility = () => {
  const viewPortWindow = document.querySelector('#viewPortWindow.content')
  if (viewPortWindow.classList.contains('hidden')){ 
    viewPortWindow.classList.toggle('hidden');
    };
};

const loadImageToInspect = (selectionId,inputId,canvasId,divNamesId) => {

    let selection = document.getElementById(selectionId);
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

    inspectedImageArray[persistent_state]["name"]=name
    inspectedImageArray[persistent_state]["PUB_ID"]=PUB_ID
    inspectedImageArray[persistent_state]["condition"]=condition
    inspectedImageArray[persistent_state]["coordinates"]=coordinates
    inspectedImageArray[persistent_state]["dataset"]=dataset
    inspectedImageArray[persistent_state]["dimensions"]=dimensions
    inspectedImageArray[persistent_state]["hic_path"]=hic_path
    inspectedImageArray[persistent_state]["numpyarr"]=numpyArr
    inspectedImageArray[persistent_state]["viewing_vmax"]=viewing_vmax

    //set input#filter1.value
    var pixelMax = document.querySelector(inputId)
    pixelMax.value = viewing_vmax;

    //set canvas
    const decodedBytes = Uint8Array.from(atob(numpyArr), c => c.charCodeAt(0));
    const float32Array = new Float32Array(decodedBytes.buffer);
    const rows = dimensions, cols = dimensions;
    const reshapedArray = [];
    for (let i = 0; i < rows; i++) {
        reshapedArray.push(float32Array.slice(i * cols, (i + 1) * cols));
    }

    const canvas = document.getElementById(canvasId);
    canvas.width = 450;
    canvas.height = 450;
    let finalarr = kronecker(reshapedArray,Math.round(450/dimensions))
    normalizeToImageData(finalarr, 0, viewing_vmax, canvas);
    if (inspectedImageArray[persistent_state]["coordinates"]===undefined){
        splitCoords=""
    } else {
        splitCoords=inspectedImageArray[persistent_state]["coordinates"].split(",")
    }

    let divNames = document.getElementById(divNamesId);
    divNames.innerHTML = `<p style="-webkit-user-select: text;margin-bottom: 1px"><class "s">${inspectedImageArray[persistent_state]["dataset"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${inspectedImageArray[persistent_state]["name"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[0]}: ${splitCoords[1]}–${splitCoords[2]}<p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[3]}: ${splitCoords[4]}–${splitCoords[5]}</p>`

    persistent_state^=1;

};


document.querySelector('#viewPortWindow .close-box').addEventListener('click', () => {
  const viewPortWindow = document.querySelector('#viewPortWindow.content')
  viewPortWindow.classList.toggle('hidden');
});



const clickMap = new Map();
// clickMap.set("backBtn", ['dialog:callInspectTools', false, "back-to-previous"])
clickMap.set("backBtn", "back-to-previous")
clickMap.set("viewToQueryBtn", "change-view-to-query")
clickMap.set("viewToViewerBtn", "change-view-to-viewer")
clickMap.set("viewToPairsBtn", "change-view-to-pairs")
clickMap.set("popViewBtn", toggleViewPortVisibility)



////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




document.body.addEventListener('click', function (event) {
    passive: true
    const namedId = event.target.id;
    if (!(clickMap.has(namedId))){
        return
    }
    if (["popViewBtn"].includes(namedId)){
        clickMap.get(namedId)();
        return
    }
    api.signalToMain('dialog:callInspectTools', false)
    api.send(`${clickMap.get(event.target.id)}`);
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



////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




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

    const flatArray = reshapedArray.flat();
    const normalized = flatArray.map(value => Math.round(((value - vMin) / (vMax - vMin)) * 255));

    const imageDataArray = new Uint8ClampedArray(rows * cols * 4);
    for (let i = 0; i < normalized.length; i++) {
        const value = normalized[i];
        imageDataArray[i * 4] = value;     // Red
        imageDataArray[i * 4 + 1] = value; // Green
        imageDataArray[i * 4 + 2] = value; // Blue
        imageDataArray[i * 4 + 3] = 255;   // Alpha
    }

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


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



document.addEventListener('DOMContentLoaded', async () => {
    window.api.signalToMain('dialog:callInspectTools', true);
    optionFillViewer("field-select");
    var search = document.getElementById('field-select').value;
    var nameString = queryToSelectbox(search);
    var divNames = document.getElementById("names-field");
    divNames.innerHTML = "<option />" + nameString;
    var divNames = document.getElementById("names-field");
    divNames.innerHTML = "<option />" + nameString;
    loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload");
    persistent_state^=1;

    const canvas = document.getElementById('canvas-hidden');
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

    const canvas2 = document.getElementById('canvas-hidden-2');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = 450;
    canvas2.height = 450;

    // Draw the checkerboard pattern
    for (let row = 0; row < numTiles; row++) {
        for (let col = 0; col < numTiles; col++) {
            // Alternate between black and white
            const isBlack = (row + col) % 2 === 0;
            ctx2.fillStyle = isBlack ? 'black' : 'white';
            ctx2.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
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
    loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload");
});


document.querySelector('input#filter1').addEventListener('change', async () => {
    //load vmax value as default into pixelMax
    var pixelMaxValue = document.querySelector("input#filter1").value;
    var numpyArr = inspectedImageArray[persistent_state]["numpyarr"]
    var dimensions = inspectedImageArray[persistent_state]["dimensions"]
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
    let finalarr = kronecker(reshapedArray,Math.round(450/dimensions))
    normalizeToImageData(finalarr, 0, pixelMaxValue, canvas);
});



////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




window.api.recieve("transmitSwapInspect", (message) =>{
    console.log(persistent_state)
    let splitCoords = inspectedImageArray[persistent_state]["coordinates"].split(',');
    // inspectedImageArray[persistent_state]["coordinates"] = `${splitCoords[0]}: ${splitCoords[1]}–${splitCoords[2]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[3]}: ${splitCoords[4]}–${splitCoords[5]}`
    let divNames = document.getElementById("pop-payload");
    if (inspectedImageArray[persistent_state]["coordinates"]===undefined){
        splitCoords=""
        divNames.innerHTML = `<p style="-webkit-user-select: text;margin-bottom: 1px"><class "s">${inspectedImageArray[persistent_state]["dataset"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${inspectedImageArray[persistent_state]["name"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">0: 0-0</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">0: 0-0</p>`
    } else {
        splitCoords = inspectedImageArray[persistent_state]["coordinates"].split(',');
            divNames.innerHTML = `<p style="-webkit-user-select: text;margin-bottom: 1px"><class "s">${inspectedImageArray[persistent_state]["dataset"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${inspectedImageArray[persistent_state]["name"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[0]}: ${splitCoords[1]}–${splitCoords[2]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[3]}: ${splitCoords[4]}–${splitCoords[5]}</p>`
    }
    
    persistent_state^=1;
    divNames = document.getElementById("sql-query-payload");
    if (inspectedImageArray[persistent_state]["coordinates"]===undefined){
        splitCoords=""
        divNames.innerHTML = `<p style="-webkit-user-select: text;margin-bottom: 1px"><class "s">${inspectedImageArray[persistent_state]["dataset"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${inspectedImageArray[persistent_state]["name"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">0: 0-0</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">0: 0-0</p>`
    } else {
        splitCoords = inspectedImageArray[persistent_state]["coordinates"].split(',');
        divNames.innerHTML = `<p style="-webkit-user-select: text;margin-bottom: 1px"><class "s">${inspectedImageArray[persistent_state]["dataset"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${inspectedImageArray[persistent_state]["name"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[0]}: ${splitCoords[1]}–${splitCoords[2]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[3]}: ${splitCoords[4]}–${splitCoords[5]}</p>`
    }


    if (viewPortWindow.classList.contains('hidden')){
        viewPortWindow.classList.toggle('hidden');
    }

    const sourceCanvas = document.getElementById("canvas-inspect")
    // var sourcePixelMaxValue = document.querySelector("input#filter1").value;
    const targetCanvas = document.getElementById("canvas-pop")
    // var targetPixelMaxValue = document.querySelector("input#filter1").value;
    const hideCanvas = document.getElementById("canvas-hidden")
    const hideCanvas2 = document.getElementById("canvas-hidden-2")

    const tctx = targetCanvas.getContext("2d");
    const sctx = sourceCanvas.getContext("2d");
    const hctx = hideCanvas.getContext("2d");
    const hctx2 = hideCanvas2.getContext("2d");
    hctx.drawImage(sourceCanvas, 0, 0, 450, 450)
    tctx.drawImage(sourceCanvas, 0, 0, 350, 350);
    sctx.drawImage(hideCanvas2, 0, 0, 450, 450);
    hctx2.drawImage(hideCanvas, 0, 0, 450, 450);
});


window.api.recieve("closePopView", (message) =>{
    const reply = viewPortWindow.classList.contains('hidden');
    console.log(reply)
    if (!reply){
        viewPortWindow.classList.toggle('hidden')
    };
    console.log(reply)
    window.api.signalToMain("closeWindowConfirm",reply)
});

