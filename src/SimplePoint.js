BILLIARD.SimplePoint=function(param1, param2)
{
	this.x=0;
	this.y=0;
	if (typeof param1=='undefined')
		param1=0;
	if (typeof param2=='undefined')
		param2=0;
	this.update(param1, param2);

};// end function

BILLIARD.SimplePoint.prototype.update=function(param1, param2)
{
	this.x = BILLIARD.Ball.correctFloatingPointError(param1);
	this.y = BILLIARD.Ball.correctFloatingPointError(param2);
	return;
};// end function
