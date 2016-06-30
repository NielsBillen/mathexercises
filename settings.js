/*global console*/



var Settings = (function () {
    "use strict";
    
    var my = {}, addTouchListener, inputTableButtonContainer, inputExerciseContainer;
    
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
    
    inputTableButtonContainer = document.getElementById("input-table-button-container");
    inputExerciseContainer = document.getElementById("input-exercise-button-container");
    
    /**
     * Control the value of the table.
     */
    (function () {
        var i, button, tableStorage, table, addTableClickHandler;
        
        /* read the table as a string from storage */
        tableStorage = localStorage.getItem("exercise-multiplication-table");
        
        /* convert the string to a valid integer */
        if (tableStorage) {
            table = parseInt(tableStorage, 10);
            
            if (table < 1 || table > 10) {
                table = 5;
            }
        } else {
            table = 5;
        }
        
        addTableClickHandler = function (button, i) {
            addTouchListener(button, function () {
                var previousButton;
                
                /* remove the selection */
                previousButton = document.getElementById("table-button" + table);
                previousButton.classList.remove("selected");

                /* set the table */
                table = i;

                /* add the selection */
                button.classList.add("selected");
                
                /* store the table */
                localStorage.setItem("exercise-multiplication-table", i);
            });
        };

        /* create the buttons */
        for (i = 1; i <= 10; i += 1) {
            button = document.createElement("div");
            button.innerHTML = i;
            button.id = "table-button" + i;
            
            inputTableButtonContainer.appendChild(button);
            
            if (i === table) {
                button.className = "settings-button center selected";
            } else {
                button.className = "settings-button center";
            }
            
            addTableClickHandler(button, i);
        }
    }());
    
    /**
     * Control the number of exercises of the table.
     */
    (function () {
        var i, j, array, button, exerciseStorage, exercise, addTableClickHandler;
        
        /* create the buttons */
        array = [1, 5, 10, 15, 20];
        
        /* read the table as a string from storage */
        exerciseStorage = localStorage.getItem("exercise-multiplication-exercisecount");
        
        /* convert the string to a valid integer */
        if (exerciseStorage) {
            exercise = parseInt(exerciseStorage, 10);
            
            (function () {
                var i, found = false;
                for (i = 0; i < array.length; i += 1) {
                    if (array[i] === exercise) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    exercise = array[1];
                }
            }());
        } else {
            exercise = array[1];
        }
        
        addTableClickHandler = function (button, i) {
            addTouchListener(button, function () {
                var previousButton;
                
                /* remove the selection */
                previousButton = document.getElementById("exercise-button" + exercise);
                previousButton.classList.remove("selected");

                /* set the table */
                exercise = i;

                /* add the selection */
                button.classList.add("selected");
                
                /* store the table */
                localStorage.setItem("exercise-multiplication-exercisecount", i);
            });
        };
        
        for (j = 0; j < array.length; j += 1) {
            i = array[j];
            button = document.createElement("div");
            button.innerHTML = i;
            button.id = "exercise-button" + i;
            
            inputExerciseContainer.appendChild(button);
            
            if (i === exercise) {
                button.className = "settings-button center selected";
            } else {
                button.className = "settings-button center";
            }
            
            addTableClickHandler(button, i);
        }
    }());
    
    return my;
}());