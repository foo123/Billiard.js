/**
* Circle.js by Nera Liu. Feb 5, 2011
* Visit blog.neraliu.com/nengine for documentation, updates and more free code.
*
*
* Copyright (c) 2011 Nera Liu
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
**/

/**
* Represents a Circle wth x / y coordinates as center.
**/

(function(NEngine) {

  /**
  * Circle's constructor.
  **/
  function Circle(x, y, r, filled) {
    this.__displayobject_init("Circle");
    this.x = x;
    this.y = y;
    this.radius = r;
    this.regX = 0;
    this.regY = 0;
    if (typeof filled == 'boolean') { this.filled = filled; }
  }

  Circle.inheritsFrom(NEngine.Shape);

  /**
  * The radius of the Circle.
  * @type Number 
  **/
  Circle.prototype.radius = 0;

  /**
  * Clone the Circle object.
  * @method Circle.clone()
  **/
  Circle.prototype.clone = function() {
    return new Circle(this.x, this.y, this.r, this.filled);
  }

  /**
  * Return the string of Circle object.
  * @method Circle.toString()
  **/
  Circle.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",r:" + this.radius + ")";
  }

  /**
  * Draw the Circle on the canvas.
  * @method Circle.draw(ctx, ignoreCache)
  **/
  Circle.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    this.applyStyle(ctx);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, new NEngine.Angle().degree2radian(0), new NEngine.Angle().degree2radian(360), true);
    if (this.filled) { ctx.fill(); } else { ctx.stroke(); }
    this.resetStyle(ctx);
  }

  /**
  * Test whether the mouseX/Y is in bound of the Circle.
  * @method Circle.inBounds(globalX, globalY)
  **/
  Circle.prototype.inBounds = function(globalX, globalY) {
    // throw "Exception: Circle.inBounds(globalX, globalY)";
    return false;
  }

  /**
  * Exposing the Circle to the NEngine global object.
  **/
  NEngine.Circle = Circle;

}(NEngine));
