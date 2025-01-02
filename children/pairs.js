
let tableMemory = {
            "datasetFields": Array(),
            "resolutionFields": {},
            "NamesFields": "",
            "databaseName" : "",
            }


const clickMap = new Map();
clickMap.set("backBtn", "back-to-previous")
clickMap.set("viewToQueryBtn", "change-view-to-query")
// clickMap.set("viewToViewerBtn", "change-view-to-viewer")
clickMap.set("viewToInspectBtn", "change-view-to-inspect")


document.body.addEventListener('click', function (event) {
    const namedId = event.target.id;
    if (!(clickMap.has(namedId))){
        return
    }
    api.send(`${clickMap.get(event.target.id)}`);
});



// document.getElementById('selectAllBtn').addEventListener('click',()=>{
//     $("#names *").find("option").prop("selected", true);
// })

$(document).ready(function() {
  $("#selectAllBtn").click(function() {
    $("#names").find("option").prop("selected", true);
  });
});


// const viewPopAboutButton = document.getElementById('aboutBtn');
// viewPopAboutButton.addEventListener('click',()=>{
//     api.send('change-view-to-about');
// });


function optionFillViewer(idName){
    var names = window.api.getDistinctDatasets();
    let divNames = document.getElementById(idName);
    let nameString = names.map((elem) => {
        console.log(elem.hic_path)
        return elem.hic_path
    }).join("<option />")
    divNames.innerHTML =  "<option />" + nameString;
};


// Using Object.assign()
// let functionMapped = { "name" : window.api.getNames, "dataset" : window.api.getDataset, "condition" : window.api.getCondition, "hic_path" : window.api.getHiCPath, "PUB-ID" : window.api.getPubId,}; //write MAP method for each function, call MAP object from query_from_textbox.

function intersectingRows(sqlRows1, sqlRows2) {
    // Helper function to process SQL rows into a dictionary grouped by chromosome
    function ingestToDict(sqlList) {
        const outDict = {};

        for (let i = 0; i < sqlList.length; i++) {
            const row = sqlList[i];
            const [c1, x1, x2, c2, y1, y2] = row.coordinates.split(",");
            const [x1Int, x2Int, y1Int, y2Int] = [x1, x2, y1, y2].map(Number);

            if (!outDict[c1]) {
                outDict[c1] = [];
            }
            outDict[c1].push([row.name, [x1Int, x2Int, y1Int, y2Int]]);
        }

        return outDict;
    }

    // Helper function to find intersections between two lists of intervals
    function intervalIntersection(list1, list2) {
        const result = [];
        let i = 0, j = 0;

        while (i < list1.length && j < list2.length) {
            const [name1, [x1Start, x1End, y1Start, y1End]] = list1[i];
            const [name2, [x2Start, x2End, y2Start, y2End]] = list2[j];

            // Check for overlap in either the x or y intervals
            const xOverlap = x1Start <= x2End && x2Start <= x1End;
            const yOverlap = y1Start <= y2End && y2Start <= y1End;

            if (xOverlap || yOverlap) {
                result.push([name1, name2]);
            }

            // Move to the next interval
            if (x1End < x2End) {
                i++;
            } else {
                j++;
            }
        }

        return result;
    }

    // Process both sets of SQL rows into dictionaries
    const chrDict1 = ingestToDict(sqlRows1);
    const chrDict2 = ingestToDict(sqlRows2);

    // Find intersections for common chromosomes
    const keys = Array.from({ length: 22 }, (_, i) => `chr${i + 1}`).concat("chrX");
    const intersection = [];

    for (const ch of keys) {
        if (!(chrDict1[ch] && chrDict2[ch])) {
            continue;
        }
        intersection.push(...intervalIntersection(chrDict1[ch], chrDict2[ch]));
    }

    return intersection;
}


// function query_with_textbox(keyname){
//     var search = document.getElementById('sqlite3-query').value;
//     var names = functionMapped[keyname](search);
//     let divNames = document.getElementById("names");
//     let nameString = names.map((elem) => {
//         return elem.name
//     }).join("<option />");
//     console.log(nameString);
//     divNames.innerHTML = "<option />" + nameString;
// }

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
//     optionFillViewer("left-select");
//     optionFillViewer("right-select");
// });





document.addEventListener('DOMContentLoaded', async () => {
    window.api.signalToMain('dialog:callInspectTools', true);
    await window.api.invoke('request-init-tableMemory-dataset');
    var divNames = document.getElementById("dataset-left");
    divNames.innerHTML += "<option />Pasteboard</option>";
    divNames = document.getElementById("dataset-right");
    divNames.innerHTML += "<option />Pasteboard</option>";
    // const dname = document.getElementById("field-select").value;
    // const res = document.getElementById("resolution-field-select").value;
    // var data = window.api.getDatasetatRes(dname, res, 0)
    // divNames = document.getElementById("names-field");
    // var nameString;
    // nameString = data.map((elem) => {
        // return elem["name"]
    // }).join("<option />");
    // divNames.innerHTML = "<option />" + nameString;
});


function prepareQuery(){
    const datasetA = document.getElementById("dataset-left").txt;
    const resolutionA = document.getElementById("resolution-left").txt;
    const datasetB = document.getElementById("dataset-right").txt;
    const resolutionB = document.getElementById("resolution-right").txt;
};

const viewToPairsButton = document.getElementById('intersectBtn');
intersectBtn.addEventListener('click',()=>{
    // prepareQuery();
    const datasetA = document.getElementById("dataset-left").value;
    const resolutionA = document.getElementById("resolution-left").value;
    const datasetB = document.getElementById("dataset-right").value;
    const resolutionB = document.getElementById("resolution-right").value;
    console.log(datasetA, resolutionA, datasetB, resolutionB)
    const sqlRowsA = new Array()
    const sqlRowsB = new Array()
    var ptrSQL = ['1'];
    page = 0;
    while(ptrSQL.length!==0){
        ptrSQL = window.api.getCoordsAtNameRes(datasetA, resolutionA, page)
        sqlRowsA.push(...ptrSQL)
        page += 200;
    }

    var ptrSQL = ['1'];
    page = 0;
    while(ptrSQL.length!==0){
        ptrSQL = window.api.getCoordsAtNameRes(datasetB, resolutionB, page)
        sqlRowsB.push(...ptrSQL)
        page += 200;
    }

    console.log(sqlRowsA)
    console.log(sqlRowsB)

    // while(){
    //     page += 200;
    //     if 
    // }
    // console.log(window.api.getDatasetatRes(datasetA, resolutionA,200))
    // console.log(typeof window.api.getDatasetatRes(datasetA, resolutionA,200))
    // console.log(window.api.getDatasetatRes(datasetA, resolutionA,200).length===0)
    const pairs = intersectingRows(sqlRowsA, sqlRowsB)
    console.log(pairs)
    //Query Left and Right ALL as specified. UNLESS PASTEBOARD
    //return Intersected values...

    let divNames = document.getElementById("names");
    let nameString = pairs.map((elem) => {
        return elem.join(" ... ")
    }).join("<option />");
    console.log(nameString);
    divNames.innerHTML = "<option />" + nameString;




});






window.api.recieve("resolve-init-tableMemory-dataset", (data) => {
    for (const [key, value] of Object.entries(data[0])) {
        tableMemory["datasetFields"].push(value);
        tableMemory["resolutionFields"][value] = data[1][value]
    }

    var search = document.getElementById("dataset-left");
    var divNames = document.getElementById("resolution-left");
    var nameString = tableMemory["datasetFields"].map((elem) => {
        console.log(elem)
        return elem
    }).join("<option />");

    search.innerHTML = "<option />" + nameString;
    nameString = tableMemory["resolutionFields"][tableMemory["datasetFields"][0]].map((elem) => {
        console.log(elem)
        return elem
    }).join("<option />");
    divNames.innerHTML = "<option />Resolution</option><option />" + nameString;


    search = document.getElementById("dataset-right");
    divNames = document.getElementById("resolution-right");
    var nameString = tableMemory["datasetFields"].map((elem) => {
        console.log(elem)
        return elem
    }).join("<option />");

    search.innerHTML = "<option />" + nameString;
    nameString = tableMemory["resolutionFields"][tableMemory["datasetFields"][0]].map((elem) => {
        console.log(elem)
        return elem
    }).join("<option />");
    divNames.innerHTML = "<option />Resolution</option><option />" + nameString;
});





// document.querySelector('#leftInspectBtn').addEventListener('click', async () => {
//     var search = document.getElementById('left-select').value;
//     console.log(search);
//     let nameString = queryToSelectbox(search);
//     console.log(nameString);
//     let divNames = document.getElementById("populate-left");
//     divNames.innerHTML = "<option />" + nameString;
// });

// document.querySelector('#rightInspectBtn').addEventListener('click', async () => {
//     var search = document.getElementById('right-select').value;
//     console.log(search);
//     let nameString = queryToSelectbox(search);
//     console.log(nameString);
//     let divNames = document.getElementById("populate-right");
//     divNames.innerHTML = "<option />" + nameString;
// });





// document.querySelector('#tail-sql').addEventListener('click', async () => {
//     tailOfSQLClick()
// });


// document.querySelector('#queryBtn').addEventListener('click', async () => {
//     var fieldSelect = document.getElementById("field-select");
//     var value = fieldSelect.value;
//     var text = fieldSelect.options[fieldSelect.selectedIndex].text;
//     query_with_textbox(text);
// });

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
//     defaultRender()
// });

// document.querySelector('#viewBtn').addEventListener('click', async () => {
//     var colOfSelectedOpt = document.getElementById("names").selectedOptions; //This is how we call selected values
//     var values = [];
//     for(var i=0;i<colOfSelectedOpt.length;i++) {
//          values.push(colOfSelectedOpt[i].value);
//     }
//     return values;
// });


