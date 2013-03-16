(function(BILLIARD){
BILLIARD.CollisionResult=function(param1, param2, param3, param4)
{
    this.p0=null;
    this.p1=null;
    if (typeof param1=='undefined')
        param1=0;
    if (typeof param2=='undefined')
        param2=0;
    if (typeof param3=='undefined')
        param3=0;
    if (typeof param4=='undefined')
        param4=0;
    this.p0 = new BILLIARD.SimplePoint(param1, param2);
    this.p1 = new BILLIARD.SimplePoint(param3, param4);
};
})(BILLIARD);