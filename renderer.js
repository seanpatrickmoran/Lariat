// In renderer process (web page).
// const ipcRenderer = require('electron');


// const viewPopAboutButton = document.getElementById('aboutBtn');
// viewPopAboutButton.addEventListener('click',()=>{
//     api.send('change-view-to-about');
// });

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

const backButton = document.getElementById('backBtn');
backButton.addEventListener('click',()=>{
    api.send('back-to-previous');
});
