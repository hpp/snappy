joCache.set("settings", function() {
	//turn off the snaps


	console.log("entering Settings Card");

    console.log("type of autoRest = " + typeof autoReset + ", autoReset = " + autoReset);
	var autoResetToggle = new joToggle(autoReset);
	autoResetToggle.select();
	autoResetToggle.select();
	autoResetToggle.changeEvent.subscribe(toggleAutoRest);
	function toggleAutoRest(){
		autoReset = !autoReset;
		localStorage.setItem("autoReset",autoReset);
		console.log("auto reset changed to " + autoReset);
	}
		
	var autoResetControl = new joFlexrow([
		new joLabel("Advanced Mode (auto reset)").setStyle("left"),
		autoResetToggle
	]);
	var tapTempo = new joButton("Tap Tempo").setStyle({id: "tap_tempo"}).selectEvent.subscribe(tapButtonSelected);
	function tapButtonSelected() {
		joFocus.clear();
		tap();
	}

    console.log("sensitivity = " + sensitivity);
	var sensitivitySlider = new joSlider(sensitivity);
	sensitivitySlider.setRange(0, 5, 0.5);
	sensitivitySlider.changeEvent.subscribe(sensitivitySliderChange, this);
	function sensitivitySliderChange(v) {
        sensitivity = v;
        localStorage.setItem("sensitivity",sensitivity);
        document.getElementById("sensitivity").innerHTML = "Sensitivity - " + sensitivity;
	}

	var sensitivitySliderGroup = new joGroup([
	    new joLabel("Sensitivity = " + sensitivity).setStyle({id: "sensitivity"}),
        sensitivitySlider
	]);//*/
/*
    //After you setup your control and it will reposition the thumb appropriately.  A trick I used to make it look less abrupt was to add a quick CSS animation to it.  Here's the CSS:
    joDefer(function() {
      sensitivitySlider.draw();
    });

   // And the function I call:
/*
    function animate(o) {
      joDOM.addCSSClass(o, "animate");
      joDefer(function() {joDOM.removeCSSClass(o, "animate");});
    }

    //Just add that function call right before joSlider and the thumb will slide into position:

    joDefer(function() {
      animate(sensitivitySlider);
      sensitivitySlider.draw();
    });//*/

	
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
		    //Play sound
            var tempMedia = new Media(androidPath + soundFolder[type] + fileName);
            tempMedia.play();

			//check if changed
			if (soundOptionsIdx[type][value] != soundDBIdx[type]){
				//update thumpDBIdx
				soundDBIdx[type] = soundOptionsIdx[type][value];
				if (type==isThumpy){
				    localStorage.setItem("thumpDBIdx", soundDBIdx[type]);
				} else {
				    localStorage.setItem("snapDBIdx", soundDBIdx[type]);
				}
				//update sound file
				gotSoundUriCB(type, fileName)
			}		
		}
	
	}

	function addSoundToSoundMenu(type, fileName, idx){
	    console.log("add sound to sound menu. type = " + type + ", file = " + fileName + ", idx = " + idx);
		soundOptionsAdd(type, fileName);
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
		watching = true;
		startWatch();
	}

	console.log("Got Settings Card")
	var card = new joCard([
		new joTitle("Thump N Snap - Settings"),
		new joGroup([
			autoResetControl,
			tempoHTML,
			tapTempo,
			sensitivitySliderGroup,
			thumpySoundLabel,
			thumpyFileBox,
			snappySoundLabel,
			snappyFileBox,
		]),
		backButton,
		invisibleHTML
	]);

    card.sensitivitySlider = sensitivitySlider;

    return card;
});



