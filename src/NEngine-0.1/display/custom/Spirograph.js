/**
* Spirograph.js by Nera Liu. Feb 5, 2011
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
* Represents a Spirograph in x / y coordinates.
**/

(function(NEngine) {

  /**
  * Spirograph's constructor.
  **/
  function Spirograph(R, r, O) {
    this.__displayobject_init("Spirograph");
    this.R = R;
    this.r = r;
    this.O = O;
    this.regX = 0;
    this.regY = 0;
  }

  Spirograph.inheritsFrom(NEngine.Shape);

  /**
  * @type Number
  **/
  Spirograph.prototype.R = 0;

  /**
  * @type Number
  **/
  Spirograph.prototype.r = 0;

  /**
  * @type Number
  **/
  Spirograph.prototype.O = 0;

  /**
  * Clone the Spirograph object.
  * @method Spirograph.clone()
  **/
  Spirograph.prototype.clone = function() {
    return new Spirograph(this.R, this.r, this.O);
  }

  /**
  * Return the string of Spirograph object.
  * @method Spirograph.toString()
  **/
  Spirograph.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",R:" + this.R + ",r:" + this.r + ",O:" + this.O + ")";
  }

  /**
  * Draw the Spirograph on the canvas.
  * @method Spirograph.draw(ctx)
  **/
  Spirograph.prototype.draw = function(ctx, ignoreCache) {
    if (!this.visible) { return true; }
    if (this.__draw(ctx, ignoreCache)) { return true; }
    if (this.animate) { this.animate(); }
    var x1 = this.R-this.O;
    var y1 = 0;
    var i  = 1;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    do {
      if (i>20000) break;
      var x2 = (this.R+this.r)*Math.cos(i*Math.PI/72) - (this.r+this.O)*Math.cos(((this.R+this.r)/this.r)*(i*Math.PI/72))
      var y2 = (this.R+this.r)*Math.sin(i*Math.PI/72) - (this.r+this.O)*Math.sin(((this.R+this.r)/this.r)*(i*Math.PI/72))
      ctx.lineTo(x2,y2);
      x1 = x2;
      y1 = y2;
      i++;
    } while (x2 != this.R-this.O && y2 != 0 );
    ctx.stroke();
  }

  /**
  * Test whether the mouseX/Y is in bound of the Spirograph.
  * @method Spirograph.inBounds(globalX, globalY)
  **/
  Spirograph.prototype.inBounds = function(globalX, globalY) {
    throw "Exception: Spirograph.inBounds(globalX, globalY)";
  }

  /**
  * Exposing the Spirograph to the NEngine global object.
  **/
  NEngine.Spirograph = Spirograph;

}(NEngine));
