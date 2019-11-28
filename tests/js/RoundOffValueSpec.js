/* globals MockMP */

(function () {

    "use strict";

    describe("RoundOffValue", function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    "mode": "exception",
                    "math": "none",
                    "point": "integer",
                    "send_nulls": true,
                },
                inputs: ['input'],
                outputs: ['output']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.output.connect({simulate: () => {}});
        });

        it("math no operation : string", function () {
            MashupPlatform.prefs.set("math", "none");

            roundOff("123.45");

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 123.45);
        });

        it("math no operation : number", function () {
            MashupPlatform.prefs.set("math", "none");

            roundOff(567.89);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 567.89);
        });

        it("round : integer", function () {
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "integer");

            roundOff(123.4567);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 123);
        });

        it("round : first", function () {
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "first");

            roundOff(123.4567);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 123.5);
        });

        it("round : second", function () {
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "second");

            roundOff(123.4567);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 123.46);
        });

        it("round : third", function () {
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "third");

            roundOff(123.4567);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 123.457);
        });

        it("floor: integer", function () {
            MashupPlatform.prefs.set("math", "floor");
            MashupPlatform.prefs.set("point", "integer");

            roundOff(-8.6);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', -9);
        });


        it("ceil: integer", function () {
            MashupPlatform.prefs.set("math", "ceil");
            MashupPlatform.prefs.set("point", "integer");

            roundOff(-8.6);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', -8);
        });

        it("trunc: integer", function () {
            MashupPlatform.prefs.set("math", "ceil");
            MashupPlatform.prefs.set("point", "integer");

            roundOff(-5.6);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', -5);
        });

        it("allowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", true);

            roundOff(null);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', null);
        });

        it("disallowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", false);

            roundOff(null);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it("parameter error : mode : exception", function () {
            MashupPlatform.prefs.set("mode", "exception");

            expect(function () {
                roundOff('abc');
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("parameter error : mode : remove", function () {
            MashupPlatform.prefs.set("mode", "remove");

            roundOff('abc');

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it("parameter error : mode : pass", function () {
            MashupPlatform.prefs.set("mode", "pass");

            roundOff('abc');

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 'abc');
        });

    });
})();
