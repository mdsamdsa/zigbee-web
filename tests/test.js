'use strict';

var arr = [ 0, 1, 2];

var arr2 = [ 0, 2, 3];

function getVal(val) {
    for(var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            return i;
        }
    }
    return -1;
}

function addVal(val) {
    var ind = getVal(val);
    if (ind == -1) {
        arr.push(val);
    }
}

function removeVal(val) {
    var ind = getVal(val);
    if (ind != -1) {
        arr.splice(ind, 1);
    }
}

function update() {
    for(var i = 0; i < arr2.length; i++) {
        if (getVal(arr2[i]) == -1) {
            addVal(arr2[i]);
        }
    }
    for(var j = 0; j < arr.length; j++) {
        console.log(j);
        var found = false;
        for(var k = 0; k < arr2.length; k++) {
            if (arr[j] == arr2[k]) {
                found = true;
                break;
            }
        }
        if (!found) {
            removeVal(arr[j]);
        }
    }
}

console.log(arr);
update();
console.log(arr);
