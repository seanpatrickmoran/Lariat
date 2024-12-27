const path = require('path');
const { BrowserWindow, app, Menu, ipcMain, } = require('electron');
// const { dialog } = require('electron')


const isMac = process.platform === 'darwin';

let browserWindowArray = { "" : 0,
	'mainWindow': -2,
	'pasteboardWindow': -2,
	'inspectToolsWindow': -2,
	}

let mainWindowState = {
	'mainWindow': "",
	}

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
	// pasteboardWindow.setAlwaysOnTop(true)
	// pasteboardWindow.api.send(browserWindowArray)
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


const closeFocusWindow = () => {
	const selectWindow = BrowserWindow.getFocusedWindow()
	if (selectWindow != null) {
		var name = selectWindow.getTitle();
		browserWindowArray[name] = -1;
		selectWindow.close()
	}
	return
}


app.whenReady().then(()=> {
	createMainWindow();
	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu)
	// ipcMain.handle('dialog:callMain', talkToMain)
	// ipcMain.handle('dialog:chooseData', mainDumpToPasteboard)
});



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
		        { role: 'quit' }
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
      // process.platform !== 'darwin' ? { role: 'close' } : { role: 'quit' },
      { role: 'Quit' },
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
    if (selectWindow.getURL()==="file://"+__dirname+"index.html"){
    	return
    }
    selectWindow.loadFile('index.html')

	if (browserWindowArray['mainWindow'] != -2){
	selectWindow.webContents.on('did-finish-load', ()=>{
	  selectWindow.webContents.send("show-start-mosaic","hidden");
      });
	};
});

// 	if (browserWindowArray['mainWindow'] != -2){
// 	selectWindow.webContents.on('did-finish-load', ()=>{
// 	  selectWindow.webContents.send("show-start-mosaic","hidden");
//       });
// 	};
// });


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
	var selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow']);
	if(selectWindow.webContents.getURL() != "file://"+__dirname+"children/inspect.html"){
		if(browserWindowArray['inspectToolsWindow']!=-2){
			BrowserWindow.fromId(browserWindowArray['inspectToolsWindow']).close()
			browserWindowArray['inspectToolsWindow']=-2;
			return
		}
		await createInspectToolsWindow();
		BrowserWindow.fromId(browserWindowArray['inspectToolsWindow']).isVisible()
		return 
	}
	return null

});

ipcMain.handle('dialog:chooseMain', async (event, data) => {
	const response = await data;
	console.log('main');
	console.log(response)
    const selectWindow = BrowserWindow.fromId(browserWindowArray['pasteboardWindow']);
	selectWindow.webContents.send("main-to-pasteboard",response);
});


ipcMain.handle('dialog:PBoardToMain', async (event, data) => {
	const response = await data;
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow']);

    const path = selectWindow.webContents.getURL();

	if (BrowserWindow.fromId(browserWindowArray['mainWindow']) === null){
	selectWindow.webContents.on('did-finish-load', ()=>{
	  // selectWindow.webContents.send("show-start-mosaic","hidden");
		selectWindow.loadFile('children/query.html')});
	}
	selectWindow.webContents.send("paste-board-to-noWindow",(response));
    // const selectWindow = BrowserWindow.fromId(browserWindowArray['pasteboardWindow']);
	// selectWindow.webContents.send("main-to-pasteboard",response);
	return
});



