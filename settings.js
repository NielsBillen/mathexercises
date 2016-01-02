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
            inputTable.value = table;
        } else {
            inputTable.value = 3;
            localStorage.setItem("exercise-multiplication-table", 3);
        }
        
        if (count) {
            inputExerciseCount.value = count;
        } else {
            inputExerciseCount.value = 20;
            localStorage.setItem("exercise-multiplication-exercisecount", 20);
        }
    }());
    
    inputTable.oninput = function (e) {
        var number = parseInt(inputTable.value, 10);
        
        if (number) {
            localStorage.setItem("exercise-multiplication-table", number);
        }
    };
    
    inputExerciseCount.oninput = function (e) {
        var number = parseInt(inputExerciseCount.value, 10);
        
        if (number) {
            localStorage.setItem("exercise-multiplication-exercisecount", number);
        }
    };
    
    
    return my;
}());