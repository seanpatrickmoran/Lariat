const executeQueryButton = () =>{
    var fieldSelect = document.getElementById("field-select");
    var value = fieldSelect.value;
    var text = fieldSelect.options[fieldSelect.selectedIndex].text;
    if (document.getElementById("avail-field-select").value === "---Scroll for all results---") {
        query_with_textbox(text,'sqlite3-query');
    } else {
        query_with_textbox(text,"avail-field-select");
    };
};

const executeCopyToPasteboard = () => {
    console.log('hello');
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


document.body.addEventListener('click', function (event) {
    const namedId = event.target.id;
    if (!(clickMap.has(namedId))){
        return
        }
    console.log('click')
    console.log(event.target.id)
    if (["queryBtn","copyToPbBtn"].includes(namedId)){
        // executeQueryButton();
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


function query_with_textbox(keyname,route){
    var search = document.getElementById(route).value;
    var names = functionMapped[keyname](search)
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
};

function queryToSelectbox(search){
    var names = window.api.getDistinctItems(search);
    let nameString = names.map((elem) => {
        return elem[search]
    }).join("<option />");
    return nameString;
};



document.addEventListener('DOMContentLoaded', async () => {
    var search = document.getElementById('field-select').value;
    var nameString = queryToSelectbox(search);
    var divNames = document.getElementById("avail-field-select");
    divNames.innerHTML = "<option /> ---Scroll for all results--- </option><option />" + nameString;
});



document.getElementById('field-select').addEventListener('change', async () => {
    var search = document.getElementById('field-select').value;
    var names = window.api.getDistinctItems(search);
    let nameString = names.map((elem) => {
        return elem[search]
    }).join("<option />");
    let divNames = document.getElementById("avail-field-select");
    divNames.innerHTML = "<option /> ---Scroll for all results--- </option><option />" + nameString;
});


window.api.recieve("paste-board-to-noWindow",(values) => {
    var names = values[0];
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem
    }).join("<option />");
    divNames.innerHTML = "<option />" + nameString;
});
