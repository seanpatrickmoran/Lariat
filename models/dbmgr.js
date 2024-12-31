const sqlite = require('better-sqlite3');
// const db = new sqlite("./images2.db")
// const db = new sqlite("/Users/seanmoran/Documents/Master/2024/Dec2024/databse1.db")
//const db = new sqlite("/Users/seanmoran/Documents/Master/2024/Dec2024/122824_mustacheTEST.db")
// const db = new sqlite("/Users/seanmoran/Documents/Master/2024/Dec2024/databse3.db")
const db = new sqlite("/Users/seanmoran/Documents/Master/2024/Dec2024/databaseDUMP/database5.db")

//var pathToDatabase = "";
//
//function bootDataBase() => {
//    api.send('checkDataBaseOrLoad', console.log('here first');)
////    return api.send('checkDataBaseOrLoad', console.log('here first');)
//    return "/Users/seanmoran/Documents/Master/2024/Dec2024/databse1.db"
//}
//var pathToDatabase = bootDataBase();
//console.log(pathToDatabase);

//const db = new sqlite(pathToDatabase);
//api.send('checkDataBaseOrLoad', console.log('here first');)


//var db;
exports.db = db;

