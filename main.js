const path = require('path');
const { BrowserWindow, app, Menu, ipcMain, } = require('electron');


const isMac = process.platform === 'darwin';

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		title: "Lariat",
		width: 800,
		height: 600,
		webPreferences:{
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js')
		}
	});

	if (process.env.NODE_ENV !== 'production') {
	mainWindow.webContents.openDevTools();
	}
	mainWindow.loadFile("index.html")
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

	// const aboutWindow = new BrowserWindow({
	// 	title: "Pasteboard",
	// 	width: 420,
	// 	height: 360,
	// });
	// aboutWindow.loadFile("popBoard.html")
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


app.whenReady().then(()=> {
	createWindow();
	// createWelcomeWindow();
	//implement menu
	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu)
	// popWelcomePage();
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
      // { label: 'Pasteboard', accelerator: "CmdOrCtrl+T", click: () => app.emit('openPasteBoard'),} //HERE **
      process.platform !== 'darwin' ? { role: 'close' } : { role: 'quit' },
      { role: 'quit' },
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
	if (BrowserWindow.getAllWindows().length === 0){
	createWindow();
	}
});



//IPC view

//index.html view
//query.html view

ipcMain.on('change-view-to-query', ()=>{
    BrowserWindow.getAllWindows()[0].loadFile('children/query.html')
});

ipcMain.on('change-view-to-inspect', ()=>{
    BrowserWindow.getAllWindows()[0].loadFile('children/inspect.html')
});

ipcMain.on('change-view-to-viewer', ()=>{
    BrowserWindow.getAllWindows()[0].loadFile('children/viewer.html')
});

ipcMain.on('change-view-to-pairs', ()=>{
    BrowserWindow.getAllWindows()[0].loadFile('children/pairs.html')
});

ipcMain.on('back-to-previous', ()=>{
    BrowserWindow.getAllWindows()[0].loadFile('index.html')
});
