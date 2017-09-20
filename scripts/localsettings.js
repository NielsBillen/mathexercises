/******************************************************************************
 *
 *****************************************************************************/

var localsettings = (function () {
    "use strict";
    
    var my = {};
    
    my.setExerciseStartTime = function () {
        localStorage.setItem("exercise-start-time", JSON.stringify(Date.now()));
    };
    
    my.getExerciseStartTime = function () {
        return JSON.parse(localStorage.getItem("exercise-start-time"));
    };
    
    /*  */
    my.getExerciseChoice = function (defaultValue) {
        if (!(typeof defaultValue === "string" || defaultValue instanceof String)) {
            throw "the default value is not of type string!";
        } else if (defaultValue !== "multiply" && defaultValue !== "divide") {
            throw "the default value should either be multiply or divide";
        }
        
        var result = localStorage.getItem("exercise-choice");
        
        if (result && (result === "multiply" || result === "divide")) {
            return result;
        } else {
            return defaultValue;
        }
    };
    
    /* sets the number of exercises to the given value */
    my.setExerciseChoice = function (value) {
        if (!(typeof value === "string" || value instanceof String)) {
            throw "the default value is not of type string!";
        } else if (value !== "multiply" && value !== "divide") {
            throw "the default value should either be multiply or divide";
        }
        
        localStorage.setItem("exercise-choice", value);
    };
    
    /* */
    my.setResults = function (results) {
        localStorage.setItem("exercise-results", JSON.stringify(results));
    };
    
    my.getResults = function () {
        return JSON.parse(localStorage.getItem("exercise-results"));
    };
    
    /* returns the types of exercises or the default when it is not set yet */
    my.getTypes = function (defaultValues) {
        if (!Array.isArray(defaultValues)) {
            throw "the given default values are not an array!";
        }
        if (defaultValues.length === 0) {
            throw "the given array is empty!";
        }
        
        var result = JSON.parse(localStorage.getItem("exercise-types"));
        
        if (result) {
            if (Array.isArray(result)) {
                return result;
            } else {
                return defaultValues;
            }
        } else {
            return defaultValues;
        }
    };
    
    /* set the types */
    my.setTypes = function (values) {
        if (!Array.isArray(values)) {
            throw "the given values are not an array!";
        }
        if (values.length === 0) {
            throw "the given array is empty!";
        }
        
        localStorage.setItem("exercise-types", JSON.stringify(values));
    };
    
    /* returns the number of exercises or the default number when it is not set yet */
    my.getNumberOfExercises = function (defaultValue) {
        if (!Number.isInteger(defaultValue)) {
            throw "the default value is not of type integer!";
        }
        
        var result = localStorage.getItem("exercise-count");
        
        if (result) {
            return parseInt(result, 10);
        } else {
            return defaultValue;
        }
    };
    
    /* sets the number of exercises to the given value */
    my.setNumberOfExercises = function (value) {
        localStorage.setItem("exercise-count", value.toString());
    };
    
    /* gets the valid numbers for the exercises */
    my.getTables = function (defaultValues) {
        if (!Array.isArray(defaultValues)) {
            throw "the given default values are not an array!";
        }
        if (defaultValues.length === 0) {
            throw "the given array is empty!";
        }
        
        var result = JSON.parse(localStorage.getItem("exercise-tables"));
        
        if (result) {
            if (Array.isArray(result)) {
                return result;
            } else {
                return defaultValues;
            }
        } else {
            return defaultValues;
        }
    };
    
    /* sets the valid numbers for the table exercises */
    my.setTables = function (values) {
        if (!Array.isArray(values)) {
            throw "the given values are not an array!";
        }
        if (values.length === 0) {
            throw "the given array is empty!";
        }
        
        localStorage.setItem("exercise-tables", JSON.stringify(values));
    };
    
    return my;
}());