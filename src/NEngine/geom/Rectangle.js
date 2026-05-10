
/**
* Represents a Rectangle with x / y coordinates and width and height.
**/

(function(NEngine) {

  /**
  * Point's constructor.
  **/
  function Rect(x, y, w, h) {
    this.name = "Rectangle";
    this.x = x;
    this.y = y;
	this.width=w;
	this.height=h;
  }

  Rect.prototype.contains = function(pt) {
    return (this.x<=pt.x &&  this.y<=pt.y && pt.x<=this.x+this.width && pt.y<=this.y+this.height);
  }
  Rect.prototype.clone = function() {
    return new Rect(this.x, this.y, this.width,this.height);
  }
  Rect.prototype.toString = function() {
    return this.name + "(x:" + this.x + ",y:" + this.y + ",width:" + this.width +",height:" + this.height +")";
  }

  NEngine.Rect = Rect;

}(NEngine));
