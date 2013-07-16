//var db = null;

function dbInit(onSuccessCB) {
    console.log("initiallizing db");
	var db = window.openDatabase("SoundDB", "1.0", "SoundDB", 32*1024*1024);
	db.transaction(populateDB, errorCB, onSuccessCB);
	//alert("dbInit out");

}

function populateDB(tx) {
	console.log("populating DB");
	tx.executeSql('DROP TABLE IF EXISTS Sound');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Sound (id INTEGER PRIMARY KEY, isThump INTEGER, name TEXT)');
	tx.executeSql("insert or replace into Sound (id, isThump, name) values (1, 1, '" + androidPath + "808bd2.mp3')");
	tx.executeSql("insert or replace into Sound (id, isThump, name) VALUES (2, 0, '" + androidPath + "chut_sd.mp3')");
    //tx.executeSql("INSERT INTO Sound (id, isThump, name) VALUES (1, 1, '808bd2.mp3')");
    //tx.executeSql('select * from Sound where id=1');

}

function errorCB(err) {
    alert("Error processing SQL: Error Code "+err.code);
}

function errorQueryCB(err) {
    alert("Error processing SQL Query: Error Code "+err.code);
}

function successCB() {
    //alert("successfully grabbed sound from DB!");
}

function getSoundDBUri(idx, cb) {
	var sqlCmd = "SELECT * FROM Sound WHERE id="+idx;
	console.log("Getting Sound from DB at Index "+idx);

	var db = window.openDatabase("SoundDB", "1.0", "SoundDB", 32*1024*1024);
	//db.transaction(qDB, errorCB, successCB);
	//db.transaction({
	//	onQueryDB: function(tx) {
	//		queryDB(tx,sqlCmd,cb);
	//	}
	//}, errorCB, successCB);
	
	db.transaction(function(tx) {
		queryDB(tx,sqlCmd,cb,queryIdxSuccess);
	}, errorCB, successCB);

}

function getSoundOptions(type, cb){
	var sqlCmd = "SELECT * FROM Sound WHERE isThump="+type;
	var db = window.openDatabase("SoundDB", "1.0", "SoundDB", 32*1024*1024);
	db.transaction(function(tx) {
		queryDB(tx,sqlCmd,cb,querySoundOptionsSuccess);
	}, errorCB, successCB);
}

function qDB(tx){
	//alert("transact");
	tx.executeSql("SELECT * FROM Sound", [], rqDB, errorCB);
}

function rqDB(tx, results) {
	//alert(" rows length = " + results.rows.length); 
	for (i=0;i<results.rows.length;i++){
		alert("row " + i + " id = " + results.rows.item(i).id);
	}
}



function queryDB(tx, sqlCmd, cb, successCB) {
    console.log('query db = ' + sqlCmd);
    tx.executeSql(sqlCmd, [], function(tx, results) { 
			successCB(tx,results,cb);
	}, errorQueryCB);
}

function queryIdxSuccess(tx, results, resultsCB) {
	var fileName = results.rows.item(0).name;
	var soundType = results.rows.item(0).isThump;
	//alert('query success! name = ' + fileName + "; isThump = " + soundType);
    console.log("Returned rows = " + results.rows.length);
    
    // this will be true since it was a select statement and so rowsAffected was 0
    if (!results.rowsAffected) {
        console.log('No rows affected!');
        resultsCB("default thump goes here"); //the default thump sound
    }
    
    resultsCB(soundType, fileName);   
}

function querySoundOptionsSuccess(tx, results, resultsCB){
	//alert('plow');
	var len = results.rows.length;
	var soundNameArray = [], soundIdxArray = [];
	for (i=0;i<len;i++){
		soundNameArray.push(results.rows.item(i).name);
		soundIdxArray.push(results.rows.item(i).id);
	}
	resultsCB(soundNameArray, soundIdxArray);
}

function setSoundByUri(type, name, cb){
    var sqlCmd = "insert into Sound values (NULL, "+type+", '"+name+"')";
    var db = window.openDatabase("SoundDB", "1.0", "SoundDB", 32*1024*1024);
    db.transaction(function(tx) {
    	insertDB(tx,sqlCmd,type,name,cb);
    }, insertError, successCB);
}

function insertDB(tx, sqlCmd, type, name, cb) {
    console.log("insert SQL cmd = " + sqlCmd);
    tx.executeSql(sqlCmd, [], function(tx,results) {
        insertSuccess(type,name,results.insertId,cb);
    }, insertError);
}

function insertSuccess(type,fileName,idx,cb) {
    console.log("insertSuccess");
    //var idx = sqlite3_last_insert_rowid(db);
    console.log("inserted " + fileName + " into DB at idx " + idx);
    cb(type, fileName, idx);
    gotSoundUriCB(type, fileName);
}

function insertError(Err) {
    alert("Warning, unable to inserted into DB" + Err.code);
}