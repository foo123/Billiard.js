(function(BILLIARD) {
"use strict";
BILLIARD.TriangleData = function() {
    var self = this;
    self.p0 = new BILLIARD.SimplePoint();
    self.p1 = new BILLIARD.SimplePoint();
    self.dx = 0;
    self.dy = 0;
    self.vx = 0;
    self.vy = 0;
    self.len = 0;
};
BILLIARD.TriangleData.prototype = {
    constructor: BILLIARD.TriangleData,
    p0: null,
    p1: null,
    vx: 0,
    vy: 0,
    dx: 0,
    dy: 0,
    len: 0,
    refresh: function(param1) {
        var self = this;
        if (null == param1) param1 = false;
        if (param1)
        {
            self.vx = BILLIARD.Ball.correctFloatingPointError(self.p1.x - self.p0.x);
            self.vy = BILLIARD.Ball.correctFloatingPointError(self.p1.y - self.p0.y);
        }
        else
        {
            self.p1.update(self.p0.x + self.vx, self.p0.y + self.vy);
        }
        self.len = BILLIARD.TriangleData.getHypotenuse(self.vx, self.vy);
        if (self.len > 0)
        {
            self.dx = BILLIARD.Ball.correctFloatingPointError(self.vx / self.len);
            self.dy = BILLIARD.Ball.correctFloatingPointError(self.vy / self.len);
        }
        else
        {
            self.dx = 0;
            self.dy = 0;
        }
    }
};
BILLIARD.TriangleData.getHypotenuse = function(side1, side2) {
    return BILLIARD.Ball.correctFloatingPointError(Math.hypot(side1, side2));
};
})(BILLIARD);