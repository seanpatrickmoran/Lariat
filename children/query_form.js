var searchPageOffset = 0;
var offsetPage = Math.ceil(searchPageOffset/200);




const incrementAndQuery = () => {
    searchPageOffset += 200;
    console.log(searchPageOffset)
    let resolution = document.getElementById("resolution-field-select").value.replace("all", '');
    let dataset = document.getElementById("dataset-field-select").value
    query_with_textbox(dataset,resolution,searchPageOffset);
};

const decrementAndQuery = () => {
    if (searchPageOffset === 0){
        return
    };
    searchPageOffset -= 200;
    console.log(searchPageOffset)
    let resolution = document.getElementById("resolution-field-select").value.replace("all", '');
    let dataset = document.getElementById("dataset-field-select").value
    query_with_textbox(dataset,resolution,searchPageOffset);
};


const executeQueryButton = () => {
    searchPageOffset = 0;
    if (document.getElementById("names-field-select").value === "all") {
        console.log('print')
        query_with_textbox('','names');
    } else {
        console.log('else');
        query_with_textbox('', document.getElementById("dataset-field-select").value); //will this return more than one value?
    };
};

function query_with_textbox(keyname,route,searchPageOffset){
    let resolution = document.getElementById("resolution-field-select").value
    let dataset = document.getElementById("dataset-field-select").value
    console.log(dataset)
    var names;
    console.log(searchPageOffset)
    if (resolution!=''){
        names = window.api.getDatasetatRes(dataset, parseInt(resolution), searchPageOffset)
        console.log('accessed')
    } else {
        console.log('else')
        names = window.api.getDataset(dataset, searchPageOffset)
    }
    // if (names!=undefined){
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");

    console.log(nameString)
    divNames.innerHTML = "<option />" + nameString
    // };
};



// # dataset-field-select change this




const executeCopyToPasteboard = () => {
    window.api.talkToPBoard('true');
    var fieldSelect = document.getElementById("names");
    const optionsSelect = fieldSelect.selectedOptions;
    const dumpArr = new Array(optionsSelect.length);
    for (let i = 0; i < optionsSelect.length; i++) {
      dumpArr[i] = JSON.parse(JSON.stringify(window.api.getNames(optionsSelect[i].value)))[0]
    }if (dumpArr.length === 0){
        return
    }
    window.api.mainDumpToPasteboard(dumpArr);
};


const clickMap = new Map();
clickMap.set("backBtn", "back-to-previous")
clickMap.set("viewToInspectBtn", "change-view-to-inspect")
clickMap.set("viewToViewerBtn", "change-view-to-viewer")
clickMap.set("viewToPairsBtn", "change-view-to-pairs")
clickMap.set("queryBtn", executeQueryButton)
clickMap.set("copyToPbBtn", executeCopyToPasteboard)
clickMap.set("offSetLeftButton", decrementAndQuery)
clickMap.set("offSetRightButton", incrementAndQuery)



document.body.addEventListener('click', function (event) {
    const namedId = event.target.id;
    if (!(clickMap.has(namedId))){
        return
        }
    // console.log('click')
    // console.log(event.target.id)
    if (["queryBtn","copyToPbBtn","offSetLeftButton","offSetRightButton"].includes(namedId)){
        console.log('hello!')
        console.log(namedId)
        clickMap.get(namedId)();
        return
    }
    api.send(`${clickMap.get(event.target.id)}`);
});

// Using Object.assign()
const functionMapped = { "name" : window.api.getNames, "dataset" : window.api.getDataset, "condition" : window.api.getCondition, "hic_path" : window.api.getHiCPath, "PUB_ID" : window.api.getPubId, "resolution" : window.api.getResolution, "dimensions" : window.api.getDimensions,}; //write MAP method for each function, call MAP object from query_from_textbox.


function tailOfSQLClick(){
    var names = window.api.getTail();
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    divNames.innerHTML = nameString;
};



function fetchDistinctQuery(key){
    // console.log('issue here')
    var names = window.api.getDistinctItems(key);
    let nameString = names.map((elem) => {
        return elem[key]
    }).join("<option />");
    return nameString
};



window.api.recieve("transmit-tableMemory-dataset", (data) => {
    console.log('hello!')
    console.log(data[0])
    var search = document.getElementById('dataset-field-select')
    let nameString = data[0].map((elem) => {
        return elem["dataset"]
    }).join("<option />");
    console.log(nameString)
    search.innerHTML = "<option value=\"dataset\" />Dataset</option><option />" + nameString;
});


document.addEventListener('DOMContentLoaded', async () => {
    await window.api.invoke('get-tableMemory-datasets');

 
    var search = document.getElementById('resolution-field-select')
    var nameString = fetchDistinctQuery('resolution');
    console.log(nameString)
    search.innerHTML = "<option value=\"resolution\" />Resolution</option><option />" + nameString;

});



document.getElementById('dataset-field-select').addEventListener('change', async () => {
    var searchValue = document.getElementById('dataset-field-select').value;
    let nameString = fetchDistinctQuery('resolution');
    let divNames = document.getElementById("resolution-field-select");
    divNames.innerHTML = "<option value=\"resolution\" />Resolution</option><option />" + nameString;
});



window.api.recieve("paste-board-to-noWindow",(values) => {
    var names = values[0];
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
});
