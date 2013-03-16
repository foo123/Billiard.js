(function(BILLIARD){
    BILLIARD.Taco=function(taco)
    {
        this.moving=false;
        this.holding=false;
        this.hits=0;
        this.first_hit=null;
        this.vector_mouse=null;
        this.init_mouse=null;
        this.whiteBall=null;
        this.last_power_factor=null;
        this.maxPower = 120;
        this.RAD_TO_DEG = 180/Math.PI;
        this.DEG_TO_RAD = Math.PI/180;
        this.maxRadius = 100;
        var thiss=this;
        this.keypress=false;
        NEngine.Shape.call(this);
        this.name='taco';
        this.cacheCanvas=document.createElement('canvas');
        this.image=new Image();
        this.image.onload=function(){
            thiss.cacheCanvas.width=thiss.image.width;
            thiss.cacheCanvas.height=thiss.image.height;
            var ctx=thiss.cacheCanvas.getContext('2d');
            ctx.drawImage(thiss.image,0,0);
            thiss.width=thiss.image.width;
            thiss.height=thiss.image.height;
            thiss.regX=thiss.image.width/2;
            thiss.regY=0;
        };
        
        this.init_mouse = new BILLIARD.TriangleData();
        this.vector_mouse = new BILLIARD.TriangleData();
        
        this.onKeyDown=function(e){thiss.onPress(e)};
        this.onKeyUp=function(e){thiss.onRelease(e)};
        this.image.src=taco;
    };
    BILLIARD.Taco.inheritsFrom(NEngine.Shape);
    BILLIARD.Taco.prototype.draw=function(ctx,ignoreCache)
    {
        this.__draw(ctx,ignoreCache);
    };
    BILLIARD.Taco.prototype.init=function(whiteBall)
    {
        this.moving = true;
        this.holding = false;
        this.alpha = 0;
        this.hits = 0;
        this.whiteBall = whiteBall;
    };// end function
    BILLIARD.Taco.prototype.putOnBorder=function(off)
    {
        if (typeof off=='undefined')
            off=0;
        var a=this.rotation+Math.PI*0.5;
        var c=Math.cos(a);
        var s=Math.sin(a);
        var r=this.whiteBall.r+5+off;
        //this.x = this.whiteBall.x + this.vector_mouse.dx * this.whiteBall.r;
        //this.y = this.whiteBall.y + this.vector_mouse.dy * this.whiteBall.r;
        this.x = this.whiteBall.x + c * r;
        this.y = this.whiteBall.y + s * r;
    };// end function
    BILLIARD.Taco.prototype.updateState=function()
    {
        var _loc_1 = null;
        var _loc_2 = NaN;
        if (this.moving)
        {
                //this.rotation=-Math.PI/2;
                //this.putOnBorder();
                //return;
            if (this.holding)
            {
                _loc_1 = new BILLIARD.TriangleData();
                _loc_1.p0 = new BILLIARD.SimplePoint(this.whiteBall.x, this.whiteBall.y);
                _loc_1.p1 = new BILLIARD.SimplePoint(this.parent.mouseX, this.parent.mouseY);
                _loc_1.refresh(true);
                _loc_2 = _loc_1.len - this.init_mouse.len;
                if (_loc_1.len <= this.whiteBall.r || _loc_2 <= 0)
                {
                    this.putOnBorder();
                }
                else if (_loc_2 <= this.maxRadius && (this.vector_mouse.dx > 0 && _loc_1.dx > 0 || this.vector_mouse.dx < 0 && _loc_1.dx < 0))
                {
                    //this.x = this.whiteBall.x + this.vector_mouse.dx * (this.whiteBall.r + _loc_2);
                    //this.y = this.whiteBall.y + this.vector_mouse.dy * (this.whiteBall.r + _loc_2);
                    this.putOnBorder(_loc_2);
                }
            }
            else
            {
                this.vector_mouse.p0 = new BILLIARD.SimplePoint(this.whiteBall.x, this.whiteBall.y);
                this.vector_mouse.p1 = new BILLIARD.SimplePoint(this.parent.mouseX, this.parent.mouseY);
                this.vector_mouse.refresh(true);
                if (this.vector_mouse.dx < 0)
                {
                    this.rotation = Math.PI/2 + Math.atan(this.vector_mouse.vy / this.vector_mouse.vx);
                }
                else
                {
                    this.rotation = 3*Math.PI/2 + Math.atan(this.vector_mouse.vy / this.vector_mouse.vx);
                }
                this.putOnBorder();
            }
        }
    };// end function
    BILLIARD.Taco.prototype.onPress=function(event)
    {
        if (!this.keypress && event.keyCode==81) //q key pressed
        {
        this.init_mouse.p0 = new BILLIARD.SimplePoint(this.whiteBall.x, this.whiteBall.y);
        this.init_mouse.p1 = new BILLIARD.SimplePoint(this.parent.mouseX, this.parent.mouseY);
        this.init_mouse.refresh(true);
        this.holding = true;
        this.keypress=true;
        }
    };// end function
    BILLIARD.Taco.prototype.onRelease=function(event)
    {
        var _loc_2 = null;
        var _loc_5 = NaN;
        if (this.whiteBall.dragging)
        {
            this.whiteBall.allowDrag(false);
        }
        if (this.holding)
        {
            this.moving = false;
            this.holding = false;
            this.keypress=false;
            _loc_2 = new BILLIARD.TriangleData();
            _loc_2.p0 = new BILLIARD.SimplePoint(this.whiteBall.x + this.init_mouse.dx * this.whiteBall.r, this.whiteBall.y + this.init_mouse.dy * this.whiteBall.r);
            _loc_2.p1 = new BILLIARD.SimplePoint(this.x, this.y);
            _loc_2.refresh(true);
            this.putOnBorder();
            if (_loc_2.len > 0 && this.whiteBall.direction.vx == 0 && this.whiteBall.direction.vy == 0)
            {
                this.last_power_factor = _loc_2.len / this.maxRadius;
                _loc_5 = this.last_power_factor * this.maxPower;
                /*if (this.hits > 0)
                {
                    _loc_5 = _loc_5 * 0.65;
                }*/
                this.first_hit = null;
                this.whiteBall.updateDirection(this.whiteBall.x + _loc_5 * (-this.init_mouse.dx), this.whiteBall.y + _loc_5 * (-this.init_mouse.dy));
                this.hits++;
            }
        }
    };// end function
    BILLIARD.Taco.prototype.getDirection=function()
    {
        return new BILLIARD.SimplePoint(-this.vector_mouse.dx, -this.vector_mouse.dy);
    };// end function
})(BILLIARD);