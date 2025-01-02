// var dbmgr = require("./dbmgr.js");
// var dbmgr = require("./test.js");
// import * as sqlite3 from "dbmgr.js";
// var db = dbmgr.db;

//"CREATE TABLE imag(name, dataset, condition, coordinates, numpyarr, viewing_vmax, dimensions, hic_path, PUB_ID, resolution, norm, meta)"
// cursor = connection.execute("CREATE TABLE imag(name, dataset, condition, coordinates, numpyarr, viewing_vmax, dimensions, hic_path, PUB_ID, resolution, norm, meta)")

import { db } from "./dbmgr.js";

export const getNames = (name) => {
	const sql = 'SELECT * FROM imag WHERE name = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	return result;
};


export const getDataset = (name, offset) => {
	const sql = `SELECT * FROM imag WHERE dataset = '${name}' LIMIT 100 OFFSET ${offset};`; // LIMIT 3 OFFSET 0';
	let stmt = db.prepare(sql);
	let result = stmt.all();
	return result;
};


export const getDatasetAll = (name) => {
	const sql = `SELECT * FROM imag WHERE dataset = '${name}'`; // LIMIT 3 OFFSET 0';
	let stmt = db.prepare(sql);
	let result = stmt.all();
	return result;
};


export const getCondition = (name) => {
	const sql = 'SELECT * FROM imag WHERE condition = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	return result;
};

export const getHiCPath = (name) => {
	const sql = 'SELECT * FROM imag WHERE hic_path = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	return result;
};

export const getPubId = (name) => {
	const sql = 'SELECT * FROM imag WHERE PUB_ID = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(name);
	return result;
};

export const getResolution = (name) => {
	const sql = 'SELECT * FROM imag WHERE resolution = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(parseInt(name));
	return result;
};

export const getDimensions = (name) => {
	const sql = 'SELECT * FROM imag WHERE dimensions = (?)';
	let stmt = db.prepare(sql);
	let result = stmt.all(parseInt(name));
	return result;
};

export const pragma = () => {
	const sql = 'PRAGMA table_info(imag)'; 
	let stmt = db.prepare(sql);
	let result = stmt.all();
	// console.log(result);
	return result;
};

export const getTail = () => {
	const sql = "SELECT * FROM imag ORDER BY ROWID ASC LIMIT 100";
	let stml = db.prepare(sql);
	let result = stml.all();
	return result;
}

export const getDistinctDatasets = () => {
	const sql = "SELECT DISTINCT hic_path FROM imag ORDER BY name ASC;"
	let stml = db.prepare(sql);
	let result = stml.all();
	return result;
}

export const getDistinctItems = (name) => {
	const sql = `SELECT DISTINCT ${name} FROM imag ORDER BY name ASC;`
	let stml = db.prepare(sql);
	let result = stml.all();
	return result;
}

export const getDistinctItemsAtRes = (key,resolution) => {
	const sql = `SELECT DISTINCT ${key} FROM imag ORDER BY name ASC WHERE resolution = ${resolution};`
	let stml = db.prepare(sql);
	let result = stml.all();
	return result;
}

export const countDistinctItems = (name, key, offset=0) => {
	// const sql = `SELECT COUNT(*) FROM imag WHERE (?)  ORDER BY name ASC;`
	const sql = `SELECT COUNT(*) FROM imag WHERE ${name} = '${key} LIMIT 100 OFFSET ${offset};`
	let stml = db.prepare(sql);
	let result = stml.get();
	return  result['COUNT(*)']
	// return result;
};

export const getDatasetatRes = (name, resolution, offset=0) => {
	const sql = `SELECT * FROM imag WHERE dataset = '${name}' AND resolution = '${resolution}' LIMIT 100 OFFSET ${offset};` // LIMIT 3 OFFSET 0';
	let stmt = db.prepare(sql);
	let result = stmt.all();
	return result;
};

