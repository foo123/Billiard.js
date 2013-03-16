/**
* Bitmap.js by Nera Liu. Feb 5, 2011
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
* Represents a Bitmap in x / y coordinates.
**/

(function(NEngine) {

  /**
  * Bitmap's constructor.
  **/
  function Bitmap(image, x, y, w, h, sx, sy, sw, sh) {
    this.__displayobject_init("Bitmap");
    this.x = x;
    this.y = y;
    this.regX = w/2;
    this.regY = h/2;

    if (typeof image == "string") {
      this.image = new Image();
      var o = this;
      this.image.onload = function() {
        o.ready = true;
      }
      this.image.src = image;
    } else if (image instanceof Image) {
      this.image = image;
    } else {
      throw "Exception: the first parameter is not String or Image object"; 
    }

    if (w != undefined) { this.width = w; }
    if (h != undefined) { this.height = h; }
    if (sx != undefined) { this.sx = sx; }
    if (sy != undefined) { this.sy = sy; }
    if (sw != undefined) { this.sw = sw; }
    if (sh != undefined) { this.sh = sh; }
  }

  Bitmap.inheritsFrom(NEngine.Shape);

  /**
  * The image object.
  * @type Image
  **/
  Bitmap.prototype.image = null;

  /**
  * Is the Image ready?
  * @type Boolean
  **/
  Bitmap.prototype.ready = false;

  /**
  * The x displacement of the image object.
  * @type Number
  **/
  Bitmap.prototype.sx = null;

  /**
  * The y displacement of the image object.
  * @type Number
  **/
  Bitmap.prototype.sy = null;

  /**
  * The w displacement of the image object.
  * @type Number
  **/
  Bitmap.prototype.sw = null;

  /**
  * The h displacement of the image object.
  * @type Number
  **/
  Bitmap.prototype.sh = null;

  /**
  * Clone the Bitmap object.
  * @method Bitmap.clone()
  **/
  Bitmap.prototype.clone = function() {
    return new Bitmap(this.image.src);
  }

  /**
  * Return the string of Bitmap object.
  * @method Bitmap.toString()
  **/
  Bitmap.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",imageurl:" + this.image.src + ")";
  }

  /**
  * Draw the Bitmap on the canvas.
  * @method Bitmap.draw(ctx, ignoreCache)
  **/
  Bitmap.prototype.draw = function(ctx, ignoreCache) {
	if (this.__draw(ctx, ignoreCache)) { return true; }
    if (this.ready) {
      if (this.width && this.height && this.sx != undefined && this.sy != undefined && this.sw && this.sh) {
        ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height);
      } else if (this.width && this.height) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else {
        ctx.drawImage(this.image, this.x, this.y);
      }
    }
  }

  /**
  * Test whether the mouseX/Y is in bound of the Bitmap.
  * @method Bitmap.inBounds(globalX, globalY)
  **/
  Bitmap.prototype.inBounds = function(globalX, globalY) {
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
  * Exposing the Bitmap to the NEngine global object.
  **/
  NEngine.Bitmap = Bitmap;

}(NEngine));
