/*global console*/

var addTouchListener = function (element, callback) {
    "use strict";
    
    if (document.body.ontouchstart === undefined) {
        element.addEventListener("click", callback);
    } else {
        element.addEventListener("touchstart", callback);
    }
};

var Keyboard = (function () {
    "use strict";
    
    var my = {}, listeners = [];
    
    my.buttonClicked = function (button, value) {
        var j;
        for (j = 0; j < listeners.length; j += 1) {
            listeners[j](button, value);
        }
    };
    
    my.apppendListener = function (listener) {
        listeners.push(listener);
    };
    
    my.init = function () {
        var i, button;
        
        for (i = 0; i <= 9; i += 1) {
            button = document.getElementById("button" + i);
            addTouchListener(button, my.buttonClicked.bind(this, button, i));
        }
    
        button = document.getElementById("button_enter");
        addTouchListener(button, my.buttonClicked.bind(this, button, "enter"));
        
        button = document.getElementById("button_back");
        addTouchListener(button, my.buttonClicked.bind(this, button, "backspace"));
    };
    
    my.init();
    
    return my;
}());

var Exercise = (function () {
    "use strict";
    
    var my = {};
    
    my.Multiplication = function (left, operator, right, solution, correctCallBack, wrongCallBack, resetCallBack) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.solution = solution;
        this.correctCallBack = correctCallBack;
        this.wrongCallBack = wrongCallBack;
        this.resetCallBack = resetCallBack;
        this.enabled = true;
        
        this.input = document.createElement("div");
        this.input.id = "exercise-input";
        this.input.className = "center";
        
        Keyboard.apppendListener(function (button, value) {
            var length = this.input.innerHTML.length;

            if (this.enabled) {
                if (value === "enter") {
                    if (length > 0) {
                        this.check();
                    }
                } else if (value === "backspace") {
                    if (length > 0) {
                        this.input.innerHTML = this.input.innerHTML.substring(0, length - 1);
                    }
                } else {
                    this.input.innerHTML = parseInt(this.input.innerHTML + value, 10);
                }
            }
        }.bind(this));
        
        this.table = 1;
        this.unknown = "solution";
        this.index = 0;
        this.numbers = my.getPermutation(2, 10);
    };
    
    my.Multiplication.prototype.setUnknown = function (unknown) {
        if (unknown === "solution" || unknown === "left" || unknown === "right") {
            this.unknown = unknown;
        } else {
            throw "unknown input '" + unknown + "' for Multiplication.prototype.setUnknown";
        }
    };
    
    my.Multiplication.prototype.setTable = function (table) {
        if (table < 2) {
            throw "the table should be larger than 1.";
        }
        this.table = table;
    };
    
    my.Multiplication.prototype.generate = function () {
        var solution, rightOperand, previousEnd;
        
        if (this.index === 0) {
            previousEnd = this.numbers[this.numbers.length - 1];
            
            do {
                my.shuffle(this.numbers);
            } while (this.numbers[0] === previousEnd);
        }
                
        my.clearElement(this.left);
        my.clearElement(this.right);
        my.clearElement(this.operator);
        my.clearElement(this.solution);
        my.clearElement(this.input);
                
        this.enabled = true;
        this.resetCallBack();
        
        if (this.unknown === "solution") {
            rightOperand = this.numbers[this.index];
            
            this.left.innerHTML = this.table;
            this.right.innerHTML = rightOperand;
            this.operator.innerHTML = "&times;";
            this.solution.appendChild(this.input);

            this.exerciseSolution = rightOperand * this.table;
        } else if (this.unknown === "left") {
            solution = this.numbers[this.index];
            
            this.right.innerHTML = this.table;
            this.solution.innerHTML = (solution * this.table);
            this.operator.innerHTML = "&times;";
            this.left.appendChild(this.input);

            this.exerciseSolution = solution;
        } else if (this.unknown === "right") {
            solution = this.numbers[this.index];
            
            this.left.innerHTML = this.table;
            this.solution.innerHTML = (solution * this.table);
            this.operator.innerHTML = "&times;";
            this.right.appendChild(this.input);
            
            this.exerciseSolution = solution;
        }
        
        this.index = (this.index + 1) % (this.numbers.length);
    };
    
    my.Multiplication.prototype.check = function () {
        this.enabled = false;
        
        if (parseInt(this.input.innerHTML, 10) === this.exerciseSolution) {
            this.correctCallBack();
        } else {
            this.wrongCallBack();
        }
        
        setTimeout(this.generate.bind(this), 2000);
    };
    
    my.getPermutation = function (from, to) {
        var i, j, array, temp;
        array = [];
        
        for (i = from; i <= to; i += 1) {
            array.push(i);
        }
        
        return my.shuffle(array);
    };
    
    my.shuffle = function (array) {
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
    
    my.clearElement = function (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element.innerHTML = "";
    };
    
    return my;
}());

var exercise = document.getElementById("exercise");
var leftOperator = document.getElementById("exercise-operator-left");
var rightOperator = document.getElementById("exercise-operator-right");
var operator = document.getElementById("exercise-operand");
var solution = document.getElementById("exercise-solution");
var feedback = document.getElementById("exercise-feedback");
var monkey = document.getElementById("monkey");

var monkeyHappy = new Image();
monkeyHappy.src = "images/monkey-happy.svg";

var monkeySad = new Image();
monkeySad.src = "images/monkey-sad.svg";

var monkeyThinking = new Image();
monkeyThinking.src = "images/monkey-thinking.svg";

var multipliation = new Exercise.Multiplication(leftOperator, operator, rightOperator, solution, function () {
    "use strict";
    monkey.style.backgroundImage = 'url(' + monkeyHappy.src + ')';
    monkey.style.animationDelay = "0s";
    monkey.style.animationName = "";
    monkey.style.animationName = "monkey-animation-correct";
}, function () {
    "use strict";
    monkey.style.backgroundImage = 'url(' + monkeySad.src + ')';
    monkey.style.animationDelay = "0s";
    monkey.style.animationDuration = "2s";
    monkey.style.animationName = "";
    monkey.style.animationName = "monkey-animation-wrong";
}, function () {
    "use strict";
    monkey.style.backgroundImage = 'url(' + monkeyThinking.src + ')';
});

multipliation.setUnknown("solution");
multipliation.setTable(4);
multipliation.generate();