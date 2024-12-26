// const { ipcRenderer } = require('electron');
// const ipc = require("electron").ipcRenderer;

// ipcMain.on('pasteboard-select', ()=>{
// 	console.log('yes');
// });

// pasteBoardView
// const pasteBoardtoMainField = document.getElementById('pbSelect');
// pasteBoardtoMainField.addEventListener('click',()=>{
//     bridge.send('pasteboard-select');
// });

const pasteBoardtoMainField = document.getElementById('pbSelect');
pasteBoardtoMainField.addEventListener('click', async () => {
	var pasteBoardSelectField = document.getElementById('pasteboard');
	// var names = await window.api.mainDumpToPasteboard()

	//this function, on click, will talk to main.js and deposit the data on the active page
	//need a descriptor to explain where to put data...

	// return await window.api.mainDumpToPasteboard()


    // let nameString = names.map((elem) => {
    //     return elem[search]
    // }).join("<option />");    
    // pasteBoardSelectField.innerHTML = "<option />" + nameString;

})

const pasteBoardTalk = document.getElementById('pbTalk');
pasteBoardTalk.addEventListener('click', async () => {
  window.api.talkToMain('hello!')
})



window.api.recieve("main-to-pasteboard",(valueArr) => {
	console.log('popboard');
	console.log(valueArr)
	let nameString = valueArr[0].join("<option />");
	console.log(nameString)
	// valueArr.map((elem) => {
	//     return elem
	// }).join("<option />");
	const target = document.getElementById('pasteboard');
	target.innerHTML = "<option />" + nameString;
	console.log("<option />" + nameString)
});
// })
