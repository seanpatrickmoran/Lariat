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

var queryMapped = new Map();

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

const pasteBoardPasteTo = document.getElementById('pbPaste');
pasteBoardPasteTo.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
    window.api.talkToMain('true');
    // var fieldSelect = document.getElementById("names");
    const optionsSelect = pasteBoardSelectField.selectedOptions;
    const dumpArr = new Array(optionsSelect.length);
    for (let i = 0; i < optionsSelect.length; i++) {
      dumpArr[i] = optionsSelect[i].value;
    }
	window.api.pasteboardDumpToMain(dumpArr)

});

// const pasteBoardDump = document.getElementById('pbDump');
// pasteBoardDump.addEventListener('click', async () => {
// 	//TODO
// });

const pasteBoardTalk = document.getElementById('pbTalk');
pasteBoardTalk.addEventListener('click', async () => {
  // window.api.talkToMain("index.html", window.id)
  window.api.talkToMain(window.id)
})


//<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot">

/* --------IPC type calls-------- */
//To Main

//To Query

window.api.recieve("main-to-pasteboard",(valueArr) => {
	let nameString = valueArr[0].join("<option />");
	// let nameString = valueArr[0].join("<option style=\"background-image:url(base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==\" />");
	const target = document.getElementById('pasteboard');
	target.innerHTML += "<option />" + nameString;
});

window.api.recieve("talk-to-main",() => {
    window.api.talkToPBoard(window.id);
});


//To Inspect

