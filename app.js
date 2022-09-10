const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require("fs")
const puppeteer = require("puppeteer")
const { JSDOM } = require("jsdom");

var browser

(async () => {
  browser = await puppeteer.launch();
})();


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, '/src/index.html'));
  mainWindow.setMenu(null)
  mainWindow.maximize();
  mainWindow.show();
};

ipcMain.on('createBanner', async (event, source) => {
  
  var contentHtml = fs.readFileSync(path.join(__dirname, '/src/banner/index.html'), 'utf8');
  const dom = new JSDOM(contentHtml);
  const document = dom.window.document
  const parentElement = document.getElementById('descriptionObjects')

  // Set colors...
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
  .gradient-line { 
    width: 100%; 
    height: 10px; 
    background: ${source.color1}; 
    background: linear-gradient(90deg, ${source.color1} 50%, ${source.color2} 100%); } 

  .warningBoxColor { background-color: ${source.color1}; } 
  `;
  document.getElementsByTagName('head')[0].appendChild(style);

  // Top contents filling...
  const mainTitle = document.getElementById("mainTitle")
  mainTitle.innerHTML = source.main.title
  document.getElementById("mainImage").src = source.main.image

  // Mini banner contents filling...
  if (source.mini) {
    const miniBanner = document.getElementById("miniBanner")
    miniBanner.getElementsByTagName('h1')[0].innerHTML = source.mini.title
    miniBanner.getElementsByTagName('span')[0].innerHTML = source.mini.desc
    miniBanner.getElementsByTagName('img')[0].src = source.mini.image
  } else {
    document.getElementById("miniBanner")?.remove()
    document.getElementById("2gradient")?.remove()
  }

  // Description objects creating and appending...
  let currentPosition = "left-box"
  for (const el of source.descriptionObjects) {
    if (!el) continue;
    const createElement = document.createElement('div')
    createElement.classList.add(`${currentPosition}`)
    createElement.innerHTML = `
        ${currentPosition == 'left-box' ? `<img src="${el.image}" alt="">` : ``}
        <div class="box-text">
          <h1>${el.title}</h1>
          <span>${el.desc}</span>
        </div>
        ${currentPosition == 'right-box' ? `<img src="${el.image}" alt="">` : ``}
      `
    parentElement.appendChild(createElement)
    currentPosition = (currentPosition == 'left-box') ? 'right-box' : 'left-box'
  }


  // Get all HTML as string
  const html = document.documentElement.outerHTML
  fs.writeFile('out/out.html', html, (err) => {
    if (err) console.log(err);
  });

  // Start the screenshot process...
  const page = await browser.newPage();
  page.setViewport({ width: 600, height: document.body.clientHeight, deviceScaleFactor: 3 });
  await page.goto(`file:${path.join(__dirname, '/out/out.html')}`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'out/screenshot.jpg', fullPage: true });
  await page.close()

  // When finish send event to relaod client banner...
  event.sender.send('preview')
})

ipcMain.on('saveBanner', async () => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save Banner',
    defaultPath: `banner-${Date.now()}.jpg`,
    filters :[
      {name: 'Images', extensions: ['jpg']},
     ]
  });
  if (filePath) fs.copyFile(path.join(__dirname, '/out/screenshot.jpg'), filePath, (error) => {
    if (error) console.warn(error)
  })
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});