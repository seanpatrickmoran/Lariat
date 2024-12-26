// In renderer process (web page).
// const ipcRenderer = require('electron');


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

const viewToViewerButton = document.getElementById('viewToViewerBtn');
viewToViewerButton.addEventListener('click',()=>{
    api.send('change-view-to-viewer');
});

const viewToPairsButton = document.getElementById('viewToPairsBtn');
viewToPairsButton.addEventListener('click',()=>{
    api.send('change-view-to-pairs');
});

window.api.recieve("show-start-mosaic",(value) => {
	const showStartMosaic = document.getElementById('showStartMosaic');
	showStartMosaic.style = `visibility: ${value}`;
});

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