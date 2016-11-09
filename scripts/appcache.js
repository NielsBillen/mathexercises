/*global console, confirm*/

/* listen for load */
window.addEventListener("load", function (loadEvent) {
    "use strict";
    
    
    var appcache, version, versionNumber, setVersionNumber;
    
    appcache = window.applicationCache;
    version = document.getElementById("version");
    versionNumber = "v0.2.3.2";
    
    /*
     * Listens whether an update is ready.
     */
    appcache.addEventListener("updateready", function (e) {
        console.log(e);
        
        if (appcache.status === appcache.UPDATEREADY) {
            // update available
            if (confirm("A new version of this application is available. Load it?")) {
                window.location.reload();
            }
        }
    });
    
    appcache.addEventListener("checking", function (e) {
        console.log("checking for update!");
        console.log(e);
        version.innerHTML = "zoeken naar updates...";
    });
    
    appcache.addEventListener("noupdate", function (e) {
        console.log("no update available!");
        version.innerHTML = "geen updates beschikbaar";
        setVersionNumber(1000);
    });
    
    appcache.addEventListener("downloading", function (e) {
        console.log(e);
        version.innerHTML = "update downloaden...";
    });
    
    appcache.addEventListener("progress", function (e) {
        console.log(e);
        version.innerHTML = "downloaded " + e.loaded + " / " + e.total;
    });
    
    /*
     * Listens for errors.
     */
    appcache.addEventListener("error", function (e) {
        console.log(e);
        version.innerHTML = "fout tijdens update...";
        setVersionNumber(1000);
    });
    
    setVersionNumber = function (timeout) {
        if (timeout && timeout > 0) {
            setTimeout(function () {
                version.innerHTML = versionNumber;
            }, timeout);
        } else {
            version.innerHTML = versionNumber;
        }
    };
    
    // force update
    try {
        version.innerHTML = "checking for updates...";
        appcache.update();
    } catch (e) {
        version.innerHTML = "error during update...";
        setVersionNumber(1000);
    }
});