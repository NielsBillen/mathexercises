/*global confirm, window, document*/

/* listen for load */
window.addEventListener("load", function (e) {
    "use strict";
    
    var appcache, version, versionNumber, setVersionNumber, updateButton;
    
    appcache = window.applicationCache;
    versionNumber = "v0.4.5";
    version = document.getElementById("version");
    version.innerHTML = versionNumber;
    updateButton = document.getElementById("update");
    
    appcache.addEventListener("cached", function (e) {
        version.innerHTML = "geen updates beschikbaar";
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
        if (appcache.status === appcache.UPDATEREADY) {
            if (confirm("Er is een update beschikbaar. Wil je updaten?")) {
                try {
                    appcache.swapCache();
                } catch (error) {
                    version.innerHTML = "up-to-date...";
                }
                window.location.reload();
            }
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
            version.innerHTML = "up-to-date...";
            setVersionNumber(1000);
        }
    };
});
