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

const getTail = () => {
	return testmgr.getTail();
}

const pragma = () => {
	return testmgr.pragma();
}

const getDistinctDatasets = () => {
	return testmgr.getDistinctDatasets();
}


// exports.getDataset = (name) => {
// 	const sql = 'SELECT * FROM imag WHERE (dataset) = (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name);
// 	console.log(result);
// 	return result;
// };

// exports.getCondition = (name) => {
// 	const sql = 'SELECT * FROM imag WHERE (condition) = (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name);
// 	console.log(result);
// 	return result;
// };

// exports.getHiCPath = (name) => {
// 	const sql = 'SELECT * FROM imag WHERE (hic_path) = (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name);
// 	console.log(result);
// 	return result;
// };

// exports.getPubId = (name) => {
// 	const sql = 'SELECT * FROM imag WHERE (PUB_ID) = (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name);
// 	// console.log(result);
// 	return result;
// };





// contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
contextBridge.exposeInMainWorld("api", {
	getNames: getNames,
	getDataset: getDataset,
	getCondition: getCondition,
	getHiCPath: getHiCPath,
	getPubId: getPubId,
	getTail: getTail,
	getVMax: getVMax,
	getDistinctDatasets: getDistinctDatasets,
	pragma: pragma,
    send: (channel, data) => ipcRenderer.send(channel, data),
    recieve: (channel, func) => ipcRenderer.on(
        channel,
        (event, ...args) => func(args)
    )
})

//frontend
