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
var lastSelectedRow;
// var trs = document.getElementById('pasteboard-table').tBodies[0].getElementsByTagName('tr');

$( function() {
$( "#pasteboard" ).selectable({
  stop: function() {
    // var result = $( "#select-result" ).empty();
    $( ".ui-selected", this ).each(function() {
      var index = $( "#selectable tr" ).index( this );
      // result.append( " #" + ( index + 1 ) );
    });
  }
});
} );


const pasteBoardSelectAll = document.getElementById('pbSelect');
pasteBoardSelectAll.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
	$("table tr").addClass("ui-selected");
});


const pasteBoardRemove = document.getElementById('pbRemove');
pasteBoardRemove.addEventListener('click', async () => {
   $("table tr.ui-selected").remove();
});

const pasteBoardPasteTo = document.getElementById('pbPaste');
pasteBoardPasteTo.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
    window.api.talkToMain('true');
    var names = $("#pasteboard tr.ui-selected td").map(function(){
    return this.innerHTML.split("class=\"ui-selectee\">")[1]
	}).get();
	window.api.pasteboardDumpToMain(names)
});

const pasteBoardDump = document.getElementById('pbDump');
pasteBoardDump.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
    window.api.talkToMain('true');
    // write to sqlite3... 
    // var names = $("#pasteboard tr.ui-selected td").map(function(){
    // return this.innerHTML.split("class=\"ui-selectee\">")[1]
	// }).get();
	// window.api.pasteboardDumpToMain(names)
});

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
	var toArr = "";
	// let nameString = valueArr[0].join("<option />");

	//change this to take in the mapping, not the arr. you may also take in a arr of tuples...

    for (let i = 0; i < valueArr[0].length; i++) {
      var substring = valueArr[0][i];
      toArr += `<tr id="selectable"><td><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">${substring}</td></tr>`;
    }


	// let nameString = valueArr[0].join("<tr onmousedown=\"RowClick(this,false);\"/>");
	const target = document.getElementById('pasteboard');
	// console.log(toArr)
	target.innerHTML += toArr;
});

window.api.recieve("talk-to-main",() => {
    window.api.talkToPBoard(window.id);
});


//To Inspect

