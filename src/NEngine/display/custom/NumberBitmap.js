/**
* NumberBitmap.js by Nera Liu. Feb 5, 2011
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
* Represents a NumberBitmap in x / y coordinates.
**/

(function(NEngine) {

  /**
  * NumberBitmap's constructor.
  **/
  function NumberBitmap(imageurl, x, y, w, h) {
    this.__displayobject_init("NumberBitmap");
    this.x = x;
    this.y = y;
    this.regX = w/2;
    this.regY = h/2;
    this.image = new Image();
    var o = this;
    this.image.onload = function() {
      o.ready = true;
    }
    if (w) { this.width = w; }
    if (h) { this.height = h; }
    this.image.src = imageurl;
    this.number = new NEngine.StaticText(x,y,this.id,true);
  }

  NumberBitmap.inheritsFrom(NEngine.Shape);

  /**
  * The image object.
  * @type Image
  **/
  NumberBitmap.prototype.image = null;

  /**
  * Is the Image ready?
  * @type Boolean
  **/
  NumberBitmap.prototype.ready = false;

  /**
  * The text object.
  * @type StaticText
  **/
  NumberBitmap.prototype.number = null;

  /**
  * Clone the NumberBitmap object.
  * @method NumberBitmap.clone()
  **/
  NumberBitmap.prototype.clone = function() {
    return new NumberBitmap(this.image.src);
  }

  /**
  * Return the string of NumberBitmap object.
  * @method NumberBitmap.toString()
  **/
  NumberBitmap.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",imageurl:" + this.image.src + ")";
  }

  /**
  * Draw the NumberBitmap on the canvas.
  * @method NumberBitmap.draw(ctx, ignoreCache)
  **/
  NumberBitmap.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    if (this.ready) {
      if (this.width && this.height) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else {
        ctx.drawImage(this.image, this.x, this.y);
      }
    }
    this.number.draw(ctx);
  }

  /**
  * Test whether the mouseX/Y is in bound of the NumberBitmap.
  * @method NumberBitmap.inBounds(globalX, globalY)
  **/
  NumberBitmap.prototype.inBounds = function(globalX, globalY) {
    var inBounds = (globalX >= this.x && globalY >= this.y && globalX < (this.x + this.width) && globalY < (this.y + this.height));
    if (this.stage) {
      if (inBounds) {
        var imagedata = this.stage.graphics.ctx.getImageData(globalX, globalY, 1, 1);
        return (imagedata.data[3]/255);
      }
    }
    return inBounds;
  }

  /**
  * Exposing the NumberBitmap to the NEngine global object.
  **/
  NEngine.NumberBitmap = NumberBitmap;

}(NEngine));
