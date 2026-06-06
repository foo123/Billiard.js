(function(BILLIARD) {
"use strict";
BILLIARD.Game = function Game(container, assets, mrgX, mrgY, type) {
    if (null == type) type = 1;
    mrgY = mrgY || 0;
    mrgX = mrgX || 0;
    var self = this;

    self.mrgX = mrgX;
    self.mrgY = mrgY;
    self.diff = null;
    self.tri = null;
    self.lines = null;
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
    self.taco = null;

    self.white = 'white';//white;
    self.black = 'black';//black;
    self.red = 'red';//red;
    self.yellow = 'yellow';//yel;

    self.isSVG = 'SVG' === String(container.tagName || '').toUpperCase();

    self.tablepockets = new SceneLite.DisplayObject2D(self.isSVG ? ('<image href="'+assets.tablepockets.src+'" width="'+assets.tablepockets.width+'" height="'+assets.tablepockets.height+'" />') : ('<img src="'+assets.tablepockets.src+'" style="width:'+assets.tablepockets.width+'px;height:'+assets.tablepockets.height+'px;" />'), self.isSVG ? 'svg' : 'html');
    self.tablepockets.name = 'table-with-pockets';
    self.tablepockets.width = assets.tablepockets.width;
    self.tablepockets.height = assets.tablepockets.height;
    self.tablepockets.x = self.mrgX;
    self.tablepockets.y = self.mrgY;
    self.tablepockets.pointerEvents = false;
    self.tablepockets.useTransform = false;

    self.tablenopockets = new SceneLite.DisplayObject2D(self.isSVG ? ('<image href="'+assets.tablenopockets.src+'" width="'+assets.tablenopockets.width+'" height="'+assets.tablenopockets.height+'" />') : ('<img src="'+assets.tablenopockets.src+'" style="width:'+assets.tablenopockets.width+'px;height:'+assets.tablenopockets.height+'px;" />'), self.isSVG ? 'svg' : 'html');
    self.tablenopockets.name = 'table-without-pockets';
    self.tablenopockets.width = assets.tablenopockets.width;
    self.tablenopockets.height = assets.tablenopockets.height;
    self.tablenopockets.x = self.mrgX;
    self.tablenopockets.y = self.mrgY;
    self.tablenopockets.pointerEvents = false;
    self.tablenopockets.useTransform = false;

    self.taco = new BILLIARD.Taco(assets.taco, self.isSVG);

    self.balls = [];
    self.balls_removed = [];

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
                self.diff = BILLIARD.correctFloatingPointError(self.tri.len - self.balls[i].r * 2);
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

    SceneLite.call(self, container, 2*self.mrgX + (type === 1 ? self.tablepockets : self.tablenopockets).width, 2*self.mrgY + (type === 1 ? self.tablepockets : self.tablenopockets).height);
    //self.autoUpdate = false;
    self.fps = 12; // 12 FPS
    self.init(type);
    setInterval(function() {self.onEnterFrame();}, 1000 / self.fps);
};
BILLIARD.Game.inheritsFrom(SceneLite);

BILLIARD.Game.prototype.isSVG = false;
BILLIARD.Game.prototype.mrgX = 0;
BILLIARD.Game.prototype.mrgY = 0;
BILLIARD.Game.prototype.fps = 12;
BILLIARD.Game.prototype.diff = null;
BILLIARD.Game.prototype.tri = null;
BILLIARD.Game.prototype.lines = null;
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
BILLIARD.Game.prototype.white = null;
BILLIARD.Game.prototype.black = null;
BILLIARD.Game.prototype.red = null;
BILLIARD.Game.prototype.yellow = null;
BILLIARD.Game.prototype.tablenopockets = null;
BILLIARD.Game.prototype.tablepockets = null;
BILLIARD.Game.prototype.taco = null;
BILLIARD.Game.prototype.makeBall = function(color, scaling) {
    var self = this;
    return new BILLIARD.Ball(color, Math.round(24*scaling), self.type, self.mrgX, self.mrgY, self.isSVG);
};
BILLIARD.Game.prototype.addBall = function(ball) {
    var self = this;
    self.addChild(ball);
    self.balls.push(ball);
    ball.updateDirection(ball.x, ball.y);
};
BILLIARD.Game.prototype.init = function(type) {
    var self = this, index, name, ball, scaling;
    self.type = type;

    self.empty();

    self.lines = null;
    if (self.c0_fake) self.c0_fake.dispose();
    self.c0_fake = null;
    if (self.c0) self.c0.dispose();
    self.c0 = null;
    if (self.c1) self.c1.dispose();
    self.c1 = null;
    if (self.c2) self.c2.dispose();
    self.c2 = null;
    if (self.c3) self.c3.dispose();
    self.c3 = null;
    if (self.c4) self.c4.dispose();
    self.c4 = null;
    if (self.c5) self.c5.dispose();
    self.c5 = null;
    if (self.c6) self.c6.dispose();
    self.c6 = null;
    if (self.c7) self.c7.dispose();
    self.c7 = null;
    if (self.c8) self.c8.dispose();
    self.c8 = null;
    if (self.c9) self.c9.dispose();
    self.c9 = null;
    if (self.c10) self.c10.dispose();
    self.c10 = null;
    if (self.c11) self.c11.dispose();
    self.c11 = null;
    if (self.c12) self.c12.dispose();
    self.c12 = null;
    if (self.c13) self.c13.dispose();
    self.c13 = null;
    if (self.c14) self.c14.dispose();
    self.c14 = null;
    if (self.c15) self.c15.dispose();
    self.c15 = null;
    self.balls = [];
    self.balls_removed = [];

    scaling = (self.type === 1 ? self.tablepockets : self.tablenopockets).width / 585;
    BILLIARD.Ball.w = {x1:self.mrgX+scaling*29, y1:self.mrgY+scaling*35, x2:self.mrgX+scaling*(585-29), y2:self.mrgY+scaling*(365-39)};
    self.addChild(self.type === 1 ? self.tablepockets : self.tablenopockets);

    self.c0_fake = self.makeBall(self.white, scaling);
    self.c0_fake.name = 'c0_fake';
    self.c0_fake.colour = 0;
    self.c0_fake.alpha = 0.5;
    self.addChild(self.c0_fake);

    self.c0 = self.makeBall(self.white, scaling);
    self.c0.name = 'c0';
    self.c0.colour = 0;

    if (self.type === 1) // american pool
    {
        for (index=1; index<=15; ++index)
        {
            name = 'c' + String(index);
            if (index < 8)
            {
                self[name] = self.makeBall(self.yellow, scaling);
                self[name].colour = 2;
            }
            else if (index > 8)
            {
                self[name] = self.makeBall(self.red, scaling);
                self[name].colour = 3;
            }
            else//if (index === 8)
            {
                self[name] = self.makeBall(self.black, scaling);
                self[name].colour = 1;
            }
            self[name].name = name;
        }
    }
    else // french billiard
    {
        self.c1 = self.makeBall(self.black, scaling);
        self.c1.name = 'c1';
        self.c1.colour = 1;
        self.c2 = self.makeBall(self.red, scaling);
        self.c2.name = 'c2';
        self.c2.colour = 3;
        self.c3 = self.makeBall(self.yellow, scaling);
        self.c3.name = 'c3';
        self.c3.colour = 2;
    }

    // position balls on table
    self.c0.x = self.mrgX + scaling*(578-107);
    self.c0.y = self.mrgY + scaling*(164-66);
    self.c0.direction.p0.update(self.c0.x, self.c0.y);
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
        for (index=1; index<=15; ++index)
        {
            name = 'c' + String(index);
            ball = self[name];
            ball.x = self.mrgX + scaling*(ball.x - 107);
            ball.y = self.mrgY + scaling*(ball.y - 66);
            ball.direction.p0.update(ball.x, ball.y);
            self.addBall(ball);
        }
    }
    else // french billiard
    {
        self.c1.x = self.mrgX + scaling*200;
        self.c1.y = self.height/2;
        self.c1.direction.p0.update(self.c1.x, self.c1.y);
        self.addBall(self.c1);
        self.c2.x = self.mrgX + scaling*200;
        self.c2.y = self.mrgY + scaling*50;
        self.c2.direction.p0.update(self.c2.x, self.c2.y);
        self.addBall(self.c2);
        self.c3.x = self.mrgX + scaling*200;
        self.c3.y = self.height-self.mrgY-scaling*50;
        self.c3.direction.p0.update(self.c3.x, self.c3.y);
        self.addBall(self.c3);
    }

    self.c0.putBehindLine();
    self.taco.whiteBall = null;
    if (BILLIARD.Tween)
    {
        var delay = 0;
        self.balls.forEach(function(ball, i) {
            if (ball.name === 'c0') return;
            BILLIARD.Tween(ball)
            .fps(self.fps)
            .animate('alpha', {from:0, to:1}, 400, delay)
            .animate('x', BILLIARD.Tween.Path.bezier(self.mrgX, self.mrgX+3*(ball.x-self.mrgX)/5, ball.x), 600, delay, 'ease-out')
            .animate('y', BILLIARD.Tween.Path.bezier(ball.y < self.height/2 ? self.mrgY : (self.height-self.mrgY), ball.y < self.height/2 ? 3*self.mrgY : (self.height-3*self.mrgY), ball.y), 600, delay, 'ease-out', {
                onEnd: function(ball, tween) {
                    tween.dispose();
                    if (i+1 === self.balls.length)
                    {
                        self.taco.init(self.c0);
                        self.addChild(self.taco);
                    }
                }
            })
            .initialize()
            .enqueue();
            delay += 100;
        });
    }
    else
    {
        self.taco.init(self.c0);
        self.addChild(self.taco);
    }
};
BILLIARD.Game.prototype.onEnterFrame = function() {
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
            self.balls.sort(sortByTargetCollisionTime);
            _loc_11 = 1;
            _loc_12 = false;
            _loc_2 = 0;
            while (_loc_2 < self.balls.length)
            {
                _loc_15 = self.balls[_loc_2];
                if (_loc_15.direction.len > 0 && !_loc_15.collision)
                {
                    _loc_16 = _loc_15.target;
                    if (_loc_16 != null && _loc_16.target === _loc_15 && (_loc_11 === 1 || _loc_11 === _loc_15.collision_target_time))
                    {
                        _loc_3 = true;
                        if (_loc_6 === 0)
                        {
                            _loc_7 = Math.max(_loc_15.direction.len, _loc_16.direction.len) / 50;
                            if (_loc_7 > 1)
                            {
                                _loc_7 = 1;
                            }
                            if (self.taco.first_hit == null && (_loc_15.name === "c0" || _loc_16.name === "c0"))
                            {
                                self.taco.first_hit = _loc_15.name === "c0" ? (_loc_16) : (_loc_15);
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
                            _loc_8 = BILLIARD.correctFloatingPointError(_loc_8 - _loc_8 * _loc_11);
                            _loc_12 = true;
                        }
                    }
                    else if (_loc_15.collision_wall_detail != null && (_loc_11 === 1 || _loc_11 === _loc_15.collision_target_time))
                    {
                        _loc_11 = _loc_15.collision_target_time;
                        _loc_15.move(_loc_15.direction.p0.x + _loc_15.vx * 0.9999 * _loc_11, _loc_15.direction.p0.y + _loc_15.vy * 0.9999 * _loc_11);
                        if (!_loc_15.inPocket())
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
                                if (self.balls[_loc_17] === _loc_15)
                                {
                                    _loc_15.status = 1;
                                    self.balls_removed.push(_loc_15);
                                    self.balls.splice(_loc_17, 1);
                                    --_loc_2;
                                    if (_loc_15.colour === 1 && (self.balls.length === 0 || self.balls.length > 1 || self.balls.length === 1 && self.balls[0].colour !== 0))
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
                            _loc_8 = BILLIARD.correctFloatingPointError(_loc_8 - _loc_8 * _loc_11);
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
                            _loc_8 = BILLIARD.correctFloatingPointError(_loc_8 - _loc_8 * _loc_11);
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
                self.balls_removed[_loc_2].alpha = Math.max(0, self.balls_removed[_loc_2].alpha-0.1);
            }
            ++_loc_2;
        }
    }
    else
    {
        if (!self.taco.moving && !_loc_3)
        {
            if ((self.c0.status === 0) && !self.c0.dragging)
            {
                //snd_turn.play();
            }
            else if (self.c0.status === 1)
            {
                self.c0.putBehindLine();
                self.c0.visible = true;
                self.c0.alpha = 1;
                self.c0.status = 0;
                self.balls.push(self.c0);
            }
        }
        self.taco.moving = !_loc_3 && (self.c0.status === 0) && !self.c0.dragging;
        //self.lines.cacheCanvas.getContext('2d').clearRect(0, 0, self.lines.width, self.lines.height);
        self.c0_fake.visible = false;
        if (self.taco.moving)
        {
            self.drawLines();
            self.taco.visible = true;
            self.taco.updateState();
            self.taco.alpha = Math.min(1, self.taco.alpha+0.05);
        }
        else
        {
            self.taco.alpha = Math.max(0, self.taco.alpha-0.05);
            if (self.taco.alpha <= 0) self.taco.visible = false;
        }
    }
    if (BILLIARD.Tween) BILLIARD.Tween.tick();
    if (!self.autoUpdate) self.update();
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
            if (_loc_4 >= 0 && _loc_4 < 1 && (_loc_2.length === 0 || _loc_2[0].last_collision_time > _loc_4))
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
function sortByTargetCollisionTime(a, b)
{
    if (a.collision_target_time > b.collision_target_time)
    {
        return 1;
    }
    if (a.collision_target_time < b.collision_target_time)
    {
        return -1;
    }
    return 0;
}
function sortByTime(a, b)
{
    if (a.last_collision_time > b.last_collision_time)
    {
        return 1;
    }
    if (a.last_collision_time < b.last_collision_time)
    {
        return -1;
    }
    return 0;
}
})(BILLIARD);