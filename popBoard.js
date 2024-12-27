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





// disable text selection
// document.onselectstart = function() {
//     return false;
// }

// function RowClick(currenttr, lock) {
//     if (window.KeyboardEvent.ctrlKey || window.KeyboardEvent.metaKey) {
//         toggleRow(currenttr);
//     }
    
//     if (window.event.button === 0) {
//         if (!(window.KeyboardEvent.ctrlKey || !window.KeyboardEvent.metaKey) && !window.KeyboardEvent.shiftKey) {
//             clearAll();
//             toggleRow(currenttr);
//         }
    
//         if (window.KeyboardEvent.shiftKey) {
//             selectRowsBetweenIndexes([lastSelectedRow.rowIndex, currenttr.rowIndex])
//         }
//     }
// }


// function RowClick(currenttr, lock) {
//     if (window.KeyboardEvent.ctrlKey) {
//         toggleRow(currenttr);
//     }
    
//     if (window.event.button === 0) {
//         if (!window.event.ctrlKey && !window.event.shiftKey) {
//             clearAll();
//             toggleRow(currenttr);
//         }
    
//         if (window.event.shiftKey) {
//             selectRowsBetweenIndexes([lastSelectedRow.rowIndex, currenttr.rowIndex])
//         }
//     }
// }



// function toggleRow(row) {
//     row.className = row.className == 'selected' ? '' : 'selected';
//     lastSelectedRow = row;
// }

// function selectRowsBetweenIndexes(indexes) {
//     indexes.sort(function(a, b) {
//         return a - b;
//     });

//     for (var i = indexes[0]; i <= indexes[1]; i++) {
//         trs[i-1].className = 'selected';
//     }
// }

// function clearAll() {
//     for (var i = 0; i < trs.length; i++) {
//         trs[i].className = '';
//     }
// }

/* return value of selected
	const pasteBoardSelectField = document.getElementById('pasteboard');

	var names = $("tr#selectable.ui-selectee.ui-selected td").map(function() {
	    return this.innerHTML.split("class=\"ui-selectee\">")[1];
	}).get();

const pasteBoardSelectAll = document.getElementById('pbSelect');
pasteBoardSelectAll.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
	const length = pasteBoardSelectField.options.length;
	for(var i = 0;i<length;i++){
		document.getElementById("pasteboard").options[i].selected = "selected";

	}
})

*/



const pasteBoardSelectAll = document.getElementById('pbSelect');
pasteBoardSelectAll.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
	$("table tr").addClass("ui-selected");
	const length = pasteBoardSelectField.rows.length;
});


const pasteBoardRemove = document.getElementById('pbRemove');
pasteBoardRemove.addEventListener('click', async () => {
   $("table tr.ui-selected").remove();
});

	// const pasteBoardSelectField = document.getElementById('pasteboard');
	// const length = pasteBoardSelectField.options.length;
    // let delArr = [];
    // for (let i = 0; i < pasteBoardSelectField.options.length; i++) {
    //   delArr[i] = pasteBoardSelectField.options[i].selected;
    // }

	// let index = pasteBoardSelectField.options.length;
	// while (index--) {
	// 	if (delArr[index]) {
	// 	  pasteBoardSelectField.remove(index);
	// 	}
	// }
// });

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
	var toArr = "";
	// let nameString = valueArr[0].join("<option />");

	//change this to take in the mapping, not the arr. you may also take in a arr of tuples...

    for (let i = 0; i < valueArr[0].length; i++) {
      var substring = valueArr[0][i];
      toArr += `<tr id="selectable"><td><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">${substring}</td></tr>`;
    }


	// let nameString = valueArr[0].join("<tr onmousedown=\"RowClick(this,false);\"/>");
	const target = document.getElementById('pasteboard');
	console.log(toArr)
	target.innerHTML += toArr;
});

window.api.recieve("talk-to-main",() => {
    window.api.talkToPBoard(window.id);
});


//To Inspect

