const backButton = document.getElementById('backBtn');
backButton.addEventListener('click',()=>{
    api.send('back-to-previous');
});

const viewToQueryButton = document.getElementById('viewToQueryBtn');
viewToQueryButton.addEventListener('click',()=>{
    // api.send('change-view-to-query');
    return
});

const viewToInspectButton = document.getElementById('viewToInspectBtn');
viewToInspectButton.addEventListener('click',()=>{
    api.send('change-view-to-inspect');
});

const viewToViewerButton = document.getElementById('viewToViewerBtn');
viewToViewerButton.addEventListener('click',()=>{
    api.send('change-view-to-viewer');
});

const viewToPairsButton = document.getElementById('viewToPairsBtn');
viewToPairsButton.addEventListener('click',()=>{
    api.send('change-view-to-pairs');
});

// const copyToPasteboardButton = document.getElementById('copyToPbBtn');
// copyToPasteboardButton.addEventListener('click',()=>{
//     await 
//     api.send('copy-to-pasteboard');
// });
// const viewPopAboutButton = document.getElementById('aboutBtn');
// viewPopAboutButton.addEventListener('click',()=>{
//     api.send('change-view-to-about');
// });



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
    // console.log(names)
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


// document.querySelector('#tail-sql').addEventListener('click', async () => {
//     tailOfSQLClick()
// });


document.querySelector('#queryBtn').addEventListener('click', async () => {
    var fieldSelect = document.getElementById("field-select");
    var value = fieldSelect.value;
    var text = fieldSelect.options[fieldSelect.selectedIndex].text;
    // console.log(document.getElementById("avail-field-select").value);
    if (document.getElementById("avail-field-select").value === "---Scroll for all results---") {
        query_with_textbox(text,'sqlite3-query');
    } else {
        query_with_textbox(text,"avail-field-select");
    };

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



// const copyToPasteboardButton = document.getElementById('copyToPbBtn');
// copyToPasteboardButton.addEventListener('click',()=>{
//     await 
//     api.send('copy-to-pasteboard');
// });

document.querySelector('#copyToPbBtn').addEventListener('click', async () => {
    window.api.talkToPBoard('true');
    var fieldSelect = document.getElementById("names");
    const optionsSelect = fieldSelect.selectedOptions;
    const dumpArr = new Array(optionsSelect.length);
    for (let i = 0; i < optionsSelect.length; i++) {
      dumpArr[i] = optionsSelect[i].value;
    }
    if (dumpArr.length === 0){
        return
    }
    window.api.mainDumpToPasteboard(dumpArr);
});

window.api.recieve("paste-board-to-noWindow",(values) => {
    console.log('received')
    var names = values[0];
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem
    }).join("<option />");
    console.log(nameString);
    divNames.innerHTML = "<option />" + nameString;
});


// function query_with_textbox(keyname,route){
//     var search = document.getElementById(route).value;
//     console.log(keyname, search);
//     var names = functionMapped[keyname](search)
//     console.log(names);
//     let divNames = document.getElementById("names");
//     let nameString = names.map((elem) => {
//         return elem.name
//     })
//     console.log(nameString);
//     divNames.innerHTML = "<option />" + nameString;
// };








