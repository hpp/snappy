/**
 * This code is provided by Joe M Walter. It is for use with Thump N Snap.
 * 
 */
var pos_left = false, pos_back = false;
var watching = false;
var autoReset = false;
var tempo = 0;
var soundDBIdx = [ null, null];
var toggleImgReady = [ 1, 1];
var isThumpy = 1, isSnappy = 0, t = 1, s = 0;
var currentCard = "Main";

window.URL = window.URL || window.webkitURL;

var d = new Date();
var n = d.getTime();
var set = false;

// The watch id references the current `watchAcceleration`
var watchID = null;
// media variables
var numberOfSnaps = 4;
var thumpyMedia = new Array(numberOfSnaps);
var snappyMedia = new Array(numberOfSnaps);

var resetBeat = true;
var androidPath = "file:///android_asset/www/"; //this is only android, overright this
var soundFolder = ["audio/snaps/","audio/thumps/"];
var path = "";
var thumpyURI = "file:///android_asset/www/808bd2.mp3";
var snappyURI = "file:///android_asset/www/chut_sd.mp3";


// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("pause", stopWatch(), false);
document.addEventListener("resume", startWatch(), false); //only play if currentCard == Main

// Cordova is ready
//
function onDeviceReady() {
    console.log("device ready");
    setPath();

	//storage = window.localStorage;
	tempo = Number(window.localStorage.getItem("tempo"));
	autoReset = window.localStorage.getItem("autoReset");
	if (autoReset === 'true'|| autoReset === true){
	    autoReset = true;
	}else{ autoReset = false;}

	soundDBIdx[t] = Number(window.localStorage.getItem("thumpDBIdx"));
	soundDBIdx[s] = Number(window.localStorage.getItem("snapDBIdx"));

    console.log("autoReset="+autoReset+" tempo="+tempo+"thumpIdx="+soundDBIdx[t]+" snapDBIdx="+soundDBIdx[s]);
	if(autoReset==null||typeof autoReset != 'boolean'){
		autoReset = false;
		localStorage.setItem("autoReset",autoReset);
	}
	if(tempo==null||tempo==0){
		tempo=Math.floor(60000/(120*32)); //120 bpm => msp 16th beats (32nd for reset)
		localStorage.setItem("tempo", tempo);
	}
	//console.log("k");
	if(soundDBIdx[t]==null||soundDBIdx[t]==0){
		soundDBIdx[t]=1;
		localStorage.setItem("thumpDBIdx", soundDBIdx[t]);
	}
	//console.log("k");

	if(soundDBIdx[s]==null||soundDBIdx[s]==0){
		soundDBIdx[s]=2;
		localStorage.setItem("snapDBIdx", soundDBIdx[s]);
	}
	//console.log("k");

	console.log("autoReset="+autoReset+" tempo="+tempo+"thumpIdx="+soundDBIdx[t]+" snapDBIdx="+soundDBIdx[s]);
	dbInit(getSoundCB);

	//alert("ok");
	//snappyURI = path + getSoundDBUri(snapDBIdx);
	//alert("dbInit onto");
	
	//alert("made it to device ready");
	//thumpyMedia1 = new Media(thumpyURI, onMediaSuccess, onMediaError);
	//thumpyMedia2 = new Media(thumpyURI, onMediaSuccess, onMediaError);
	//snappyMedia1 = new Media(snappyURI, onMediaSuccess, onMediaError);
	//snappyMedia2 = new Media(snappyURI, onMediaSuccess, onMediaError);

    //var db = window.openDatabase("thumpy_db", "1.0", "Thumpy Sounds", 1000000);
    //var db = window.openDatabase("snappy_db", "1.0", "Snappy Sounds", 1000000);
}

function getSoundCB() {
    console.log("wrote to db");
    getSoundDBUri(soundDBIdx[t], gotSoundUriCB);
    getSoundDBUri(soundDBIdx[s], function(sType,fName){
        gotSoundUriCB(sType,fName,function(){
        console.log("watching="+watching);
        currentCard = "Main";
        if (watching==true){startWatch(currentCard);}
        loadSounds();
        });
    });
}

function getPhoneGapPath() {

    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path;

};

var snd = new Media( getPhoneGapPath() + 'test.wav' );

function gotSoundUriCB(soundType, fileName, cb){
    console.log("Got Sound file " + fileName + "; type = " + soundType);
    if (soundType == isSnappy) {
        snappyURI = getPhoneGapPath() + soundFolder[s] + fileName; //androidPath + soundFolder[s] + fileName;
        console.log("snap sound = " + snappyURI);
        //alert(snappyURI);
        snappyMedia =loadMedia(snappyURI, snappyMedia);
        //snappyMedia1 = new Media(snappyURI, onMediaSuccess, onMediaError);
        //snappyMedia2 = new Media(snappyURI, onMediaSuccess, onMediaError);
    } else if (soundType == isThumpy) {
        thumpyURI = getPhoneGapPath() + soundFolder[t] + fileName;
        console.log("thump sound = " + thumpyURI);
        //alert(thumpyURI);
        thumpyMedia = loadMedia(thumpyURI,thumpyMedia);
        //thumpyMedia1 = new Media(thumpyURI, onMediaSuccess, onMediaError);
        //thumpyMedia2 = new Media(thumpyURI, onMediaSuccess, onMediaError);
    }
    if(cb){
        cb();
    }
}

function loadMedia(URI, MediaArray) {
    for (i=0;i<MediaArray.length;i++){
        MediaArray[i]=new Media(URI, onMediaSuccess, onMediaError);
    }
    return MediaArray;
}

function setPath(){
    console.log("setting path");
    function fail(error){alert("failed to set path " + error.code)}

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
    function onFileSystemSuccess(fileSystem) {
        fileSystem.root.getFile("dummy.html", {create: true, exclusive: false},
        function gotFileEntry(fileEntry) {
            path = fileEntry.fullPath.replace("dummy.html","ThumpNSnap/");
            fileEntry.remove();
            fileSystem.root.getDirectory("ThumpNSnap", {create: true, exclusive: false},
            function gotDirectoryEntry(dirEntry){
                console.log("found storage directory" + dirEntry.fullPath);
            }, fail);
        }, fail);
    }, fail);
};

// Start watching the acceleration
//
function startWatch() {
	//alert("made it to accel watch started!");
    // Update acceleration every 3 seconds
	//var tempo =  window.localStorage.getItem("tempo");
	//if (thisCard!=currentCard){return;}
	//currentCard=="Main";

	console.log("tempo="+tempo+"mspb")
	if(typeof tempo != "number"){
		alert("tempo is not a Number, tempo is a " + typeof tempo);
	}
    var options = { frequency: tempo};
    if(!watchID && watching==true){
        watchID = navigator.accelerometer.watchAcceleration(onAccelSuccess, onAccelError, options);
    }
}


// Stop watching the acceleration
//


function stopWatch() {
    console.log("stop watch, watch id = " + watchID);
    if (watchID) {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
    //currentCard = thisCard;
}

// onSuccess: Get a snapshot of the current acceleration
//
function onAccelSuccess(acceleration) {
    //var autoReset = window.localStorage.getItem("autoReset");
    //console.log("autoReset="+autoReset+" from Accel");
    try {
        if (autoReset==true||autoReset=="true"){
            advancedAutoReset(acceleration);
            return;
        } else {
            normalAutoReset(acceleration);
        }
    } catch(e) {
        if(watching==false){stopWatch();}
        console.log("error handling acceleration, " + e.message);
    }
}

function normalAutoReset(acceleration){
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
 				thumpyMedia[0].getCurrentPosition(onThumpyUpdate);
 				document.getElementById("thumpy_img").src="thumpy_stomp.png";
 			} else {
 				snappyMedia[0].getCurrentPosition(onSnappyUpdate);
 				document.getElementById("snappy_img").src="snappy_snap.png";
 			}
 			resetBeat=false;
 		}
 	}
}

function toggleImg(sType){
    console.log("toggle image type = " + sType + ", toggleImgReady = " + toggleImgReady);
    if (sType == isSnappy){
        if (toggleImgReady[t]!=0){
            document.getElementById("snappy_img").src="snappy_snap.png";
            toggleImgReady[t] = 0;
        } else {
            document.getElementById("snappy_img").src="snappy_ready.png";
            toggleImgReady[t] = 1;
        }
    } else {
        if (toggleImgReady[s]!=0){
            document.getElementById("thumpy_img").src="thumpy_stomp.png";
            toggleImgReady[s] = 0;
        } else {
            document.getElementById("thumpy_img").src="thumpy_ready.png";
            toggleImgReady[s] = 1;
        }
    }
}

function advancedAutoReset(a){
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
	thumpyMedia[0].getCurrentPosition(onThumpyUpdate);
	toggleImg(isThumpy);
	pos_left = true;
	pos_back = true;
}

function leftFront(){
	if (pos_left==true && pos_back!=true) {return;}
	snappyMedia[0].getCurrentPosition(onSnappyUpdate);
	toggleImg(isSnappy);
	pos_left = true;
	pos_back = false;
}

function rightBack(){
	if (pos_left!=true && pos_back==true) {return;}
	thumpyMedia[0].getCurrentPosition(onThumpyUpdate);
	toggleImg(isThumpy);
	pos_left = false;
	pos_back = true;
}

function rightFront(){
	if (pos_left!=true && pos_back!=true) {return;}
	snappyMedia[0].getCurrentPosition(onSnappyUpdate);
	toggleImg(isSnappy);
	pos_left = false;
	pos_back = false;
}



function onThumpyUpdate(pos, iter){
    if (!iter) {iter = 0;}
	//console.log("thump1=" + pos + " thump2=" + media1 + " thump2=" + media2);
	if (pos>0 && pos<thumpyMedia[iter].getDuration()){
		if (iter+1>=thumpyMedia.length){return;}
		thumpyMedia[iter+1].getCurrentPosition(function(p){onThumpyUpdate(p,iter+1)});
		//thumpyMedia[iter+1].play();
		//console.log("thump 2" + pos + " Duration=" + media1.getDuration());
	} else {
		thumpyMedia[iter].play();
		//console.log("thump 1" + pos + " Duration=" + media1.getDuration());
	}
	navigator.notification.vibrate(80);
}

function onSnappyUpdate(pos, iter){
    if (!iter) {iter = 0;}
	//console.log("thump1=" + pos + " thump2=" + media1 + " thump2=" + media2);
	if (pos>0 && pos<snappyMedia[iter].getDuration()){
		if (iter+1>=snappyMedia.length){return;}
        snappyMedia[iter+1].getCurrentPosition(function(p){onSnappyUpdate(p,iter+1)});
        //snappyMedia2.play();
		//console.log("thump 2" + pos + " Duration=" + media1.getDuration());
	} else {
		snappyMedia[iter].play();
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
    //navigator.notification.vibrate(40);
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

