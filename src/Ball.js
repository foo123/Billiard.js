(function(BILLIARD) {
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
})(BILLIARD);