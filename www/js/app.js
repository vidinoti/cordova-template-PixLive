// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {
    var currentView = 'Home'; //save current view
    var arView;
    //create homeView
    var homeView = new HomeView(openArView);

    //show homeView
    homeView.show();

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    
    /**
    * on device ready listener
    */
    function onDeviceReady() {

        //create ar View
        arView = new ArView(closeArView);

        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        //show Button to open ArView
        homeView.showArButton();

        //Register progress listener
        arView.addListener('syncProgress',synchProgressListener);

        //Synchronize the app with PixLive Maker https://armanager.vidinoti.com
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.PixLive) {
            // You can pass an array of tags to synchronize with specific tags: synchronize(['test1','test2'])
            cordova.plugins.PixLive.synchronize([], synchSuccessListener, synchErrorListener);
        }
    };

    /**
    * open ArView
    */
    function openArView() {
        //save current view
        currentView = 'ArView';

        homeView.hide();
        setTimeout(function(){//trick to avoid blink
            arView.show();
        }, 10);
    }

    /**
    * close ArView
    */
    function closeArView() {
        //save current view
        currentView = 'Home';
        homeView.show();
        arView.hide();
    }

    /**
    * cordova on pause event listener
    */
    function onPause() {
        //hide arView when app get suspended
        if(currentView == 'ArView')
            arView.hide();
    };

    /**
    * cordova on resume event listener
    */
    function onResume() {
        //show arView when app get resumed
        if(currentView == 'ArView')
            arView.show();
    };

    /**
    * Pixlive synchronization progress listener
    */
    function synchProgressListener(event) {
        console.log("Sychronization progress: " + event.progress*100)
    };

    /**
    * Pixlive synchronization success listener
    */
    function synchSuccessListener(msg) {
        console.log("Synchronization success");
        arView.removeListener('syncProgress',synchProgressListener);
    };

    /**
    * Pixlive synchronization error listener
    */
    function synchErrorListener(err) {
        alert("Synchronization error: " + err);
        arView.removeListener('syncProgress',synchProgressListener);
    };

}());
