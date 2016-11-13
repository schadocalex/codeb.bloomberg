///////////////////////////////////////////////////
//////////////////// get Input ////////////////////

function getInput(rowDefs, cb) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    var defs = rowDefs.map(_convertDef);
    var i = 0;
    var cbHasBeenCalled = false;
    rl.on('line', function (str) {
        if(i < defs.length) {
            i = defs[i](str.trim()) ? i + 1 : i;
            if (defs.length === i) {
                cbHasBeenCalled = true;
                cb();
            }
        }
    });
    rl.on('close', function() {
        if(!cbHasBeenCalled) {
            cb();
        }
        process.exit(0);
    });
    process.on('SIGINT', function() {
        rl.close();
    });
}

function _convertDef(def) {
    const inputRegExp = /^([a-z])-([a-zA-Z]+)(?:\[([a-zA-Z]+|\d+)\])?(?:\|(.?))?$/;
    const multiVarRegExp = /^\|(.)/;

    // c(def);
    var multiVarExec = multiVarRegExp.exec(def);
    // c(multiVarExec);
    if (multiVarExec !== null) {
        var multiVarSymbol = multiVarExec[1];
        var multiVar = def.split(multiVarSymbol).slice(1);
        let functions = multiVar.map(_convertDef);
        // c("multiVar");
        // c(multiVar);
        return function (str) {
            var strs = str.split(multiVarSymbol);
            // c("-- " + strs);
            // c("-- " + functions.length);
            for (var i = 0; i < functions.length; i++) {
                // c("---" + i);
                // c("--- " + strs[i]);
                // c("--- " + functions[i]);
                functions[i](strs[i]);
            }
            return true;
        }
    } else {
        let [type, name, nb, split] = inputRegExp.exec(def).slice(1);
        if(!nb) {
            return function(str) {
                global[name] = _convertStr(str, type, split);
                return true;
            }

        } else {
            const array = global[name] = [];
            return function(str) {
                array.push(_convertStr(str, type, split));
                if(nb === "Infinity") {
                    return false;
                } else if(!isNaN(+nb)) {
                    return array.length === parseInt(nb, 10);
                } else {
                    return array.length === global[nb];
                }
            }
        }
    }
}

function _convertStr(str, type, split) {
    if(split !== undefined) {
        return str.split(split).map(s => _convertStr(s, type));
    }

    switch(type) {
        case "i":
            return +str;
        case "s":
            return str.trim();
        case "f":
            return parseFloat(str);
    }
}

//////////////// end of get Input /////////////////
///////////////////////////////////////////////////