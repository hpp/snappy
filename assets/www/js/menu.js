joCache.set("menu", function() {
	var mainMenu = new joMenu([
		{ title: "Settings", id: "settings" },
		{ title: "More", id: "more" },
		{ title: "About", id: "about" }
	]).selectEvent.subscribe(function(id) {
		App.stack.push(joCache.get(id));
		pop();
	});
	
	var backButton = new joButton("Back");
	backButton.selectEvent.subscribe(pop)
	function pop(){
		App.screen.hidePopup();
	}
	
	var card = new joCard([
		new joTitle("Menu"),
		mainMenu,
		backButton
	]);
	
	return card;
});


