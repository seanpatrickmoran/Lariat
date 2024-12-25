const backButton = document.getElementById('backBtn');
backButton.addEventListener('click',()=>{
    api.send('back-to-previous');
});

const viewToQueryButton = document.getElementById('viewToQueryBtn');
viewToQueryButton.addEventListener('click',()=>{
    api.send('change-view-to-query');
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


// const viewPopAboutButton = document.getElementById('aboutBtn');
// viewPopAboutButton.addEventListener('click',()=>{
//     api.send('change-view-to-about');
// });



// Using Object.assign()
let functionMapped = { "name" : window.api.getNames, "dataset" : window.api.getDataset, "condition" : window.api.getCondition, "hic_path" : window.api.getHiCPath, "PUB-ID" : window.api.getPubId,}; //write MAP method for each function, call MAP object from query_from_textbox.


function tailOfSQLClick(){
    var names = window.api.getTail();
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    divNames.innerHTML = nameString;
};

function defaultRender(){
    var names = window.api.pragma();
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("");
    divNames.innerHTML = nameString;
};

// function query_with_textbox(){
//     var search = document.getElementById('sqlite3-query').value;
//     var names = window.api.getNames(search);
//     let divNames = document.getElementById("names");
//     let nameString = names.map((elem) => {
//         return elem.name, elem.coordinates
//     }).join("<option />");
//     divNames.innerHTML = nameString;
// }


function query_with_textbox(keyname){
    var search = document.getElementById('sqlite3-query').value;
    var names = functionMapped[keyname](search);
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    console.log(nameString);
    divNames.innerHTML = "<option />" + nameString;
}

// function ShowImage(keyname){
//     var search = document.getElementById('sqlite3-query').value;
//     // var names = window.api.getNames(search);
//     // var names = window.api.getDataset(search);
//     var names = functionMapped[keyname](search);
//     let divNames = document.getElementById("names");
//     let nameString = names.map((elem) => {
//         return elem.name
//     }).join("<option />");
//     divNames.innerHTML = nameString;
//     console.log(nameString);
// }




document.addEventListener('DOMContentLoaded', async () => {
    defaultRender();
});


document.querySelector('#tail-sql').addEventListener('click', async () => {
    tailOfSQLClick()
});


document.querySelector('#queryBtn').addEventListener('click', async () => {
    var fieldSelect = document.getElementById("field-select");
    var value = fieldSelect.value;
    var text = fieldSelect.options[fieldSelect.selectedIndex].text;
    query_with_textbox(text);
});

document.querySelector('#inspectBtn').addEventListener('click', async () => {
    var colOfSelectedOpt = document.getElementById("names").selectedOptions; //This is how we call selected values
    var values = [];
    for(var i=0;i<colOfSelectedOpt.length;i++) {
         values.push(colOfSelectedOpt[i].value);
    }
    console.log(values);
    return values;
});


document.querySelector('#resetBtn').addEventListener('click', async () => {
    defaultRender()
});

// document.querySelector('#viewBtn').addEventListener('click', async () => {
//     var colOfSelectedOpt = document.getElementById("names").selectedOptions; //This is how we call selected values
//     var values = [];
//     for(var i=0;i<colOfSelectedOpt.length;i++) {
//          values.push(colOfSelectedOpt[i].value);
//     }
//     return values;
// });


