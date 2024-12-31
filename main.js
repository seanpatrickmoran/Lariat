const path = require('path');
const { BrowserWindow, app, Menu, ipcMain, dialog } = require('electron');
const { globalShortcut } = require('electron');
const fs = require('fs');

var datasPath = app.getPath('userData')
console.log(datasPath)
var jsonFilePath = path.join(datasPath, "LariatApplication.json")
console.log('booted')

var boot_attempts = 0;
var databaseIsValid = false
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
    const mainWindow = new BrowserWindow({
        title: "mainWindow",
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
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
        preload: path.join(__dirname, 'preload.js')
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
        preload: path.join(__dirname, 'preload.js')
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
    if ((browserWindowArray['levelsWindow'] != -2) && (BrowserWindow.fromId(browserWindowArray['levelsWindow']) != null)){
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
        preload: path.join(__dirname, 'preload.js')
    }
    });


    var [x, y] = BrowserWindow.fromId(browserWindowArray["mainWindow"]).getPosition();
    levelsWindow.setPosition(x+500,y+180);
    levelsWindow.loadFile("children/levels.html")
    levelsWindow.setMaximizable(false)
    levelsWindow.setHasShadow(false)
    levelsWindow.invalidateShadow()
    console.log('hey!')
    console.log(levelsWindow.id)
    console.log(levelsWindow.getTitle())
    levelsWindow.webContents.on('did-finish-load', ()=>{
        levelsWindow['levelsWindow'] = levelsWindow.id
        return undefined
    });
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



app.whenReady().then(()=> {
    createMainWindow();
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu)
    console.log(tableMemory)
    checkDatabase();
    console.log(tableMemory)
    console.log(BrowserWindow.getAllWindows)
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

ipcMain.on('change-view-to-viewer', ()=>{
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.loadFile('children/viewer.html')
});

ipcMain.on('change-view-to-pairs', ()=>{
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.loadFile('children/pairs.html')
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
    await createlevelsWindow();
    const selectWindow = BrowserWindow.fromId(browserWindowArray["mainWindow"])
    selectWindow.webContents.send("base64-to-levels", msg);
    console.log('2')
    console.log(browserWindowArray)
    return
});

ipcMain.handle("return-base64-to-levels", async (event, msg) => {
    const selectWindow = BrowserWindow.getFocusedWindow()//.fromId(browserWindowArray["levelsWindow"])
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

const mountDatabase = () => {
    console.log(jsonFilePath)
    boot_attempts += 1 ;
    console.log('start')
    try {
        function isJSON(str) { console.log('is it a json?'); try {return (JSON.parse(str) && !!str);} catch (e) {return false;}}
        console.log('heyllo')
        // var json;
        // fs.readFileSync(jsonFilePath)//.catch((e) => {return e})

        console.log(jsonFilePath)
        // const databaseReadIn = JSON.parse(fs.readFileSync(jsonFilePath))

        var databaseReadIn;
        // try {
        databaseReadIn = JSON.parse(fs.readFileSync(jsonFilePath))
        // } catch (err) {
        //     console.log('error caught')
        //     return err
        // }

        console.log(databaseReadIn)
        console.log('dbREAD okay')
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
        console.log('mountDB OK')
        console.log(databaseReadIn)
        tableMemory = { ...databaseReadIn};
    } catch (error){
        console.log(error)
        // if (boot_attempts>1 || error===SyntaxError){
        if (boot_attempts>1){ // || error===SyntaxError){
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Failed to load!"})}
        throw (error);
        return false
    }
    
    console.log('end')
    return true
}




const checkDatabase = () => {
    //this is only on startup. it should only work, if it doesnt work, never try again. 
    try {
    mountDatabase();
    } catch (error) {
        const promise = dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Database not initialized, please load one to continue."}).then(function (response) {
            if (!response.canceled) {
                var chosen = dialog.showOpenDialog()
                .then((filePaths) => filePaths); //*** this works.
                chosen.then((values) => {
                    console.log(values);
                    var payload = `const sqlite = require('better-sqlite3');\nconst db = new\nsqlite(\"${values[1]}\")\nexports.db = db;`


                    //to do, when we choose a path, rewrite the database import based on the filename.
//                    fs.writeFileSync(values.filepath, payload)
                    //our JSON should also be rewritten
                    // console.log(value)
                    console.log('readin')
                    console.log(jsonFilePath)
                    console.log(JSON.stringify(tableMemory))
                    // fs.writeFileSync(jsonFilePath, JSON.stringify(tableMemory))
                    mountDatabase();
                });
                chosen.catch((err) => {
                    console.log('there was a problem')
                    console.log(err)
                })
            
            } else {
                //user declined to choose a file.
                console.log(`stinky @ ${jsonFilePath}`)
                console.log(promise)
                //                fs.writeFileSync(filePath, `stinky @ ${promise.canceled}`)
            }})
        .catch((err) => {
            console.log(err)
        })
    }
    // import *  as fs from 'fs'
};


var dnames;
var rnames;
ipcMain.on('send-dataset', (event, messages) => {[dnames, rnames] = [...messages];});
const fetchDataNames = () => {return dnames}
const fetchResNames = () => {return rnames}



const chooseAndLoadDatabase = () => {
    var chosen = dialog.showOpenDialog() //*** this works.
    chosen.then(function (response) {
        console.log(response)
        if (!response.canceled) {
//            console.log(response.filePaths[0]);
//            //            var payload = `const sqlite = require('better-sqlite3');\nconst db = new\nsqlite(\"${values[1]}\")\nexports.db = db;`
////            console.log(response)
//            console.log('writing databasePath')
            tableMemory["databaseName"] = response.filePaths[0]
//            console.log(response.filePaths)

            const selectWindow = BrowserWindow.getFocusedWindow();
            selectWindow.webContents.send('fetch-dataset') // Sends a message to renderer to get prefs
            
            fetchDataNames();
            fetchResNames();
            console.log('here')
            console.log(dnames)
            console.log(rnames)
            tableMemory["datasetFields"] = [...Object.values(dnames)]
            tableMemory["resolutionFields"] = [...Object.values(rnames)]

            let jsonPayload = JSON.stringify(tableMemory);
            fs.writeFileSync(jsonFilePath, jsonPayload)
            if (boot_attempts>1){
                dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {message: "Success!"})}
        }
    })
    .catch((err) => {
        console.log(err)
    })
    mountDatabase();
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
      { label: 'Database Load', accelerator: "CmdOrCtrl+D", click: chooseAndLoadDatabase },
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
