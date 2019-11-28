/*
 * round-off-value
 * https://github.com/lets-fiware/round-off-value-operator
 *
 * Copyright (c) 2019 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var pushEvent = function pushEvent(data) {
        if (MashupPlatform.operator.outputs.output.connected) {
            MashupPlatform.wiring.pushEvent("output", data);
        }
    }

    var mathFunc = null;
    var mathTable = {"none": "", "round": "Math.round", "floor": "Math.floor", "ceil": "Math.ceil", "trunc": "Math.trunc" };
    var shiftTable = {"integer": "1", "first": "10", "second": "100", "third": "1000" };

    var makeFunction = function makeFunction() {
        var formula = mathTable[MashupPlatform.prefs.get('math')];
        var shift = shiftTable[MashupPlatform.prefs.get('point')];

        var formula = formula + ((formula === "" || shift === 1) ? '(value)' : '(value*' + shift + ')/' + shift);

        return new Function('value', '"use strict";value = parseFloat(value);return (' + formula + ')');
    }

    var roundOff = function roundOff(value) {
        mathFunc = makeFunction();

        if (value != null) {
            if (!isNaN(value)) {
                pushEvent(mathFunc(value));

            } else {
                var mode = MashupPlatform.prefs.get('mode');
                if (mode === "exception") {
                    throw new MashupPlatform.wiring.EndpointTypeError();
                } else if (mode === "pass") {
                    pushEvent(value);
                } // remove
            }
        } else {
            if (MashupPlatform.prefs.get("send_nulls")) {
                pushEvent(value);
            }
        }
    }

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback("input", roundOff);
    }

    /* test-code */
    window.roundOff = roundOff;
    /* end-test-code */

})();
