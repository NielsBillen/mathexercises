/*global console*/

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
        
        this.input = document.createElement("input");
        this.input.id = "exercise-input";
        this.input.onkeyup = function (e) {
            if (!e) {
                e = window.event;
            }
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
                this.check();
                return false;
            }
        }.bind(this);
        
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
        
        /* reset */
        
        my.clearElement(this.left);
        my.clearElement(this.right);
        my.clearElement(this.operator);
        my.clearElement(this.solution);
        my.clearElement(this.input);
        this.input.value = "";
        this.resetCallBack();
        
        
        if (this.unknown === "solution") {
            rightOperand = this.numbers[this.index];
            
            this.left.innerHTML = this.table;
            this.right.innerHTML = rightOperand;
            this.operator.innerHTML = "&times;";
            this.solution.appendChild(this.input);

            this.input.solution = rightOperand * this.table;
        } else if (this.unknown === "left") {
            solution = this.numbers[this.index];
            
            this.right.innerHTML = this.table;
            this.solution.innerHTML = (solution * this.table);
            this.operator.innerHTML = "&times;";
            this.left.appendChild(this.input);

            this.input.solution = solution;
        } else if (this.unknown === "right") {
            solution = this.numbers[this.index];
            
            this.left.innerHTML = this.table;
            this.solution.innerHTML = (solution * this.table);
            this.operator.innerHTML = "&times;";
            this.right.appendChild(this.input);

            this.input.solution = solution;
        }
        
        this.index = (this.index + 1) % (this.numbers.length);
    };
    
    my.Multiplication.prototype.check = function () {
        if (parseInt(this.input.value, 10) === this.input.solution) {
            this.correctCallBack();
        } else {
            this.wrongCallBack();
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
var feedback = document.getElementById("exercise-feedback");
var monkey = document.getElementById("monkey");

var multipliation = new Exercise.Multiplication(leftOperator, operator, rightOperator, solution, function () {
    "use strict";
    
    var image = new Image();
        
    image.onload = function () {
        monkey.style.backgroundImage = 'url("images/monkey-happy.svg")';
        setTimeout(this.generate.bind(this), 2000);
    }.bind(multipliation);
    
    image.src = "images/monkey-happy.svg";
}, function () {
    "use strict";
    
    var image = new Image();
        
    image.onload = function () {
        monkey.style.backgroundImage = 'url("images/monkey-sad.svg")';
        setTimeout(this.generate.bind(this), 2000);
    }.bind(multipliation);
    
    image.src = "images/monkey-sad.svg";
}, function () {
    "use strict";
    var image = new Image();
        
    image.onload = function () {
        monkey.style.backgroundImage = 'url("images/monkey-thinking.svg")';
    }.bind(multipliation);
    
    image.src = "images/monkey-thinking.svg";
});

multipliation.setUnknown("solution");
multipliation.setTable(4);
multipliation.generate();