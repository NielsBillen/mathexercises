/*global console*/

/*-----------------------------------------------------------------------------
 * Controls a customized keyboard containing the numbers, an enter key and a 
 * backspace key.
 *
 * @author  Niels Billen
 * @version 0.1
 *---------------------------------------------------------------------------*/

var Keyboard = (function () {
    "use strict";
    
    var my = {}, listeners = [], addTouchListener, buttonClicked, keyPressed, audio = document.getElementById("keyboard-button-click");
    
    /**
     * Adds the given callback function as a touch listener to the given element.
     *
     * When touch events are supported, it will be added as a touchstart event, 
     * otherwhise it will be added on a click.
     */
    addTouchListener = function (element, callback) {
        if (document.body.ontouchstart === undefined) {
            element.addEventListener("click", callback);
        } else {
            element.addEventListener("touchstart", callback);
        }
    };
    
    /**
     * Listens for keyboard presses and calls the appropriate keyboard functions.
     */
    document.onkeypress = function (e) {
        e = e || window.event;
    
        var string, charCode;
        
        charCode = (typeof e.which === "number") ? e.which : e.keyCode;
                
        if (charCode >= 48 && charCode <= 57) {
            // keypad number has been pressed
            keyPressed(charCode - 48);
        } else if (charCode === 13) {
            // enter key has been pressed
            keyPressed("enter");
        } else if (charCode === 8 || charCode === 127) {
            // backspace key has been pressed
            keyPressed("backspace");
        } else {
            console.log("key with keycode " + charCode + " has been pressed!");
        }
    };
    
    /*
     * Called when a keyboard button is pressed with the appropriate value.
     * 
     * All listeners attached to this keyboard will be notified that
     * the button with the given value has been pressed.
     */
    keyPressed = function (value) {
        var j;
        for (j = 0; j < listeners.length; j += 1) {
            listeners[j](value);
        }
    };
    
    /*
     * Called when a button is clicked with the appropriate value.
     * 
     * All listeners attached to this keyboard will be notified that
     * the button with the given value has been pressed.
     */
    buttonClicked = function (button, value) {
        var j;
        for (j = 0; j < listeners.length; j += 1) {
            listeners[j](value);
        }
        
        // animate the button
        button.style.animationName = "none";
        setTimeout(function () {
            button.style.animationName = "keyboard-keypress";
        }, 5);
        audio.play();
    };
    
    /*
     * Appends the given listener, which is notified on keypresses, to this
     * keyboard. 
     *
     * When a key is pressed, the given listener will be called with the value
     * of the pressed button.
     */
    my.apppendListener = function (listener) {
        listeners.push(listener);
    };
    
    /*
     * Anonymous function which attaches the appropriate listeners to
     * the buttons.
     */
    (function () {
        var i, button;
        
        for (i = 0; i <= 9; i += 1) {
            button = document.getElementById("button-" + i);
            addTouchListener(button, buttonClicked.bind(this, button, i));
        }
    
        button = document.getElementById("button-enter");
        addTouchListener(button, buttonClicked.bind(this, button, "enter"));
        
        button = document.getElementById("button-back");
        addTouchListener(button, buttonClicked.bind(this, button, "backspace"));
    }());
        
    return my;
}());