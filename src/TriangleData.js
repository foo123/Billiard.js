(function(BILLIARD){
    BILLIARD.TriangleData=function()
    {
        this.p0=0;
        this.vy=0;
        this.p1=0;
        this.vx=0;
        this.dx=0;
        this.len=0;
        this.dy=0;

        this.p0 = new BILLIARD.SimplePoint();
        this.p1 = new BILLIARD.SimplePoint();
    };// end function
    BILLIARD.TriangleData.prototype.refresh=function(param1)
    {
        if (typeof param1=='undefined')
            param1=false;
        if (param1)
        {
            this.vx = BILLIARD.Ball.correctFloatingPointError(this.p1.x - this.p0.x);
            this.vy = BILLIARD.Ball.correctFloatingPointError(this.p1.y - this.p0.y);
        }
        else
        {
            this.p1.update(this.p0.x + this.vx, this.p0.y + this.vy);
        }
        this.len = BILLIARD.TriangleData.getHypotenuse(this.vx, this.vy);
        if (this.len > 0)
        {
            this.dx = BILLIARD.Ball.correctFloatingPointError(this.vx / this.len);
            this.dy = BILLIARD.Ball.correctFloatingPointError(this.vy / this.len);
        }
        else
        {
            this.dx = 0;
            this.dy = 0;
        }
    };// end function
    BILLIARD.TriangleData.getHypotenuse=function(side1, side2)
    {
        return BILLIARD.Ball.correctFloatingPointError(Math.sqrt(side1 * side1 + side2 * side2));
    };// end function
})(BILLIARD);