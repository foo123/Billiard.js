(function(BILLIARD) {
"use strict";
BILLIARD.CollisionResult = function(x1, y1, x2, y2) {
    var self = this;
    if (null == x1) x1 = 0;
    if (null == y1) y1 = 0;
    if (null == x2) x2 = 0;
    if (null == y2) y2 = 0;
    self.p0 = new BILLIARD.SimplePoint(x1, y1);
    self.p1 = new BILLIARD.SimplePoint(x2, y2);
};
BILLIARD.CollisionResult.prototype = {
    constructor: BILLIARD.CollisionResult,
    p0: null,
    p1: null
};
})(BILLIARD);