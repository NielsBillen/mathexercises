/*global navigator, console*/

(function () {
    "use strict";
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("../sw.js").then(function (registration) {
            console.log('the service worker has been registred: ', registration);
        }).catch(function (error) {
            console.log('the service worker could not be registred', error);
        });
    }
}());