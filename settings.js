/*global console*/

var Settings = (function () {
    "use strict";
    
    var my = {}, inputTable, inputExerciseCount;
    
    inputTable = document.getElementById("input-table");
    inputExerciseCount = document.getElementById("input-exercise-count");

    (function () {
        var table, count;
        
        table = localStorage.getItem("exercise-multiplication-table");
        count = localStorage.getItem("exercise-multiplication-exercisecount");
        
        if (table) {
            if (table < 1) {
                table = 1;
            }
            inputTable.value = table;
        } else {
            inputTable.value = 3;
            localStorage.setItem("exercise-multiplication-table", 3);
        }
        
        if (count) {
            if (count < 1) {
                count = 1;
            }
            inputExerciseCount.value = count;
        } else {
            inputExerciseCount.value = 20;
            localStorage.setItem("exercise-multiplication-exercisecount", 20);
        }
    }());
    
    inputTable.oninput = inputTable.onchange = function (e) {
        var number = parseInt(inputTable.value, 10);
        
        if (!isNaN(number)) {
            if (number < 1) {
                number = 1;
                inputTable.value = 1;
            }
            localStorage.setItem("exercise-multiplication-table", number);
        }
    };
    
    inputExerciseCount.oninput = function (e) {
        var number = parseInt(inputExerciseCount.value, 10);
        
        if (!isNaN(number)) {
            if (number < 1) {
                number = 1;
                inputExerciseCount.value = 1;
            }
            localStorage.setItem("exercise-multiplication-exercisecount", number);
        }
    };
    
    
    return my;
}());