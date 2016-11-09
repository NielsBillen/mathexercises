/*global console, confirm*/
/*var cache = (function () {
    "use strict";
    
    window.addEventListener("load", function (e) {
        
    });
    
    var my, appcache;
    
    my = {};
    appcache = window.applicationCache;
    
    my.update = function () {
        // update the cache
        appcache.update();
    };
    
    return my;
}());*/

/* listen for load */
window.addEventListener("load", function (e) {
    "use strict";
    
    
    var appcache = window.applicationCache;
    
    appcache.addEventListener("updateready", function (e) {
        if (appcache.status === appcache.UPDATEREADY) {
            // update available
            if (confirm("A new version of this application is available. Load it?")) {
                window.location.reload();
            }
        }
    });
    
    appcache.update();
});