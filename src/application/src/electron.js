const {app, BrowserWindow} = require("electron")

function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600
	})

	// and load the index.html of the app.
	// win.loadFile("index.html");
	win.loadURL("http://192.168.1.10/admin")
	// Open the DevTools.
	win.webContents.openDevTools({mode: "detach"})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
