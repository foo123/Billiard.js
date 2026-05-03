(function(BILLIARD) {
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