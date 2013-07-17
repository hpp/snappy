function handleFileSelect(type, file, cb) {
    console.log("handle File Select")

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        gotFS(fs,file,type,cb);
    }, fail);

}

function gotFS(fileSystem, file, type, cb) {
    console.log("got filesystem, file path = " + path + file.name);
    var flags = {create: true, exclusive: true};
    fileSystem.root.getFile("ThumpNSnap/"+file.name, flags, function(fe) {gotFileEntry(fe, file, type, cb);}, fail);
}

function gotFileEntry(fileEntry, file, type, cb) {
    console.log("got fileEntry");
    fileEntry.createWriter(function(w){gotFileWriter(w, file, type, cb);}, fail);
}

function gotFileWriter(fileWriter, file, type, cb) {
    console.log("got fileWriter");
    fileWriter.onwriteend = function(evt){setSoundByUri(type, path + file.name, cb);};
    // var audioSound = new Audio();
    //var audioSound.src = URL.createObjectURL(file, {autoRevoke:false});
    var reader = new FileReader();
    reader.onload = function(event) {
        var rawData = event.target.result;
        fileWriter.write(rawData);
    };
    reader.onerror = function(event){
        alert("error, file could not be read" + event.target.error.code);
    };

    reader.readAsBinaryString(file);
}

function fail(error) {
    //alert("error");
    alert("file handler error " + error.code);
    if (error.code == FileError.PATH_EXISTS_ERR){
        alert("The file already exists.");
    }
}

function findSoundFiles(sType, cb) {
    console.log("find Sound Files");
    if (sType){var sFolder = "thumps";}else{var sFolder = "snaps";}
    sFolder = androidPath + "audio/" + sFolder;
    console.log("sound folder = " + sFolder);


    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
          findSFgotFS(fs,sFolder,cb);
    }, fail);
}

function findSFgotFS(fileSystem, sFolder,cb) {
    console.log("find SF got file System");

    fileSystem.root.getDirectory(sFolder, {create: false, exclusive: false}, function(dirEntry){
        findSFgotDir(dirEntry, cb)
    }, fail);
}

function findSFgotDir(dirEntry, cb) {
    console.log("find SF got Directory Entry");

    var dirReader = dirEntry.createReader();
    dirReader.readEntries(function(e){findSFdirEntries(e,cb);}, fail);
}

function findSFdirEntries(entries,cb){
    console.log("find SF directory entries");

    var i;
    var soundFiles = [];
    for (i=0; i<entries.length; i++) {
        soundFiles.push(entries[i].name);
    }
    cb(soundFiles);
}
