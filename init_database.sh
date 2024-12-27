#!/bin/bash

databasepath="/path/to/your/database.db"

cat <<EOF > models/dbmgr1.js
const sqlite = require('better-sqlite3');
const db = new sqlite(\`${databasepath}\`);
exports.db = db;
EOF

echo "database at ${databasepath} initalized."