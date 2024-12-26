const path = require('path');
const { BrowserWindow, app, Menu, ipcMain, } = require('electron');
// const { dialog } = require('electron')


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
	//


// async function talkToMain (msg) {
//   const strname = await msg;
//   console.log(strname);
//   return strname
// }

async function mainDumpToPasteboard (data) {
	// well, we don't want to call the selected options from pasteboard, we want to call them from QUERY, INSPECT, etc.
	// instead, we can read the options from pasteboard into the current open window?
  const strname = await data;
  console.log('runs here');
  return
}



// const popWelcomePage = () => {

  // <div id="content" class="content">
  //   <div class="control-box close-box"><a class="control-box-inner"></a></div>
  //   <div class="control-box zoom-box"><div class="control-box-inner"><div class="zoom-box-inner"></div></div></div>
  //   <div class="control-box windowshade-box"><div class="control-box-inner"><div class="windowshade-box-inner"></div></div></div>
  //   <h1 class="title">Unimplemented!</h1>
  //     <h3 class="text-xl text-teal-100 text-center">Lariat</h3>
  //     <p>Version 0.0.1</p>
  //     <p>Developed by Sean Moran and Dr. Jie Liu</p>
  //     <p>University of Michigan DCMB</p>
  //     <p>MIT License, December 2024</p>
  //     <div class="icon"><img src="img/bomb.png" /></div>
  //     <ul>
// 		  <li><class "s">A system error has occurred. Please reboot your Mac.</li>
  //     </ul>
  //     <button class="command_button">Reboot</button>
  //   </div>
// }

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
	pasteboardWindow.loadFile("popBoard.html")
	// pasteboardWindow.setAlwaysOnTop(true)
	// pasteboardWindow.api.send(browserWindowArray)

	return undefined
}

// const createWelcomeWindow = () => {
// 	//there's definitely some kind of window that will freeze. check ChildWindowClass?
// 	const welcomeWindow = new BrowserWindow({
// 		// parent: mainWindow,
// 		// modal: true,
// 		title: "Welcome!",
// 		width: 250,
// 		height: 250,
// 	});
// 	welcomeWindow.loadFile("children/welcome.html")
// }


// const createHahahaWindow = () => {
// 	const hahahaWindow = new BrowserWindow({
// 		title: "WARN",
// 		width: 150,
// 		height: 150,
// 	});
// 	hahahaWindow.loadFile("hahaha.html")
// }


let browserWindowArray = { "" : 0,
	'mainWindow': -2,
	'pasteboardWindow': -2
	}

let mainWindowState = {
	'mainWindow': "",
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
      { label: 'Close Window', accelerator: "CmdOrCtrl+W",},
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

// exports.menu = menu;



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
    const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow'])
    selectWindow.loadFile('index.html')

	if (browserWindowArray['mainWindow'] != -2){
	selectWindow.webContents.on('did-finish-load', ()=>{
	  selectWindow.webContents.send("show-start-mosaic","hidden");
      });
	};
});


ipcMain.handle('dialog:callMain', async (event, msg) => {
	// const [page, response] = msg;
	// console.log(page, response)
	await createMainWindow();
    // const selectWindow = BrowserWindow.fromId(browserWindowArray['mainWindow']);
	// if (BrowserWindow.fromId(browserWindowArray['mainWindow']) != page){
	// 	selectWindow.loadFile(`children/${page}`)
	// }
	return
});


//need to check if Pboard exists from query 
ipcMain.handle('dialog:callPBoard', async (event, data) => {
	await createPopWindow();
	BrowserWindow.fromId(browserWindowArray['pasteboardWindow']).moveTop()
	//can we populate it?
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
	  // selectWindow.webContents.send("show-start-mosaic","hidden");
		selectWindow.loadFile('children/query.html')});
	}
	selectWindow.webContents.send("paste-board-to-noWindow",(response));
    // const selectWindow = BrowserWindow.fromId(browserWindowArray['pasteboardWindow']);
	// selectWindow.webContents.send("main-to-pasteboard",response);

});



