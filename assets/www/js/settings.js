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
	var tempoHTML = new joHTML("<p id='tempo'>Tempo = " + tempo + "</p>");
	
	var thumpySoundLabel = new joLabel("Thumpy Sound File");
	var thumpyFileBox = new joHTML("<input type='file' value='file:///android_asset/www/808bd2.mp3' name='thumpy_sound'>");

	var snappySoundLabel = new joLabel("Snappy Sound File");
	var snappyFileBox = new joHTML("<input type='file' value='file:///android_asset/www/808bd2.mp3' name='snappy_sound'>");
	
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
			snappyFileBox
		]),
		backButton
	]);
	
	return card;
});



