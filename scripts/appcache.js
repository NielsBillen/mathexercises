/*global console, confirm*/

/* listen for load */
window.addEventListener("load", function (loadEvent) {
    "use strict";
    
    var appcache, version, versionNumber, setVersionNumber;
    
    appcache = window.applicationCache;
    version = document.getElementById("version");
    versionNumber = "v0.2.3.3";
    
    appcache.addEventListener("cached", function (e) {
        console.log(e);
    }, false);
    
    appcache.addEventListener("checking", function (e) {
        console.log("checking for update!");
        console.log(e);
        version.innerHTML = "zoeken naar updates...";
    }, false);
    
    appcache.addEventListener("downloading", function (e) {
        console.log(e);
        version.innerHTML = "update downloaden...";
    }, false);

    appcache.addEventListener("error", function (e) {
        console.log(e);
        version.innerHTML = "fout tijdens update...";
        setVersionNumber(1000);
    }, false);
    
    appcache.addEventListener("noupdate", function (e) {
        console.log("no update available!");
        version.innerHTML = "geen updates beschikbaar";
        setVersionNumber(1000);
    }, false);
    
    appcache.addEventListener("obsolete", function (e) {
        console.log(e);
    }, false);
    
    appcache.addEventListener("progress", function (e) {
        console.log(e);
        version.innerHTML = "downloaded " + e.loaded + " / " + e.total;
    }, false);
    
    appcache.addEventListener("updateready", function (e) {
        console.log(e);
        
        // update available
        if (confirm("A new version of this application is available. Load it?")) {
            window.location.reload();
        }
    }, false);
    
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