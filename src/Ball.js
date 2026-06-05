(function(BILLIARD) {
"use strict";
var cnt = 0;
BILLIARD.Ball = function Ball(ball, size, mrgX, mrgY, type, isSVG) {
    var self = this;
    if (null == type) type = 2;
    var color = ball.toLowerCase(),
        content,
        ctx,
        fillStyle,
        colorStop = {
            red: ["#f50404", "#973333"],
            yellow: ["#edf00b", "#9b9c29"],
            black: ["#4b4b4b", "#0e0e0e"],
            white: ["#f7f7f7", "#9c9c9c"]
        };

    if (-1 < color.indexOf('red')) color = 'red';
    else if (-1 < color.indexOf('yellow')) color = 'yellow';
    else if (-1 < color.indexOf('black')) color = 'black';
    else color = 'white';

    ++cnt;

    if (isSVG)
    {
        content = '<g><defs><radialGradient id="--r-grad-'+String(cnt)+'" fx="'+(100*(9/24)*(size/24)).toFixed(2)+'%" fy="'+(100*(9/24)*(size/24)).toFixed(2)+'%" fr="'+(100*(4/24)*(size/24)).toFixed(2)+'%" cx="'+(100*(9/24)*(size/24)).toFixed(2)+'%" cy="'+(100*(9/24)*(size/24)).toFixed(2)+'%" r="'+(100*(15/24)*(size/24)).toFixed(2)+'%"><stop offset="0%" stop-color="'+colorStop[color][0]+'" /><stop offset="100%" stop-color="'+colorStop[color][1]+'" /></radialGradient></defs><circle cx="'+(size/2).toFixed(2)+'" cy="'+(size/2).toFixed(2)+'" r="'+(size/2).toFixed(2)+'" fill="url(\'#--r-grad-'+String(cnt)+'\')" /></g>';
    }
    else
    {
        content = document.createElement('canvas');
        content.width = size;
        content.height = size;
        ctx = content.getContext('2d');
        fillStyle = ctx.createRadialGradient(9*size/24, 9*size/24, 4*size/24, 9*size/24, 9*size/24, 15*size/24);
        fillStyle.addColorStop(0, colorStop[color][0]);
        fillStyle.addColorStop(1, colorStop[color][1]);
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    Scene.DisplayObject2D.call(self, content, isSVG ? 'svg' : 'html');
    self.pointerEvents = false;
    self.useTransform = true;
    self.width = size;
    self.height = size;
    self.x0 = size/2;
    self.y0 = size/2;
    self.r = size/2 - 1;
    self.m = 1;
    self.type = type;
    self.status = 0;
    self.proccess_time = null;
    self.collision_target_time = null;
    self.collision = false;
    self.collision_wall_detail = null;
    self.last_collision_time = null;
    self.line_limit_x = null;
    self.dragging = false;
    self.target = null;
    self.colour = null;
    self.vx = null;
    self.vy = null;
    self.line_limit_x = mrgX + 538*size/24 + 1/*self.r*/;
    self.direction = new BILLIARD.TriangleData();
    self.direction.p0.update(self.x, self.y);
    self.updateProccessTime(1);
};
BILLIARD.Ball.inheritsFrom(Scene.DisplayObject2D);

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
BILLIARD.Ball.prototype.w = null;
BILLIARD.Ball.prototype.vx = null;
BILLIARD.Ball.prototype.vy = null;
BILLIARD.Ball.prototype.allowDrag = function(allow) {
    this.dragging = false;
};
BILLIARD.Ball.prototype.affectSpeed = function(factor) {
    if (null == factor) factor = 0.975;
    var self = this;
    self.direction.vx = BILLIARD.correctFloatingPointError(self.direction.vx * factor);
    self.direction.vy = BILLIARD.correctFloatingPointError(self.direction.vy * factor);
    if (Math.abs(self.direction.vx) < 0.12 && Math.abs(self.direction.vy) < 0.12)
    {
        self.direction.vx = 0;
        self.direction.vy = 0;
    }
    self.direction.refresh();
};
BILLIARD.Ball.prototype.inPocket = function() {
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
    self.proccess_time = BILLIARD.correctFloatingPointError(t);
    self.vx = BILLIARD.correctFloatingPointError(self.direction.vx * self.proccess_time);
    self.vy = BILLIARD.correctFloatingPointError(self.direction.vy * self.proccess_time);
};

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
    _loc_7 = BILLIARD.correctFloatingPointError(_loc_5.x * ball1.direction.vx + _loc_5.y * ball1.direction.vy);
    _loc_8 = BILLIARD.correctFloatingPointError(_loc_6.x * ball1.direction.vx + _loc_6.y * ball1.direction.vy);
    _loc_9 = BILLIARD.correctFloatingPointError(_loc_5.x * ball2.direction.vx + _loc_5.y * ball2.direction.vy);
    _loc_10 = BILLIARD.correctFloatingPointError(_loc_6.x * ball2.direction.vx + _loc_6.y * ball2.direction.vy);
    _loc_11 = BILLIARD.correctFloatingPointError((_loc_7 * (ball1.m - ball2.m) + 2 * ball2.m * _loc_9) / (ball1.m + ball2.m));
    _loc_12 = BILLIARD.correctFloatingPointError((_loc_9 * (ball2.m - ball1.m) + 2 * ball1.m * _loc_7) / (ball1.m + ball2.m));
    _loc_13 = new BILLIARD.SimplePoint(_loc_5.x * _loc_11, _loc_5.y * _loc_11);
    _loc_14 = new BILLIARD.SimplePoint(_loc_6.x * _loc_8, _loc_6.y * _loc_8);
    _loc_15 = new BILLIARD.SimplePoint(_loc_5.x * _loc_12, _loc_5.y * _loc_12);
    _loc_16 = new BILLIARD.SimplePoint(_loc_6.x * _loc_10, _loc_6.y * _loc_10);
    return new BILLIARD.CollisionResult(BILLIARD.correctFloatingPointError(_loc_13.x + _loc_14.x), BILLIARD.correctFloatingPointError(_loc_13.y + _loc_14.y), BILLIARD.correctFloatingPointError(_loc_15.x + _loc_16.x), BILLIARD.correctFloatingPointError(_loc_15.y + _loc_16.y));
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
    _loc_4 = BILLIARD.correctFloatingPointError(Math.pow(ball2.vx - ball1.vx, 2) + Math.pow(ball2.vy - ball1.vy, 2));
    _loc_5 = BILLIARD.correctFloatingPointError(2 * ((ball2.direction.p0.x - ball1.direction.p0.x) * (ball2.vx - ball1.vx) + (ball2.direction.p0.y - ball1.direction.p0.y) * (ball2.vy - ball1.vy)));
    _loc_6 = BILLIARD.correctFloatingPointError(Math.pow(ball2.direction.p0.x - ball1.direction.p0.x, 2) + Math.pow(ball2.direction.p0.y - ball1.direction.p0.y, 2) - Math.pow(ball1.r + ball2.r, 2));
    _loc_7 = BILLIARD.correctFloatingPointError(Math.pow(_loc_5, 2) - 4 * _loc_4 * _loc_6);
    if (_loc_4 !== 0)
    {
        _loc_8 = BILLIARD.correctFloatingPointError((-_loc_5 - Math.sqrt(_loc_7)) / (2 * _loc_4));
        if (_loc_8 >= 0)
        {
            _loc_3 = _loc_8;
        }
    }
    return _loc_3;
};
BILLIARD.Ball.stillOnTable = function(x, y, r) {
    var w = BILLIARD.Ball.w;
    return x - r >= w.x1 && x + r <= w.x2 && y - r >= w.y1 && y + r <= w.y2;
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
    _loc_7 = BILLIARD.correctFloatingPointError(_loc_5.x * ball1.vx + _loc_5.y * ball1.vy);
    _loc_8 = BILLIARD.correctFloatingPointError(_loc_6.x * ball1.vx + _loc_6.y * ball1.vy);
    _loc_9 = BILLIARD.correctFloatingPointError(_loc_5.x * ball2.vx + _loc_5.y * ball2.vy);
    _loc_10 = BILLIARD.correctFloatingPointError(_loc_6.x * ball2.vx + _loc_6.y * ball2.vy);
    _loc_11 = BILLIARD.correctFloatingPointError((_loc_7 * (ball1.m - ball2.m) + 2 * ball2.m * _loc_9) / (ball1.m + ball2.m));
    _loc_12 = BILLIARD.correctFloatingPointError((_loc_9 * (ball2.m - ball1.m) + 2 * ball1.m * _loc_7) / (ball1.m + ball2.m));
    _loc_13 = new BILLIARD.SimplePoint(_loc_5.x * _loc_11, _loc_5.y * _loc_11);
    _loc_14 = new BILLIARD.SimplePoint(_loc_6.x * _loc_8, _loc_6.y * _loc_8);
    _loc_15 = new BILLIARD.SimplePoint(_loc_5.x * _loc_12, _loc_5.y * _loc_12);
    _loc_16 = new BILLIARD.SimplePoint(_loc_6.x * _loc_10, _loc_6.y * _loc_10);
    ball1.direction.vx = BILLIARD.correctFloatingPointError(_loc_13.x + _loc_14.x);
    ball1.direction.vy = BILLIARD.correctFloatingPointError(_loc_13.y + _loc_14.y);
    ball1.collision = true;
    ball2.direction.vx = BILLIARD.correctFloatingPointError(_loc_15.x + _loc_16.x);
    ball2.direction.vy = BILLIARD.correctFloatingPointError(_loc_15.y + _loc_16.y);
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
        _loc_4 = BILLIARD.correctFloatingPointError((param1.r - param1.direction.p0.x + w.x1) / param1.vx);
        if (_loc_4 >= 0)
        {
            _loc_2.y = 1;
            _loc_2.x = _loc_4;
            _loc_3 = true;
        }
    }
    if (param1.direction.vy < 0)
    {
        _loc_4 = BILLIARD.correctFloatingPointError((param1.r - param1.direction.p0.y + w.y1) / param1.vy);
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
        _loc_4 = BILLIARD.correctFloatingPointError((w.x2 - param1.r - param1.direction.p0.x) / param1.vx);
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
        _loc_4 = BILLIARD.correctFloatingPointError((w.y2 - param1.r - param1.direction.p0.y) / param1.vy);
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