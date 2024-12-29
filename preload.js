const testmgr = require("./models/testmgr.js");
// const {contextBridge} = require("electron");
const { contextBridge, ipcRenderer } = require('electron');


// const getNames = (name, colName) => {
// 	return testmgr.getNames(name, colName);
// }

const getNames = (name) => {
	return testmgr.getNames(name);
}

const getDataset = (name) => {
	return testmgr.getDataset(name);
}

const getCondition = (name) => {
	return testmgr.getCondition(name);
}

const getHiCPath = (name) => {
	return testmgr.getHiCPath(name);
}

const getPubId = (name) => {
	return testmgr.getPubId(name);
}

const getVMax = (name) => {
	return testmgr.getVMax(name);
}

const getResolution = (name) => {
	return testmgr.getResolution(name);
}

const getDimensions = (name) => {
	return testmgr.getDimensions(name);
}

const getTail = () => {
	return testmgr.getTail();
}

const pragma = () => {
	return testmgr.pragma();
}

const getDistinctDatasets = () => {
	return testmgr.getDistinctDatasets();
}

const getDistinctItems = (name) => {
	return testmgr.getDistinctItems(name);
}

// contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
contextBridge.exposeInMainWorld("api", {
	getNames: getNames,
	getDataset: getDataset,
	getCondition: getCondition,
	getHiCPath: getHiCPath,
	getPubId: getPubId,
	getTail: getTail,
	getVMax: getVMax,
	getResolution: getResolution,
	getDimensions: getDimensions,
	getDistinctItems: getDistinctItems,
	getDistinctDatasets: getDistinctDatasets,
	pragma: pragma,
    send: (channel, data) => ipcRenderer.send(channel, data),
    recieve: (channel, func) => ipcRenderer.on(
        channel,
        (event, ...args) => func(args),
        ),
    // invoke: ,
	talkToMain: (msg) => ipcRenderer.invoke('dialog:callMain', msg),
	signalToMain: (channel, msg) => ipcRenderer.invoke(channel, msg),
	mainDumpToPasteboard: (data) => ipcRenderer.invoke('dialog:chooseMain', data),
	talkToPBoard: (msg) => ipcRenderer.invoke('dialog:callPBoard', msg),
	pasteboardDumpToMain: (data) => ipcRenderer.invoke('dialog:PBoardToMain', data),
})


// contextBridge.exposeInIsolatedWorld('bridge', {
//     send: (channel, data) => ipcRenderer.send(channel, data),
//     recieve: (channel, func) => ipcRenderer.on(
//         channel,
//         (event, ...args) => func(args),
//         ),
//   }
// )




//frontend
