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
    // api.send('change-view-to-pairs');
    return
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
    optionFillViewer("left-select");
    optionFillViewer("right-select");
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


