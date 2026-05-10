/**
* BitmapSequence.js by Nera Liu. Feb 5, 2011
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
* Represents a BitmapSequence in x / y coordinates.
**/

(function(NEngine) {

  /**
  * BitmapSequence's constructor.
  **/
  function BitmapSequence(spriteimage, seq, x, y) {
    this.__displayobject_init("BitmapSequence");
    this.x = x;
    this.y = y;
    this.seq = seq;
    this.spritesheet = spritesheet;
  }

  BitmapSequence.inheritsFrom(NEngine.Shape);

  /**
  * The sprite sheet.
  * @type SprtieSheet
  **/
  BitmapSequence.prototype.spritesheet = null;

  /**
  * the bitmap sequence index
  * @type Array
  **/
  BitmapSequence.prototype.seq = null;

  /**
  * the current bitmap sequence index
  * @type Number
  **/
  BitmapSequence.prototype.index = 0;

  /**
  * Clone the BitmapSequence object.
  * @method BitmapSequence.clone()
  **/
  BitmapSequence.prototype.clone = function() {
    return new BitmapSequence(this.spritesheet, this.seq, this.x, this.y);
  }

  /**
  * Return the string of BitmapSequence object.
  * @method BitmapSequence.toString()
  **/
  BitmapSequence.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",index:" + this.index + ")";
  }

  /**
  * Draw the BitmapSequence on the canvas.
  * @method BitmapSequence.draw(ctx, ignoreCache)
  **/
  BitmapSequence.prototype.draw = function(ctx) {
    if (this.spritesheet.ready) {
      if (this.index < this.seq.length-1) { this.index++;
      } else { this.index = 0; }
      this.spritesheet.active_sprite = this.seq[this.index];
      this.spritesheet.draw(ctx);
    }
  }

  /**
  * Set the x coordinate of the active sprite image.
  * @method BitmapSequence.setImageX(x)
  **/
  BitmapSequence.prototype.setImageX = function(x) {
    if (this.spritesheet.ready) {
      this.spritesheet.setSpriteImageX(x);
    }
  }

  /**
  * Get the x coordinate of the active sprite image.
  * @method BitmapSequence.getImageX(x)
  **/
  BitmapSequence.prototype.getImageX = function() {
    if (this.spritesheet.ready) {
      return this.spritesheet.getSpriteImageX();
    }
  }

  /**
  * Set the y coordinate of the active sprite image.
  * @method BitmapSequence.setImageY(y)
  **/
  BitmapSequence.prototype.setImageY = function(y) {
    if (this.spritesheet.ready) {
      this.spritesheet.setSpriteImageY(y);
    }
  }

  /**
  * Get the y coordinate of the active sprite image.
  * @method BitmapSequence.getImageY(y)
  **/
  BitmapSequence.prototype.getImageY = function() {
    if (this.spritesheet.ready) {
      return this.spritesheet.getSpriteImageY();
    }
  }

  /**
  * Test whether the mouseX/Y is in bound of the BitmapSequence.
  * @method BitmapSequence.inBounds(globalX, globalY)
  **/
  BitmapSequence.prototype.inBounds = function(globalX, globalY) {
  }

  /**
  * Exposing the BitmapSequence to the NEngine global object.
  **/
  NEngine.BitmapSequence = BitmapSequence;

}(NEngine));
