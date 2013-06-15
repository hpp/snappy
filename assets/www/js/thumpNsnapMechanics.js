/**
 * This code is provided by Joe M Walter. It is for use with Thump N Snap.
 * 
 */
<<<<<<< HEAD
=======



>>>>>>> 8a52b2783c5e7ce1a0bbdd97b2ee0171f593c862
var pos_left = false, pos_back = false;
var watching = false;
var autoReset = null;
var tempo = null;

var d = new Date();
var n = d.getTime();
var set = false;

<<<<<<< HEAD
=======

>>>>>>> 8a52b2783c5e7ce1a0bbdd97b2ee0171f593c862
// The watch id references the current `watchAcceleration`
var watchID = null;
// media variables
var thumpyMedia1 = null;
var thumpyMedia2 = null;
var snappyMedia1 = null;
var snappyMedia2 = null;
var resetBeat = true;
var thumpyURI = "file:///android_asset/www/808bd2.mp3";
var snappyURI = "file:///android_asset/www/chut_sd.mp3";


// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("pause", stopWatch, false);
document.addEventListener("resume", startWatch, false);

// Cordova is ready
//
function onDeviceReady() {
	//storage = window.localStorage;
	tempo = Number(window.localStorage.getItem("tempo"));
	autoReset = window.localStorage.getItem("autoReset");
	if(!autoReset){
		autoReset = false;
		localStorage.setItem("autoReset",autoReset);
	}
	if(!tempo){
		tempo=Math.floor(120*1000/32/60);
		localStorage.setItem("tempo", tempo);
	}
	//console.log("autoReset="+autoReset);
	
	//alert("made it to device ready");
	thumpyMedia1 = new Media(thumpyURI, onMediaSuccess, onMediaError);
	thumpyMedia2 = new Media(thumpyURI, onMediaSuccess, onMediaError);
	snappyMedia1 = new Media(snappyURI, onMediaSuccess, onMediaError);
	snappyMedia2 = new Media(snappyURI, onMediaSuccess, onMediaError);
	console.log("watching="+watching);
    if (watching) {startWatch();}
    var db = window.openDatabase("thumpy_db", "1.0", "Thumpy Sounds", 1000000);
    var db = window.openDatabase("snappy_db", "1.0", "Snappy Sounds", 1000000);
}

// Start watching the acceleration
//
function startWatch() {
	//alert("made it to accel watch started!");
    // Update acceleration every 3 seconds
	//var tempo =  window.localStorage.getItem("tempo");
	console.log("tempo="+tempo+"mspb")
	if(typeof tempo != "number"){
		alert("tempo is not a Number, tempo is a " + typeof tempo);
	}
    var options = { frequency: tempo};

    watchID = navigator.accelerometer.watchAcceleration(onAccelSuccess, onAccelError, options);
}


// Stop watching the acceleration
//
function stopWatch() {
    if (watchID) {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
}

// onSuccess: Get a snapshot of the current acceleration
//
function onAccelSuccess(acceleration) {
	//var autoReset = window.localStorage.getItem("autoReset");
	//console.log("autoReset="+autoReset+" from Accel");
 	if (autoReset==true||autoReset=="true"){
 		onAutoReset(acceleration);
 		return;
 	} 
	 
 	//console.log("autoResetfalse="+autoReset);
 	if (acceleration.x<-0.5){
 		resetBeat = true;
 		if (acceleration.z<0){
			document.getElementById("thumpy_img").src="thumpy_ready.png";
			document.getElementById("snappy_img").src="snappy.png";
		} else {
			document.getElementById("snappy_img").src="snappy_ready.png";
			document.getElementById("thumpy_img").src="thumpy.png";
		}
 	} else if (acceleration.x>0.5) {
 		if (resetBeat==true){
 			if (acceleration.z<0){
 				thumpyMedia1.getCurrentPosition(onThumpyUpdate);
 				document.getElementById("thumpy_img").src="thumpy_stomp.png";
 			} else {
 				snappyMedia1.getCurrentPosition(onSnappyUpdate);
 				document.getElementById("snappy_img").src="snappy_snap.png";
 			}
 			resetBeat=false;
 		}
 	}  
}

function onAutoReset(a){
	//alert("made it to onAutoReset");
	if (a.x<-0.5){
		if (a.z<-0.5){
			leftBack();			
		} else if (a.z>0.5){
			leftFront();
		}
	} else if (a.x>0.5){
		if (a.z<-0.5){
			rightBack();
		} else if (a.z>0.5){
			rightFront();
		}
	}
}

function leftBack(){
	if (pos_left==true && pos_back==true) {return;}
	thumpyMedia1.getCurrentPosition(onThumpyUpdate);
	pos_left = true;
	pos_back = true;
}

function leftFront(){
	if (pos_left==true && pos_back!=true) {return;}
	snappyMedia1.getCurrentPosition(onSnappyUpdate);
	pos_left = true;
	pos_back = false;
}

function rightBack(){
	if (pos_left!=true && pos_back==true) {return;}
	thumpyMedia1.getCurrentPosition(onThumpyUpdate);
	pos_left = false;
	pos_back = true;
}

function rightFront(){
	if (pos_left!=true && pos_back!=true) {return;}
	snappyMedia1.getCurrentPosition(onSnappyUpdate);
	pos_left = false;
	pos_back = false;
}



function onThumpyUpdate(pos){
	//console.log("thump1=" + pos + " thump2=" + media1 + " thump2=" + media2);
	if (pos>0 && pos<thumpyMedia1.getDuration()){
		thumpyMedia2.play();
		//console.log("thump 2" + pos + " Duration=" + media1.getDuration());
	} else {
		thumpyMedia1.play();
		//console.log("thump 1" + pos + " Duration=" + media1.getDuration());
	}
	navigator.notification.vibrate(80);
}

function onSnappyUpdate(pos){
	//console.log("thump1=" + pos + " thump2=" + media1 + " thump2=" + media2);
	if (pos>0 && pos<snappyMedia1.getDuration()){
		snappyMedia2.play();
		//console.log("thump 2" + pos + " Duration=" + media1.getDuration());
	} else {
		snappyMedia1.play();
		//console.log("thump 1" + pos + " Duration=" + media1.getDuration());
	}
	navigator.notification.vibrate(40);
}

// onError: Failed to get the acceleration
//
function onAccelError() {
    alert('onError!');
}


// onSuccess Callback
//
function onMediaSuccess() {
    console.log("playAudio():Audio Success");
}


// onError Callback 
//
function onMediaError(error) {
    alert('code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}

function tap(){
	d = new Date();
	if(set!=true){
		n = d.getTime();
		document.getElementById("tap_tempo").innerHTML = "__stop__";
		set = true;
	} else {
		var tempo  =  Math.floor((d.getTime()-n)/32);
		document.getElementById("tempo").innerHTML = "tempo = "+ Math.floor((60000/(tempo *32)))+"bpm";
		document.getElementById("tap_tempo").innerHTML = "Tap Tempo";
		window.localStorage.setItem("tempo",tempo);
		set = false;
	}

}

function checkAutoReset(){
	return autoReset;
}

function onExit(){
	thumpyMedia1.release();
	thumpyMedia2.release();
	snappyMedia1.release();
	snappyMedia2.release();
	alert("Thanks for playing")
}

