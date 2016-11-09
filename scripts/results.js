/*global console, localsettings*/

(function () {
    "use strict";
    
    var check, correctValue;
    
    correctValue = function (result) {
        var exercise, value;
        
        exercise = result.exercise;
        
        switch (exercise.unknown) {
        case "left":
            return exercise.left;
        case "right":
            return exercise.right;
        case "operator":
            return exercise.operator;
        case "solution":
            return exercise.solution;
        default:
            throw "unrecognised unknown '" + exercise.unknown + "' in exercise!";
        }
    };
    
    check = function (result) {
        var exercise, value;
        
        exercise = result.exercise;
        value = result.value;
        
        switch (exercise.unknown) {
        case "left":
            return exercise.left === parseInt(value, 10);
        case "right":
            return exercise.right === parseInt(value, 10);
        case "operator":
            return exercise.operator === value;
        case "solution":
            return exercise.solution === parseInt(value, 10);
        default:
            throw "unrecognised unknown '" + exercise.unknown + "' in exercise!";
        }
    };
    
    (function () {
        var i, count, table, row, left, right, operator, equals, solution, results, result, exercise, correct, evaluation, correction;

        // retrieve the results
        results = localsettings.getResults();
        table = document.getElementById("results-table");
        count = 0;

        // iterate over the results
        for (i = 0; i < results.length; i += 1) {
            result = results[i];
            exercise = result.exercise;
            correct = check(result);
            
            if (correct) {
                count += 1;
            }
            
            row = table.insertRow();

            /******************************************************************
             * left operand
             *****************************************************************/
            
            left = document.createElement("div");
            left.className = "operand left center";
            if (exercise.unknown === "left") {
                left.classList.add("unknown");
                if (correct) {
                    left.classList.add("correct");
                } else {
                    left.classList.add("wrong");
                }
                left.innerHTML = result.value.toString();
            } else {
                left.innerHTML = exercise.left.toString();
            }
            
            row.insertCell().appendChild(left);
            
            /******************************************************************
             * operand
             *****************************************************************/
            
            operator = document.createElement("div");
            operator.className = "operand operator center";
            if (exercise.unknown === "operator") {
                operator.classList.add("unknown");

                if (correct) {
                    operator.classList.add("correct");
                } else {
                    operator.classList.add("wrong");
                }
                operator.innerHTML = result.value.toString();
            } else {
                operator.innerHTML = exercise.operator.toString();
            }
            row.insertCell().appendChild(operator);

            /******************************************************************
             * right operand
             *****************************************************************/
            
            right = document.createElement("div");
            right.className = "operand right center";
            if (exercise.unknown === "right") {
                right.classList.add("unknown");
                if (correct) {
                    right.classList.add("correct");
                } else {
                    right.classList.add("wrong");
                }
                right.innerHTML = result.value.toString();
            } else {
                right.innerHTML = exercise.right.toString();
            }
            
            row.insertCell().appendChild(right);

            /******************************************************************
             * equals sign
             *****************************************************************/
            
            equals = document.createElement("div");
            equals.innerHTML = "=";
            equals.className = "operand equals center";
            row.insertCell().appendChild(equals);

            /******************************************************************
             * solution operand
             *****************************************************************/
            
            solution = document.createElement("div");
            solution.className = "operand solution center";
            if (exercise.unknown === "solution") {
                solution.classList.add("unknown");
                if (correct) {
                    solution.classList.add("correct");
                } else {
                    solution.classList.add("wrong");
                }
                solution.innerHTML = result.value.toString();
            } else {
                solution.innerHTML = exercise.solution.toString();
            }
            
            row.insertCell().appendChild(solution);

            
            // evalution
            evaluation = document.createElement("div");
            evaluation.className = "evaluation";
            if (correct) {
                evaluation.innerHTML = "juist";
                evaluation.classList.add("outline-black");
            } else {
                evaluation.classList.add("wrong");
                evaluation.innerHTML = "fout";
                evaluation.classList.add("outline-white");
            }
            row.insertCell().appendChild(evaluation);
            
            // correction
            if (!correct) {
                /******************************************************************
                 * left operand
                 *****************************************************************/

                left = document.createElement("div");
                left.className = "operand left center";
                left.innerHTML = exercise.left.toString();

                if (exercise.unknown === "left") {
                    left.classList.add("unknown");
                    left.classList.add("correct");
                }


                row.insertCell().appendChild(left);

                /******************************************************************
                 * operand
                 *****************************************************************/

                operator = document.createElement("div");
                operator.className = "operand operator center";
                operator.innerHTML = exercise.operator.toString();

                if (exercise.unknown === "operator") {
                    operator.classList.add("unknown");
                    operator.classList.add("correct");
                }
                row.insertCell().appendChild(operator);

                /******************************************************************
                 * right operand
                 *****************************************************************/

                right = document.createElement("div");
                right.className = "operand right center";
                right.innerHTML = exercise.right.toString();
                
                if (exercise.unknown === "right") {
                    right.classList.add("unknown");
                    right.classList.add("correct");
                }

                row.insertCell().appendChild(right);

                /******************************************************************
                 * equals sign
                 *****************************************************************/

                equals = document.createElement("div");
                equals.innerHTML = "=";
                equals.className = "operand equals center";
                row.insertCell().appendChild(equals);

                /******************************************************************
                 * solution operand
                 *****************************************************************/

                solution = document.createElement("div");
                solution.className = "operand solution center";
                solution.innerHTML = exercise.solution.toString();
                if (exercise.unknown === "solution") {
                    solution.classList.add("unknown");
                    solution.classList.add("correct");
                }

                row.insertCell().appendChild(solution);
            }
        }
        
        document.getElementById("score").innerHTML = "Resultaat: " + count + "/" + results.length;
    }());
}());