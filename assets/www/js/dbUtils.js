//var db = null;

function dbInit(onSuccessCB) {
    //alert("dbInit");
	var db = window.openDatabase("SoundDB", "1.0", "SoundDB", 32*1024*1024);
	db.transaction(populateDB, errorCB, onSuccessCB);
	//alert("dbInit out");

}

function populateDB(tx) {
	//tx.executeSql('DROP TABLE IF EXISTS Sound');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Sound (id INTEGER PRIMARY KEY, isThump INTEGER, name TEXT)');
	tx.executeSql("insert or replace into sound (id, isThump, name) values (1, 1, '808bd2.mp3')");
	tx.executeSql("insert or replace into sound (id, isThump, name) VALUES (2, 0, 'chut_sd.mp3')");
    //tx.executeSql("INSERT INTO Sound (id, isThump, name) VALUES (1, 1, '808bd2.mp3')");
    //tx.executeSql('select * from Sound where id=1');

}

function errorCB(err) {
    //alert("Error processing SQL: Error Code "+err.code);
}

function successCB() {
    //alert("successfully grabbed sound from DB!");
}

function getSoundDBUri(idx, cb) {
	var sqlCmd = "SELECT * FROM Sound WHERE id="+idx;
	//alert(sqlCmd);

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

function getSoundOptions(isThumpy, cb){
	var sqlCmd = "SELECT * FROM Sound WHERE isThump="+isThumpy;
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
    //alert('query db' + sqlCmd);
    tx.executeSql(sqlCmd, [], function(tx, results) { 
			successCB(tx,results,cb);
	}, errorCB);
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
	var len = results.rows.length;
	var soundNameArray = [], soundIdxArray = [];
	for (i=0;i<len;i++){
		soundNameArray.push(results.rows.item(i).name);
		soundIdxArray.push(results.rows.item(i).id);
	}
	resultsCB(soundNameArray, soundIdxArray);
}
