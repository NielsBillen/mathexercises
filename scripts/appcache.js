/*global console, confirm*/

/* listen for load */
window.addEventListener("load", function (loadEvent) {
    "use strict";
    
    var appcache, version, versionNumber, setVersionNumber, updateButton;
    
    appcache = window.applicationCache;
    versionNumber = "v0.2.6";
    version = document.getElementById("version");
    version.innerHTML = versionNumber;
    updateButton = document.getElementById("update");
    
    appcache.addEventListener("cached", function (e) {
        setVersionNumber(1000);
    }, false);
    
    appcache.addEventListener("checking", function (e) {
        version.innerHTML = "zoeken naar updates ...";
    }, false);
    
    appcache.addEventListener("downloading", function (e) {
        version.innerHTML = "update downloaden ...";
    }, false);

    appcache.addEventListener("error", function (e) {
        version.innerHTML = "fout tijdens update ...";
        setVersionNumber(1000);
    }, false);
    
    appcache.addEventListener("noupdate", function (e) {
        version.innerHTML = "geen updates beschikbaar";
        setVersionNumber(1000);
    }, false);
    
    appcache.addEventListener("obsolete", function (e) {
    }, false);
    
    appcache.addEventListener("progress", function (e) {
        version.innerHTML = "downloaded " + e.loaded + " / " + e.total;
    }, false);
    
    appcache.addEventListener("updateready", function (e) {
        // update available
        if (confirm("Er is een update beschikbaar. Wil je updaten?")) {
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
    
    updateButton.onclick = function () {
        // force update
        try {
            version.innerHTML = "zoeken naar updates...";
            appcache.update();
        } catch (e) {
            version.innerHTML = "fout tijdens het updaten...";
            setVersionNumber(1000);
            console.log(e);
        }
    };
});