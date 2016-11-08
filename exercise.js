/******************************************************************************
 * Controls the execution of the exercise using the Model-View-Controller 
 * design pattern.
 * 
 * The view implements methods to modify the relevant parts of the graphical
 * user interface.
 *
 * The model implements the data for the exercises.
 *
 * The controller controls the flow.
 *****************************************************************************/

/*global Keyboard, localsettings, console*/

var model, view, controller, utility;

utility = (function () {
    "use strict";
    
    var my = {};
    
    my.permutateNumbers = function (from, to, size) {
        var result, array, i, j;
        
        result = [];
        
        while (result.length < size) {
            // generate an array
            array = [];
            for (i = from; i <= to; i += 1) {
                array.push(i);
            }
            my.shuffle(array);
            
            // add the required amount
            for (i = 0; i < Math.min(array.length, size - result.length); i += 1) {
                result.push(array[i]);
            }
        }
        
        return result;
    };
    
    my.permutateArray = function (array, size) {
        var result, temp, i;
        
        result = [];
        
        while (result.length < size) {
            // generate an array
            temp = array.slice(0);
            my.shuffle(temp);
            
            // add the required amount
            for (i = 0; i < Math.min(temp.length, size - result.length); i += 1) {
                result.push(temp[i]);
            }
        }
        
        return result;
    };
    
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
    
    var my, monkey, progress, left, right, operator, solution, clear, input, unknown;

    my = {};

    /* retrieve the graphical user interface elements */
    monkey = document.getElementById("monkey");
    progress = document.getElementById("progress");
    left = document.getElementById("exercise-operator-left");
    right = document.getElementById("exercise-operator-right");
    operator = document.getElementById("exercise-operand");
    solution = document.getElementById("exercise-solution");

    /* style the user's input text field */
    input = document.createElement("div");
    input.id = "exercise-input";
    input.className = "center noselect";
    
    /* sets the color of the input field */
    my.setInputColor = function (color) {
        input.style.color = color;
    };
    
    /* happy animation */
    my.happyAnimation = function (callback) {
        var image, replacement;
        
        // initialize the image
        image = new Image();
        
        image.onload = function () {
            monkey.style.backgroundImage = "url(" + image.src + ")";
            monkey.style.animationDelay = "0s";
            monkey.style.animationDuration = "2s";
            
            replacement = monkey.cloneNode(true);
            monkey.parentElement.replaceChild(replacement, monkey);
            
            monkey = replacement;
            monkey.addEventListener("animationend", callback);
            monkey.style.animationName = "monkey-animation-correct";
        };
        
        image.src = "images/monkey-happy.svg";
    };
    
    /* sad animation */
    my.sadAnimation = function (callback) {
        var image, replacement;
        
        // initialize the image
        image = new Image();
        
        image.onload = function () {
            monkey.style.backgroundImage = "url(" + image.src + ")";
            monkey.style.animationDelay = "0s";
            monkey.style.animationDuration = "3s";
            
            replacement = monkey.cloneNode(true);
            monkey.parentElement.replaceChild(replacement, monkey);
            
            monkey = replacement;
            monkey.addEventListener("animationend", callback);
            monkey.style.animationName = "monkey-animation-wrong";
        };
        
        image.src = "images/monkey-sad.svg";
    };
    
    /* thinking image */
    my.thinking = function () {
        var image = new Image();
        
        image.onload = function () {
            monkey.style.backgroundImage = "url(" + image.src + ")";
        };
        
        image.src = "images/monkey-thinking.svg";
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
        } else if (value !== "+" && value !== "-" && value !== "x" && value !== "/") {
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
        if (operator !== "+" && operator !== "-" && operator !== "x" && operator !== "/") {
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

    // checks whether the exercise is correctly solved
    my.Exercise.prototype.check = function (view) {
        var input = view.getInput();

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

    // override the print
    my.Exercise.prototype.toString = function () {
        return this.left + this.operator + this.right + "=" + this.solution;
    };

    // returns an array of multiplication exercises
    my.Multiplications = function (count, tableArray, unknownArray) {
        if (count < 1) {
            throw "the requested number of multiplication exercises is smaller than one!";
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

        var i, result, exercise, left, right, solution, unknown, previous, valid, lefts, rights, unknowns;

        // initialize the result
        result = [];
        lefts = utility.permutateArray(tableArray, count);
        rights = utility.permutateNumbers(1, 10, count);
        unknowns = utility.permutateArray(unknownArray, count);
        
        for (i = 0; i < count; i += 1) {
            left = lefts[i];
            right = rights[i];
            solution = left * right;
            unknown = unknowns[i];
            
            result[i] = new my.Exercise(left, right, "x", solution, unknown);
        }
        
        /*
        // create the exercises            
        while (result.length < count) {
            // left operand from array
            left = tableArray[Math.floor(Math.random() * tableArray.length)];

            // right operand between 1 and 10
            right = Math.floor(Math.random() * 10) + 1;

            // solution 
            solution = left * right;
            
            // unknown 
            unknown = unknownArray[Math.floor(Math.random() * unknownArray.length)];
            
            // check if previous exercise happens to be identical
            valid = true;
            if (result.length > 0) {
                previous = result[result.length - 1];

                if (tableArray.length > 1 && previous.left === left) {
                    valid = false;
                } else if (previous.left === left && previous.right === right) {
                    valid = false;
                }
                if (unknownArray.length > 1 && previous.unknown === unknown) {
                    valid = false;
                }
            }

            // push the exercise
            if (valid) {
                exercise = new my.Exercise(left, right, "x", solution, unknown);
                result.push(exercise);
            }
        }
        */

        return result;
    };

    return my;
}());

controller = (function () {
    "use strict";
    
    var my, currentExercise, exercises, accept, listener, check, correct, wrong, advance;
    
    // initialize the variables
    my = {};
    accept = true;
    currentExercise = -1;
    
    // initialize the keyboard listener
    listener = function (key) {
        var inputValue, keyValue, newInput;

        // exit when not accepting input
        if (accept === false) {
            console.log("input disabled!");
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
            
            if (newInput > 999) {
                return;
            }
            view.setInput(newInput);
        }
    };
    
    check = function () {
        var exercise;
        
        exercise = exercises[currentExercise];
        
        if (exercise.check(view)) {
            correct();
            console.log("correct!");
        } else {
            wrong();
            console.log("incorrect!");
        }
    };
    
    advance = function () {
        accept = true;
        currentExercise += 1;
        
        if (currentExercise === exercises.length) {
            window.location = "index.html";
        } else {
            exercises[currentExercise].show(view);
            view.clearInput();
            view.thinking();
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
    
    wrong = function () {
        var callback = function (e) {
            // detach this callback
            e.srcElement.removeEventListener("animationeend", this);
            advance();
        };
        
        accept = false;
        view.setInputColor("red");
        view.sadAnimation(callback);
    };
    
    // append the listener
    Keyboard.apppendListener(listener);
    
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
    
    var tables, count, types;
    
    count = localsettings.getNumberOfExercises(10);
    tables = localsettings.getTables([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    types = localsettings.getTypes(["solution"]);
    
    controller.init(model.Multiplications(count, tables, types));
}());
