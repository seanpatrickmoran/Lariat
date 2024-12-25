var dbmgr = require("./dbmgr.js");
var db = dbmgr.db;

//"CREATE TABLE imag(name, dataset, condition, coordinates, numpyarr, viewing_vmax, dimensions, hic_path, PUB_ID, resolution, meta)"

exports.getNames = (name) => {
	const sql = 'SELECT * FROM imag WHERE name = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	return result;
};

exports.getDataset = (name) => {
	const sql = 'SELECT * FROM imag WHERE dataset = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	// console.log(result);
	return result;
};

exports.getCondition = (name) => {
	const sql = 'SELECT * FROM imag WHERE condition = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	// console.log(result);
	return result;
};

exports.getHiCPath = (name) => {
	const sql = 'SELECT * FROM imag WHERE hic_path = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	// console.log(result);
	return result;
};

exports.getPubId = (name) => {
	const sql = 'SELECT * FROM imag WHERE PUB_ID = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	// console.log(result);
	return result;
};

exports.getResolution = (name) => {
	const sql = 'SELECT * FROM imag WHERE resolution = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(parseInt(name));
	// console.log(result);
	return result;
};

exports.getDimensions = (name) => {
	const sql = 'SELECT * FROM imag WHERE dimensions = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(parseInt(name));
	console.log(result,name);
	return result;
};

exports.pragma = () => {
	const sql = 'PRAGMA table_info(imag)'; 
	let stmt = db.prepare(sql);
	let result = stmt.all();
	// console.log(result);
	return result;
};

exports.getTail = () => {
	const sql = "SELECT * FROM imag ORDER BY ROWID ASC LIMIT 100";
	let stml = db.prepare(sql);
	let result = stml.all();
	return result;
}

// exports.getDistinctDatasets = () => {
// 	const sql = "SELECT DISTINCT dataset FROM imag ORDER BY name ASC;"
// 	let stml = db.prepare(sql);
// 	let result = stml.all();
// 	console.log(result);
// 	return result;
// }

exports.getDistinctDatasets = () => {
	const sql = "SELECT DISTINCT hic_path FROM imag ORDER BY name ASC;"
	let stml = db.prepare(sql);
	let result = stml.all();
	// console.log(result);
	return result;
}

exports.getDistinctItems = (name) => {
	const sql = `SELECT DISTINCT ${name} FROM imag ORDER BY name ASC;`
	let stml = db.prepare(sql);
	let result = stml.all();
	console.log(result);
	return result;
}



// exports.getNames = (name, colName="name") => {
// 	// alert(name);
// 	// const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
// 	// console.log(row.firstName, row.lastName, row.email);

// 	// const stml = db.prepare("SELECT * FROM imag WHERE (?) = (?)");
// 	// // console.log(row);
// 	// stml.run()
// 	// let result = stml.all();
// 	// return result;
// 	const sql = 'SELECT * FROM imag WHERE name = (?)';
// 	// const sql = 'SELECT * FROM imag WHERE ? = ?';
// 	let stmt = db.prepare(sql);
// 	// let result = stmt.all(colName, name);
// 	let result = stmt.all(name);
// 	console.log(result);
// // }





// function query to pass sql statement directly to child window. make only callable from child window and only from DEVMODE

// exports.callField = () => {
// 	// const sql = "SELECT * FROM imag";
// 	const sql = "SELECT * FROM imag ORDER BY ROWID ASC LIMIT 10";
// 	let stml = db.prepare(sql);
// 	let result = stml.all();
// 	return result;
// }

// exports.callField = () => {
// 	// const sql = "SELECT * FROM imag";
// 	const sql = "SELECT * FROM imag ORDER BY ROWID ASC LIMIT 10";
// 	let stml = db.prepare(sql);
// 	let result = stml.all();
// 	return result;
// }