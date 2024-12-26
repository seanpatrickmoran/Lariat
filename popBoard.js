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

// const pasteBoardtoMainField = document.getElementById('pbSelect');
// pasteBoardtoMainField.addEventListener('click', async () => {
// 	var pasteBoardSelectField = document.getElementById('pasteboard');
// 	//TODO

// })

const pasteBoardSelectAll = document.getElementById('pbSelect');
pasteBoardSelectAll.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
	const length = pasteBoardSelectField.options.length;
	for(var i = 0;i<length;i++){
		document.getElementById("pasteboard").options[i].selected = "selected";
	}
})

const pasteBoardRemove = document.getElementById('pbRemove');
pasteBoardRemove.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
	const length = pasteBoardSelectField.options.length;
    let delArr = [];
    for (let i = 0; i < pasteBoardSelectField.options.length; i++) {
      delArr[i] = pasteBoardSelectField.options[i].selected;
    }

	let index = pasteBoardSelectField.options.length;
	while (index--) {
		if (delArr[index]) {
		  pasteBoardSelectField.remove(index);
		}
	}
});

// const pasteBoardPasteTo = document.getElementById('pbPasteTo');
// pasteBoardPasteTo.addEventListener('click', async () => {
// 	//TODO
// });

// const pasteBoardDump = document.getElementById('pbDump');
// pasteBoardDump.addEventListener('click', async () => {
// 	//TODO
// });

const pasteBoardTalk = document.getElementById('pbTalk');
pasteBoardTalk.addEventListener('click', async () => {
  window.api.talkToMain('hello!')
})


/* --------IPC type calls-------- */

window.api.recieve("main-to-pasteboard",(valueArr) => {
	let nameString = valueArr[0].join("<option />");
	const target = document.getElementById('pasteboard');
	target.innerHTML = "<option />" + nameString;
});

window.api.recieve("talk-to-main",() => {
    window.api.talkToPBoard(window.id);

    	// talkToPBoard: (msg) => ipcRenderer.invoke('dialog:callPBoard', msg),


});
// window.api.recieve("main-to-pasteboard",(valueArr) => {
// 	let nameString = valueArr[0].join("<option />");
// 	const target = document.getElementById('pasteboard');
// 	target.innerHTML = "<option />" + nameString;
// });
