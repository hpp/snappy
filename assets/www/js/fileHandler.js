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
    alert("error " + error.code);
    if (error.code == FileError.PATH_EXISTS_ERR){
        alert("The file already exists.");
    }
}




