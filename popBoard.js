let namesMemory = new Map();
var lastSelectedRow;
// var trs = document.getElementById('pasteboard-table').tBodies[0].getElementsByTagName('tr');
$(function(){$("#pasteboard").selectable({stop:function(){$(".ui-selected",this).each(function(){$("#selectable tr").index(this)})}})});


const pasteBoardSelectAll = document.getElementById('pbSelect');
pasteBoardSelectAll.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
	$("table tr").addClass("ui-selected");
});


const pasteBoardRemove = document.getElementById('pbRemove');
pasteBoardRemove.addEventListener('click', async () => {
   $("table tr.ui-selected").each(function(){
	   	// this.children("td.strname");
	   	const name = $(this).text();
	   	// console.log($(this).children())
   		namesMemory.delete(name)
   		// console.log(this.children("td.strname"))
   		this.remove()
   });


});

const pasteBoardPasteTo = document.getElementById('pbPaste');
pasteBoardPasteTo.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
    window.api.talkToMain('true');
    var names = $("#pasteboard tr.ui-selected td.strname").map(function(){
    return this.innerHTML
	}).get();

	window.api.pasteboardDumpToMain(names)
});

const pasteBoardDump = document.getElementById('pbDump');
pasteBoardDump.addEventListener('click', async () => {
	const pasteBoardSelectField = document.getElementById('pasteboard');
    var names = $("#pasteboard tr.ui-selected td.strname").map(function(){
    return window.api.getALL(this.innerHTML)
	}).get();
	// console.log(names)
	// $("table tr.ui-selected")
	// this is identical to pasteBoardPasteTo... refactor?
    window.api.signalToMain('dump-pasteboard', names);
});

const pasteBoardTalk = document.getElementById('pbTalk');
pasteBoardTalk.addEventListener('click', async () => {
  // window.api.talkToMain("index.html", window.id)
  window.api.talkToMain(window.id)
})


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


// async function asyncImageAbstract() {

// }

// function base64ToImage(base64, vMax, size) {





window.api.recieve("main-to-pasteboard",(valueArr) => {
	// const strnames = document.getElementById('pasteboard').getElementsByClassName("strname");
	// const target = document.getElementById('pasteboard')

    // if (strnames.length>1) {
    //     for (i=0;i<strnames.length;i++){
    //         if (namesMemory.has(strnames[i].innerText)){
    //             continue
    //         } else {
	//             namesMemory.set(strnames[i].innerText, 2)
    //     	}
    // 	}

	// }

	// if (strnames.length==1 && !namesMemory.has(strnames.innerText)) {
	// 	if (namesMemory.has(strnames.innerText)){
			
	// 	} else {
    // 	namesMemory.set(strnames.innerText, 2)
	//     }
	// }
	console.log('here')

    var names = valueArr[0];
    console.log(valueArr, valueArr[0])
    for (let i = 0; i < names.length; i++) {
		var substring = names[i];
		if (namesMemory.has(substring)){
		// if (namesMemory.has(substring.name)){
			continue
		} else {




			// Get the table element
			var table = document.getElementById("pasteboard");
			// Create a new row element
			var newRow = document.createElement("tr");
			// Create cells
			var cell1 = document.createElement("td");
			var cell2 = document.createElement("td");

			// Add text to cells
			// cell1.innerHTML = "Column 1";
			// const resizedImageBase64 = base64ToImage(substring.numpyarr, substring.viewing_vmax, substring.dimensions)
			// cell1.innerHTML = `<img class="thumbnail" src="${resizedImageBase64}">`
			cell1.className = "thumbnail"
			cell2.innerHTML = `${substring}`
			// cell2.innerHTML = `${substring.name}`
			cell2.className = "strname"

			// Add cells to row
			newRow.appendChild(cell1);
			newRow.appendChild(cell2);

			// Add row to table
			table.appendChild(newRow);
			namesMemory.set(substring,2)
			// namesMemory.set(substring.name,2)
		// const resizedImageBase64 = base64ToImage(substring.numpyarr, substring.viewing_vmax, substring.dimensions)
	    // target.innerHTML += `<tr id="selectable">
	    // 						<td class="thumbnail">
	    // 							<img class="thumbnail" src="${resizedImageBase64}">
    	// 						</td>
	    // 							<td class="strname">${substring.name}
	    // 						</td>
    	// 					</tr>`;
		}		  
    };
});

window.api.recieve("talk-to-main",() => {
    window.api.talkToPBoard(window.id);
});


//To Inspect

