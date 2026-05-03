(function(BILLIARD) {
"use strict";
BILLIARD.SimplePoint = function(x, y) {
    var self = this;
    if (null == x) x = 0;
    if (null == y) y = 0;
    self.x = 0;
    self.y = 0;
    self.update(x, y);
};
BILLIARD.SimplePoint.prototype = {
    constructor: BILLIARD.SimplePoint,
    x: 0,
    y: 0,
    update: function(x, y) {
        var self = this;
        self.x = BILLIARD.Ball.correctFloatingPointError(x);
        self.y = BILLIARD.Ball.correctFloatingPointError(y);
        return self;
    }
};
})(BILLIARD);