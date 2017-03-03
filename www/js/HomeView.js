var HomeView = function (openArView) {
	var html;//HomeView html layout

	var arButtonOn = false;	//true if ar button is On

    /**
     * Initialize HomeView
     */
     this.initialize = function() {
		//create html
		html = 	"<div class='view' id='homeView'>" +
					"<div class='app'>" +
						"<h1>MY AR APPLICATION</h1>" +
						"<div class='blink'>" +
							"<p id='openArButton'>START AR</p>" +
						"</div>" +
					"</div>" +
				"</div>";
	};

	/**
    * show HomeView
    */
    this.show = function() {
    	document.body.innerHTML += html;
    	var elem;
    	if( elem = document.getElementById("openArButton") ) {
    		elem.addEventListener("click", openArView );
    	}
    	if( arButtonOn )
    		this.showArButton();
    };

	/**
    * hide HomeView
    */
    this.hide = function() {
    	var elem;
    	if( elem = document.getElementById("openArButton") ) {
    		elem.removeEventListener("click", openArView );
    	}
    	if( elem = document.getElementById("homeView") ) {
    		elem.parentNode.removeChild( elem );
    	}
    };

	/**
    * show arButton
    */
    this.showArButton = function() {
    	document.querySelector("#openArButton").setAttribute('style', 'display:block;');
    	arButtonOn = true;
    };

    this.initialize();
};