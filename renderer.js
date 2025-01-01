// In renderer process (web page).


// const viewPopAboutButton = document.getElementById('aboutBtn');
// viewPopAboutButton.addEventListener('click',()=>{
//     api.send('change-view-to-about');
// });


//mainView
const viewToQueryButton = document.getElementById('viewToQueryBtn');
viewToQueryButton.addEventListener('click',()=>{
    api.send('change-view-to-query');
});

const viewToInspectButton = document.getElementById('viewToInspectBtn');
viewToInspectButton.addEventListener('click',()=>{
    api.send('change-view-to-inspect');
});

// const viewToViewerButton = document.getElementById('viewToViewerBtn');
// viewToViewerButton.addEventListener('click',()=>{
//     api.send('change-view-to-viewer');
// });

// const viewToPairsButton = document.getElementById('viewToPairsBtn');
// viewToPairsButton.addEventListener('click',()=>{
//     api.send('change-view-to-pairs');
// });

window.api.recieve("show-start-mosaic",(value) => {
	const showStartMosaic = document.getElementById('showStartMosaic');
	showStartMosaic.style = `visibility: ${value}`;
});

// window.api.recieve('send-persisted-state', (values) => {
//     const datasetValues = values;
// });


//function fetchAndGive() {
//    console.log(message)
//    const datasets = window.api.getDistinctItems("dataset");
//    const resolutions = window.api.getDistinctItems("resolution");
//    console.log(datasets, resolutions)
//    window.api.returnSignal([datasets,resolutions]);
//};

//window.api.fetchSignal(fetchAndGive)

window.api.recieve('fetch-dataset', (event, a) => {
    console.log(event.sender)
    let dset = window.api.getDistinctItems("dataset");
    let res = window.api.getDistinctItems("resolution");
    // console.log(Object.values(dset))//, res)
    console.log('fetch-dataset')
    console.log(dset)
    console.log(res)
//    const dset_mapped = dset.map((elem) => elem["dataset"]);
//    const rset_mapped = res.map((elem) => elem["resolution"])
//    console.log(dset_mapped, rset_mapped)
//    window.api.send('send-dataset',[dset,res]);
    window.api.send('send-dataset',[Object.values(dset),Object.values(res)]);
    console.log('7')
//    event.sender.send('send-dataset',[dset,res]);
});


// window.api.recieve('persist-state', (event, a) => {
//     // selectWindow.webContents.send("transmitSwapInspect",'');
// });

//window.api.recieve("paste-board-to-noWindow",(values) => {
//    var names = values[0];
//    let divNames = document.getElementById("names");
//    let nameString = names.map((elem) => {
//        return elem
//    }).join("<option />");
//    divNames.innerHTML = "<option />" + nameString;
//});


//window.api.fetchSignal( () => {
//    const datasets = window.api.getDistinctItems("dataset");
//    const resolutions = window.api.getDistinctItems("resolution");
//    console.log(datasets, resolutions)
//    window.api.returnSignal([datasets,resolutions])
//})
//



//window.api.recieve("retrieve-fields", () => {
//    api.send("fetch-fields");
//  console.log(customData); // 'something'
//});


// window.api.recieve("main-to-pasteboard",(valueArr) => {
// 	const element = document.querySelector('select#pasteboard');
// 	console.log('here');
// 	console.log(valueArr)
// 	element.innerHTML = valueArr;
// });

// window.api.recieve('copy-to-pasteboard', async (,data) =>{
// 	const dataArr = await 

// 	api.mainDumpToPasteboard('dialog:chooseData', (data)) 

// }

// const copyToPasteboardButton = document.getElementById('copyToPbBtn');
// viewToPairsButton.addEventListener('click',()=>{
//     api.send('copy-to-pasteboard');
// });

const backButton = document.getElementById('backBtn');
backButton.addEventListener('click',()=>{
    api.send('back-to-previous');
});


// pasteBoardView
// const pasteBoardtoMainField = document.getElementById('pbSelect');
// pasteBoardtoMainField.addEventListener('click',()=>{
//     api.send('pasteboard-select');
// });
