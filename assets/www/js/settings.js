joCache.set("settings", function() {
	//turn off the snaps
	stopWatch();
	
	var autoResetToggle = new joToggle(autoReset).changeEvent.subscribe(toggleAutoRest);
	function toggleAutoRest(){
		autoReset = !autoReset;	
		console.log(autoReset);	
	}
		
	var autoResetControl = new joFlexrow([
		new joLabel("Auto Reset").setStyle("left"),
		autoResetToggle
	]);
	var tapTempo = new joButton("Tap Tempo").setStyle({id: "tap_tempo"}).selectEvent.subscribe(tapButtonSelected);
	function tapButtonSelected() {
		joFocus.clear();
		tap();
	}
	
	var tempoText = "Tempo = "+ Math.floor((60000/(tempo *32)))+"bpm";
	var tempoHTML = new joHTML("<p id='tempo'>" + tempoText + "</p>");
	
	
	
	//************************	
	var thumpySoundLabel = new joLabel("Thumpy Sound File");
	//var thumpyFileBox = new joHTML("<input type='file' value='file:///android_asset/www/808bd2.mp3' name='thumpy_sound'>");
	
	var thumpyFileBox = new joSelect(soundOptions[t], soundOptionsIdx[t].indexOf(soundDBIdx[t]));
	thumpyFileBox.selectEvent.subscribe( function(v) {
		changeSound(v,t);
	});
	
	function changeSound(value,type){
		fileName = soundOptions[type][value];
		//alert(fileName);
	
		if (fileName == "Download"){
			//goto website to download free drum kick sounds
			if (type == isThumpy){
				App.stack.push(joCache.get("thumpSound"));
			} else {
				App.stack.push(joCache.get("snapSound"));
			}
			
		} else if (fileName == "Browse"){
			//browse file system, move selected file to local dir
			//alert("Browse");
			//var newFileEvent = new customEvent('build',{'sType':type});
			var soundInput = document.getElementById('soundInput');
			soundInput.addEventListener('change', function(){
			    //alert("changed");
			    handleFileSelect(type, this.files[0], addSoundToSoundMenu);
			}, false);
			//soundInput.addEventListener('build', handleFileSelect, false);
			soundInput.click();
			//soundInput.dispatchEvent(newFileEvent);

		} else {
			//check if changed
			if (soundOptionsIdx[type][value] != soundDBIdx[type]){
				//update thumpDBIdx
				soundDBIdx[type] = soundOptionsIdx[type][value];
				//update sound file
				gotSoundUriCB(type, fileName)
			}		
		}
	
	}

	function addSoundToSoundMenu(type, fileName, idx){
	    console.log("add sound to sound menu. type = " + type + ", file = " + fileName + ", idx = " + idx);
		soundOptionsAdd(fileName);
		soundOptionsIdx[type].push(idx);
		soundDBIdx[type]=idx;
	    if (type == isThumpy){
	        thumpyFileBox = new joSelect(soundOptions[type], soundOptionsIdx[type].indexOf(soundDBIdx[type]));
	       	thumpyFileBox.selectEvent.subscribe( function(v) {
				changeSound(v,t);
			});
	    } else {
	    	snappyFileBox = new joSelect(soundOptions[type], soundOptionsIdx[type].indexOf(soundDBIdx[type]));
	       	snappyFileBox.selectEvent.subscribe( function(v) {
				changeSound(v,s);
			});
	    }
	}
	
	var invisibleHTML = new joControl('<input style="opacity:0;" type="file" name="soundInput" id="soundInput"/>');
	invisibleHTML.changeEvent.subscribe(handleFileSelect);

	//************************
	var snappySoundLabel = new joLabel("Snappy Sound File");
	//var snappyFileBox = new joHTML("<input type='file' value='file:///android_asset/www/808bd2.mp3' name='snappy_sound'>");
		
	var snappyFileBox = new joSelect(soundOptions[s], soundOptionsIdx[s].indexOf(soundDBIdx[s]));
	snappyFileBox.selectEvent.subscribe( function(v) {
		changeSound(v,s);
	});
		
	var backButton = new joButton("Back");
	backButton.selectEvent.subscribe(goBack)
	function goBack(){
		App.stack.pop();
		//turn on the snaps
		startWatch();
	}
	
	var card = new joCard([
		new joTitle("Thump N Snap - Settings"),
		new joGroup([
			autoResetControl,
			tempoHTML,
			tapTempo,
			thumpySoundLabel,
			thumpyFileBox,
			snappySoundLabel,
			snappyFileBox,
		]),
		backButton,
		invisibleHTML
	]);
	
	
	return card;
});



