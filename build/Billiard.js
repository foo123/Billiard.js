// BILLIARD
var BILLIARD = {VERSION: "2.0.0"};
/*window.BILLIARD = BILLIARD;*/
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
})(BILLIARD);(function(BILLIARD) {
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
})(BILLIARD);(function(BILLIARD) {
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
})(BILLIARD);(function(BILLIARD) {
"use strict";
BILLIARD.Ball = function Ball(ball, type) {
    var self = this;
    if (null == type) type = 2;
    NEngine.DisplayObject.call(self);
    self.proccess_time = null;
    self.collision_target_time = null;
    self.collision = false;
    self.collision_wall_detail = null;
    self.last_collision_time = null;
    self.line_limit_x = null;
    self.dragging = false;
    self.target = null;
    self.colour = null;
    self.type = type;
    self.m = 1;
    self.r = 1;
    self.vx = null;
    self.vy = null;
    self.direction = new BILLIARD.TriangleData();
    self.direction.p0.update(self.x, self.y);
    self.status = 0;
    self.cacheCanvas = document.createElement('canvas');
    self.image = new Image();
    self.image.onload = function() {
        self.cacheCanvas.width = self.image.width;
        self.cacheCanvas.height = self.image.height;
        self.width = self.image.width;
        self.height = self.image.height;
        self.regX = self.image.width/2;
        self.regY = self.image.height/2;
        self.r = self.image.width/2-1;
        //self.line_limit_x = 538 + self.r;
        var ctx = self.cacheCanvas.getContext('2d');
        ctx.drawImage(self.image, 0, 0);
    };
    self.line_limit_x = 538 + self.r;
    self.updateProccessTime(1);
    self.image.src = ball;
};
BILLIARD.Ball.inheritsFrom(NEngine.DisplayObject);

BILLIARD.Ball.prototype.proccess_time = null;
BILLIARD.Ball.prototype.collision_target_time = null;
BILLIARD.Ball.prototype.collision = false;
BILLIARD.Ball.prototype.collision_wall_detail = null;
BILLIARD.Ball.prototype.last_collision_time = null;
BILLIARD.Ball.prototype.line_limit_x = null;
BILLIARD.Ball.prototype.dragging = false;
BILLIARD.Ball.prototype.direction = null;
BILLIARD.Ball.prototype.target = null;
BILLIARD.Ball.prototype.colour = null;
BILLIARD.Ball.prototype.status = null;
BILLIARD.Ball.prototype.type = null;
BILLIARD.Ball.prototype.m = 1;
BILLIARD.Ball.prototype.r = 1;
BILLIARD.Ball.prototype.vx = null;
BILLIARD.Ball.prototype.vy = null;
BILLIARD.Ball.prototype.draw = function(ctx, ignoreCache) {
    this.__draw(ctx, ignoreCache);
};
BILLIARD.Ball.prototype.allowDrag = function(allow) {
    var self = this;
    self.dragging = false;
    self.onMouseDown = null;
    self.mouseEnabled = false;
    self.useHandCursor = false;
    /*
    if (allow)
    {
        self.dragging = true;
        //self.onMouseDown=function() {self.startDragging()};
        self.mouseEnabled = true;
        self.useHandCursor = true;
    }
    else
    {
        self.dragging = false;
        //self.stopDrag();
        self.onMouseDown = null;
        self.mouseEnabled = false;
        self.useHandCursor = false;
        self.move(self.x, self.y);
        if (BILLIARD.Ball.isPositionOverlapped(self.x, self.y, self) != null)
        {
            self.putBehindLine();
        }
    }*/
};
BILLIARD.Ball.prototype.affectSpeed = function(factor) {
    var self = this;
    if (null == factor) factor = 0.975;
    self.direction.vx = BILLIARD.Ball.correctFloatingPointError(self.direction.vx * factor);
    self.direction.vy = BILLIARD.Ball.correctFloatingPointError(self.direction.vy * factor);
    if (Math.abs(self.direction.vx) <= 0.1 && Math.abs(self.direction.vy) < 0.1)
    {
        self.direction.vx = 0;
        self.direction.vy = 0;
    }
    self.direction.refresh();
};
BILLIARD.Ball.prototype.inHole = function() {
    var self = this;
    if (self.type !== 1) return false;
    var _loc_1 = false;
    var _loc_2 = NaN;
    var _loc_3 = NaN;
    _loc_1 = self.direction.p0.y < BILLIARD.Ball.w.y2 - (BILLIARD.Ball.w.y2 - BILLIARD.Ball.w.y1) / 2;
    _loc_2 = BILLIARD.Ball.w.x2 - (BILLIARD.Ball.w.x2 - BILLIARD.Ball.w.x1) / 2;
    _loc_3 = 0.707107;
    if (self.direction.p0.x < _loc_2 + self.r / 1.25 && self.direction.p0.x > _loc_2 - self.r / 1.25)
    {
        self.x = _loc_2;
        if (_loc_1)
        {
            self.y = BILLIARD.Ball.w.y1 - self.r / 2;
        }
        else
        {
            self.y = BILLIARD.Ball.w.y2 + self.r / 2;
        }
        return true;
    }
    if (self.direction.p0.y < BILLIARD.Ball.w.y1 + self.r * 1.3)
    {
        if (self.direction.p0.x > BILLIARD.Ball.w.x2 - self.r * 1.3)
        {
            self.x = BILLIARD.Ball.w.x2 - 3;
            self.y = BILLIARD.Ball.w.y1 + 3;
            return true;
        }
        if (self.direction.p0.x < BILLIARD.Ball.w.x1 + self.r * 1.3)
        {
            self.x = BILLIARD.Ball.w.x1 + 3;
            self.y = BILLIARD.Ball.w.y1 + 3;
            return true;
        }
    }
    else if (self.direction.p0.y > BILLIARD.Ball.w.y2 - self.r * 1.3)
    {
        if (self.direction.p0.x > BILLIARD.Ball.w.x2 - self.r * 1.3)
        {
            self.x = BILLIARD.Ball.w.x2 - 3;
            self.y = BILLIARD.Ball.w.y2 - 3;
            return true;
        }
        if (self.direction.p0.x < BILLIARD.Ball.w.x1 + self.r * 1.3)
        {
            self.x = BILLIARD.Ball.w.x1 + 3;
            self.y = BILLIARD.Ball.w.y2 - 3;
            return true;
        }
    }
    return false;
};
BILLIARD.Ball.prototype.updateDirection = function(dx, dy) {
    var self = this;
    self.direction.p1.update(dx, dy);
    self.direction.refresh(true);
};
BILLIARD.Ball.prototype.move = function(x, y) {
    var self = this;
    self.x = x;
    self.y = y;
    self.direction.p0.update(x, y);
};
BILLIARD.Ball.prototype.putBehindLine = function() {
    var self = this,
        w = BILLIARD.Ball.w,
        r = self.r,
        x = Math.random() * (w.x2 - r - self.line_limit_x),
        y = Math.random() * (w.y2 - r - (w.y1 + r))
    ;
    self.direction.vx = 0;
    self.direction.vy = 0;
    self.move(self.line_limit_x + x, w.y1 + r + y);
    if (BILLIARD.Ball.isPositionOverlapped(self.x, self.y, self) != null)
    {
        self.putBehindLine();
    }
    else
    {
        //self.allowDrag(true);
    }
};
BILLIARD.Ball.prototype.startDragging = function(event) {
    /*
    var self = this,
        w = BILLIARD.Ball.w,
        r = self.r;
    //self.startDrag(true, new NEngine.Rect(self.line_limit_x, w.y1 + r, w.x2 - self.line_limit_x - r, w.y2 - w.y1 - r * 2));
    */
};
BILLIARD.Ball.prototype.updateProccessTime = function(t) {
    var self = this;
    self.proccess_time = BILLIARD.Ball.correctFloatingPointError(t);
    self.vx = BILLIARD.Ball.correctFloatingPointError(self.direction.vx * self.proccess_time);
    self.vy = BILLIARD.Ball.correctFloatingPointError(self.direction.vy * self.proccess_time);
};

BILLIARD.Ball.w = {x1:29, y1:35, x2:585-29, y2:365-39};
//BILLIARD.Ball.w = {x1:135, y1:102, x2:665, y2:397};
BILLIARD.Ball.isPositionOverlapped = function() {return null;};
BILLIARD.Ball.simulateElasticCollision = function(ball1, ball2) {
    var _loc_3 = null,
        _loc_4 = NaN,
        _loc_5 = null,
        _loc_6 = null,
        _loc_7 = NaN,
        _loc_8 = NaN,
        _loc_9 = NaN,
        _loc_10 = NaN,
        _loc_11 = NaN,
        _loc_12 = NaN,
        _loc_13 = null,
        _loc_14 = null,
        _loc_15 = null,
        _loc_16 = null
    ;
    _loc_3 = new BILLIARD.SimplePoint(ball2.direction.p0.x - ball1.direction.p0.x, ball2.direction.p0.y - ball1.direction.p0.y);
    _loc_4 = BILLIARD.TriangleData.getHypotenuse(_loc_3.x, _loc_3.y);
    _loc_5 = new BILLIARD.SimplePoint(_loc_3.x / _loc_4, _loc_3.y / _loc_4);
    _loc_6 = new BILLIARD.SimplePoint(-_loc_5.y, _loc_5.x);
    _loc_7 = BILLIARD.Ball.correctFloatingPointError(_loc_5.x * ball1.direction.vx + _loc_5.y * ball1.direction.vy);
    _loc_8 = BILLIARD.Ball.correctFloatingPointError(_loc_6.x * ball1.direction.vx + _loc_6.y * ball1.direction.vy);
    _loc_9 = BILLIARD.Ball.correctFloatingPointError(_loc_5.x * ball2.direction.vx + _loc_5.y * ball2.direction.vy);
    _loc_10 = BILLIARD.Ball.correctFloatingPointError(_loc_6.x * ball2.direction.vx + _loc_6.y * ball2.direction.vy);
    _loc_11 = BILLIARD.Ball.correctFloatingPointError((_loc_7 * (ball1.m - ball2.m) + 2 * ball2.m * _loc_9) / (ball1.m + ball2.m));
    _loc_12 = BILLIARD.Ball.correctFloatingPointError((_loc_9 * (ball2.m - ball1.m) + 2 * ball1.m * _loc_7) / (ball1.m + ball2.m));
    _loc_13 = new BILLIARD.SimplePoint(_loc_5.x * _loc_11, _loc_5.y * _loc_11);
    _loc_14 = new BILLIARD.SimplePoint(_loc_6.x * _loc_8, _loc_6.y * _loc_8);
    _loc_15 = new BILLIARD.SimplePoint(_loc_5.x * _loc_12, _loc_5.y * _loc_12);
    _loc_16 = new BILLIARD.SimplePoint(_loc_6.x * _loc_10, _loc_6.y * _loc_10);
    return new BILLIARD.CollisionResult(BILLIARD.Ball.correctFloatingPointError(_loc_13.x + _loc_14.x), BILLIARD.Ball.correctFloatingPointError(_loc_13.y + _loc_14.y), BILLIARD.Ball.correctFloatingPointError(_loc_15.x + _loc_16.x), BILLIARD.Ball.correctFloatingPointError(_loc_15.y + _loc_16.y));
};
BILLIARD.Ball.findTimeUntilCollide = function(ball1, ball2) {
    var _loc_3 = NaN,
        _loc_4 = NaN,
        _loc_5 = NaN,
        _loc_6 = NaN,
        _loc_7 = NaN,
        _loc_8 = NaN
    ;
    _loc_3 = -1;
    _loc_4 = BILLIARD.Ball.correctFloatingPointError(Math.pow(ball2.vx - ball1.vx, 2) + Math.pow(ball2.vy - ball1.vy, 2));
    _loc_5 = BILLIARD.Ball.correctFloatingPointError(2 * ((ball2.direction.p0.x - ball1.direction.p0.x) * (ball2.vx - ball1.vx) + (ball2.direction.p0.y - ball1.direction.p0.y) * (ball2.vy - ball1.vy)));
    _loc_6 = BILLIARD.Ball.correctFloatingPointError(Math.pow(ball2.direction.p0.x - ball1.direction.p0.x, 2) + Math.pow(ball2.direction.p0.y - ball1.direction.p0.y, 2) - Math.pow(ball1.r + ball2.r, 2));
    _loc_7 = BILLIARD.Ball.correctFloatingPointError(Math.pow(_loc_5, 2) - 4 * _loc_4 * _loc_6);
    if (_loc_4 !== 0)
    {
        _loc_8 = BILLIARD.Ball.correctFloatingPointError((-_loc_5 - Math.sqrt(_loc_7)) / (2 * _loc_4));
        if (_loc_8 >= 0)
        {
            _loc_3 = _loc_8;
        }
    }
    return _loc_3;
};
BILLIARD.Ball.stillOnTable = function(x, y,r) {
    var w = BILLIARD.Ball.w;
    return x - r >= w.x1 && x + r <= w.x2 && y - r >= w.y1 && y + r <= w.y2;
};
BILLIARD.Ball.correctFloatingPointError = function(val, precision) {
    if (null == precision) precision = 10;
    var _loc_3 = Math.pow(10, precision);
    return Math.round(_loc_3 * val) / _loc_3;
};
BILLIARD.Ball.doElasticCollision = function(ball1, ball2) {
    var _loc_3 = null,
        _loc_4 = NaN,
        _loc_5 = null,
        _loc_6 = null,
        _loc_7 = NaN,
        _loc_8 = NaN,
        _loc_9 = NaN,
        _loc_10 = NaN,
        _loc_11 = NaN,
        _loc_12 = NaN,
        _loc_13 = null,
        _loc_14 = null,
        _loc_15 = null,
        _loc_16 = null
    ;
    _loc_3 = new BILLIARD.SimplePoint(ball2.direction.p0.x - ball1.direction.p0.x, ball2.direction.p0.y - ball1.direction.p0.y);
    _loc_4 = BILLIARD.TriangleData.getHypotenuse(_loc_3.x, _loc_3.y);
    _loc_5 = new BILLIARD.SimplePoint(_loc_3.x / _loc_4, _loc_3.y / _loc_4);
    _loc_6 = new BILLIARD.SimplePoint(-_loc_5.y, _loc_5.x);
    _loc_7 = BILLIARD.Ball.correctFloatingPointError(_loc_5.x * ball1.vx + _loc_5.y * ball1.vy);
    _loc_8 = BILLIARD.Ball.correctFloatingPointError(_loc_6.x * ball1.vx + _loc_6.y * ball1.vy);
    _loc_9 = BILLIARD.Ball.correctFloatingPointError(_loc_5.x * ball2.vx + _loc_5.y * ball2.vy);
    _loc_10 = BILLIARD.Ball.correctFloatingPointError(_loc_6.x * ball2.vx + _loc_6.y * ball2.vy);
    _loc_11 = BILLIARD.Ball.correctFloatingPointError((_loc_7 * (ball1.m - ball2.m) + 2 * ball2.m * _loc_9) / (ball1.m + ball2.m));
    _loc_12 = BILLIARD.Ball.correctFloatingPointError((_loc_9 * (ball2.m - ball1.m) + 2 * ball1.m * _loc_7) / (ball1.m + ball2.m));
    _loc_13 = new BILLIARD.SimplePoint(_loc_5.x * _loc_11, _loc_5.y * _loc_11);
    _loc_14 = new BILLIARD.SimplePoint(_loc_6.x * _loc_8, _loc_6.y * _loc_8);
    _loc_15 = new BILLIARD.SimplePoint(_loc_5.x * _loc_12, _loc_5.y * _loc_12);
    _loc_16 = new BILLIARD.SimplePoint(_loc_6.x * _loc_10, _loc_6.y * _loc_10);
    ball1.direction.vx = BILLIARD.Ball.correctFloatingPointError(_loc_13.x + _loc_14.x);
    ball1.direction.vy = BILLIARD.Ball.correctFloatingPointError(_loc_13.y + _loc_14.y);
    ball1.collision = true;
    ball2.direction.vx = BILLIARD.Ball.correctFloatingPointError(_loc_15.x + _loc_16.x);
    ball2.direction.vy = BILLIARD.Ball.correctFloatingPointError(_loc_15.y + _loc_16.y);
    ball2.collision = true;
};
BILLIARD.Ball.doElasticCollisionWithWall = function(ball, wall) {
    switch (wall.y)
    {
        case 1:
        {
            ball.direction.vx = Math.abs(ball.vx);
            ball.direction.refresh();
            break;
        }
        case 2:
        {
            ball.direction.vy = Math.abs(ball.vy);
            ball.direction.refresh();
            break;
        }
        case 3:
        {
            ball.direction.vx = -Math.abs(ball.vx);
            ball.direction.refresh();
            break;
        }
        case 4:
        {
            ball.direction.vy = -Math.abs(ball.vy);
            ball.direction.refresh();
            break;
        }
        default:
        {
            break;
        }
    }
};
BILLIARD.Ball.findTimeUntilCollideWithWall = function(param1) {
    var _loc_2 = null,
        _loc_3 = false,
        _loc_4 = NaN,
        w = BILLIARD.Ball.w
    ;
    _loc_2 = new BILLIARD.SimplePoint();
    _loc_2.x = -1;
    _loc_3 = false;
    _loc_4 = 0;
    if (param1.direction.vx < 0)
    {
        _loc_4 = BILLIARD.Ball.correctFloatingPointError((param1.r - param1.direction.p0.x + w.x1) / param1.vx);
        if (_loc_4 >= 0)
        {
            _loc_2.y = 1;
            _loc_2.x = _loc_4;
            _loc_3 = true;
        }
    }
    if (param1.direction.vy < 0)
    {
        _loc_4 = BILLIARD.Ball.correctFloatingPointError((param1.r - param1.direction.p0.y + w.y1) / param1.vy);
        if (_loc_4 >= 0)
        {
            if (!_loc_3 || _loc_4 < _loc_2.x)
            {
                _loc_2.y = 2;
                _loc_2.x = _loc_4;
                _loc_3 = true;
            }
        }
    }
    if (param1.direction.vx > 0)
    {
        _loc_4 = BILLIARD.Ball.correctFloatingPointError((w.x2 - param1.r - param1.direction.p0.x) / param1.vx);
        if (_loc_4 >= 0)
        {
            if (!_loc_3 || _loc_4 < _loc_2.x)
            {
                _loc_2.y = 3;
                _loc_2.x = _loc_4;
                _loc_3 = true;
            }
        }
    }
    if (param1.direction.vy > 0)
    {
        _loc_4 = BILLIARD.Ball.correctFloatingPointError((w.y2 - param1.r - param1.direction.p0.y) / param1.vy);
        if (_loc_4 >= 0)
        {
            if (!_loc_3 || _loc_4 < _loc_2.x)
            {
                _loc_2.y = 4;
                _loc_2.x = _loc_4;
                _loc_3 = true;
            }
        }
    }
    return _loc_2;
};
})(BILLIARD);(function(BILLIARD) {
"use strict";
BILLIARD.Taco = function Taco(taco) {
    var self = this;
    NEngine.InteractiveObject.call(self);
    self.moving = false;
    self.holding = false;
    self.locked = false;
    self.hits = 0;
    self.first_hit = null;
    self.whiteBall = null;
    self.last_power_factor = null;
    self.maxPower = 120;
    self.maxRadius = 100;
    self.name = 'taco';
    self.init_mouse = new BILLIARD.TriangleData();
    self.vector_mouse = new BILLIARD.TriangleData();
    self.skipBounds = true;
    self.onKeyDown = function(e) {self.onPress(e)};
    self.onKeyUp = function(e) {self.onRelease(e)};
    self.onTouchStart = function(e) {self.onPress(e);};
    self.onTouchEnd = function(e) {self.onRelease(e);};
    self.onTouchMove = function(e) {if (e.preventDefault) e.preventDefault();};
    self.cacheCanvas = document.createElement('canvas');
    self.image = new Image();
    self.image.onload = function() {
        self.cacheCanvas.width = self.image.width;
        self.cacheCanvas.height = self.image.height;
        self.width = self.image.width;
        self.height = self.image.height;
        self.regX = self.image.width/2;
        self.regY = 0;
        var ctx = self.cacheCanvas.getContext('2d');
        ctx.drawImage(self.image, 0, 0);

    };
    self.image.src = taco;
};
BILLIARD.Taco.inheritsFrom(NEngine.InteractiveObject);

BILLIARD.Taco.prototype.moving = false;
BILLIARD.Taco.prototype.holding = false;
BILLIARD.Taco.prototype.locked = false;
BILLIARD.Taco.prototype.hits = 0;
BILLIARD.Taco.prototype.first_hit = null;
BILLIARD.Taco.prototype.vector_mouse = null;
BILLIARD.Taco.prototype.init_mouse = null;
BILLIARD.Taco.prototype.whiteBall = null;
BILLIARD.Taco.prototype.last_power_factor = null;
BILLIARD.Taco.prototype.maxPower = 120;
BILLIARD.Taco.prototype.maxRadius = 100;
BILLIARD.Taco.prototype.image = null;
BILLIARD.Taco.prototype.draw = function(ctx, ignoreCache) {
    this.__draw(ctx,ignoreCache);
};
BILLIARD.Taco.prototype.init = function(whiteBall) {
    var self = this;
    self.moving = true;
    self.holding = false;
    self.alpha = 0;
    self.hits = 0;
    self.whiteBall = whiteBall;
};
BILLIARD.Taco.prototype.putOnBorder = function(off) {
    if (null == off) off = 0;
    var self = this,
        a = self.rotation+Math.PI*0.5,
        c = Math.cos(a),
        s = Math.sin(a),
        r = self.whiteBall.r + 5 + off;
    //self.x = self.whiteBall.x + self.vector_mouse.dx * self.whiteBall.r;
    //self.y = self.whiteBall.y + self.vector_mouse.dy * self.whiteBall.r;
    self.x = self.whiteBall.x + c * r;
    self.y = self.whiteBall.y + s * r;
};
BILLIARD.Taco.prototype.updateState = function() {
    var self = this,
        _loc_1 = null,
        _loc_2 = NaN;
    if (self.moving)
    {
        //self.rotation=-Math.PI/2;
        //self.putOnBorder();
        //return;
        if (self.holding)
        {
            _loc_1 = new BILLIARD.TriangleData();
            _loc_1.p0 = new BILLIARD.SimplePoint(self.whiteBall.x, self.whiteBall.y);
            _loc_1.p1 = new BILLIARD.SimplePoint(self.parent.mouseX, self.parent.mouseY);
            _loc_1.refresh(true);
            _loc_2 = _loc_1.len - self.init_mouse.len;
            if (_loc_1.len <= self.whiteBall.r || _loc_2 <= 0)
            {
                self.putOnBorder();
            }
            else if (_loc_2 <= self.maxRadius && (self.vector_mouse.dx > 0 && _loc_1.dx > 0 || self.vector_mouse.dx < 0 && _loc_1.dx < 0))
            {
                //self.x = self.whiteBall.x + self.vector_mouse.dx * (self.whiteBall.r + _loc_2);
                //self.y = self.whiteBall.y + self.vector_mouse.dy * (self.whiteBall.r + _loc_2);
                self.putOnBorder(_loc_2);
            }
        }
        else
        {
            self.vector_mouse.p0 = new BILLIARD.SimplePoint(self.whiteBall.x, self.whiteBall.y);
            self.vector_mouse.p1 = new BILLIARD.SimplePoint(self.parent.mouseX, self.parent.mouseY);
            self.vector_mouse.refresh(true);
            if (self.vector_mouse.dx < 0)
            {
                self.rotation = Math.PI/2 + Math.atan(self.vector_mouse.vy / self.vector_mouse.vx);
            }
            else
            {
                self.rotation = 3*Math.PI/2 + Math.atan(self.vector_mouse.vy / self.vector_mouse.vx);
            }
            self.putOnBorder();
        }
    }
};
BILLIARD.Taco.prototype.onPress = function(event) {
    var self = this;
    if (!self.locked)
    {
        if (event.touches)
        {
            var start_mouse = new BILLIARD.SimplePoint(self.parent.mouseX, self.parent.mouseY);
            setTimeout(function update() {
                var curr_mouse = new BILLIARD.SimplePoint(self.parent.mouseX, self.parent.mouseY),
                    dist = BILLIARD.TriangleData.getHypotenuse(curr_mouse.x-start_mouse.x, curr_mouse.y-start_mouse.y);
                if (dist < 1)
                {
                    self.init_mouse.p0 = new BILLIARD.SimplePoint(self.whiteBall.x, self.whiteBall.y);
                    self.init_mouse.p1 = new BILLIARD.SimplePoint(curr_mouse.x, curr_mouse.y);
                    self.init_mouse.refresh(true);
                    self.holding = true;
                    self.locked = true;
                }
                else
                {
                    start_mouse = curr_mouse;
                    setTimeout(update, 2000);
                }
            }, 2000);
        }
        else if (event.keyCode === 81) //q key pressed
        {
            self.init_mouse.p0 = new BILLIARD.SimplePoint(self.whiteBall.x, self.whiteBall.y);
            self.init_mouse.p1 = new BILLIARD.SimplePoint(self.parent.mouseX, self.parent.mouseY);
            self.init_mouse.refresh(true);
            self.holding = true;
            self.locked = true;
        }
    }
};
BILLIARD.Taco.prototype.onRelease = function(event) {
    var self = this,
        _loc_2 = null,
        _loc_5 = NaN;
    if (self.whiteBall.dragging)
    {
        self.whiteBall.allowDrag(false);
    }
    if (self.holding)
    {
        _loc_2 = new BILLIARD.TriangleData();
        _loc_2.p0 = new BILLIARD.SimplePoint(self.whiteBall.x + self.init_mouse.dx * self.whiteBall.r, self.whiteBall.y + self.init_mouse.dy * self.whiteBall.r);
        _loc_2.p1 = new BILLIARD.SimplePoint(self.x, self.y);
        _loc_2.refresh(true);
        self.moving = false;
        self.holding = false;
        self.locked = false;
        self.putOnBorder();
        if (_loc_2.len > 0 && self.whiteBall.direction.vx === 0 && self.whiteBall.direction.vy === 0)
        {
            self.last_power_factor = _loc_2.len / self.maxRadius;
            _loc_5 = self.last_power_factor * self.maxPower;
            /*if (self.hits > 0)
            {
                _loc_5 = _loc_5 * 0.65;
            }*/
            self.first_hit = null;
            self.whiteBall.updateDirection(self.whiteBall.x + _loc_5 * (-self.init_mouse.dx), self.whiteBall.y + _loc_5 * (-self.init_mouse.dy));
            ++self.hits;
        }
    }
};
BILLIARD.Taco.prototype.getDirection = function() {
    return new BILLIARD.SimplePoint(-this.vector_mouse.dx, -this.vector_mouse.dy);
};
})(BILLIARD);(function(BILLIARD) {
"use strict";
BILLIARD.Game = function Game(container, type, table1, table2, ball, black, yel, red, taco) {
    var self = this;
    self.fps = 12; // 12 FPS
    NEngine.env.interval = 1000/self.fps;
    NEngine.Stage.call(self, container);

    self.canvas = container;
    self.width = 585;
    self.height = 365;

    self.c0_fake = null;
    self.c0 = null;
    self.c1 = null;
    self.c2 = null;
    self.c3 = null;
    self.c4 = null;
    self.c5 = null;
    self.c6 = null;
    self.c7 = null;
    self.c8 = null;
    self.c9 = null;
    self.c10 = null;
    self.c11 = null;
    self.c12 = null;
    self.c13 = null;
    self.c14 = null;
    self.c15 = null;
    self.balls = [];
    self.balls_removed = [];
    self.lines = null;
    self.taco = null;
    self.diff = null;
    self.tri = null;
    self.americantable = new NEngine.Bitmap(table1, 0, 0);
    self.frenchtable = new NEngine.Bitmap(table2, 0, 0);
    self.taco = new BILLIARD.Taco(taco);
    self.white = ball;
    self.black = black;
    self.red = red;
    self.yellow = yel;

    BILLIARD.Ball.isPositionOverlapped = function(x, y, ball) {
        if (null == ball) ball = null;
        self.tri = new BILLIARD.TriangleData();
        self.tri.p0.x = x;
        self.tri.p0.y = y;
        var i = 0;
        while (i < self.balls.length)
        {
            if (ball !== self.balls[i])
            {
                self.tri.p1 = self.balls[i].direction.p0;
                self.tri.refresh(true);
                self.diff = BILLIARD.Ball.correctFloatingPointError(self.tri.len - self.balls[i].r * 2);
                if (self.diff < 0)
                {
                    console.error("ERROR!! ball[" + ball.name + "] is overlapping with [" + self.balls[i].name + "] by " + self.diff + " pixels.");
                    return self.balls[i];
                }
            }
            ++i;
        }
        return null;
    };

    self.stagetick = self.tick;
    self.init(type);
};
BILLIARD.Game.inheritsFrom(NEngine.Stage);

BILLIARD.Game.prototype.lines = null;
BILLIARD.Game.prototype.diff = null;
BILLIARD.Game.prototype.tri = null;
BILLIARD.Game.prototype.taco = null;
BILLIARD.Game.prototype.c0_fake = null;
BILLIARD.Game.prototype.c0 = null;
BILLIARD.Game.prototype.c1 = null;
BILLIARD.Game.prototype.c2 = null;
BILLIARD.Game.prototype.c3 = null;
BILLIARD.Game.prototype.c4 = null;
BILLIARD.Game.prototype.c5 = null;
BILLIARD.Game.prototype.c6 = null;
BILLIARD.Game.prototype.c7 = null;
BILLIARD.Game.prototype.c8 = null;
BILLIARD.Game.prototype.c9 = null;
BILLIARD.Game.prototype.c10 = null;
BILLIARD.Game.prototype.c11 = null;
BILLIARD.Game.prototype.c12 = null;
BILLIARD.Game.prototype.c13 = null;
BILLIARD.Game.prototype.c14 = null;
BILLIARD.Game.prototype.c15 = null;
BILLIARD.Game.prototype.balls = null;
BILLIARD.Game.prototype.balls_removed = null;
BILLIARD.Game.prototype.frenchtable = null;
BILLIARD.Game.prototype.americantable = null;
BILLIARD.Game.prototype.white = null;
BILLIARD.Game.prototype.black = null;
BILLIARD.Game.prototype.red = null;
BILLIARD.Game.prototype.yellow = null;
BILLIARD.Game.prototype.addBall = function(ball) {
    ball.updateDirection(ball.x, ball.y);
    this.balls.push(ball);
};
BILLIARD.Game.prototype.init = function(type) {
    var self = this;
    self.type = type;
    self.tick = self.stagetick;
    self.balls = [];
    self.balls_removed = [];

    while (self.numChildren > 0) self.removeChildAt(0);

    if (self.type === 1) // american pool
    {
        self.addChild(self.americantable);
    }
    else  // french billiard
    {
        self.addChild(self.frenchtable);
    }

    self.c0_fake = new BILLIARD.Ball(self.white, self.type);
    self.c0_fake.name = "c0_fake";
    self.c0_fake.colour = 0;
    self.c0_fake.alpha = 0.5;
    self.addChild(self.c0_fake);
    self.c0 = new BILLIARD.Ball(self.white, self.type);
    self.c0.name = 'c0';
    self.c0.colour = 0;

    if (self.type === 1) // american pool
    {
        var b_index = 1;
        while (b_index <= 15)
        {
            self["c" +  b_index] = null;
            if (b_index === 8)
            {
                self["c" +  b_index] = new BILLIARD.Ball(self.black, self.type);
                self["c" + b_index].colour = 1;
            }
            else if (b_index < 8)
            {
                self["c" +  b_index] = new BILLIARD.Ball(self.yellow, self.type);
                self["c" + b_index].colour = 2;
            }
            else if (b_index > 8)
            {
                self["c" +  b_index] = new BILLIARD.Ball(self.red, self.type);
                self["c" + b_index].colour = 3;
            }
            self["c" +  b_index].name = "c"+b_index;
            ++b_index;
        }
    }
    else // french billiard
    {
        self.c1 = new BILLIARD.Ball(self.black, self.type);
        self.c1.name = 'c1';
        self.c1.colour = 1;
        self.c2 = new BILLIARD.Ball(self.red, self.type);
        self.c2.name = 'c2';
        self.c2.colour = 3;
        self.c3 = new BILLIARD.Ball(self.yellow, self.type);
        self.c3.name = 'c3';
        self.c3.colour = 2;
    }

    // position balls on table
    self.c0.x = 578-107;
    self.c0.y = 164-66;
    self.c0.direction.p0.update(self.c0.x, self.c0.y);
    self.addChild(self.c0);
    self.addBall(self.c0);

    if (self.type === 1) // american pool
    {
        self.c1.x = 311;
        self.c1.y = 248;
        self.c2.x = 287;
        self.c2.y = 262;
        self.c3.x = 239;
        self.c3.y = 289;
        self.c4.x = 215;
        self.c4.y = 248;
        self.c5.x = 239;
        self.c5.y = 234;
        self.c6.x = 263;
        self.c6.y = 221;
        self.c7.x = 215;
        self.c7.y = 194;

        self.c8.x = 263;
        self.c8.y = 248;

        self.c9.x = 287;
        self.c9.y = 234;
        self.c10.x = 215;
        self.c10.y = 221;
        self.c11.x = 239;
        self.c11.y = 207;
        self.c12.x = 263;
        self.c12.y = 276;
        self.c13.x = 239;
        self.c13.y = 262;
        self.c14.x = 215;
        self.c14.y = 276;
        self.c15.x = 215;
        self.c15.y = 303;
        for (var i=1; i<16; ++i)
        {
            self['c'+i].x -= 107;
            self['c'+i].y -= 66;
            self['c'+i].direction.p0.update(self['c'+i].x, self['c'+i].y);
            self.addChild(self["c" + i]);
            self.addBall(self["c" + i]);
        }
    }
    else // french billiard
    {
        self.c1.x = 200;
        self.c1.y = self.height/2;
        self.c1.direction.p0.update(self.c1.x, self.c1.y);
        self.addChild(self.c1);
        self.addBall(self.c1);
        self.c2.x = 200;
        self.c2.y = 50;
        self.c2.direction.p0.update(self.c2.x, self.c2.y);
        self.addChild(self.c2);
        self.addBall(self.c2);
        self.c3.x = 200;
        self.c3.y = self.height-50;
        self.c3.direction.p0.update(self.c3.x, self.c3.y);
        self.addChild(self.c3);
        self.addBall(self.c3);
    }
    self.c0.putBehindLine();
    self.taco.init(self.c0);
    self.addChild(self.taco);
    //self.addChild(self.lines);
    self.tick = function() {self.onEnterFrame();};
};
BILLIARD.Game.prototype.onEnterFrame = function(event) {
    var self = this,
        _loc_2 = 0,
        _loc_3 = false,
        _loc_6 = NaN,
        _loc_7 = NaN,
        _loc_8 = NaN,
        _loc_9 = NaN,
        _loc_10 = NaN,
        _loc_11 = NaN,
        _loc_12 = false,
        _loc_13 = null,
        _loc_14 = null,
        _loc_15 = null,
        _loc_16 = null,
        _loc_17 = undefined
    ;
    _loc_3 = false;
    _loc_2 = 0;
    while (_loc_2 < self.balls.length)
    {
        self.balls[_loc_2].updateProccessTime(1);
        if (self.balls[_loc_2].direction.len > 0)
        {
            _loc_3 = true;
        }
        ++_loc_2;
    }
    if (_loc_3)
    {
        _loc_6 = 0;
        _loc_7 = 0;
        _loc_8 = 1;
        _loc_9 = 0;
        _loc_10 = 0;
        while (_loc_8 > 0 && _loc_3)
        {
            _loc_3 = false;
            _loc_2 = 0;
            while (_loc_2 < self.balls.length)
            {

                self.balls[_loc_2].collision = false;
                self.balls[_loc_2].target = null;
                self.balls[_loc_2].collision_wall_detail = null;
                self.balls[_loc_2].collision_target_time = Infinity;
                _loc_13 = self.getBallsInCollision(self.balls[_loc_2]);
                if (_loc_13.length > 0)
                {
                    self.balls[_loc_2].target = _loc_13[0];
                    self.balls[_loc_2].collision_target_time = _loc_13[0].last_collision_time;
                }
                _loc_14 = BILLIARD.Ball.findTimeUntilCollideWithWall(self.balls[_loc_2]);
                if (_loc_14.x >= 0 && _loc_14.x < 1 && (self.balls[_loc_2].collision_target_time == Infinity || _loc_14.x < self.balls[_loc_2].collision_target_time))
                {
                    self.balls[_loc_2].collision_target_time = _loc_14.x;
                    self.balls[_loc_2].collision_wall_detail = _loc_14;
                    self.balls[_loc_2].target = null;
                }
                ++_loc_2;
            }
            self.balls.sort(self.sortByTargetCollisionTime);
            _loc_11 = 1;
            _loc_12 = false;
            _loc_2 = 0;
            while (_loc_2 < self.balls.length)
            {
                _loc_15 = self.balls[_loc_2];
                if (_loc_15.direction.len > 0 && !_loc_15.collision)
                {
                    _loc_16 = _loc_15.target;
                    if (_loc_16 != null && _loc_16.target == _loc_15 && (_loc_11 == 1 || _loc_11 == _loc_15.collision_target_time))
                    {
                        _loc_3 = true;
                        if (_loc_6 === 0)
                        {
                            _loc_7 = Math.max(_loc_15.direction.len, _loc_16.direction.len) / 50;
                            if (_loc_7 > 1)
                            {
                                _loc_7 = 1;
                            }
                            if (self.taco.first_hit == null && (_loc_15.name == "c0" || _loc_16.name == "c0"))
                            {
                                self.taco.first_hit = _loc_15.name == "c0" ? (_loc_16) : (_loc_15);
                            }
                        }
                        ++_loc_6;
                        _loc_11 = _loc_15.collision_target_time;
                        _loc_9 = _loc_15.direction.p0.x + _loc_15.vx * 0.9999 * _loc_11;
                        _loc_10 = _loc_15.direction.p0.y + _loc_15.vy * 0.9999 * _loc_11;
                        _loc_15.move(_loc_9, _loc_10);
                        _loc_9 = _loc_16.direction.p0.x + _loc_16.vx * 0.9999 * _loc_11;
                        _loc_10 = _loc_16.direction.p0.y + _loc_16.vy * 0.9999 * _loc_11;
                        _loc_16.move(_loc_9, _loc_10);
                        BILLIARD.Ball.doElasticCollision(_loc_15, _loc_16);
                        _loc_15.updateProccessTime(_loc_15.proccess_time - _loc_15.proccess_time * _loc_11);
                        _loc_15.collision = true;
                        _loc_15.affectSpeed(0.96);
                        _loc_16.updateProccessTime(_loc_16.proccess_time - _loc_16.proccess_time * _loc_11);
                        _loc_16.collision = true;
                        _loc_16.affectSpeed(0.96);
                        _loc_15.target = null;
                        _loc_15.collision_target_time = Infinity;
                        _loc_16.target = null;
                        _loc_16.collision_target_time = Infinity;
                        if (!_loc_12)
                        {
                            _loc_8 = BILLIARD.Ball.correctFloatingPointError(_loc_8 - _loc_8 * _loc_11);
                            _loc_12 = true;
                        }
                    }
                    else if (_loc_15.collision_wall_detail != null && (_loc_11 == 1 || _loc_11 == _loc_15.collision_target_time))
                    {
                        _loc_11 = _loc_15.collision_target_time;
                        _loc_15.move(_loc_15.direction.p0.x + _loc_15.vx * 0.9999 * _loc_11, _loc_15.direction.p0.y + _loc_15.vy * 0.9999 * _loc_11);
                        if (!_loc_15.inHole())
                        {
                            _loc_3 = true;
                            BILLIARD.Ball.doElasticCollisionWithWall(_loc_15, _loc_15.collision_wall_detail);
                            _loc_15.collision = true;
                            _loc_15.updateProccessTime(_loc_15.proccess_time - _loc_15.proccess_time * _loc_11);
                            _loc_15.affectSpeed(0.925);
                        }
                        else
                        {
                            _loc_17 = 0;
                            while (_loc_17 < self.balls.length)
                            {

                                if (self.balls[_loc_17] == _loc_15)
                                {
                                    _loc_15.status = 1;
                                    self.balls_removed.push(_loc_15);
                                    self.balls.splice(_loc_17, 1);
                                    --_loc_2;
                                    if (_loc_15.colour == 1 && (self.balls.length == 0 || self.balls.length > 1 || self.balls.length == 1 && self.balls[0].colour != 0))
                                    {
                                        self.c0.status = 2;
                                    }
                                    break;
                                }
                                ++_loc_17;
                            }
                        }
                        if (!_loc_12)
                        {
                            _loc_8 = BILLIARD.Ball.correctFloatingPointError(_loc_8 - _loc_8 * _loc_11);
                            _loc_12 = true;
                        }
                    }
                    else
                    {
                        _loc_3 = true;
                        _loc_15.move(_loc_15.direction.p0.x + _loc_15.vx * _loc_11, _loc_15.direction.p0.y + _loc_15.vy * _loc_11);
                        _loc_15.updateProccessTime(_loc_15.proccess_time - _loc_15.proccess_time * _loc_11);
                        _loc_15.affectSpeed(0.975);
                        _loc_15.target = null;
                        _loc_15.collision_target_time = Infinity;
                        if (!_loc_12)
                        {
                            _loc_8 = BILLIARD.Ball.correctFloatingPointError(_loc_8 - _loc_8 * _loc_11);
                            _loc_12 = true;
                        }
                    }
                }
                ++_loc_2;
            }
        }
    }
    if (self.balls_removed.length > 0)
    {
        _loc_2 = 0;
        while (_loc_2 < self.balls_removed.length)
        {

            if (self.balls_removed[_loc_2].alpha <= 0)
            {
                self.balls_removed[_loc_2].visible = false;
                self.balls_removed.splice(_loc_2, 1);
                --_loc_2;
            }
            else
            {
                self.balls_removed[_loc_2].alpha -= 0.1;
            }
            ++_loc_2;
        }
    }
    else
    {
        if (!self.taco.moving && !_loc_3)
        {
            if (self.c0.status == 0 && !self.c0.dragging)
            {
                //snd_turn.play();
            }
            else if (self.c0.status == 1)
            {
                self.c0.putBehindLine();
                self.c0.visible = true;
                self.c0.alpha = 1;
                self.c0.status = 0;
                self.balls.push(self.c0);
            }
        }
        self.taco.moving = !_loc_3 && self.c0.status == 0 && !self.c0.dragging;
        //self.lines.cacheCanvas.getContext('2d').clearRect(0, 0, self.lines.width, self.lines.height);
        self.c0_fake.visible = false;
        if (self.taco.moving)
        {
            self.drawLines();
            self.taco.updateState();
            if (self.taco.alpha < 1)
            {
                self.taco.alpha += 0.05;
            }
            else
            {
                self.taco.alpha = 1;
            }
        }
        else if (self.taco.alpha > 0)
        {
            self.taco.alpha -= 0.05;
        }
        else
        {
            self.taco.alpha = 0;
        }
    }
    self.stagetick();
};
BILLIARD.Game.prototype.getBallsInCollision = function(ball) {
    var self = this,
        _loc_2 = null,
        _loc_3 = 0,
        _loc_4 = NaN;
    ball.last_collision_time = Infinity;
    _loc_2 = [];
    _loc_3 = 0;
    while (_loc_3 < self.balls.length)
    {
        if (self.balls[_loc_3] != ball)
        {
            self.balls[_loc_3].last_collision_time = Infinity;
            _loc_4 = BILLIARD.Ball.findTimeUntilCollide(ball, self.balls[_loc_3]);
            if (_loc_4 >= 0 && _loc_4 < 1 && (_loc_2.length == 0 || _loc_2[0].last_collision_time > _loc_4))
            {
                self.balls[_loc_3].last_collision_time = _loc_4;
                _loc_2[0] = self.balls[_loc_3];
            }
        }
        ++_loc_3;
    }
    return _loc_2;
};
BILLIARD.Game.prototype.drawLines = function() {
    var self = this,
        _loc_1 = null,
        _loc_2 = null,
        _loc_3 = NaN,
        _loc_4 = NaN,
        _loc_5 = NaN,
        _loc_6 = NaN,
        _loc_7 = null,
        _loc_8 = 0,
        _loc_9 = NaN,
        _loc_10 = null,
        _loc_11 = null;
    //var ctx=self.lines.cacheCanvas.getContext('2d');
    //ctx.clearRect(0, 0, self.lines.width, self.lines.height);
    _loc_1 = new BILLIARD.TriangleData();
    _loc_1.p0 = new BILLIARD.SimplePoint(self.c0.direction.p0.x, self.c0.direction.p0.y);
    self.c0_fake.move(self.c0.direction.p0.x, self.c0.direction.p0.y);
    _loc_2 = self.taco.getDirection();
    self.c0_fake.updateDirection(self.c0_fake.direction.p0.x + _loc_2.x, self.c0_fake.direction.p0.y + _loc_2.y);
    self.c0_fake.updateProccessTime(1);
    _loc_3 = self.c0_fake.direction.dx;
    _loc_4 = self.c0_fake.direction.dy;
    _loc_5 = self.c0_fake.direction.len;
    _loc_6 = -1;
    _loc_8 = 0;
    while (_loc_8 < self.balls.length)
    {
        if (self.balls[_loc_8] !== self.c0)
        {
            _loc_9 = BILLIARD.Ball.findTimeUntilCollide(self.c0_fake, self.balls[_loc_8]);
            if (_loc_9 >= 0 && (_loc_6 == -1 || _loc_9 < _loc_6))
            {
                _loc_6 = _loc_9;
                _loc_7 = self.balls[_loc_8];
            }
        }
        ++_loc_8;
    }
    if (_loc_6 === -1)
    {
        _loc_10 = BILLIARD.Ball.findTimeUntilCollideWithWall(self.c0_fake);
        _loc_6 = _loc_10.x;
    }
    if (_loc_6 > 0)
    {
        self.c0_fake.move(self.c0_fake.direction.p0.x + _loc_3 * _loc_5 * _loc_6, self.c0_fake.direction.p0.y + _loc_4 * _loc_5 * _loc_6);
        self.c0_fake.visible = true;
        self.c0_fake.alpha = self.taco.locked ? 0.75 : 0.5;
        _loc_1.p1 = new BILLIARD.SimplePoint(self.c0_fake.direction.p0.x, self.c0_fake.direction.p0.y);
        _loc_1.refresh(true);
        /*if (_loc_1.len > self.c0.r * 2)
        {
            ctx.moveTo(self.c0.direction.p0.x + self.c0.r * _loc_3, self.c0.direction.p0.y + self.c0.r * _loc_4);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0,0,0,0.25)';
            //self.lines.graphics.lineStyle(1, 0, 0.25);
            ctx.lineTo(self.c0_fake.direction.p0.x + self.c0_fake.r * (-_loc_3), self.c0_fake.direction.p0.y + self.c0_fake.r * (-_loc_4));
            ctx.stroke();
        }*/
        _loc_11 = null;
        if (_loc_7 != null)
        {
            _loc_11 = BILLIARD.Ball.simulateElasticCollision(self.c0_fake, _loc_7);
        }
        if (_loc_11 != null)
        {
            _loc_1.p0.x = self.c0_fake.direction.p0.y;
            _loc_1.p0.y = self.c0_fake.direction.p0.y;
            _loc_1.vx = _loc_11.p0.x;
            _loc_1.vy = _loc_11.p0.y;
            _loc_1.refresh();
            /*ctx.moveTo(self.c0_fake.direction.p0.x + self.c0_fake.r * _loc_1.dx, self.c0_fake.direction.p0.y + self.c0_fake.r * _loc_1.dy);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0,255,0,0.25)';
            //self.lines.graphics.lineStyle(1, 65280, 0.25);
            ctx.lineTo(self.c0_fake.direction.p0.x + (self.c0_fake.r * 2 + 50) * _loc_1.dx, self.c0_fake.direction.p0.y + (self.c0_fake.r * 2 + 50) * _loc_1.dy);
            ctx.stroke();*/
            _loc_1.p0.x = _loc_7.direction.p0.x;
            _loc_1.p0.y = _loc_7.direction.p0.y;
            _loc_1.vx = _loc_11.p1.x;
            _loc_1.vy = _loc_11.p1.y;
            _loc_1.refresh();
            /*ctx.moveTo(_loc_7.direction.p0.x + _loc_7.r * _loc_1.dx, _loc_7.direction.p0.y + _loc_7.r * _loc_1.dy);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0,255,255,0.25)';
            //self.lines.graphics.lineStyle(1, 65535, 0.25);
            ctx.lineTo(_loc_7.direction.p0.x + (_loc_7.r + 50) * _loc_1.dx, _loc_7.direction.p0.y + (_loc_7.r + 50) * _loc_1.dy);
            ctx.stroke();*/
        }
    }
};
BILLIARD.Game.prototype.sortByTargetCollisionTime = function(param1, param2) {
    if (param1.collision_target_time > param2.collision_target_time)
    {
        return 1;
    }
    if (param1.collision_target_time < param2.collision_target_time)
    {
        return -1;
    }
    return 0;
};
BILLIARD.Game.prototype.sortByTime = function(param1, param2) {
    if (param1.last_collision_time > param2.last_collision_time)
    {
        return 1;
    }
    if (param1.last_collision_time < param2.last_collision_time)
    {
        return -1;
    }
    return 0;
};
})(BILLIARD);