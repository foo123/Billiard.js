BILLIARD.Ball=function(ball,type)
{
	this.proccess_time=null;
	this.collision_target_time=null;
	this.collision=false;
	this.m=1;
	this.dragging=false;
	this.direction=null;//:TriangleData;
	this.last_collision_time=null;
	this.r=1;
	this.target=null;//:Ball;
	this.line_limit_x=null;
	this.vx=null;
	this.vy=null;
	this.colour=null;
	this.collision_wall_detail=null;//:SimplePoint;
	this.status=null;
	if (typeof type=='undefined')
		type=2;
	this.type=type;
	NEngine.Shape.call(this);
	this.cacheCanvas=document.createElement('canvas');
	var thiss=this;
	this.image=new Image();
	this.image.onload=function(){
		thiss.cacheCanvas.width=thiss.image.width;
		thiss.cacheCanvas.height=thiss.image.height;
		var ctx=thiss.cacheCanvas.getContext('2d');
		ctx.drawImage(thiss.image,0,0);
		thiss.width=thiss.image.width;
		thiss.height=thiss.image.height;
		thiss.regX=thiss.image.width/2;
		thiss.regY=thiss.image.height/2;
		thiss.r=thiss.image.width/2-1;
	};
	
	this.direction = new BILLIARD.TriangleData();
	this.direction.p0.update(this.x, this.y);
	this.collision = false;
	this.status = 0;
	this.dragging = false;
	this.line_limit_x = 538 + this.r;
	this.updateProccessTime(1);
	this.image.src=ball;
};
BILLIARD.Ball.w={x1:29, y1:35, x2:585-29, y2:365-39};
//BILLIARD.Ball.w={x1:135, y1:102, x2:665, y2:397};
BILLIARD.Ball.isPositionOverlapped=function(){return null};//Function;
BILLIARD.Ball.inheritsFrom(NEngine.Shape);
BILLIARD.Ball.prototype.draw=function(ctx,ignoreCache)
{
	this.__draw(ctx,ignoreCache);
};
BILLIARD.Ball.simulateElasticCollision=function(ball1, ball2)
{
	var _loc_3 = null;
	var _loc_4 = NaN;
	var _loc_5 = null;
	var _loc_6 = null;
	var _loc_7 = NaN;
	var _loc_8 = NaN;
	var _loc_9 = NaN;
	var _loc_10 = NaN;
	var _loc_11 = NaN;
	var _loc_12 = NaN;
	var _loc_13 = null;
	var _loc_14 = null;
	var _loc_15 = null;
	var _loc_16 = null;
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
};// end function
BILLIARD.Ball.findTimeUntilCollide=function(param1, param2)
{
	var _loc_3 = NaN;
	var _loc_4 = NaN;
	var _loc_5 = NaN;
	var _loc_6 = NaN;
	var _loc_7 = NaN;
	var _loc_8 = NaN;
	_loc_3 = -1;
	_loc_4 = BILLIARD.Ball.correctFloatingPointError(Math.pow(param2.vx - param1.vx, 2) + Math.pow(param2.vy - param1.vy, 2));
	_loc_5 = BILLIARD.Ball.correctFloatingPointError(2 * ((param2.direction.p0.x - param1.direction.p0.x) * (param2.vx - param1.vx) + (param2.direction.p0.y - param1.direction.p0.y) * (param2.vy - param1.vy)));
	_loc_6 = BILLIARD.Ball.correctFloatingPointError(Math.pow(param2.direction.p0.x - param1.direction.p0.x, 2) + Math.pow(param2.direction.p0.y - param1.direction.p0.y, 2) - Math.pow(param1.r + param2.r, 2));
	_loc_7 = BILLIARD.Ball.correctFloatingPointError(Math.pow(_loc_5, 2) - 4 * _loc_4 * _loc_6);
	if (_loc_4 != 0)
	{
		_loc_8 = BILLIARD.Ball.correctFloatingPointError((-_loc_5 - Math.sqrt(_loc_7)) / (2 * _loc_4));
		if (_loc_8 >= 0)
		{
			_loc_3 = _loc_8;
		}
	}
	return _loc_3;
};// end function
BILLIARD.Ball.stillOnTable=function(param1, param2, param3)
{
	var w=BILLIARD.Ball.w;
	return param1 - param3 >= w.x1 && param1 + param3 <= w.x2 && param2 - param3 >= w.y1 && param2 + param3 <= w.y2;
};// end function
BILLIARD.Ball.correctFloatingPointError=function(param1, param2)
{
	if (typeof param2=='undefined')
		param2=10;
	var _loc_3 = NaN;
	_loc_3 = Math.pow(10, param2);
	return Math.round(_loc_3 * param1) / _loc_3;
};// end function
BILLIARD.Ball.doElasticCollision=function(ball1, ball2)
{
	var _loc_3 = null;
	var _loc_4 = NaN;
	var _loc_5 = null;
	var _loc_6 = null;
	var _loc_7 = NaN;
	var _loc_8 = NaN;
	var _loc_9 = NaN;
	var _loc_10 = NaN;
	var _loc_11 = NaN;
	var _loc_12 = NaN;
	var _loc_13 = null;
	var _loc_14 = null;
	var _loc_15 = null;
	var _loc_16 = null;
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
};// end function
BILLIARD.Ball.doElasticCollisionWithWall=function(param1, param2)
{
	switch(param2.y)
	{
		case 1:
		{
			param1.direction.vx = Math.abs(param1.vx);
			param1.direction.refresh();
			break;
		}
		case 2:
		{
			param1.direction.vy = Math.abs(param1.vy);
			param1.direction.refresh();
			break;
		}
		case 3:
		{
			param1.direction.vx = -Math.abs(param1.vx);
			param1.direction.refresh();
			break;
		}
		case 4:
		{
			param1.direction.vy = -Math.abs(param1.vy);
			param1.direction.refresh();
			break;
		}
		default:
		{
			break;
		}
	}
};// end function
BILLIARD.Ball.findTimeUntilCollideWithWall=function(param1)
{
	var _loc_2 = null;
	var _loc_3 = false;
	var _loc_4 = NaN;
	_loc_2 = new BILLIARD.SimplePoint();
	_loc_2.x = -1;
	_loc_3 = false;
	_loc_4 = 0;
	var w=BILLIARD.Ball.w;
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
};// end function
BILLIARD.Ball.prototype.allowDrag=function(allow)
{
	this.dragging = false;
	this.onMouseDown=null;
	this.mouseEnabled = false;
	this.useHandCursor = false;
	return;
	/*var thiss=this;
	if (allow)
	{
		this.dragging = true;
		//this.onMouseDown=function(){thiss.startDragging()};
		this.mouseEnabled = true;
		this.useHandCursor = true;
	}
	else
	{
		this.dragging = false;
		//this.stopDrag();
		this.onMouseDown=null;
		this.mouseEnabled = false;
		this.useHandCursor = false;
		this.move(this.x, this.y);
		if (BILLIARD.Ball.isPositionOverlapped(this.x, this.y, this) != null)
		{
			this.putBehindLine();
		}
	}*/
};// end function
BILLIARD.Ball.prototype.affectSpeed=function(factor)
{
	if (typeof param1 == 'undefined')
		factor = 0.975;
	
	var _loc_2 = factor;
	this.direction.vx = BILLIARD.Ball.correctFloatingPointError(this.direction.vx * _loc_2);
	this.direction.vy = BILLIARD.Ball.correctFloatingPointError(this.direction.vy * _loc_2);
	if (Math.abs(this.direction.vx) <= 0.1 && Math.abs(this.direction.vy) < 0.1)
	{
		this.direction.vx = 0;
		this.direction.vy = 0;
	}
	this.direction.refresh();
};// end function
BILLIARD.Ball.prototype.inHole=function()
{
	if (this.type!=1) return false;
	var _loc_1 = false;
	var _loc_2 = NaN;
	var _loc_3 = NaN;
	_loc_1 = this.direction.p0.y < BILLIARD.Ball.w.y2 - (BILLIARD.Ball.w.y2 - BILLIARD.Ball.w.y1) / 2;
	_loc_2 = BILLIARD.Ball.w.x2 - (BILLIARD.Ball.w.x2 - BILLIARD.Ball.w.x1) / 2;
	_loc_3 = 0.707107;
	if (this.direction.p0.x < _loc_2 + this.r / 1.25 && this.direction.p0.x > _loc_2 - this.r / 1.25)
	{
		this.x = _loc_2;
		if (_loc_1)
		{
			this.y = BILLIARD.Ball.w.y1 - this.r / 2;
		}
		else
		{
			this.y = BILLIARD.Ball.w.y2 + this.r / 2;
		}
		return true;
	}
	if (this.direction.p0.y < BILLIARD.Ball.w.y1 + this.r * 1.3)
	{
		if (this.direction.p0.x > BILLIARD.Ball.w.x2 - this.r * 1.3)
		{
			this.x = BILLIARD.Ball.w.x2 - 3;
			this.y = BILLIARD.Ball.w.y1 + 3;
			return true;
		}
		if (this.direction.p0.x < BILLIARD.Ball.w.x1 + this.r * 1.3)
		{
			this.x = BILLIARD.Ball.w.x1 + 3;
			this.y = BILLIARD.Ball.w.y1 + 3;
			return true;
		}
	}
	else if (this.direction.p0.y > BILLIARD.Ball.w.y2 - this.r * 1.3)
	{
		if (this.direction.p0.x > BILLIARD.Ball.w.x2 - this.r * 1.3)
		{
			this.x = BILLIARD.Ball.w.x2 - 3;
			this.y = BILLIARD.Ball.w.y2 - 3;
			return true;
		}
		if (this.direction.p0.x < BILLIARD.Ball.w.x1 + this.r * 1.3)
		{
			this.x = BILLIARD.Ball.w.x1 + 3;
			this.y = BILLIARD.Ball.w.y2 - 3;
			return true;
		}
	}
	return false;
};// end function
BILLIARD.Ball.prototype.updateDirection=function(param1, param2)
{
	this.direction.p1.update(param1, param2);
	this.direction.refresh(true);
};// end function
BILLIARD.Ball.prototype.move=function(param1, param2)
{
	this.x = param1;
	this.y = param2;
	this.direction.p0.update(param1, param2);
	return;
};// end function
BILLIARD.Ball.prototype.putBehindLine=function()
{
	var _loc_1 = NaN;
	var _loc_2 = NaN;
	var w= BILLIARD.Ball.w;
	var r=this.r;
	_loc_1 = Math.random() * (w.x2 - r - this.line_limit_x);
	_loc_2 = Math.random() * (w.y2 - r - (w.y1 + r));
	this.direction.vx = 0;
	this.direction.vy = 0;
	this.move(this.line_limit_x + _loc_1, w.y1 + r + _loc_2);
	if (BILLIARD.Ball.isPositionOverlapped(this.x, this.y, this) != null)
	{
		this.putBehindLine();
	}
	else
	{
		//this.allowDrag(true);
	}
};// end function
BILLIARD.Ball.prototype.startDragging=function(event)
{
	return;
	var _loc_2 = null;
	var w=BILLIARD.Ball.w;
	var r=this.r;
	_loc_2 = new NEngine.Rect(this.line_limit_x, w.y1 + r, w.x2 - this.line_limit_x - r, w.y2 - w.y1 - r * 2);
	//this.startDrag(true, _loc_2);
};// end function
BILLIARD.Ball.prototype.updateProccessTime=function(param1)
{
	this.proccess_time = BILLIARD.Ball.correctFloatingPointError(param1);
	this.vx = BILLIARD.Ball.correctFloatingPointError(this.direction.vx * this.proccess_time);
	this.vy = BILLIARD.Ball.correctFloatingPointError(this.direction.vy * this.proccess_time);
};// end function
