const sqlite = require('better-sqlite3');
const db = new sqlite("./images2.db")
exports.db = db;
