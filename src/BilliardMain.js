(function(BILLIARD){
    BILLIARD.Main=function(container,type,table1,table2,ball,black,yel,red,taco)
    {
        this.c0_fake=null;
        this.c0=null;
        this.c1=null;
        this.c2=null;
        this.c3=null;
        this.c4=null;
        this.c5=null;
        this.c6=null;
        this.c7=null;
        this.c8=null;
        this.c9=null;
        this.c10=null;
        this.c11=null;
        this.c12=null;
        this.c13=null;
        this.c14=null;
        this.c15=null;
        this.balls=[];
        this.balls_removed=[];
        this.DEG_TO_RAD=Math.PI/180;
        this.RAD_TO_DEG=180/Math.PI;
        this.lines=null;
        this.taco=null;
        this.diff=null;
        this.tri=null;
        var thiss=this;
        this.canvas=container;
        this.width=585;
        this.height=365;
        this.fps=12; // 12 FPS
        NEngine.env.interval=1000/this.fps;
        NEngine.Stage.call(this,this.canvas);
        this.frenchtable=new NEngine.Bitmap(table2,0,0);
        this.americantable=new NEngine.Bitmap(table1,0,0);
        this.taco=new BILLIARD.Taco(taco);
        this.white=ball;
        this.black=black;
        this.red=red;
        this.yellow=yel;
        
        BILLIARD.Ball.isPositionOverlapped = function (param1, param2, param3)
        {
            if (typeof param3 == 'undefined')
                param3=null;
            thiss.tri = new BILLIARD.TriangleData();
            thiss.tri.p0.x = param1;
            thiss.tri.p0.y = param2;
            var i = 0;
            while (i < thiss.balls.length)
            {
                
                if (param3 != thiss.balls[i])
                {
                    thiss.tri.p1 = thiss.balls[i].direction.p0;
                    thiss.tri.refresh(true);
                    thiss.diff = BILLIARD.Ball.correctFloatingPointError(thiss.tri.len - thiss.balls[i].r * 2);
                    if (thiss.diff < 0)
                    {
                        alert("ERROR!! ball[" + param3.name + "] is overlapping with [" + thiss.balls[i].name + "] by " + thiss.diff + " pixels.");
                        return thiss.balls[i];
                    }
                }
                i++;
            }
            return null;
        };// end function
        this.stagetick=this.tick;
        this.init(type);
    };// end function
    BILLIARD.Main.inheritsFrom(new NEngine.Stage(document.createElement('canvas')));
    BILLIARD.Main.prototype.addBall=function(ball)
    {
        ball.updateDirection(ball.x, ball.y);
        this.balls.push(ball);
    };// end function
    BILLIARD.Main.prototype.init=function(type)
    {
        this.type=type;
        var thiss=this;
        this.tick=this.stagetick;
        this.balls = [];
        this.balls_removed = [];
        
        while(this.numChildren>0) this.removeChildAt(0);
        
        if (this.type==1) // american
            this.addChild(this.americantable);
        else  // french
            this.addChild(this.frenchtable);
        
        this.c0_fake=new BILLIARD.Ball(this.white,this.type);
        this.c0_fake.name="c0_fake";
        this.c0_fake.colour = 0;
        this.c0_fake.alpha=0.5;
        this.addChild(this.c0_fake);
        this.c0=new BILLIARD.Ball(this.white,this.type);
        this.c0.name='c0';
        this.c0.colour = 0;
        
        if (this.type==1) // american
        {
            var b_index = 1;
            while ( b_index <= 15)
            {
                this["c" +  b_index]=null;
                if (b_index == 8)
                {
                    this["c" +  b_index]=new BILLIARD.Ball(this.black,this.type);
                    this["c" + b_index].colour = 1;
                }
                else if (b_index < 8)
                {
                    this["c" +  b_index]=new BILLIARD.Ball(this.yellow,this.type);
                    this["c" + b_index].colour = 2;
                }
                else if (b_index > 8)
                {
                    this["c" +  b_index]=new BILLIARD.Ball(this.red,this.type);
                    this["c" + b_index].colour = 3;
                }
                this["c" +  b_index].name="c"+b_index;
                b_index++;
            }
        }
        else // french
        {
            this.c1=new BILLIARD.Ball(this.black,this.type);
            this.c1.name='c1';
            this.c1.colour = 1;
            this.c2=new BILLIARD.Ball(this.red,this.type);
            this.c2.name='c2';
            this.c2.colour = 3;
            this.c3=new BILLIARD.Ball(this.yellow,this.type);
            this.c3.name='c3';
            this.c3.colour = 2;
        }
        // position balls on table
        this.c0.x=578-107;
        this.c0.y=164-66;
        this.c0.direction.p0.update(this.c0.x,this.c0.y);
        this.addChild(this.c0);
        this.addBall(this.c0);
        
        if (this.type==1) // american
        {
            this.c1.x=311;
            this.c1.y=248;
            this.c2.x=287;
            this.c2.y=262;
            this.c3.x=239;
            this.c3.y=289;
            this.c4.x=215;
            this.c4.y=248;
            this.c5.x=239;
            this.c5.y=234;
            this.c6.x=263;
            this.c6.y=221;
            this.c7.x=215;
            this.c7.y=194;
            
            this.c8.x=263;
            this.c8.y=248;
            
            this.c9.x=287;
            this.c9.y=234;
            this.c10.x=215;
            this.c10.y=221;
            this.c11.x=239;
            this.c11.y=207;
            this.c12.x=263;
            this.c12.y=276;
            this.c13.x=239;
            this.c13.y=262;
            this.c14.x=215;
            this.c14.y=276;
            this.c15.x=215;
            this.c15.y=303;
            for (var i=1;i<16;i++)
            {
                this['c'+i].x-=107;
                this['c'+i].y-=66;
                this['c'+i].direction.p0.update(this['c'+i].x,this['c'+i].y);
                this.addChild(this["c" + i]);
                this.addBall(this["c" + i]);
            }
        }
        else // french
        {
            this.c1.x=200;
            this.c1.y=this.height/2;
            this.c1.direction.p0.update(this.c1.x,this.c1.y);
            this.addChild(this.c1);
            this.addBall(this.c1);
            this.c2.x=200;
            this.c2.y=50;
            this.c2.direction.p0.update(this.c2.x,this.c2.y);
            this.addChild(this.c2);
            this.addBall(this.c2);
            this.c3.x=200;
            this.c3.y=this.height-50;
            this.c3.direction.p0.update(this.c3.x,this.c3.y);
            this.addChild(this.c3);
            this.addBall(this.c3);
        }
        this.c0.putBehindLine();
        this.taco.init(this.c0);
        this.addChild(this.taco);
        //this.addChild(this.lines);
        this.tick=function(){thiss.onEnterFrame()};
    };
    BILLIARD.Main.prototype.onEnterFrame=function(event)
    {
        var _loc_2 = 0;
        var _loc_3 = false;
        var _loc_6 = NaN;
        var _loc_7 = NaN;
        var _loc_8 = NaN;
        var _loc_9 = NaN;
        var _loc_10 = NaN;
        var _loc_11 = NaN;
        var _loc_12 = false;
        var _loc_13 = null;
        var _loc_14 = null;
        var _loc_15 = null;
        var _loc_16 = null;
        var _loc_17 = undefined;
        _loc_3 = false;
        _loc_2 = 0;
        while (_loc_2 < this.balls.length)
        {
            
            this.balls[_loc_2].updateProccessTime(1);
            if (this.balls[_loc_2].direction.len > 0)
            {
                _loc_3 = true;
            }
            _loc_2++;
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
                while (_loc_2 < this.balls.length)
                {
                    
                    this.balls[_loc_2].collision = false;
                    this.balls[_loc_2].target = null;
                    this.balls[_loc_2].collision_wall_detail = null;
                    this.balls[_loc_2].collision_target_time = Infinity;
                    _loc_13 = this.getBallsInCollision(this.balls[_loc_2]);
                    if (_loc_13.length > 0)
                    {
                        this.balls[_loc_2].target = _loc_13[0];
                        this.balls[_loc_2].collision_target_time = _loc_13[0].last_collision_time;
                    }
                    _loc_14 = BILLIARD.Ball.findTimeUntilCollideWithWall(this.balls[_loc_2]);
                    if (_loc_14.x >= 0 && _loc_14.x < 1 && (this.balls[_loc_2].collision_target_time == Infinity || _loc_14.x < this.balls[_loc_2].collision_target_time))
                    {
                        this.balls[_loc_2].collision_target_time = _loc_14.x;
                        this.balls[_loc_2].collision_wall_detail = _loc_14;
                        this.balls[_loc_2].target = null;
                    }
                    _loc_2++;
                }
                this.balls.sort(this.sortByTargetCollisionTime);
                _loc_11 = 1;
                _loc_12 = false;
                _loc_2 = 0;
                while (_loc_2 < this.balls.length)
                {
                    
                    _loc_15 = this.balls[_loc_2];
                    if (_loc_15.direction.len > 0 && !_loc_15.collision)
                    {
                        _loc_16 = _loc_15.target;
                        if (_loc_16 != null && _loc_16.target == _loc_15 && (_loc_11 == 1 || _loc_11 == _loc_15.collision_target_time))
                        {
                            _loc_3 = true;
                            if (_loc_6 == 0)
                            {
                                _loc_7 = Math.max(_loc_15.direction.len, _loc_16.direction.len) / 50;
                                if (_loc_7 > 1)
                                {
                                    _loc_7 = 1;
                                }
                                if (this.taco.first_hit == null && (_loc_15.name == "c0" || _loc_16.name == "c0"))
                                {
                                    this.taco.first_hit = _loc_15.name == "c0" ? (_loc_16) : (_loc_15);
                                }
                            }
                            _loc_6 = _loc_6 + 1;
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
                                while (_loc_17 < this.balls.length)
                                {
                                    
                                    if (this.balls[_loc_17] == _loc_15)
                                    {
                                        _loc_15.status = 1;
                                        this.balls_removed.push(_loc_15);
                                        this.balls.splice(_loc_17, 1);
                                        _loc_2 = _loc_2 - 1;
                                        if (_loc_15.colour == 1 && (this.balls.length == 0 || this.balls.length > 1 || this.balls.length == 1 && this.balls[0].colour != 0))
                                        {
                                            this.c0.status = 2;
                                        }
                                        break;
                                    }
                                    _loc_17 = _loc_17 + 1;
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
                    _loc_2++;
                }
            }
        }
        if (this.balls_removed.length > 0)
        {
            _loc_2 = 0;
            while (_loc_2 < this.balls_removed.length)
            {
                
                if (this.balls_removed[_loc_2].alpha <= 0)
                {
                    this.balls_removed[_loc_2].visible = false;
                    this.balls_removed.splice(_loc_2, 1);
                    _loc_2 = _loc_2 - 1;
                }
                else
                {
                    this.balls_removed[_loc_2].alpha = this.balls_removed[_loc_2].alpha - 0.1;
                }
                _loc_2++;
            }
        }
        else
        {
            if (!this.taco.moving && !_loc_3)
            {
                if (this.c0.status == 0 && !this.c0.dragging)
                {
                    //snd_turn.play();
                }
                else if (this.c0.status == 1)
                {
                    this.c0.putBehindLine();
                    this.c0.visible = true;
                    this.c0.alpha = 1;
                    this.c0.status = 0;
                    this.balls.push(this.c0);
                }
            }
            this.taco.moving = !_loc_3 && this.c0.status == 0 && !this.c0.dragging;
            //this.lines.cacheCanvas.getContext('2d').clearRect(0,0,this.lines.width,this.lines.height);
            this.c0_fake.visible = false;
            if (this.taco.moving)
            {
                this.drawLines();
                this.taco.updateState();
                if (this.taco.alpha < 1)
                {
                    this.taco.alpha = this.taco.alpha + 0.025;
                }
                else
                {
                    this.taco.alpha = 1;
                }
            }
            else if (this.taco.alpha > 0)
            {
                this.taco.alpha = this.taco.alpha - 0.025;
            }
            else
            {
                this.taco.alpha = 0;
            }
        }
        this.stagetick();
    };// end function
    BILLIARD.Main.prototype.getBallsInCollision=function(ball)
    {
        var _loc_2 = null;
        var _loc_3 = 0;
        var _loc_4 = NaN;
        ball.last_collision_time = Infinity;
        _loc_2 = [];
        _loc_3 = 0;
        while (_loc_3 < this.balls.length)
        {
            
            if (this.balls[_loc_3] != ball)
            {
                this.balls[_loc_3].last_collision_time = Infinity;
                _loc_4 = BILLIARD.Ball.findTimeUntilCollide(ball, this.balls[_loc_3]);
                if (_loc_4 >= 0 && _loc_4 < 1 && (_loc_2.length == 0 || _loc_2[0].last_collision_time > _loc_4))
                {
                    this.balls[_loc_3].last_collision_time = _loc_4;
                    _loc_2[0] = this.balls[_loc_3];
                }
            }
            _loc_3++;
        }
        return _loc_2;
    };// end function
    BILLIARD.Main.prototype.drawLines=function()
    {
        var _loc_1 = null;
        var _loc_2 = null;
        var _loc_3 = NaN;
        var _loc_4 = NaN;
        var _loc_5 = NaN;
        var _loc_6 = NaN;
        var _loc_7 = null;
        var _loc_8 = 0;
        var _loc_9 = NaN;
        var _loc_10 = null;
        var _loc_11 = null;
        //var ctx=this.lines.cacheCanvas.getContext('2d');
        //ctx.clearRect(0,0,this.lines.width,this.lines.height);
        _loc_1 = new BILLIARD.TriangleData();
        _loc_1.p0 = new BILLIARD.SimplePoint(this.c0.direction.p0.x, this.c0.direction.p0.y);
        this.c0_fake.move(this.c0.direction.p0.x, this.c0.direction.p0.y);
        _loc_2 = this.taco.getDirection();
        this.c0_fake.updateDirection(this.c0_fake.direction.p0.x + _loc_2.x, this.c0_fake.direction.p0.y + _loc_2.y);
        this.c0_fake.updateProccessTime(1);
        _loc_3 = this.c0_fake.direction.dx;
        _loc_4 = this.c0_fake.direction.dy;
        _loc_5 = this.c0_fake.direction.len;
        _loc_6 = -1;
        _loc_8 = 0;
        while (_loc_8 < this.balls.length)
        {
            
            if (this.balls[_loc_8] != this.c0)
            {
                _loc_9 = BILLIARD.Ball.findTimeUntilCollide(this.c0_fake, this.balls[_loc_8]);
                if (_loc_9 >= 0 && (_loc_6 == -1 || _loc_9 < _loc_6))
                {
                    _loc_6 = _loc_9;
                    _loc_7 = this.balls[_loc_8];
                }
            }
            _loc_8++;
        }
        if (_loc_6 == -1)
        {
            _loc_10 = BILLIARD.Ball.findTimeUntilCollideWithWall(this.c0_fake);
            _loc_6 = _loc_10.x;
        }
        if (_loc_6 > 0)
        {
            this.c0_fake.move(this.c0_fake.direction.p0.x + _loc_3 * _loc_5 * _loc_6, this.c0_fake.direction.p0.y + _loc_4 * _loc_5 * _loc_6);
            this.c0_fake.visible = true;
            _loc_1.p1 = new BILLIARD.SimplePoint(this.c0_fake.direction.p0.x, this.c0_fake.direction.p0.y);
            _loc_1.refresh(true);
            /*if (_loc_1.len > this.c0.r * 2)
            {
                ctx.moveTo(this.c0.direction.p0.x + this.c0.r * _loc_3, this.c0.direction.p0.y + this.c0.r * _loc_4);
                ctx.lineWidth=1;
                ctx.strokeStyle='rgba(0,0,0,0.25)';
                //this.lines.graphics.lineStyle(1, 0, 0.25);
                ctx.lineTo(this.c0_fake.direction.p0.x + this.c0_fake.r * (-_loc_3), this.c0_fake.direction.p0.y + this.c0_fake.r * (-_loc_4));
                ctx.stroke();
            }*/
            _loc_11 = null;
            if (_loc_7 != null)
            {
                _loc_11 = BILLIARD.Ball.simulateElasticCollision(this.c0_fake, _loc_7);
            }
            if (_loc_11 != null)
            {
                _loc_1.p0.x = this.c0_fake.direction.p0.y;
                _loc_1.p0.y = this.c0_fake.direction.p0.y;
                _loc_1.vx = _loc_11.p0.x;
                _loc_1.vy = _loc_11.p0.y;
                _loc_1.refresh();
                /*ctx.moveTo(this.c0_fake.direction.p0.x + this.c0_fake.r * _loc_1.dx, this.c0_fake.direction.p0.y + this.c0_fake.r * _loc_1.dy);
                ctx.lineWidth=1;
                ctx.strokeStyle='rgba(0,255,0,0.25)';
                //this.lines.graphics.lineStyle(1, 65280, 0.25);
                ctx.lineTo(this.c0_fake.direction.p0.x + (this.c0_fake.r * 2 + 50) * _loc_1.dx, this.c0_fake.direction.p0.y + (this.c0_fake.r * 2 + 50) * _loc_1.dy);
                ctx.stroke();*/
                _loc_1.p0.x = _loc_7.direction.p0.x;
                _loc_1.p0.y = _loc_7.direction.p0.y;
                _loc_1.vx = _loc_11.p1.x;
                _loc_1.vy = _loc_11.p1.y;
                _loc_1.refresh();
                /*ctx.moveTo(_loc_7.direction.p0.x + _loc_7.r * _loc_1.dx, _loc_7.direction.p0.y + _loc_7.r * _loc_1.dy);
                ctx.lineWidth=1;
                ctx.strokeStyle='rgba(0,255,255,0.25)';
                //this.lines.graphics.lineStyle(1, 65535, 0.25);
                ctx.lineTo(_loc_7.direction.p0.x + (_loc_7.r + 50) * _loc_1.dx, _loc_7.direction.p0.y + (_loc_7.r + 50) * _loc_1.dy);
                ctx.stroke();*/
            }
        }
    };// end function
    BILLIARD.Main.prototype.sortByTargetCollisionTime=function(param1, param2)
    {
        if (param1.collision_target_time > param2.collision_target_time)
        {
            return 1;
        }
        if (param1.collision_target_time < param2.collision_target_time)
        {
            return -1;
        }
        return 0;
    };// end function
    BILLIARD.Main.prototype.sortByTime=function(param1, param2)
    {
        if (param1.last_collision_time > param2.last_collision_time)
        {
            return 1;
        }
        if (param1.last_collision_time < param2.last_collision_time)
        {
            return -1;
        }
        return 0;
    };// end function
})(BILLIARD);