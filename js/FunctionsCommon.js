// JavaScript source code

function ArrayWithZeros(length) { //Lol this took too much time to find
    array = [];
    for (i = 0; i < length; i++) {
        array.push(0);
    }
    return array;
}

//Self-explanatory!
function ArraySum(array) {
    var sum = 0;
    for (i = 0; i < array.length; i++) {
        toAdd = array[i];
        sum += toAdd;
    }
    return sum;
}
