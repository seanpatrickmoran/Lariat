var stName0="";
var stPUB_ID0="";
var stCondition0="";
var stCoordinates0="";
var stDataset0="";
var stDimensions0="";
var stHic_path0="";
var stNumpyArr0="";
var stViewing_vmax0=0;

var stName1="";
var stPUB_ID1="";
var stCondition1="";
var stCoordinates1="";
var stDataset1="";
var stDimensions1="";
var stHic_path1="";
var stNumpyArr1="";
var stViewing_vmax1=0;

var persistent_state = 0;
var isLogNorm = 0;

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



let tableMemory = {
            "datasetFields": Array(),
            "resolutionFields": {},
            "NamesFields": "",
            "databaseName" : "",
            }


let searchPageOffset = 0;
var offsetPage = Math.ceil(searchPageOffset/200);

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


const queryInspectToNamesField = (dname, res, setPageOffset=0) =>{
    searchPageOffset += setPageOffset
    data = window.api.getDatasetatRes(dname, res, searchPageOffset)

    if (data.length===0){
        searchPageOffset -= setPageOffset
        return
    }

    divNames = document.getElementById("names-field");
    nameString = data.map((elem) => {
        return elem["name"]
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
    $("#names-field")[0].selectedIndex = 0;
    loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload");
}


const incrementAndQuery = () => {
    const setPageOffset = 200;
    const dataset = document.getElementById("field-select").value;
    const resolution = document.getElementById("resolution-field-select").value;
    queryInspectToNamesField(dataset,resolution, setPageOffset);
};

const decrementAndQuery = () => {
    if (searchPageOffset === 0){
        return
    };
    const setPageOffset = -200;
    const dataset = document.getElementById("field-select").value;
    const resolution = document.getElementById("resolution-field-select").value;
    queryInspectToNamesField(dataset,resolution, setPageOffset);
};

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


const toggleViewPortVisibility = () => {
  const viewPortWindow = document.querySelector('#viewPortWindow.content')
  if (viewPortWindow.classList.contains('hidden')){ 
    viewPortWindow.classList.toggle('hidden');
    };
};

const inspectSendsToPopboard = () => {
    window.api.talkToPBoard('true');
    var selection = document.querySelector('select#names-field')
    // console.log(window.api.getNames(selection.options[selection.selectedIndex].text))
    // const reply = JSON.parse(JSON.stringify(window.api.getNames(selection.options[selection.selectedIndex].text)))[0]
    // const reply = window.api.getNames(selection.options[selection.selectedIndex].text)[0]
    console.log(selection.options[selection.selectedIndex].text)


    // dumpArr[i] = optionsSelect[i].innerText.split(" ... ")[1]

    // dumpArr[i] = optionsSelect[i].innerText.split(" ... ")[1][0]

    // window.api.mainDumpToPasteboard([reply]);
    setTimeout(() => window.api.mainDumpToPasteboard([selection.options[selection.selectedIndex].text]), 100)
}

const loadImageToInspect = (selectionId,inputId,canvasId,divNamesId, vMinTrigger=0, vMaxTrigger=0) => {

    // persistent_state^=1;

    let selection = document.getElementById(selectionId);
    var value = selection.value;
    var queryName = selection.options[selection.selectedIndex].text;
    var valueArr = singlularQuery(queryName);

    var preloadedValues = JSON.parse(JSON.stringify(valueArr))[0];
    const name         = preloadedValues.name;
    // const PUB_ID       = preloadedValues.PUB_ID;
    // const condition    = preloadedValues.condition;
    const coordinates  = preloadedValues.coordinates;
    const dataset      = preloadedValues.dataset;
    const dimensions   = preloadedValues.dimensions;
    // const hic_path     = preloadedValues.hic_path;
    const numpyArr     = preloadedValues.numpyarr;
    const viewing_vmax = vMaxTrigger > 0 ? vMaxTrigger : preloadedValues.viewing_vmax;
    const viewing_min  = vMinTrigger > 0 ? vMinTrigger : 0;

    inspectedImageArray[persistent_state]["name"]=name
    // inspectedImageArray[persistent_state]["PUB_ID"]=PUB_ID
    // inspectedImageArray[persistent_state]["condition"]=condition
    inspectedImageArray[persistent_state]["coordinates"]=coordinates
    inspectedImageArray[persistent_state]["dataset"]=dataset
    inspectedImageArray[persistent_state]["dimensions"]=dimensions
    // inspectedImageArray[persistent_state]["hic_path"]=hic_path
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
    normalizeToImageData(finalarr, viewing_min, viewing_vmax, canvas);
    if (inspectedImageArray[persistent_state]["coordinates"]===undefined){
        splitCoords=""
    } else {
        splitCoords=inspectedImageArray[persistent_state]["coordinates"].split(",")
    }

    let divNames = document.getElementById(divNamesId);
    divNames.innerHTML = `<p style="-webkit-user-select: text;margin-bottom: 1px"><class "s">${inspectedImageArray[persistent_state]["dataset"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${inspectedImageArray[persistent_state]["name"]}</p><p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[0]}: ${splitCoords[1]}–${splitCoords[2]}<p style="-webkit-user-select: text;margin-top: 1px;margin-bottom: 1px">${splitCoords[3]}: ${splitCoords[4]}–${splitCoords[5]}</p>`

    persistent_state ^= 1;
};


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

document.querySelector('#viewPortWindow .close-box').addEventListener('click', () => {
  const viewPortWindow = document.querySelector('#viewPortWindow.content')
  viewPortWindow.classList.toggle('hidden');
});



const clickMap = new Map();
// clickMap.set("backBtn", ['dialog:callInspectTools', false, "back-to-previous"])
clickMap.set("backBtn", "back-to-previous")
clickMap.set("viewToQueryBtn", "change-view-to-query")
// clickMap.set("viewToViewerBtn", "change-view-to-viewer")
clickMap.set("viewToPairsBtn", "change-view-to-pairs")
clickMap.set("popViewBtn", toggleViewPortVisibility)
clickMap.set("selectToPopboard", inspectSendsToPopboard)
clickMap.set("offSetLeftButton", decrementAndQuery)
clickMap.set("offSetRightButton", incrementAndQuery)


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




document.body.addEventListener('click', function (event) {
    passive: true
    const namedId = event.target.id;
    if (!(clickMap.has(namedId))){
        return
    }
    if (["popViewBtn","selectToPopboard", "offSetLeftButton","offSetRightButton"].includes(namedId)){
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

function singlularQuery(name){
    var names = window.api.getNames(name);
    let nameString = names.map((elem) => {
        return elem
    });
    return nameString;
}

function queryToSelectbox(search){
    var names = window.api.getDatasetAll(search);
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    return nameString;
}


function fetchDistinctQuery(key){
    var names = window.api.getDistinctItems(key);
    let nameString = names.map((elem) => {
        return elem[key]
    }).join("<option />");
    return nameString
};



function logNormalize(avMax){
    c = 255

c = 255 / np.log(1 + np.max(image)) 
log_image = c * (np.log(image + 1)) 
};










function normalizeToImageData(reshapedArray, vMin, vMax, canvas) {
    const rows = reshapedArray.length;
    const cols = reshapedArray[0].length;

    const flatArray = reshapedArray.flat();
    const normalized = isLogNorm===true ? logNormalize(flatArray, vMax) : flatArray.map(value => Math.round(((value - vMin) / (vMax - vMin)) * 255));




    // const normalized = flatArray.map(value => Math.round(((value - vMin) / (vMax - vMin)) * 255));

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

window.api.recieve("resolve-init-tableMemory-dataset", (data) => {
    for (const [key, value] of Object.entries(data[0])) {
        tableMemory["datasetFields"].push(value);
        tableMemory["resolutionFields"][value] = data[1][value]
    }

    var search = document.getElementById("field-select");
    var divNames = document.getElementById("resolution-field-select");
    // // var names = data[0]

    // console.log(search)
    // console.log(tableMemory)
    // console.log(tableMemory["datasetFields"])
    // console.log(tableMemory["resolutionFields"][tableMemory["datasetFields"][0]]);
    var nameString = tableMemory["datasetFields"].map((elem) => {
        console.log(elem)
        return elem
    }).join("<option />");

    search.innerHTML = "<option />" + nameString;
    // var resolutionnames = data[1][search.value]
    nameString = tableMemory["resolutionFields"][tableMemory["datasetFields"][0]].map((elem) => {
        console.log(elem)
        return elem
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
});


window.api.recieve("transmit-tableMemory-dataset", (data) => {
    var search = document.getElementById("field-select");
    var divNames = document.getElementById("resolution-field-select");
    var names = data[0]
    var nameString = names.map((elem) => {
        return elem
    }).join("<option />");
    search.innerHTML = "<option />" + nameString;
    var resolutionnames = data[1][names[0]]
    nameString = resolutionnames.map((elem) => {
        return elem
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
});


window.api.recieve("transmit-tableMemory-resolution", (res) => {
    const search = document.getElementById("field-select");
    const searchValue = search.value;
    var divNames = document.getElementById("resolution-field-select");
    var resolutionnames = res[0][searchValue]
    nameString = resolutionnames.map((elem) => {
        return elem
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
});





document.addEventListener('DOMContentLoaded', async () => {
    window.api.signalToMain('dialog:callInspectTools', true);
    await window.api.invoke('request-init-tableMemory-dataset');
    var divNames = document.getElementById("field-select");
    divNames.innerHTML += "<option />Pasteboard</option>";
    const dname = document.getElementById("field-select").value;
    const res = document.getElementById("resolution-field-select").value;
    var data = window.api.getDatasetatRes(dname, res, 0)
    divNames = document.getElementById("names-field");
    var nameString;
    nameString = data.map((elem) => {
        return elem["name"]
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;

    //select first
    $("#names-field")[0].selectedIndex = 0;

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
    const search = document.getElementById("field-select").value
    var divNames = document.getElementById("resolution-field-select");

    if(search==="Pasteboard"){
        //
    } else {


    nameString = tableMemory["resolutionFields"][search].map((elem) => {
        console.log(elem)
        return elem
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
    
    searchPageOffset = 0;
    const dname = document.getElementById("field-select").value;
    const res = document.getElementById("resolution-field-select").value;
    queryInspectToNamesField(dname, res)
    }
});



document.querySelector('#resolution-field-select').addEventListener('change', async () => {
    searchPageOffset = 0;
    const dname = document.getElementById("field-select").value;
    const res = document.getElementById("resolution-field-select").value;
    queryInspectToNamesField(dname, res)
});






// document.querySelector('#names-field').addEventListener('change', async () => {
//     loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload");
// });


// document.querySelector('input#filter1').addEventListener('change', async () => {
//     var pixelMaxValue = document.querySelector("input#filter1").value;
//     loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload", 0, pixelMaxValue);
// });







document.querySelector('#names-field').addEventListener('change', async () => {
    // document.querySelector("input#filter0").value = 0;
    // var pixelMaxValue = document.querySelector("input#filter1").value;
    loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload")
});

document.querySelector('input#filter0').addEventListener('change', async () => {
    var pixelMinValue = document.querySelector("input#filter0").value;
    var pixelMaxValue = document.querySelector("input#filter1").value;
    loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload", pixelMinValue, pixelMaxValue);
});


document.querySelector('input#filter1').addEventListener('change', async () => {
    var pixelMinValue = document.querySelector("input#filter0").value;
    var pixelMaxValue = document.querySelector("input#filter1").value;
    loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload", pixelMinValue, pixelMaxValue);
});


document.querySelector('#resetfiltersBtn').addEventListener('click', () => {
    let selection = document.querySelector("input#filter1");
    selection.value = inspectedImageArray[persistent_state]["viewing_vmax"];
    loadImageToInspect("names-field","input#filter1","canvas-inspect","sql-query-payload");
});




////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




window.api.recieve("transmitSwapInspect", (message) =>{
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


////recieve, relay image to levels.
window.api.recieve("base64-to-levels",() => {
    const canvas = document.getElementById("canvas-inspect")
    const base64 = canvas.toDataURL();
    window.api.signalToMain("return-base64-to-levels", base64);
});


window.api.recieve("closePopView", (message) =>{
    const reply = viewPortWindow.classList.contains('hidden');
    if (!reply){
        viewPortWindow.classList.toggle('hidden')
    };
    window.api.signalToMain("closeWindowConfirm",reply)
});

