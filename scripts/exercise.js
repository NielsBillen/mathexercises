/*-----------------------------------------------------------------------------
 * Controls the execution of the exercise using the Model-View-Controller 
 * design pattern.
 * 
 * The view implements methods to modify the relevant parts of the graphical
 * user interface.
 *
 * The model implements the data for the exercises.
 *
 * The controller controls the flow.
 *---------------------------------------------------------------------------*/

/*global Keyboard, localsettings, console*/

var model, view, controller, utility;

/******************************************************************************
 * Utility function to generate the exercises
 *****************************************************************************/

utility = (function () {
    "use strict";
    
    var my = {};
    
    /*
     * Returns a random element from the given array
     */
    my.getRandom = function (array) {
        if (!array) {
            throw "array is undefined!";
        } else if (!Array.isArray(array)) {
            throw "argument is not an array!";
        } else if (array.length === 0) {
            throw "the array is empty!";
        }
        return array[Math.floor(Math.random() * array.length)];
    };
    
    my.getRandomInt = function (minimum, maximum) {
        return minimum + Math.floor(Math.random() * (maximum - minimum + 1));
    };
    
    /*
     * Generates an array of the given size, containing successive permutations
     * of the given array.
     */
    my.permutateArray = function (array, size) {
        if (!array) {
            throw "array is undefined!";
        } else if (!Array.isArray(array)) {
            throw "argument is not an array!";
        } else if (size < 0) {
            throw "the array size cannot be smaller than zero!";
        }
        
        var result, temp, i;
        
        temp = array.slice(0);

        result = [];
        while (result.length < size) {
            // shuffle the temporary array
            my.shuffle(temp);
            
            // add as much of the 'temp' array to the result.
            for (i = 0; i < Math.min(temp.length, size - result.length); i += 1) {
                result.push(temp[i]);
            }
        }
        
        return result;
    };
    
    /*
     * Generates an array of the given size, containing successive permutations
     * of the numbers in the closed interval [from, to] (inclusive).
     */
    my.permutateNumbers = function (from, to, size) {
        if (from >= to) {
            throw "from must be strictly smaller than to!";
        } else if (size < 0) {
            throw "the array must be positive!";
        }
        
        
        // initialize a temporary array which contains the range of numbers
        var temp = [], i;
        for (i = from; i <= to; i += 1) {
            temp.push(i);
        }

        return my.permutateArray(temp, size);
    };
    
    
    /*
     * Shuffle the given array.
     */
    my.shuffle = function (array) {
        if (!array) {
            throw "array is undefined!";
        } else if (!Array.isArray(array)) {
            throw "argument is not an array!";
        }
        
        var i, j, temp;
        
        // yates-shuffle
        for (i = array.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        
        return array;
    };
    
    return my;
}());

/**************************************************************************
 * View for the exercise
 *************************************************************************/

var view = (function () {
    "use strict";
    
    var my, character, progress, left, right, operator, solution, clear, input, unknown, animate;

    my = {};

    /* retrieve the graphical user interface elements */
    character = document.getElementById("character");
    progress = document.getElementById("progress");
    left = document.getElementById("exercise-operator-left");
    right = document.getElementById("exercise-operator-right");
    operator = document.getElementById("exercise-operand");
    solution = document.getElementById("exercise-solution");

    /* style the user's input text field */
    input = document.createElement("div");
    input.id = "exercise-input";
    input.className = "center";
    
    /* sets the color of the input field */
    my.setInputColor = function (color) {
        input.style.color = color;
    };
    
    /* listen for end of start animation */
    character.addEventListener("animationend", function (e) {
        if (e.animationName === "animation-start") {
            character.style.top = "1vmin";
        }
    });
    
    /* applies an animation to the character */
    animate = function (callback, style, animation, duration, iterations) {
        var replacement;
            
        // replace the node to force the animation to replay
        replacement = character.cloneNode(true);
        character.parentElement.replaceChild(replacement, character);
        
        character = replacement;
        character.classList.add(style);
        character.style.top = "1vmin";
        character.style.animationDelay = "0s";
        character.style.animationDuration = duration + "s";
        character.style.animationIterationCount = iterations;
            
        if (callback) {
            character.addEventListener("animationend", callback);
            character.addEventListener("animationend", function (e) {
                character.classList.remove(style);
            });
        }
        character.style.animationName = animation;
    };
    
    /* happy animation */
    my.happyAnimation = function (callback) {
        animate(callback, "correct", "animation-correct", 0.5, 4);
    };
    
    /* sad animation */
    my.sadAnimation = function (callback, correctAnswer) {
        setTimeout(function () {
            my.setInput(correctAnswer);
        }, 1000);
        
        animate(callback, "wrong", "animation-wrong", 3, 1);
    };
    
    /* sets the progress */
    my.setProgress = function (currentExercise, totalExercises) {
        progress.innerHTML = "Oefening: " + currentExercise + "/" + totalExercises;
    };
    
    /* sets the operator to the given value (+, -, x, /) */
    my.setOperator = function (value) {
        // throw an exception
        if (operator === unknown) {
            throw "trying to explicitely set the unknown of the exercise!";
        } else if (value !== "+" && value !== "-" && value !== "x" && value !== "&times;" && value !== "/" && value !== "&divide;" && value !== ':') {
            throw "unsupported operator " + value + "!";
        }

        operator.innerHTML = value;
    };

    /* returns the operator as a string */
    my.getOperator = function () {
        return operator.innerHTML;
    };

    /* sets the value of the input field */
    my.setInput = function (value) {
        if (!Number.isInteger(value)) {
            throw "the given value '" + value + "' does not have the integer type!";
        }
        input.innerHTML = value.toString();
    };

    /* returns the input*/
    my.getInput = function (value) {
        return input.innerHTML;
    };
    
    /* clears the input */
    my.clearInput = function () {
        input.innerHTML = "";
    };

    /* set the left operand to the given integer value */
    my.setLeftOperand = function (value) {
        if (left === unknown) {
            throw "trying to explicitely set the unknown of the exercise! use setInput(value) instead!";
        }
        if (!Number.isInteger(value)) {
            throw "the given value '" + value + "' does not have the integer type!";
        }
        left.innerHTML = value.toString();
    };

    /* returns the value of the left operand as an integer */
    my.getLeftOperand = function () {
        return parseInt(left.innerHTML, 10);
    };

    /* set the right operand to the given integer value */
    my.setRightOperand = function (value) {
        if (solution === right) {
            throw "trying to explicitely set the unknown of the exercise!";
        }
        if (!Number.isInteger(value)) {
            throw "the given value '" + value + "' does not have the integer type!";
        }
        right.innerHTML = value.toString();
    };

    /* returns the value of the right operand as an integer */
    my.getRightOperand = function () {
        return parseInt(right.innerHTML, 10);
    };

    /* sets the solution to the given integer value */
    my.setSolution = function (value) {
        if (solution === unknown) {
            throw "trying to explicitely set the unknown of the exercise!";
        }
        if (!Number.isInteger(value)) {
            throw "the given value '" + value + "' does not have the integer type!";
        }
        solution.innerHTML = value.toString();
    };

    /* returns the value of the solution as an integer */
    my.getSolution = function () {
        return parseInt(solution.innerHTML, 10);
    };

    /* sets the unknown ("left", "right", "operator", "solution") */
    my.setUnknown = function (value) {
        if (value !== "left" && value !== "right" && value !== "operator" && value !== "solution") {
            throw "cannot set the unknown to solve for to " + value + "!";
        }

        // remove the input from the previous unknown
        if (unknown) {
            unknown.removeChild(input);
        }

        switch (value) {
        case "left":
            unknown = left;
            break;
        case "right":
            unknown = right;
            break;
        case "solution":
            unknown = solution;
            break;
        case "operator":
            unknown = operator;
            break;
        }

        // clear the unknown
        while (unknown.firstChild) {
            unknown.removeChild(unknown.firstChild);
        }
        unknown.innerHTML = "";
        unknown.appendChild(input);
    };

    return my;
}());

var model = (function () {
    "use strict";
    var my;

    my = {};

    /**********************************************************************
     * Creates a new exercise
     *********************************************************************/

    my.Exercise = function (left, right, operator, solution, unknown) {
        if (!Number.isInteger(left)) {
            throw "the given left operand is not an integer!";
        }
        if (!Number.isInteger(left)) {
            throw "the given right operand is not an integer!";
        }
        if (!Number.isInteger(solution)) {
            throw "the given solution is not an integer!";
        }
        if (operator !== "+" && operator !== "-" && operator !== "x" && operator !== "/" && operator !== "&times;" && operator !== "&divide;" && operator !== ':') {
            throw "unsupported operator '" + operator + "'!";
        }
        if (unknown !== "left" && unknown !== "right" && unknown !== "solution" && unknown !== "operator") {
            throw "unsupported unknown '" + unknown + "'!";
        }

        this.left = left;
        this.right = right;
        this.operator = operator;
        this.solution = solution;
        this.unknown = unknown;
    };
    
    // returns the correct answer of the exercise
    my.Exercise.prototype.getAnswer = function () {
        if (this.unknown === "left") {
            return this.left;
        } else if (this.unknown === "right") {
            return this.right;
        } else if (this.unknown === "operator") {
            return this.operator;
        } else if (this.unknown === "solution") {
            return this.solution;
        } else {
            throw "the unknown field '" + this.unknown + "' does not correspont to any of the valid options!";
        }
    };

    // checks whether the exercise is correctly solved
    my.Exercise.prototype.check = function (input) {
        if (this.unknown === "left") {
            return this.left === parseInt(input, 10);
        } else if (this.unknown === "right") {
            return this.right === parseInt(input, 10);
        } else if (this.unknown === "operator") {
            return this.operator === input.toString();
        } else if (this.unknown === "solution") {
            return this.solution === parseInt(input, 10);
        } else {
            return false;
        }
    };

    // shows the exercise 
    my.Exercise.prototype.show = function (view) {
        view.setUnknown(this.unknown);
        if (this.unknown !== "left") {
            view.setLeftOperand(this.left);
        }
        if (this.unknown !== "right") {
            view.setRightOperand(this.right);
        }
        if (this.unknown !== "operator") {
            view.setOperator(this.operator);
        }
        if (this.unknown !== "solution") {
            view.setSolution(this.solution);
        }
    };

    // returns whether this exercise is equal to a previous exercise
    my.Exercise.prototype.equals = function (other) {
        return other && this.left === other.left && this.right === other.right && this.unknown === other.unknown && this.solution === other.solution && this.operator === other.operator;
    };
    
    my.Exercise.prototype.getOperands = function () {
        return [ this.left, this.right, this.solution ];
    };
    
    my.Exercise.prototype.nbOfDifferentOperands = function (other) {
        if (!other) {
            return;
        }
        
        var i, current, operands, count, result;
        
        result = 0;
        current = null;
        
        operands = this.getOperands().concat(other.getOperands());
        operands.sort();
        
        for (i = 0; i < operands.length; i += 1) {
            if (operands[i] !== current) {
                if (count === 1) {
                    result += 1;
                }
                
                count = 1;
                current = operands[i];
            }
        }
        
        if (count === 1) {
            return result + 1;
        } else {
            return result;
        }
    };
    
    // returns whether this exercise shares an operand with another exercise
    my.Exercise.prototype.sharesOperand = function (other) {
        if (!other) {
            return false;
        }
        
        if (this.left === other.left || this.left === other.right || this.left === other.solution) {
            return true;
        }
        
        if (this.right === other.left || this.right === other.right || this.right === other.solution) {
            return true;
        }
        
        if (this.solution === other.left || this.solution === other.right || this.solution === other.solution) {
            return true;
        }
        
        return false;
    };
    
    // override the print
    my.Exercise.prototype.toString = function () {
        return this.left + this.operator + this.right + "=" + this.solution;
    };
    
    my.Result = function (exercise, value) {
        this.exercise = exercise;
        this.value = value;
    };
    
    // generate a random exercise
    my.Generate = function (tableArray, unknownArray, operatorArray) {
        var operator, left, right, solution,  unknown, operatorSign;
        
        operator = utility.getRandom(operatorArray);
    
        if (operator === "multiply") {
            //if (Math.random() < 0.5) {
            right = utility.getRandom(tableArray);
            left = utility.getRandomInt(1, 10);
            
            solution = left * right;
            operatorSign = "&times;";
        } else {
            right = utility.getRandom(tableArray);
            solution = utility.getRandomInt(1, 10);
            left = solution * right;
            operatorSign = ":";
        }
            
        unknown = utility.getRandom(unknownArray);
        
        return new my.Exercise(left, right, operatorSign, solution, unknown);
    };

    // returns an array containing exercises
    my.Exercices = function (count, tableArray, unknownArray, operatorArray) {
        if (count < 1) {
            throw "the requested number of exercises is smaller than one!";
        }
        if (!Array.isArray(tableArray)) {
            throw "the given tables are not an array!" + tableArray;
        }
        if (tableArray.length === 0) {
            throw "the array with tables is empty!";
        }
        if (!Array.isArray(unknownArray)) {
            throw "the given unknowns are not an array!" + unknownArray;
        }
        if (unknownArray.length === 0) {
            throw "the array with unknown positions is empty!";
        }
        if (!Array.isArray(operatorArray)) {
            throw "the given operator array is not an array!" + operatorArray;
        }
        if (operatorArray.length === 0) {
            throw "the array with operators is empty!";
        }
        
        var i, j, result, best, bestDifferent, different, exercise, retries, temp;
        
        
        result = [];
        
        // initialize the result
        for (i = 0; i < count; i += 1) {
            retries = 0;
            best = null;
            bestDifferent = 0;
            
outer:
            // try 100 times go generate a good exercise
            while (retries < 100) {
                retries += 1;

                
                // generate a random exercise
                temp = my.Generate(tableArray, unknownArray, operatorArray);
                
                // initialise best (in case no exercise is ever going to be good!)
                if (!best) {
                    best = temp;
                }
                
                if (unknownArray.length > 1 && i > 1 && temp.unknown === result[i - 1].unknown && temp.unknown === result[i - 2].unknown) {
                    // avoid more than 2 consecutive equal places for the unknowns
                    continue;
                } else if (operatorArray.length > 1 && i > 1 && temp.operator === result[i - 1].operator && temp.operator === result[i - 2].operator) {
                    // avoid more than 2 consecutive equal operators
                    continue;
                } else if (i > 0 && temp.solution === result[i - 1].solution) {
                    // avoid consecutive exercises with the same solution
                    continue;
                } else if (i > 0 && temp.left === temp.right && result[i - 1].left === result[i - 1].right) {
                    // avoid consectucive exercises with have the same left and right operand
                    continue;
                } else if (i > 0 && temp.left === temp.solution && result[i - 1].left === result[i - 1].solution) {
                    // avoid consectucive exercises with have the same left and right operand
                    continue;
                } else if (i > 0 && temp.right === temp.solution && result[i - 1].right === result[i - 1].solution) {
                    // avoid consectucive exercises with have the same left and right operand
                    continue;
                }
                
                different = 0;
                for (j = i - 1; j >= Math.max(0, i - 20); j -= 1) {
                    different += temp.nbOfDifferentOperands(result[j]) * (i + 1);
                    if (different > bestDifferent) {
                        best = temp;
                        bestDifferent = different;
                    }
                }
                
                
                for (j = Math.max(0, i - 10); j < i; j += 1) {
                    if (temp.equals(result[j])) {
                        continue outer;
                    }
                }
            }
            
            result[i] = best;
            
            /*console.log(retries + " " + bestLength);
            console.log(best.left + " " + best.operator + " " + best.right + " = " + best.solution);*/
        }
        
        return result;
    };
    
    return my;
}());

controller = (function () {
    "use strict";
    
    var my, currentExercise, exercises, accept, check, correct, wrong, advance, results;
    
    // initialize the variables
    my = {};
    accept = true;
    currentExercise = -1;
    results = [];
    
    // initialize the keyboard listener
    Keyboard.apppendListener(function (key) {
        var inputValue, keyValue, newInput;

        // exit when not accepting input
        if (accept === false) {
            return;
        } else if (key === "enter") {
            check();
        } else if (key === "backspace") {
            inputValue = view.getInput();
            newInput = Math.floor(inputValue * 0.1);
            view.setInput(newInput);
        } else {
            inputValue = view.getInput();
            keyValue = parseInt(key, 10);
            newInput = 10 * inputValue + keyValue;
            
            if (newInput >= 0 && newInput < 1000) {
                view.setInput(newInput);
            }
        }
    });
    
    // check whether the current exercise is correct
    check = function () {
        var exercise, input, result;
        
        input = view.getInput();
        exercise = exercises[currentExercise];
        result = new model.Result(exercise, input);
        results.push(result);
        
        
        if (exercise.check(input)) {
            correct();
        } else {
            wrong(exercise.getAnswer());
        }
    };
    
    // advance to the next exercise
    advance = function () {
        accept = true;
        currentExercise += 1;
        
        if (currentExercise === exercises.length) {
            localsettings.setResults(results);
            console.log(results);
            
            window.location = "results.html";
        } else {
            exercises[currentExercise].show(view);
            view.clearInput();
            view.setInputColor("black");
            view.setProgress(currentExercise + 1, exercises.length);
        }
    };
    
    correct = function () {
        var callback = function (e) {
            // detach this callback
            e.srcElement.removeEventListener("animationend", this);
            advance();
        };
        
        accept = false;
        view.setInputColor("lime");
        view.happyAnimation(callback);
    };
    
    wrong = function (correctAnswer) {
        var callback = function (e) {
            // detach this callback
            e.srcElement.removeEventListener("animationeend", this);
            advance();
        };
        
        accept = false;
        view.setInputColor("red");
        view.sadAnimation(callback, correctAnswer);
    };
    
    my.init = function (e) {
        if (!Array.isArray(e)) {
            throw "the given argument is not an array of exercises!";
        }
        if (e.length < 1) {
            throw "the given list of exercises is empty!";
        }
        
        exercises = e;
        accept = true;
        currentExercise = 0;
        exercises[currentExercise].show(view);
        view.setProgress(currentExercise + 1, exercises.length);
    };
    
    return my;
}());

/******************************************************************************
 * Start the multiplication exercises
 *****************************************************************************/

(function () {
    "use strict";
    
    var tables, count, types, operators;
        
    count = localsettings.getNumberOfExercises(10);
    tables = localsettings.getTables([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    types = localsettings.getTypes(["solution"]);
    operators = localsettings.getExerciseOperators(["multiply"]);
    localsettings.setExerciseStartTime();
    
    controller.init(model.Exercices(count, tables, types, operators));
    /*
    if (choice === "divide") {
        typeHeader.innerHTML = ":";
        controller.init(model.Divisions(count, tables, types));
    } else {
        typeHeader.innerHTML = "&times;";
        controller.init(model.Multiplications(count, tables, types));
    }*/
}());
