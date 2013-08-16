joCache.set("menu", function() {
	var mainMenu = new joMenu([
		{ title: "Settings", id: "settings" },
		{ title: "More", id: "more" },
		{ title: "About", id: "about" }
	]).selectEvent.subscribe(function(id) {
	    var card = joCache.get(id);

		App.stack.push(card);

        if(id=="settings"){
            stopWatch();
            watching = false;
            joDefer(function() {
                card.sensitivitySlider.draw();
            });
        }
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


