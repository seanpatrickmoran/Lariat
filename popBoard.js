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

    var names = $("#pasteboard tr.ui-selected td.strname").map(function(){
    return this.innerHTML
	}).get();

	console.log(names);
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

// function normalizeToImageData(reshapedArray, vMax, dimension) {
//     const rows = dimension;
//     const cols = dimension;
//     const flatArray = reshapedArray.flat();
//     const min = Math.min(...flatArray);
//     const normalized = flatArray.map(value => Math.round(((value - min) / (vMax - min)) * 255));

//     const imageDataArray = new Uint8ClampedArray(rows * cols * 4);
//     for (let i = 0; i < normalized.length; i++) {
//         const value = normalized[i];
//         imageDataArray[i * 4] = value;     // Red
//         imageDataArray[i * 4 + 1] = value; // Green
//         imageDataArray[i * 4 + 2] = value; // Blue
//         imageDataArray[i * 4 + 3] = 255;   // Alpha (fully opaque)
//     }
//     const imageData = new ImageData(imageDataArray, cols, rows);
//     console.log(imageData)
//     var canvas = document.createElement('canvas'),
//     ctx = canvas.getContext('2d');
//     canvas.width = 28;
//     canvas.height = 28;
//     console.log(imageDataArray);
//     ctx.drawImage(imageData, 0, 0, 28, 28);
//     return canvas.toDataURL();
// }


function base64ToImage(base64, vMax, size) {
	const binaryString = atob(base64); // Decode the base64 string
	const binaryLength = binaryString.length;
	const bytes = new Uint8Array(binaryLength);
	for (let i = 0; i < binaryLength; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	// Convert the Uint8Array into a Float32Array
	const decodedArray = new Float32Array(bytes.buffer);
	// Step 2: Reshape the flat array into a 2D array
	const imageData = [];
	for (let i = 0; i < size; i++) {
		imageData.push(decodedArray.slice(i * size, (i + 1) * size));
	}

	// Step 3: Normalize the values to the range [0, 255]
	const flatNormalizedData = decodedArray.map(
	(value) => ((value - Math.min(...decodedArray)) / 
	            (vMax - Math.min(...decodedArray))) * 255
	);

	// Step 4: Create a Canvas and put the data into an ImageData object
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");

	const imageDataObject = ctx.createImageData(size, size);
	for (let i = 0; i < flatNormalizedData.length; i++) {
		const value = Math.round(flatNormalizedData[i]);
		imageDataObject.data[i * 4 + 0] = value; // Red channel
		imageDataObject.data[i * 4 + 1] = value; // Green channel
		imageDataObject.data[i * 4 + 2] = value; // Blue channel
		imageDataObject.data[i * 4 + 3] = 255;   // Alpha channel
	}

	// Step 5: Draw the ImageData to the canvas
	ctx.putImageData(imageDataObject, 0, 0);
	// Step 5: Draw the ImageData to the canvas

	const canvas_resize = document.createElement("canvas");
	canvas_resize.width = 32;
	canvas_resize.height = 32;
	const ctxr = canvas_resize.getContext("2d");

	ctxr.drawImage(canvas, 0, 0, 32, 32);

	const resizedImageBase64 = canvas_resize.toDataURL();
	return resizedImageBase64
};

window.api.recieve("main-to-pasteboard",(valueArr) => {
	console.log(valueArr)
	console.log(valueArr[0]);

	const target = document.getElementById('pasteboard');
    for (let i = 0; i < valueArr[0].length; i++) {
		var substring = valueArr[0][i];

		// const decodedBytes = Uint8Array.from(atob(substring.numpyarr), c => c.charCodeAt(0));
		// const float32Array = new Float32Array(decodedBytes.buffer);
	    // const rows = substring.dimensions; cols = substring.dimensions;
	    // const reshapedArray = [];
	    // for (let i = 0; i < rows; i++) {
	    //     reshapedArray.push(float32Array.slice(i * cols, (i + 1) * cols));
	    // }
		// let finalarr = kronecker(reshapedArray,Math.ceil(28/dimensions))
		console.log('here')
		// var imageString = normalizeToImageData(reshapedArray, substring.viewing_vmax, substring.dimensions)
		console.log(substring);

		resizedImageBase64 = base64ToImage(substring.numpyarr, substring.viewing_vmax,substring.dimensions)
	    target.innerHTML += `<tr id="selectable"><td class="thumbnail"><img class="thumbnail" src="${resizedImageBase64}"></td><td class="strname">${substring.name}</td></tr>`;
			  

		// console.log(imageString)

		// target.innerHTML += `<tr id="selectable"><td><img src="${imageString}">${substring.name}</td></tr>`;
    // toArr += `<tr id="selectable"><td><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">${substring}</td></tr>`;
    };
});

window.api.recieve("talk-to-main",() => {
    window.api.talkToPBoard(window.id);
});


//To Inspect

