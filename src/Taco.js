(function(BILLIARD) {
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
})(BILLIARD);