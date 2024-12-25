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
const functionMapped = { "name" : window.api.getNames, "dataset" : window.api.getDataset, "condition" : window.api.getCondition, "hic_path" : window.api.getHiCPath, "PUB_ID" : window.api.getPubId, "resolution" : window.api.getResolution, "dimensions" : window.api.getDimensions,}; //write MAP method for each function, call MAP object from query_from_textbox.


function tailOfSQLClick(){
    var names = window.api.getTail();
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    divNames.innerHTML = nameString;
};


function query_with_textbox(keyname){
    var search = document.getElementById('sqlite3-query').value;
    console.log(keyname, search);
    var names = functionMapped[keyname](search)
    console.log(names);
    let divNames = document.getElementById("names");
    let nameString = names.map((elem) => {
        return elem.name
    }).join("<option />");
    // console.log(nameString);
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




// document.addEventListener('DOMContentLoaded', async () => {
//     defaultRender();
// });



document.addEventListener('DOMContentLoaded', async () => {
    var search = document.getElementById('field-select').value;
    var nameString = queryToSelectbox(search);
    var divNames = document.getElementById("avail-field-select");
    divNames.innerHTML = "<option /> ---Scroll for all--- </option><option />" + nameString;

});

document.querySelector('#tail-sql').addEventListener('click', async () => {
    tailOfSQLClick()
});


document.querySelector('#queryBtn').addEventListener('click', async () => {
    var fieldSelect = document.getElementById("field-select");
    var value = fieldSelect.value;
    var text = fieldSelect.options[fieldSelect.selectedIndex].text;
    if (document.getElementById("avail-field-select").value === " ---Scroll for all--- ") {
        /*
        Query and write to 
        */
    } else {
        /*
        Otherwise, there's a selected option, query these instead.
        */
    };

});


document.getElementById('field-select').addEventListener('change', async () => {
    var search = document.getElementById('field-select').value;
    console.log(search);
    var names = window.api.getDistinctItems(search);
    let nameString = names.map((elem) => {
        return elem[search]
    }).join("<option />");
    let divNames = document.getElementById("avail-field-select");
    divNames.innerHTML = "<option /> ---Scroll for all--- </option><option />" + nameString;
});

// document.querySelector('#inspectBtn').addEventListener('click', async () => {
//     var colOfSelectedOpt = document.getElementById("names").selectedOptions; //This is how we call selected values
//     var values = [];
//     for(var i=0;i<colOfSelectedOpt.length;i++) {
//          values.push(colOfSelectedOpt[i].value);
//     }
//     console.log(values);
//     return values;
// });


// document.querySelector('#resetBtn').addEventListener('click', async () => {
//     // defaultRender()
// });

// document.querySelector('#viewBtn').addEventListener('click', async () => {
//     var colOfSelectedOpt = document.getElementById("names").selectedOptions; //This is how we call selected values
//     var values = [];
//     for(var i=0;i<colOfSelectedOpt.length;i++) {
//          values.push(colOfSelectedOpt[i].value);
//     }
//     return values;
// });


