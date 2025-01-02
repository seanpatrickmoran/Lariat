// const path = require('path');
import * as path from 'path';
import { BrowserWindow, app, Menu, ipcMain, dialog } from 'electron';
// const { BrowserWindow, app, Menu, ipcMain, dialog } = require('electron');
// const { globalShortcut } = require('electron');
import { globalShortcut } from 'electron'
// const fs = require('fs');
import * as fs from 'fs';
// const Store = require('electron-store');
import Store from 'electron-store'
// import * as testmgr from "./models/testmgr.js";


import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// const store = new Store(); // Initialize electron-store
import sqlite from "better-sqlite3";
let db = null; // Global variable to store the database connection




var datasPath = app.getPath('userData')
var jsonFilePath = path.join(datasPath, "LariatApplication.json")

var boot_attempts = 0;
// var databaseIsValid = false
var tableMemory = {
            "datasetFields": Array(),
            // "resolutionFields": Array(),
            "resolutionFields": {},
            "NamesFields": "",
            "databaseName" : "",
            }
            
var browserWindowArray = { "" : 0,
    'mainWindow': -2,
    'pasteboardWindow': -2,
    'inspectToolsWindow': -2,
    'levelsWindow': -2,
    }
let mainWindowState = {
    'mainWindow': "",
    }



const isMac = process.platform === 'darwin';

const createMainWindow = () => {
    //Only one main window
    if (browserWindowArray['mainWindow'] != -2 && BrowserWindow.fromId(browserWindowArray['mainWindow']) != null){
        // dialog.showErrorBox("Error", "Main Window already open.")
        return
    }
    //show modal only the first time
    const flagVal = BrowserWindow.fromId(browserWindowArray['mainWindow']) === null;
    const mainWindow = new BrowserWindow({
        title: "mainWindow",
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname, '/preload.mjs')
        }
    });
    if (browserWindowArray['mainWindow'] === -2 && flagVal === true){
        mainWindow.webContents.on('did-finish-load', ()=>{
          mainWindow.webContents.send("show-start-mosaic","visible");
      });
    };

    if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
    }

    browserWindowArray['mainWindow'] = mainWindow.id;
    mainWindowState["mainWindow"]="index.html";
    mainWindow.loadFile("index.html")
    return undefined
    }



const createAboutWindow = () => {
    const aboutWindow = new BrowserWindow({
        title: "About Lariat",
        width: 250,
        height: 250,

    });
    aboutWindow.loadFile("about.html")
}


const createPopWindow = () => {
    if (browserWindowArray['pasteboardWindow'] != -2 && BrowserWindow.fromId(browserWindowArray['pasteboardWindow']) != undefined) {
        // dialog.showErrorBox("Error", "Pasteboard already being used, dummy.")
        return undefined
    }

    const pasteboardWindow = new BrowserWindow({
        title: "Pasteboard",
        width: 480,
        height: 360,
        webPreferences:{
        nodeIntegration: true,
        preload: path.join(__dirname, '/preload.mjs')
    }
    });
    browserWindowArray['pasteboardWindow'] = pasteboardWindow.id
    var [x, y] = BrowserWindow.fromId(browserWindowArray["mainWindow"]).getPosition();
    pasteboardWindow.setPosition(x+400,y-20);
    pasteboardWindow.loadFile("popBoard.html")
}


const createInspectToolsWindow = () => {
    if (browserWindowArray['inspectToolsWindow'] != -2) {
        return undefined
    }

    const inspectToolsWindow = new BrowserWindow({
        title: "inspectTools",
        width: 60,
        height: 436,
        hasShadow: false,
        transparent: true,
        frame: false,
        webPreferences:{
        nodeIntegration: true,
        preload: path.join(__dirname, '/preload.mjs')
    }
    });

    var [x, y] = BrowserWindow.fromId(browserWindowArray["mainWindow"]).getPosition();
    inspectToolsWindow.setPosition(x-65,y+180);

    browserWindowArray['inspectToolsWindow'] = inspectToolsWindow.id
    inspectToolsWindow.loadFile("children/inspectTools.html")
    // inspectToolsWindow.setAlwaysOnTop(true)
    // inspectToolsWindow.setClosable(false)
    inspectToolsWindow.setMaximizable(false)
    inspectToolsWindow.setHasShadow(false)
    inspectToolsWindow.invalidateShadow()
    // inspectToolsWindow.setResizable(false)
    // inspectToolsWindow.setMenuBarVisibility(false);
    // pasteboardWindow.api.send(browserWindowArray)
    return undefined
}



const createlevelsWindow = () => {
    if ((browserWindowArray['levelsWindow'] != -2)){
        return undefined
    }

    const levelsWindow = new BrowserWindow({
        title: "levelsWindow",
        width: 500,
        height: 420,
        // hasShadow: false,
        // transparent: true,
        // frame: false,
        webPreferences:{
        nodeIntegration: true,
        preload: path.join(__dirname, '/preload.mjs')
    }
    });

    var [x, y] = BrowserWindow.fromId(browserWindowArray["mainWindow"]).getPosition();
    levelsWindow.setPosition(x+500,y+180);

    // levelsWindow['levelsWindow'] = levelsWindow.id

    levelsWindow.loadFile("children/levels.html")
    levelsWindow.setMaximizable(false)
    levelsWindow.setHasShadow(false)
    levelsWindow.invalidateShadow()
    return levelsWindow.id
}





const closeFocusWindow = () => {
    const selectWindow = BrowserWindow.getFocusedWindow()
    if (selectWindow != null) {
        if (selectWindow.getURL()==="file://"+__dirname+"/children/inspect.html"){
            selectWindow.webContents.send("closePopView",(''));
        } else {
            browserWindowArray[selectWindow.getTitle()] = -2;
            selectWindow.close()
        }
    }

    return
};


ipcMain.handle('closeWindowConfirm', async (event, data) => {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((win, index) => {
    });

            // (:
    if (data===true){
            const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
            BrowserWindow.fromId(browserWindowArray['inspectToolsWindow']).close()
            browserWindowArray['mainWindow'] = -2;
            browserWindowArray['inspectToolsWindow'] = -2;
            selectWindow.close()
            }
});


ipcMain.handle('closing', (id) => {
    browserWindowArray[id] = -2
    // BrowserWindow.fromId
});


app.whenReady().then(()=> {
    createMainWindow();
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu)
    mountDatabase();
});






app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()

});

app.on('activate', () => {
    createMainWindow();
});




//IPC on MAIN
ipcMain.on('change-view-to-query', ()=>{
  const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    mainWindowState["mainWindow"]='children/query.html';
    selectWindow.loadFile('children/query.html');
});


ipcMain.on('change-view-to-inspect', ()=>{
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.loadFile('children/inspect.html')
});



ipcMain.on('back-to-previous', ()=>{
    const selectWindow = BrowserWindow.getFocusedWindow();//fromId(browserWindowArray['mainWindow'])
    if (selectWindow.getURL()==="file://"+__dirname+"/index.html"){
        return
    }
    selectWindow.loadFile('index.html')

    if (browserWindowArray['mainWindow'] != -2){
    selectWindow.webContents.on('did-finish-load', ()=>{
      selectWindow.webContents.send("show-start-mosaic","hidden");
      });
    };
});


ipcMain.handle('get-tableMemory-datasets', async (event, message) =>{
    var messageDatasets = new Array()
    var messageResolutions = new Array()
    messageDatasets = [...tableMemory["datasetFields"]]
    messageResolutions = tableMemory["resolutionFields"]
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.webContents.send("transmit-tableMemory-dataset", messageDatasets, messageResolutions);
});


ipcMain.handle("get-tableMemory-resolution", async (event, message) =>{
    var messageResolutions = new Array()
    messageResolutions = tableMemory["resolutionFields"]
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.webContents.send("transmit-tableMemory-resolution", messageResolutions);
});


ipcMain.handle("request-init-tableMemory-dataset",  async (event, message) =>{
    var messageDatasets = new Array()
    var messageResolutions = new Array()
    messageDatasets = [...tableMemory["datasetFields"]]
    messageResolutions = tableMemory["resolutionFields"]
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.webContents.send("resolve-init-tableMemory-dataset", messageDatasets, messageResolutions);    
})





ipcMain.handle('dialog:callMain', async (event, msg) => {
    await createMainWindow();
    return BrowserWindow.getFocusedWindow().getTitle();
});



ipcMain.handle('dialog:callPBoard', async (event, data) => {
    await createPopWindow();
    BrowserWindow.fromId(browserWindowArray['pasteboardWindow']).isVisible()
    return
});



ipcMain.handle('dialog:callInspectTools', async (event, data) => {
    if (data===false){
            const inspectWindow = BrowserWindow.fromId(browserWindowArray['inspectToolsWindow'])
            browserWindowArray['inspectToolsWindow'] = -2;
            inspectWindow.close()
            return
    } else if (data === true) {
    var selectWindow = BrowserWindow.getFocusedWindow()
    await createInspectToolsWindow();
    BrowserWindow.fromId(browserWindowArray['inspectToolsWindow']).isVisible()
    }
    return
});



ipcMain.handle("transmitMainSwapInspect", async (event, msg) => {
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.webContents.send("transmitSwapInspect",'');
    return
});


ipcMain.handle("transmitMainLevels", async (event, msg) => {    
    browserWindowArray['levelsWindow'] = await createlevelsWindow();
    const selectWindow = BrowserWindow.fromId(browserWindowArray["mainWindow"])
    selectWindow.webContents.send("base64-to-levels", msg);
    return
});



ipcMain.handle("return-base64-to-levels", async (event, msg) => {
    const selectWindow = BrowserWindow.getFocusedWindow()//.fromId(browserWindowArray["levelsWindow"])
    selectWindow.webContents.on("did-finish-load", () => {
        selectWindow.webContents.send("base64-arrives-levels", msg);
    });
    return
});



ipcMain.handle('dialog:chooseMain', async (event, data) => {
    const response = await data;
    const selectWindow = BrowserWindow.fromId(browserWindowArray['pasteboardWindow']);

    selectWindow.webContents.send("main-to-pasteboard",response);
});


ipcMain.handle('dialog:PBoardToMain', async (event, data) => {
    const response = await data;
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow']);
    const path = selectWindow.webContents.getURL();
    if (BrowserWindow.fromId(browserWindowArray['mainWindow']) === null){
    selectWindow.webContents.on('did-finish-load', ()=>{
        selectWindow.loadFile('children/query.html')});
    }
  selectWindow.once('did it load', () => {

  });
    selectWindow.webContents.send("paste-board-to-noWindow",(response));
    return
});



const checkDatabase = () => {
    boot_attempts += 1 ;
    try {
        function isJSON(str) {try {return (JSON.parse(str) && !!str);} catch (e) {return false;}}
        const databaseReadIn = JSON.parse(fs.readFileSync(jsonFilePath))

        if (!(JSON.stringify(isJSON(databaseReadIn)))){
            throw (
            new Error(`file @ filePath is not a JSON`)
            )};
        if (!(isJSON(databaseReadIn["databaseName"].endsWith(".db")))){
            throw (
            new Error(`file is not a databse`)
            )};
         if (!(path.isAbsolute(databaseReadIn["databaseName"]))){
            throw (
            new Error('file not found at path')
            )};
        if ((databaseReadIn["datasetFields"]===[]) || (databaseReadIn["databasename"]==='')){
            throw (
            new Error("json corrupted or missing")
            )};   
        return true    
    } catch (error){
        console.log(error)
        // if (boot_attempts>1 || error===SyntaxError){
        if (boot_attempts>1){ // || error===SyntaxError){
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Failed to load!"})}
        throw (error);
        return false
    }
    return false
}





const mountDatabase = () => {
    if(checkDatabase()===true){
        const databaseReadIn = JSON.parse(fs.readFileSync(jsonFilePath))
        console.log('\n\n')
        console.log(`MOUNTING @ ${jsonFilePath}`)
        console.log('\n\n\n')
        console.log('__@_@_@_@_@___')
        console.log('\nCHECK tableMemory\n')
        console.log('__@_@_@_@_@___')
        console.log('\n\n\n')
      
        tableMemory = { ...databaseReadIn};
        const filePath = databaseReadIn["databaseName"]
        db = new sqlite(filePath);

        console.log('__@_@_@_@_@___')
        console.log('\nLOAD database\n')
        console.log('__@_@_@_@_@___')
        console.log('\n\n\n')
    }else{
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "WARN\nfailed database load. rebuild!"})

    }
        console.log('__@_@_@_@_@___')
        console.log('\nSuccess\n')
        console.log('__@_@_@_@_@___')
        console.log('\n\n\n')
};



function openDatabase() {
  dialog
    .showOpenDialog(BrowserWindow.getFocusedWindow(), {
      title: 'Select SQLite Database File',
      filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }],
      properties: ['openFile'],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        try {
            db = new sqlite(filePath);
            var sql = "SELECT DISTINCT dataset FROM imag ORDER BY name ASC;"
            var stml = db.prepare(sql);
            var dataArr = [...stml.all()]
            tableMemory["databaseName"] = filePath;
            tableMemory["datasetFields"] = new Array()
            tableMemory["resolutionFields"] = {};
            for (const [key, value] of Object.entries(dataArr)) {
                tableMemory["datasetFields"].push(value.dataset);
                tableMemory["resolutionFields"][value.dataset] = new Array(); 
                var rsql = `SELECT DISTINCT resolution FROM imag WHERE dataset = '${value.dataset}'`;
                var stmt = db.prepare(rsql);
                var sqlResArr = [...stmt.all()];
                for (const [rkey, rvalue] of Object.entries(sqlResArr)) {
                    tableMemory["resolutionFields"][value.dataset].push(rvalue.resolution);
                }
            }
            fs.writeFileSync(jsonFilePath, JSON.stringify(tableMemory))
            console.log(`local store written: ${filePath}`);
            mountDatabase();
        } catch (err) {
          console.error('Error opening database:', err.message);
        }
      }
    })
    .catch((err) => {
      console.error('Dialog error:', err.message);
    });
}



const menu = [
  ...(isMac
    ? [{
        label: app.name,
            submenu: [
                // {label: 'About', click: createAboutWindow,},
                // { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                  { type: 'separator' },
                // { role: 'quit' }
              ],
          },
        
      ]
    : []),
  // {role: 'fileMenu',},
  {
    label: 'File',
    submenu: [
      { label: 'New Main', accelerator: "CmdOrCtrl+N", click: createMainWindow,},
      { label: 'Open Pasteboard', accelerator: "CmdOrCtrl+T", click: createPopWindow,},
      { label: 'Close Window', accelerator: "CmdOrCtrl+W", click: closeFocusWindow, },
      // { label: 'DEV PEEK', accelerator: "CmdOrCtrl+Y", click: headBD },
      { label: 'Database Load', accelerator: "CmdOrCtrl+O", click: openDatabase },
      // process.platform !== 'darwin' ? { role: 'close' } : { role: 'quit' },
      // { role: 'Quit' },
      {label: 'Quit', accelerator: "CmdOrCtrl+Q", click: app.exit, }
    ]
  },

  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
  ...(process.platform !== 'darwin'
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
        : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  ...(process.platform !== 'darwin'
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About', click: createAboutWindow,

            },
          ],
        },
      ]
    : []),
  // {
  //   label: 'File',
  //   submenu: [
  //     {
  //       label: 'Quit',
  //       click: () => app.quit(),
  //       accelerator: 'CmdOrCtrl+W',
  //     },
  //   ],
  // },
  ...(process.env.NODE_ENV !== 'production'
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),



  {label: "Selection",
             submenu:
             [
                  {label: 'Dump', click: createAboutWindow,},
                  {label: 'Load', click: createAboutWindow,},
              ],
          },
];
