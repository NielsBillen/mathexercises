/*global localsettings*/

/*-----------------------------------------------------------------------------
 * Controls the settings and writes them to local storage.
 *
 * @author  Niels Billen
 * @version 0.1
 *---------------------------------------------------------------------------*/

(function () {
    "use strict";
    
    var addTouchListener;
    
    /*
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
    
    /**************************************************************************
     * Set the version number
     *************************************************************************/
    
    (function () {
        var version = document.getElementById("version");
        
        if (version) {
            version.innerHTML = "v0.2.2";
        }
    }());
    
    /**************************************************************************
     * Initialize the buttons which allow to pick which tables will be present 
     * in the exercises.
     *************************************************************************/
    
    (function () {
        var i, container, button, tables, click;
        
        /* read the table as a string from storage */
        container = document.getElementById("input-table-button-container");
        tables = localsettings.getTables([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        /* validate the input */
        if (!tables || !Array.isArray(tables) || tables.length === 0) {
            tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }
        
        /* create the function which creates click handlers */
        click = function (button, i) {
            return function () {
                var index;
                
                if (button.classList.contains("selected")) {
                    // break if this is the last element
                    if (tables.length === 1) {
                        return;
                    }
                    
                    // remove table from selection
                    index = tables.indexOf(i);
                    
                    if (index > -1) {
                        tables.splice(index, 1);
                    }
                    button.classList.remove("selected");
                } else {
                    // add table to selection
                    tables.push(i);
                    button.classList.add("selected");
                }
                
                /* store the table */
                localsettings.setTables(tables);
            };
        };
        
        /* create the buttons */
        for (i = 1; i <= 10; i += 1) {
            button = document.createElement("div");
            button.innerHTML = i;
            button.id = "table-button-" + i;
            button.className = "button bordered noselect";
                        
            if (tables.indexOf(i) > -1) {
                button.classList.add("selected");
            }
            
            addTouchListener(button, click(button, i));
            
            container.appendChild(button);
        }
    }());
    
    /**************************************************************************
     * Initialize the buttons which allow to pick which tables will be present 
     * in the exercises.
     *************************************************************************/
    
    (function () {
        var i, container, array, button, buttonCount, previousButton, exerciseCount, click;
        
        container = document.getElementById("input-exercise-button-container");

        /* create the buttons */
        array = [1, 5, 10, 15, 20];
        
        /* read the table as a string from storage */
        exerciseCount = localsettings.getNumberOfExercises(5);
        
        /* check if present between the options */
        if (array.indexOf(exerciseCount) === -1) {
            exerciseCount = array[Math.min(2, array.length - 1)];
            localsettings.setNumberOfExercises(exerciseCount);
        }
        
        click = function (button, i) {
            return function () {
                var previousButton;
                
                /* remove the selection */
                previousButton = document.getElementById("exercise-button-" + exerciseCount);
                previousButton.classList.remove("selected");

                /* set the table */
                exerciseCount = i;

                /* add the selection */
                button.classList.add("selected");
                
                /* store the table */
                localsettings.setNumberOfExercises(exerciseCount);
            };
        };
        
        for (i = 0; i < array.length; i += 1) {
            buttonCount = array[i];
            button = document.createElement("div");
            button.innerHTML = buttonCount;
            button.id = "exercise-button-" + buttonCount;
            button.className = "button bordered noselect";
            
            container.appendChild(button);
            
            if (buttonCount === exerciseCount) {
                button.classList.add("selected");
            }
            
            addTouchListener(button, click(button, buttonCount));
        }
    }());
    
    /**************************************************************************
     * Initialize the buttons which allow to pick the types of exercises
     *************************************************************************/
    
    (function () {
        var i, all, type, selected, button, click;
        
        all = ["left", "right", "solution"];
        selected = localsettings.getTypes(["solution"]);
        
        click = function (button, type) {
            return function () {
                if (button.classList.contains("selected")) {
                    // break if this is the last element
                    if (selected.length === 1) {
                        return;
                    }
                    
                    // remove table from selection
                    var index = selected.indexOf(type);
                    
                    if (index > -1) {
                        selected.splice(index, 1);
                    }
                    button.classList.remove("selected");
                } else {
                    // add table to selection
                    selected.push(type);
                    button.classList.add("selected");
                }
                
                /* store the table */
                localsettings.setTypes(selected);
            };
        };
        
        for (i = 0; i < all.length; i += 1) {
            type = all[i];
            button = document.getElementById("type-" + type);
            
            if (selected.indexOf(type) > -1) {
                button.classList.add("selected");
            }
            
            addTouchListener(button, click(button, type));
        }
    }());
}());