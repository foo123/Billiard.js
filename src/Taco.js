(function(BILLIARD) {
"use strict";
BILLIARD.Taco = function Taco(taco, isSVG) {
    var self = this;
    Scene.DisplayObject2D.call(self, isSVG ? ('<image href="'+taco.src+'" width="'+taco.width+'" height="'+taco.height+'" />') : ('<img src="'+taco.src+'"  style="width:'+taco.width+'px;height:'+taco.height+'px;" />'), isSVG ? 'svg' : 'html');
    self.pointerEvents = false;
    self.useTransform = true;
    self.width = taco.width;
    self.height = taco.height;
    self.x0 = taco.width/2;
    self.y0 = 0;
    self.name = 'taco';
    self.moving = false;
    self.reallymoving = false;
    self.holding = false;
    self.locked = false;
    self.visible = false;
    self.hits = 0;
    self.first_hit = null;
    self.whiteBall = null;
    self.last_power_factor = null;
    self.maxPower = 120;
    self.maxRadius = 100;
    self.init_mouse = new BILLIARD.TriangleData();
    self.vector_mouse = new BILLIARD.TriangleData();
};
BILLIARD.Taco.inheritsFrom(Scene.DisplayObject2D);

BILLIARD.Taco.prototype.moving = false;
BILLIARD.Taco.prototype.reallymoving = false;
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
BILLIARD.Taco.prototype.init = function(whiteBall) {
    var self = this;
    self.moving = true;
    self.reallymoving = false;
    self.holding = false;
    self.locked = false;
    self.visible = true;
    self.alpha = 0;
    self.hits = 0;
    self.whiteBall = whiteBall;
};
BILLIARD.Taco.prototype.putOnBorder = function(off) {
    if (!this.whiteBall) return;
    if (null == off) off = 0;
    var self = this,
        a = self.rotation+Math.PI/2,
        c = Math.cos(a),
        s = Math.sin(a),
        r = self.whiteBall.r + 5 + off;
    self.x = self.whiteBall.x + c * r;
    self.y = self.whiteBall.y + s * r;
};
BILLIARD.Taco.prototype.updateState = function() {
    var self = this,
        _loc_1 = null,
        _loc_2 = NaN;
    if (!self.whiteBall) return;
    if (self.moving)
    {
        if (self.reallymoving)
        {
            if (self.holding)
            {
                _loc_1 = new BILLIARD.TriangleData();
                _loc_1.p0 = new BILLIARD.SimplePoint(self.whiteBall.x, self.whiteBall.y);
                _loc_1.p1 = new BILLIARD.SimplePoint(self.scene.pointer[0].x, self.scene.pointer[0].y);
                _loc_1.refresh(true);
                _loc_2 = _loc_1.len - self.init_mouse.len;
                if (_loc_1.len <= self.whiteBall.r || _loc_2 <= 0)
                {
                    self.putOnBorder();
                }
                else if (_loc_2 <= self.maxRadius && (self.vector_mouse.dx > 0 && _loc_1.dx > 0 || self.vector_mouse.dx < 0 && _loc_1.dx < 0))
                {
                    self.putOnBorder(_loc_2);
                }
            }
            else
            {
                self.vector_mouse.p0 = new BILLIARD.SimplePoint(self.whiteBall.x, self.whiteBall.y);
                self.vector_mouse.p1 = new BILLIARD.SimplePoint(self.scene.pointer[0].x, self.scene.pointer[0].y);
                self.vector_mouse.refresh(true);
                self.rotation = (self.vector_mouse.dx < 0 ? (Math.PI/2) : (-Math.PI/2)) + Math.atan(self.vector_mouse.vy / self.vector_mouse.vx);
                self.putOnBorder();
            }
        }
        else
        {
            self.putOnBorder();
        }
    }
};
BILLIARD.Taco.prototype.onkeydown = function(event) {
    var self = this;
    if (self.whiteBall) self.onPress(event);
};
BILLIARD.Taco.prototype.onkeyup = function(event) {
    var self = this;
    if (self.whiteBall) self.onRelease(event);
};
BILLIARD.Taco.prototype.ontouchstart = function(event) {
    var self = this;
    if (self.whiteBall) self.onPress(event);
};
BILLIARD.Taco.prototype.ontouchend = function(event) {
    var self = this;
    if (self.whiteBall) self.onRelease(event);
};
BILLIARD.Taco.prototype.onmousemove = function(event) {
    var self = this;
    if (self.whiteBall) self.reallymoving = true;
};
BILLIARD.Taco.prototype.ontouchmove = function(event) {
    var self = this;
    if (self.whiteBall && self.reallymoving && self.moving && event.preventDefault) event.preventDefault();
};
BILLIARD.Taco.prototype.onPress = function(event) {
    var self = this;
    if (self.moving && !self.locked)
    {
        if (event.touches)
        {
            if (self.reallymoving) return;
            var start_mouse = new BILLIARD.SimplePoint(self.scene.pointer[0].x, self.scene.pointer[0].y);
            if (start_mouse.x < self.scene.mrgX-5 || start_mouse.x > self.scene.width-(self.scene.mrgX-5) || start_mouse.y < self.scene.mrgY-5 || start_mouse.y > self.scene.height-(self.scene.mrgY-5)) return;
            self.reallymoving = true;
            setTimeout(function update() {
                if (self.locked || !self.reallymoving || !self.moving) return;
                var curr_mouse = new BILLIARD.SimplePoint(self.scene.pointer[0].x, self.scene.pointer[0].y);
                if (Math.abs(curr_mouse.x-start_mouse.x) < 1.5/self.scene.scaling && Math.abs(curr_mouse.y-start_mouse.y) < 1.5/self.scene.scaling)
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
            if (event.preventDefault) event.preventDefault();
            self.init_mouse.p0 = new BILLIARD.SimplePoint(self.whiteBall.x, self.whiteBall.y);
            self.init_mouse.p1 = new BILLIARD.SimplePoint(self.scene.pointer[0].x, self.scene.pointer[0].y);
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
    self.reallymoving = false;
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
        if (_loc_2.len > 0 && Math.abs(self.whiteBall.direction.vx) < 0.05 && Math.abs(self.whiteBall.direction.vy) < 0.05)
        {
            self.last_power_factor = _loc_2.len / self.maxRadius;
            _loc_5 = self.last_power_factor * self.maxPower;
            /*if (self.hits > 0) _loc_5 = _loc_5 * 0.65;*/
            self.first_hit = null;
            self.whiteBall.updateDirection(self.whiteBall.x + _loc_5 * (-self.init_mouse.dx), self.whiteBall.y + _loc_5 * (-self.init_mouse.dy));
            ++self.hits;
        }
    }
};
BILLIARD.Taco.prototype.getDirection = function() {
    return new BILLIARD.SimplePoint(-this.vector_mouse.dx, -this.vector_mouse.dy);
};
})(BILLIARD);