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


const store = new Store(); // Initialize electron-store
import sqlite from "better-sqlite3";
let db = null; // Global variable to store the database connection

// const headBD = () => {

// }




var datasPath = app.getPath('userData')
var jsonFilePath = path.join(datasPath, "LariatApplication.json")
console.log('booted')

var boot_attempts = 0;
// var databaseIsValid = false
var tableMemory = {
            "datasetFields": Array(),
            "resolutionFields": Array(),
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
    console.log('here in create window')
    console.log(path.join(__dirname, '/preload.mjs'))
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
    console.log('hey!')
    console.log(levelsWindow.id)
    console.log(levelsWindow.getTitle())
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
    // console.log(tableMemory)
    // preLoadFromJSON();
    mountDatabase();
    // console.log(tableMemory)
    // console.log(BrowserWindow.getAllWindows)
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

// ipcMain.on('change-view-to-viewer', ()=>{
//     const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
//     selectWindow.loadFile('children/viewer.html')
// });

// ipcMain.on('change-view-to-pairs', ()=>{
//     const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
//     selectWindow.loadFile('children/pairs.html')
// });

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

// ipcMain.on("inspect-sends-popboard", () => {

// })




ipcMain.handle('get-tableMemory-datasets', async (event, message) =>{
    // var messageDatasets = Object.values(tableMemory["datasetFields"])
    console.log('at main')
    var messageDatasets = new Array()
    messageDatasets = [...tableMemory["datasetFields"]]
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.webContents.send("transmit-tableMemory-dataset", messageDatasets);
});

ipcMain.handle('dialog:callMain', async (event, msg) => {
    await createMainWindow();
    return BrowserWindow.getFocusedWindow().getTitle();
});

//need to check if Pboard exists from query
ipcMain.handle('dialog:callPBoard', async (event, data) => {
    await createPopWindow();
    BrowserWindow.fromId(browserWindowArray['pasteboardWindow']).isVisible()
    return
});

ipcMain.handle('dialog:callInspectTools', async (event, data) => {
    if (data===false){
            const inspectWindow = BrowserWindow.fromId(browserWindowArray['inspectToolsWindow'])
            // inspectWindow.setClosable(true)
            browserWindowArray['inspectToolsWindow'] = -2;
            inspectWindow.close()
            return
    } else if (data === true) {
    //but
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
    console.log('2')
    console.log(browserWindowArray)
    return
});

ipcMain.handle("return-base64-to-levels", async (event, msg) => {
    const selectWindow = BrowserWindow.getFocusedWindow()//.fromId(browserWindowArray["levelsWindow"])
    // console.log(browserWindowArray)
    // console.log(selectWindow.id)
    selectWindow.webContents.on("did-finish-load", () => {
        selectWindow.webContents.send("base64-arrives-levels", msg);
    });
    return
});


// ipcMain.handle('callLevels', async (event,data) => {
//     return 
// })

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
    console.log('here')
    boot_attempts += 1 ;
    try {
        function isJSON(str) {try {return (JSON.parse(str) && !!str);} catch (e) {return false;}}
        console.log(jsonFilePath)
        const databaseReadIn = JSON.parse(fs.readFileSync(jsonFilePath))
        console.log('heyo')

        if (!(JSON.stringify(isJSON(databaseReadIn)))){
            throw (
            new Error(`file @ filePath is not a JSON`)
            )};
        console.log()
        if (!(isJSON(databaseReadIn["databaseName"].endsWith(".db")))){
            throw (
            new Error(`file is not a databse`)
            )};
         if (!(path.isAbsolute(databaseReadIn["databaseName"]))){
            throw (
            new Error('file not found at path')
            )};
        if ((databaseReadIn["resolutionFields"]===[]) || (databaseReadIn["resolutionFields"][0]<50) || (databaseReadIn["databasename"]==='')){
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
        console.log('@@@@@@@@@@@@')
        console.log(databaseReadIn)
        console.log('dbREAD okay')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')
        console.log(tableMemory)
        console.log('peek tableMemory')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')        
        tableMemory = { ...databaseReadIn};
        const filePath = databaseReadIn["databaseName"]
        db = new sqlite(filePath);

        console.log('@@@@@@@@@@@@')
        console.log(tableMemory)
        console.log('wrote tableMemory')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')
        console.log('@@@@@@@@@@@@')
    }else{
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "WARN\nfailed database load. rebuild!"})

    }
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
            console.log( stml.all());
            tableMemory["databaseName"] = filePath;
            tableMemory["datasetFields"] = [...stml.all()]

            var sql = "SELECT DISTINCT resolution FROM imag ORDER BY name ASC;"
            var stml = db.prepare(sql);
            console.log([...stml.all()])
            tableMemory.resolutionFields = [...stml.all()]
            fs.writeFileSync(jsonFilePath, JSON.stringify(tableMemory))
            console.log(`Database connected: ${filePath}`);
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










// const mountDatabase = () => {
//     console.log(jsonFilePath)
//     console.log('@ MOUNT')
//     try {
//         function isJSON(str) {try {return (JSON.parse(str) && !!str);} catch (e) {return false;}}
//         console.log('@ MOUNT IS JSON')
//         // var json;
//         // fs.readFileSync(jsonFilePath)//.catch((e) => {return e})

//         console.log(jsonFilePath)
//         // const databaseReadIn = JSON.parse(fs.readFileSync(jsonFilePath))

//         var databaseReadIn;
//         // try {
//         databaseReadIn = JSON.parse(fs.readFileSync(jsonFilePath))
//         // } catch (err) {
//         //     console.log('error caught')
//         //     return err
//         // }
//         console.log('@@@@@@@@@@@@')
//         console.log(databaseReadIn)
//         console.log('dbREAD okay')

//         console.log('@@@@@@@@@@@@')
//         console.log(tableMemory)
//         console.log('peek tableMemory')

//         if (!(JSON.stringify(isJSON(databaseReadIn)))){
//             throw (
//             new Error(`file @ filePath is not a JSON`)
//             )};
//         console.log()
//         if (!(isJSON(databaseReadIn["databaseName"].endsWith(".db")))){
//             throw (
//             new Error(`file is not a databse`)
//             )};
//          if (!(path.isAbsolute(databaseReadIn["databaseName"]))){
//             throw (
//             new Error('file not found at path')
//             )};
//         if ((databaseReadIn["resolutionFields"]===[]) || (databaseReadIn["resolutionFields"][0]<50) || (databaseReadIn["databasename"]==='')){
//             throw (
//             new Error("json corrupted or missing")
//             )};
//         console.log('mountDB OK')
//         console.log(databaseReadIn)
//         tableMemory = { ...databaseReadIn};
//     } catch (error){
//         console.log(error)
//         // if (boot_attempts>1 || error===SyntaxError){
//         if (boot_attempts>1){ // || error===SyntaxError){
//             dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Failed to load!"})}
//         throw (error);
//         return false
//     }
    
//     console.log('end')
//     return true
// }



const preLoadFromJSON = () => {
    if (checkDatabase()===true){
        mountDatabase();
    } else {
        const promise = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Database not initialized, please load one  (CMD D) to continue."}).then(function (response){

        })

    }
}


// const checkDatabase = () => {
//     //this is only on startup. it should only work, if it doesnt work, never try again. 
//     try {
//     mountDatabase();
//     } catch (error) {
//         const promise = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Database not initialized, please load one to continue."}).then(function (response) {
//             if (!response.canceled) {
//                 var chosen = dialog.showOpenDialog()
//                 .then((filePaths) => filePaths); //*** this works.
//                 chosen.then((values) => {
//                     console.log(values);
//                     var payload = `const sqlite = require('better-sqlite3');\nconst db = new\nsqlite(\"${values[1]}\")\nexports.db = db;`


//                     //to do, when we choose a path, rewrite the database import based on the filename.
// //                    fs.writeFileSync(values.filepath, payload)
//                     //our JSON should also be rewritten
//                     // console.log(value)
//                     console.log('readin')
//                     console.log(jsonFilePath)
//                     console.log(JSON.stringify(tableMemory))
//                     fs.writeFileSync(jsonFilePath, JSON.stringify(tableMemory))
//                     // mountDatabase();

//                 });
//                 chosen.catch((err) => {
//                     console.log('there was a problem')
//                     console.log(err)
//                 })
            
//             } else {
//                 //user declined to choose a file.
//                 console.log(`stinky @ ${jsonFilePath}`)
//                 console.log(promise)
//                 //                fs.writeFileSync(filePath, `stinky @ ${promise.canceled}`)
//             }})
//         .catch((err) => {
//             console.log(err)
//         })
//     }
//     // import *  as fs from 'fs'
// };



// ipcMain.on('send-dataset', (event, messages) => {
//     console.log(messages);
//     [dnames, rnames] = [...messages];});

// var dnames;
// var rnames;

// const fetchDataNames = () => {
//     console.log('4')
//     return dnames};


// const fetchResNames = () => {
//     return rnames};

// function writeToJsonPage(){
//     try{
//     const focusWindow = BrowserWindow.getFocusedWindow()
//     focusWindow.webContents.send('fetch-dataset');
//     console.log('3')
//     const dataNames = fetchDataNames();
//     console.log(tableMemory["datasetFields"])
//     console.log(dataNames)
//     console.log(dnames)
//     console.log('5')
//     const resNames = fetchResNames();
//     console.log(resNames)
//     console.log('called sync write to json')
//     if(checkDatabase()!=false){
//         mountDatabase();
//     } else {
//         throw new Error();
//     }
//     console.log
//     return [dataNames,resNames]
//     }
//     catch (error){
//         console.error(error)
//     }
    
// }

// function callOpenDialog(){

//     let createOrder = async function () { 
//       let response = await dialog.showOpenDialog()
//       return response 
//     };

//     // var openFilePromise = dialog.showOpenDialog().then(reply => reply.filePaths).then(fp => fp[0]).catch(error => console.error(error));
//     console.log('0');
//     return createOrder
// }


// const initializeDatabase =  async() =>{

//     const files = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
//         properties: ['openFile']
//     });

//     if (!files) {
//         return;
//     }

//     console.log('1')
//     console.log(files)
//     tableMemory["databaseName"] = files.filePaths[0];

//     const payload = `const sqlite = require('better-sqlite3');\nconst db = new\nsqlite(\"${tableMemory["databaseName"]}\")\nexports.db = db;`
//     fs.writeFileSync("models/test.js",payload,{encoding:'utf8',flag:'w'})
//     fs.writeFileSync(jsonFilePath, JSON.stringify(tableMemory))

// }



// function loadDatabase(){
//     console.log("@@@@@@@@@@@@@@@@@@@")
//     console.log(tableMemory);
//     console.log("loading");

//     // console.log(rnames)
//     // if (dnames != undefined){
//     // tableMemory["datasetFields"] = [...Object.values(dnames)]
//     // tableMemory["resolutionFields"] = [...Object.values(rnames)]
//     // }
//     // else{
//     //     console.log('complain, main.js')
//     //     throw new Error()
//     // }
//     let jsonPayload = JSON.stringify(tableMemory);
//     console.log(tableMemory)
//     console.log(dnames, rnames)
//     mountDatabase();
//     dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Success!"});
// }


// const chooseAndLoadDatabase =  async() =>{

    // const files = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    //     // The Configuration object sets different properties on the Open File Dialog 
    //     properties: ['openFile']
    // });

    // // If we don't have any files, return early from the function
    // if (!files) {
    //     return;
    // }

    // // console.log(openFilePromise.then(reply => reply.filePaths).then(fp => fp[0]).catch(error => console.error(error)))
    // console.log('1')
    // console.log(files)
    // tableMemory["databaseName"] = files.filePaths[0];
    // console.log(tableMemory["databaseName"])
    // const selectWindow = BrowserWindow.getFocusedWindow();
    // const payload = `const sqlite = require('better-sqlite3');\nconst db = new\nsqlite(\"${tableMemory["databaseName"]}\")\nexports.db = db;`
    // console.log(payload)
    // fs.writeFileSync("models/test.js",payload,{encoding:'utf8',flag:'w'})

    // console.log('2')
    //   // let promise = new Promise((resolve, reject) => {
    //   //   fetchDataNames(() => resolve("done!"))
    //   // });
    // // const dataNames = await fetchDataNames();
    // // const resNames = await fetchResNames();
    // var replyArray = writeToJsonPage();
    // console.log(replyArray)
    // // const callD = new Promise((resolve => fetchDataNames(),reject => null));
    // // const callR = new Promise((resolve => fetchResNames(),reject => null);
    // // AWAIT
    // // AWAIT

    // console.log('here')
    // console.log(dnames)
    // console.log(rnames)
    // // console.log([...Object.values(dnames)])
    // //
    // //
    // if (dnames != undefined){
    // tableMemory["datasetFields"] = [...Object.values(dnames)]
    // tableMemory["resolutionFields"] = [...Object.values(rnames)]
    // }
    // else{
    //     console.log('complain, main.js')
    //     throw new Error()
    // }
    // console.log(tableMemory)

    // let jsonPayload = JSON.stringify(tableMemory);

    // fs.writeFileSync(jsonFilePath, JSON.stringify(tableMemory))
    // console.log(tableMemory)
    // console.log('ok')
    // if (boot_attempts>1){}
    // const mtDB = await mountDatabase();
    // await new Promise((resolve => mountDatabase(),reject));
    // AWAIT
    // await new Promise((resolve,reject) => resolve(mountDatabase()));
//     mountDatabase();
//     console.log('7')

//     dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Success!"});
//     // console.log('')

// }

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
