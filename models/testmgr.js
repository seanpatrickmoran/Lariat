var dbmgr = require("./dbmgr.js");
var db = dbmgr.db;

//"CREATE TABLE imag(name, dataset, condition, coordinates, numpyarr, viewing_vmax, dimensions, hic_path, PUB_ID, resolution, norm, meta)"
// cursor = connection.execute("CREATE TABLE imag(name, dataset, condition, coordinates, numpyarr, viewing_vmax, dimensions, hic_path, PUB_ID, resolution, norm, meta)")

exports.getNames = (name) => {
	const sql = 'SELECT * FROM imag WHERE name = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	return result;
};


exports.getDataset = (name, offset) => {
	const sql = `SELECT * FROM imag WHERE dataset = '${name}' LIMIT 200 OFFSET ${offset};`; // LIMIT 3 OFFSET 0';
	let stmt = db.prepare(sql);
	let result = stmt.all();
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
	console.log(stml)
	let result = stml.all();
    console.log();
	return result;
}

exports.getDistinctItemsAtRes = (key,resolution) => {
	const sql = `SELECT DISTINCT ${key} FROM imag ORDER BY name ASC WHERE resolution = ${resolution};`
	let stml = db.prepare(sql);
	console.log(stml)
	let result = stml.all();
	return result;
}

exports.countDistinctItems = (name, key, offset=0) => {
	// const sql = `SELECT COUNT(*) FROM imag WHERE (?)  ORDER BY name ASC;`
	console.log('count')
	const sql = `SELECT COUNT(*) FROM imag WHERE ${name} = '${key} LIMIT 200 OFFSET ${offset};`
	let stml = db.prepare(sql);
	let result = stml.get();
	console.log('No of rows ', result['COUNT(*)']); //logs 2
	return  result['COUNT(*)']
	// return result;
};

exports.getDatasetatRes = (name, resolution, offset=0) => {
	const sql = `SELECT * FROM imag WHERE dataset = '${name}' AND resolution = '${resolution}' LIMIT 200 OFFSET ${offset};` // LIMIT 3 OFFSET 0';
	let stmt = db.prepare(sql);
	let result = stmt.all();
	console.log(stmt)
	return result;
};






//SELECT COUNT(*) FROM patients WHERE gender = "M" AND first_name = "Moe";






// exports.getNamesLimit = (name, rowPointer, limiter) => {
// 	const sql = 'SELECT * FROM imag WHERE name = (?) LIMIT (?) OFFSET (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name, parseInt(limiter), parseInt(rowPointer ));
// 	return result;
// };

// exports.getDatasetLimit = (name, rowPointer, limiter) => {
// 	const sql = 'SELECT * FROM imag WHERE dataset = (?) LIMIT (?) OFFSET (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name, parseInt(limiter), parseInt(rowPointer));
// 	// console.log(result);
// 	return result;
// };

// exports.getConditionLimit = (name, rowPointer, limiter) => {
// 	const sql = 'SELECT * FROM imag WHERE condition = (?) LIMIT (?) OFFSET (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name, parseInt(limiter), parseInt(rowPointer));
// 	// console.log(result);
// 	return result;
// };

// exports.getHiCPathLimit = (name, rowPointer, limiter) => {
// 	const sql = 'SELECT * FROM imag WHERE hic_path = (?) LIMIT (?) OFFSET (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name, parseInt(limiter), parseInt(rowPointer));
// 	// console.log(result);
// 	return result;
// };

// exports.getPubIdLimit = (name, rowPointer, limiter) => {
// 	const sql = 'SELECT * FROM imag WHERE PUB_ID = (?) LIMIT (?) OFFSET (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name, parseInt(limiter), parseInt(rowPointer));
// 	// console.log(result);
// 	return result;
// };

// exports.getResolutionLimit = (name, rowPointer, limiter) => {
// 	const sql = 'SELECT * FROM imag WHERE resolution = (?) LIMIT (?) OFFSET (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name, parseInt(rowPointer), parseInt(rowPointer));
// 	// console.log(result);
// 	return result;
// };

// exports.getDimensionsLimit = (name, rowPointer, limiter) => {
// 	const sql = 'SELECT * FROM imag WHERE dimensions = (?) LIMIT (?) OFFSET (?)';
// 	let stmt = db.prepare(sql);
// 	let result = stmt.all(name, parseInt(limiter), parseInt(rowPointer));
// 	console.log(result,name);
// 	return result;
// };










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
