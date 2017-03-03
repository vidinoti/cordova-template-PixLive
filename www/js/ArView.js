var ArView = function (closeArView) {
    var arView;
    var html;//ArView html layout

    //function handlers
    var resizeHandler;
    var hideAnnotationsHandler;
    var presentAnnotationsHandler;
    var onCodeRecognizeHandler;

    //event listeners for pixlive events
    var pxlEventListeners = {};

    //Event handler for pixlive events
    var pxlEventHandler = function (event) {
        if (event.type && pxlEventListeners[event.type]) {
            for (var i = pxlEventListeners[event.type].length - 1; i >= 0; i--) {
                pxlEventListeners[event.type][i](event);
            }
        }
    };

    /**
     * Initialize ArView
     */
    this.initialize = function () {

        //register pxlEventHandler
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.PixLive && !window.cordova.plugins.PixLive.onEventReceived) {
            cordova.plugins.PixLive.onEventReceived = pxlEventHandler;
        }

        //initialize function handlers
        resizeHandler = this.onResize.bind(this);
        hideAnnotationsHandler = this.onHideAnnotations.bind(this);
        presentAnnotationsHandler = this.onPresentAnnotations.bind(this);
        onCodeRecognizeHandler = this.onCodeRecognize.bind(this);

        //create html layout
        html = "<div class='arView' id='arView'>" +
            "<div id='arViewLayout' style='position:absolute;top:0;bottom:0;right:0;left:0;padding:0;'>" +
            "<p style='position:absolute;top:10px;left:10px;z-index:99999;' id='closeArViewButton'>" +
            "<img src='img/home.png' width='30px'>" +
            "</p>" +
            "<div class='target'>" +
            "<img style='position:absolute; bottom:0; right:0; z-index:999' src='img/target_corner.png' width='70'>" +
            "<img style='position:absolute; bottom:0; left:0; z-index:999;-webkit-transform:rotate(90deg);' src='img/target_corner.png' width='70'>" +
            "<img style='position:absolute; top:0; left:0;z-index:999;-webkit-transform:rotate(180deg);'src='img/target_corner.png' width='70'>" +
            "<img style='position:absolute; top:0; right:0;z-index:999;-webkit-transform:rotate(-90deg);' src='img/target_corner.png' width='70'>" +
            "</div>" +
            "</div>" +
            "</div>";
    };

    /**
     * Show ArView
     */
    this.show = function () {
        document.body.innerHTML += html;
        document.getElementById("arView").setAttribute('style', 'display:block;');

        //openArView
        if (arView) {
            arView.beforeEnter();
            this.onResize();
            arView.afterEnter();
        } else {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.PixLive) {
                var screenSize = this.getSize();
                arView = cordova.plugins.PixLive.createARView(0, 0, screenSize[0], screenSize[1]);
            }
        }
        arView.disableTouch();
        this.bindEvents();
    };

    /**
     * Hide ArView
     */
    this.hide = function () {
        this.unbindEvents();

        //show homescreen
        //document.getElementById("startScreen").setAttribute('style', 'display:block;');
        var elem;
        if (elem = document.getElementById("arView"))
            elem.parentNode.removeChild( elem );

        if (arView) {
            arView.beforeLeave();
            arView.afterLeave();
        }
    };

    /**
     * Get screen size
     * @return {Array} [screenWidth,screenHeight]
     */
    this.getSize = function () {
        return [document.getElementById('arView').offsetWidth,document.getElementById('arView').offsetHeight];
    }

    /**
     * onResize Event listener
     */
    this.onResize = function () {
        if (arView) {
            var screenSize = this.getSize();
            arView.resize(0, 0, screenSize[0], screenSize[1]);
        }
    };

    /**
     * onPresentAnnotations PixLive Event listener
     * @param {object} event 
     */
    this.onPresentAnnotations = function (event) {
        arView.enableTouch();
        var elem;
        if (elem = document.getElementById("arViewLayout"))
            elem.style.display = 'none';
    };

    /**
     * onHideAnnotations PixLive Event listener
     * @param {object} event 
     */
    this.onHideAnnotations = function (event) {
        arView.disableTouch();
        var elem;
        if (elem = document.getElementById("arViewLayout"))
            elem.style.display = 'block';
    };

    /**
     * onCodeRecognize PixLive Event listener
     * @param {object} event: event.code to access the QR code
     */
    this.onCodeRecognize = function (event) {
        alert("QR code recognized: " + event.code);
    };

	/**
     * Add a new listener for the provided event type. 
     * @param {string} event The event to register for. See the [cordova-plugin-PixLive](https://github.com/vidinoti/cordova-plugin-PixLive) plugin for more info on the event types.
     * @param {function} callback The function to be called when the provided event is generated.
     */
    this.addListener = function (event, callback) {
        if (!pxlEventListeners[event]) {
            pxlEventListeners[event] = [];
        }
        pxlEventListeners[event].push(callback);
    },

    /**
     * Remove an existing listener for the provided event type. 
     * 
     * @param {string} event The event to register for. See the [cordova-plugin-PixLive](https://github.com/vidinoti/cordova-plugin-PixLive) plugin for more info on the event types.
     * @param {function} callback The function that has been passed to the `addListener(event, callback)` method.
     */
    this.removeListener = function (event, callback) {

        if (!pxlEventListeners[event] || pxlEventListeners[event].length == 0) {
            return;
        }

        var index = pxlEventListeners[event].indexOf(callback);

        if (index == -1)
            return;

        pxlEventListeners[event].splice(index, 1);
    }

    /**
     * bindEvents
     */
    this.bindEvents = function () {
        //add listener for the closeArViewButton
        var elem;
        if (elem = document.getElementById("closeArViewButton"))
            elem.addEventListener("click", closeArView);
        //add listener for android backbutton
        document.addEventListener("backbutton", closeArView, false);
        //redraw ArView when resize
        window.addEventListener("resize", resizeHandler, false);

        //bind pixlive events
        this.addListener("hideAnnotations", hideAnnotationsHandler);
        this.addListener("presentAnnotations", presentAnnotationsHandler);
        this.addListener("codeRecognize", onCodeRecognizeHandler);
    };

    /**
     * unbindEvents
     */
    this.unbindEvents = function () {
        //remove listener for the closeArViewButton
        var elem;
        if (elem = document.getElementById("closeArViewButton"))
            elem.removeEventListener("click", closeArView);
        //remove listener for android backbutton
        document.removeEventListener("backbutton", closeArView, false);
        //remove resize listener
        window.removeEventListener("resize", resizeHandler, false);

        //unbind pixlive events
        this.removeListener("hideAnnotations", hideAnnotationsHandler);
        this.removeListener("presentAnnotations", presentAnnotationsHandler);
        this.removeListener("codeRecognize", onCodeRecognizeHandler);
    };

    this.initialize();
}