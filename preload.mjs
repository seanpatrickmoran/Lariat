// const testmgr = require("./models/testmgr.js");
import { contextBridge, ipcRenderer } from 'electron';
// import 
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// import { testmgr } from "./models/testmgr.js";
import * as testmgr from "./models/testmgr.js";

// const {contextBridge} = require("electron");
// const { contextBridge, ipcRenderer } = require('electron');

// import { db } from "./../main.js";
console.log('hey')
// const getNames = (name, colName) => {
// 	return testmgr.getNames(name, colName);
// }

const getNames = (name) => {
	return testmgr.getNames(name);
}

const getDataset = (name,offset) => {
	return testmgr.getDataset(name,offset);
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

const countDistinctItems = (name,key) =>{
	return testmgr.countDistinctItems(name,key);
}

const getDatasetatRes = (name,resolution,offset) => {
	return testmgr.getDatasetatRes(name,resolution,offset)
}

const getDatasetAll = (name) => {
	return testmgr.getDatasetAll(name)
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
	countDistinctItems: countDistinctItems,
	getDatasetatRes: getDatasetatRes,
	getDatasetAll: getDatasetAll,
	pragma: pragma,
    send: (channel, data) => ipcRenderer.send(channel, data),
    recieve: (channel, func) => ipcRenderer.on(
        channel,
        (event, ...args) => func(args),
        ),
    invoke: (channel, msg) => ipcRenderer.invoke(channel, msg),
//    returnSignal: (message) => ipcRenderer.on('fetch-dataset', (message)),
//    fetchSignal: (message) => ipcRenderer.send('give-dataset', (message) => callback(...message),),
	talkToMain: (msg) => ipcRenderer.invoke('dialog:callMain', msg),
	signalToMain: (channel, msg) => ipcRenderer.invoke(channel, msg),
	mainDumpToPasteboard: (data) => ipcRenderer.invoke('dialog:chooseMain', data),
	talkToPBoard: (msg) => ipcRenderer.invoke('dialog:callPBoard', msg),
	pasteboardDumpToMain: (data) => ipcRenderer.invoke('dialog:PBoardToMain', data),
})
