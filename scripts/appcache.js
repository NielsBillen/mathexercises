/*global console, confirm*/

/* listen for load */
window.addEventListener("load", function (e) {
    "use strict";
    
    
    var appcache;
    
    appcache = window.applicationCache;
    
    /*
     * Listens whether an update is ready.
     */
    appcache.addEventListener("updateready", function (e) {
        if (appcache.status === appcache.UPDATEREADY) {
            // update available
            if (confirm("A new version of this application is available. Load it?")) {
                window.location.reload();
            }
        }
    });
    
    /*
     * Listens for errors.
     */
    appcache.addEventListener("error", function (e) {
        console.log(e);
    });
    
    if (navigator.online === "true") {
        appcache.update();
    } else {
        console.log("not online!");
    }
});