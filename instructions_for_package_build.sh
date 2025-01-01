git clone https://github.com/seanpatrickmoran/Lariat.git

npm install better-sqlite3
npm install --save-dev electron
rm -rf package-lock.json
npm i  
npm i -D electron-rebuild
npm rebuild      
./node_modules/.bin/electron-rebuild


cat <<EOF > package.json
{
  "name": "Lariat",
  "version": "0.0.1",
  "description": "GUI interface to compare chromatin features, reads from SQL",
  "exports": "main.js",
  "main": "main.js",
  "type": "module",
  "scripts": {
    "start": "electron .",
    "app:dir": "electron-builder --dir",
    "app:dist": "electron-builder"
  },
  "build": {
    "appId": "your.id",
    "mac": {
      "category": "your.app.category.type"
    }
  },
  "repository": {
    "type": "git",
    "url": "git remote -v https://github.com/seanpatrickmoran/Lariat.git"
  },
  "keywords": [
    "Bioinformatics",
    "loops",
    "4DN",
    "Nucleome",
    "3D"
  ],
  "author": "Sean Moran",
  "license": "MIT",
  "devDependencies": {
    "electron": "^33.2.1",
    "electron-builder": "^25.1.8",
    "electron-rebuild": "^3.2.9"
  },
  "dependencies": {
    "better-sqlite3": "^11.7.0",
    "electron-store": "^10.0.0"
  },
  "engines": {
    "node": ">=18"
  },
  "postinstall": "electron-builder install-app-deps"
}
EOF

npm install -D electron-builder

npm run app:dist
