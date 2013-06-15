App = {
	load: function() {
	
		// initialize jo
		jo.load();

		/*
		*/
		
		var menuButton = new joButton("Menu").selectEvent.subscribe(function() {
				App.screen.showPopup(joCache.get("menu"));	
		});

		// create our view card, notice we're nesting widgets inline
		var card = new joCard([
			new joTitle("Thump N Snap"),
			menuButton,
			new joDivider(),
			new joHTML('<div style="float: center; width: 100%;"><div id="thumpy" style="float: left; width: 50%;"><img id="thumpy_img" src="thumpy.png" width="150" height="203" style="float: right;"/></div><div id="snappy" style="float: right; width: 50%;"><img id="snappy_img" src="snappy.png" width="150" height="203" style="float: left;"/></div></div>')
		]);

		// setup our stack and screen
		this.stack = new joStack();
		this.screen = new joScreen(this.stack);

		// put the card on our view stack
		this.stack.push(card);
	}
};


