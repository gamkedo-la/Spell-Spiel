// Slightly modified from implementation by yonatanmn
// [https://gist.github.com/yonatanmn/bff1b8dd80fc549da08d209f8917faa4]


function goto(o,wp){
    if(!wp.length) {
        return o;
    }

    var firstLetter = wp[0];
    var point = o[firstLetter];

    return point ? goto(point,wp.slice(1)) : {};
}

var endSym = Symbol.for('end');

var TrieProto = {
    insert(w){
        var point = this.tree;

        w.split('').forEach(function(e,i){
            if(!point[e]) {
              point[e] = {};
            }
            point = point[e];
            if(w.length - 1 === i) {
                point[endSym] = true;
            }
        });
    },

    autoComplete(wp){
        var point = goto(this.tree, wp);
        var stack = [];

        // We can check if we've completed a word in constant time
        if(point[endSym]) {
            stack.push("");
        }

        function reduceObjToArr(o, trace) {
            for(var k in o) {
                if(o[k][endSym]) {
                    stack.push(trace + k);
                }
                reduceObjToArr(o[k], trace + k);
            }
        }

        reduceObjToArr(point, '');

        return stack.map(function(e) {
            return wp + e;
        });
    }
};

var TrieDesc = {
    tree:{
        value:{},
        enumerable:true,
    }
};

function createTrie(){
    return Object.create(TrieProto,TrieDesc);
}

