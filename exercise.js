/*global Keyboard, console*/

/*-----------------------------------------------------------------------------
 * Javascript file which controls the exercise
 *---------------------------------------------------------------------------*/

var Exercise = (function () {
    "use strict";
    
    var my = {};
    
    my.Multiplication = function (left, operator, right, solution, score, correctCallBack, wrongCallBack, resetCallBack) {
        this.left = left;                           /* left operand container */
        this.operator = operator;                   /* operator container */
        this.right = right;                         /* right operand container */
        this.solution = solution;                   /* solution container */
        this.score = score;                         /* container showing the score */
        this.correctCallBack = correctCallBack;     /* callback to function which is called when the correct answer is given */
        this.wrongCallBack = wrongCallBack;         /* callback to function which is called when the wrong answer is given */
        this.resetCallBack = resetCallBack;         /* callback to fuction which is called when the question is reset */
        this.enabled = true;                        /* whether any input is accepted */
        
        this.correct = 0;                           /* the statistics */
        this.questions = 0;                         /* the question */
        
        this.input = document.createElement("div"); /* the element in which the input is shown */
        this.input.id = "exercise-input";
        this.input.className = "center noselect";
        
        Keyboard.apppendListener(function (value) {
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
        if (table < 1) {
            throw "the table should be larger than 1!";
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
        
        this.input.style.color = "";
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
        if (this.enabled) {
            this.enabled = false;

            this.questions += 1;
            
            if (parseInt(this.input.innerHTML, 10) === this.exerciseSolution) {
                this.correct += 1;
                this.input.style.color = "lime";
                this.correctCallBack();

                setTimeout(this.generate.bind(this), 2000);
            } else {
                setTimeout(function () {
                    this.input.innerHTML = this.exerciseSolution;
                    this.input.style.color = "red";
                }.bind(this), 1000);

                setTimeout(this.generate.bind(this), 3000);

                this.wrongCallBack();
            }
            
            this.score.innerHTML = "Score: " + this.correct + "/" + this.questions;
        }
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
var score = document.getElementById("score");
var monkey = document.getElementById("monkey");

var setBackgroundImage = function (element, imageFilename, callBack) {
    "use strict";
    var image = new Image();
    
    image.onload = function () {
        element.style.backgroundImage = "url(" + image.src + ")";
        
        if (callBack) {
            callBack();
        }
    };
    
    image.src = imageFilename;
};

monkey.addEventListener("animationend", function () {
    "use strict";
    if (monkey.style.animationName === "monkey-animation-start") {
        monkey.style.top = "1vmin";
    }
});

var multipliation = new Exercise.Multiplication(leftOperator, operator, rightOperator, solution, score, function () {
    "use strict";
    setBackgroundImage(monkey, "images/monkey-happy.svg", function () {
        monkey.style.animationDelay = "0s";
        monkey.style.animationDuration = "2s";
        monkey.style.animationName = "none";
        setTimeout(function () {
            monkey.style.animationName = "monkey-animation-correct";
        }, 10);
    });
}, function () {
    "use strict";
    setBackgroundImage(monkey, "images/monkey-sad.svg", function () {
        monkey.style.animationDelay = "0s";
        monkey.style.animationDuration = "3s";
        monkey.style.animationName = "none";
        setTimeout(function () {
            monkey.style.animationName = "monkey-animation-wrong";
        }, 10);
    });
}, function () {
    "use strict";
    setBackgroundImage(monkey, "images/monkey-thinking.svg");
});

var exerciseTable = localStorage.getItem("exercise-multiplication-table");

if (exerciseTable) {
    var table = parseInt(exerciseTable, 10);
    
    if (!isNaN(table)) {
        if (table < 1) {
            table = 1;
        }
    }
    multipliation.setTable(table);
} else {
    multipliation.setTable(3);
}

multipliation.setUnknown("solution");
multipliation.generate();