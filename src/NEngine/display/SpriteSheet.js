/**
* SpriteSheet.js by Nera Liu. Feb 5, 2011
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
* Represents a SpriteSheet in x / y coordinates.
**/

(function(NEngine) {

  /**
  * SpriteSheet's constructor.
  **/
  function SpriteSheet(imageurl) {
    this.__displayobject_init("SpriteSheet");
    this.image = new Image();
    var o = this;
    this.image.onload = function() {
      o.ready = true;
    }
    this.image.src = imageurl;
    this.sprites = new Array();
    this.active_sprite = -1;
  }

  SpriteSheet.inheritsFrom(NEngine.Shape);

  /**
  * The array image position in the spritesheet.
  * @type Array
  **/
  SpriteSheet.prototype.sprites;

  /**
  * The image object.
  * @type Image
  **/
  SpriteSheet.prototype.image = null;

  /**
  * Is the Image ready?
  * @type Boolean
  **/
  SpriteSheet.prototype.ready = false;

  /**
  * The index of active sprite image.
  * @type Number 
  **/
  SpriteSheet.prototype.active_sprite;

  /**
  * Clone the SpriteSheet object.
  * @method SpriteSheet.clone()
  **/
  SpriteSheet.prototype.clone = function() {
    return new SpriteSheet(this.image.src);
  }

  /**
  * Return the string of SpriteSheet object.
  * @method SpriteSheet.toString()
  **/
  SpriteSheet.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",imageurl:" + this.image.src + ")";
  }

  /**
  * Draw the SpriteSheet on the canvas.
  * @method SpriteSheet.draw(ctx, ignoreCache)
  **/
  SpriteSheet.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    if (this.ready) {
      if (this.active_sprite > -1 && this.sprites[this.active_sprite]) {
        ctx.drawImage(this.sprites[this.active_sprite].image, 
          this.sprites[this.active_sprite].sx,
          this.sprites[this.active_sprite].sy,
          this.sprites[this.active_sprite].sw,
          this.sprites[this.active_sprite].sh,
          this.sprites[this.active_sprite].x,
          this.sprites[this.active_sprite].y,
          this.sprites[this.active_sprite].width,
          this.sprites[this.active_sprite].height
        );
      } 
    }
  }

  /**
  * Set the x coordinate of the active sprite image.
  * @method SpriteSheet.setSpriteImageX(x)
  **/
  SpriteSheet.prototype.setSpriteImageX = function(x) {
    if (this.ready) {
      if (this.active_sprite > -1 && this.sprites[this.active_sprite]) {
        this.x = x;
        for (var i=0;i<this.sprites.length;i++) {
          this.sprites[i].x = x;
        }
      }
    }
  }

  /**
  * Get the x coordinate of the active sprite image.
  * @method SpriteSheet.getSpriteImageX(x)
  **/
  SpriteSheet.prototype.getSpriteImageX = function() {
    if (this.ready) {
      if (this.active_sprite > -1 && this.sprites[this.active_sprite]) {
        return this.sprites[this.active_sprite].x;
      }
    }
  }

  /**
  * Set the y coordinate of the active sprite image.
  * @method SpriteSheet.setSpriteImageY(y)
  **/
  SpriteSheet.prototype.setSpriteImageY = function(y) {
    if (this.ready) {
      if (this.active_sprite > -1 && this.sprites[this.active_sprite]) {
        this.y = y;
        for (var i=0;i<this.sprites.length;i++) {
          this.sprites[i].y = y;
        }
      }
    }
  }

  /**
  * Get the y coordinate of the active sprite image.
  * @method SpriteSheet.getSpriteImageY(y)
  **/
  SpriteSheet.prototype.getSpriteImageY = function() {
    if (this.ready) {
      if (this.active_sprite > -1 && this.sprites[this.active_sprite]) {
        return this.sprites[this.active_sprite].y;
      }
    }
  }

  /**
  * Test whether the mouseX/Y is in bound of the SpriteSheet.
  * @method SpriteSheet.inBounds(globalX, globalY)
  **/
  SpriteSheet.prototype.inBounds = function(globalX, globalY) {
  }

  /**
  * Adds a child Sprite instance to this SprtieSheet instance.
  * @method SpriteSheet.addSpriteImage(child)
  **/
  SpriteSheet.prototype.addSpriteImage = function(child) {
    this.sprites.push(child);
  }

  /**
  * Removes the specified child Sprite instance from the child list of the SpriteSheet instance.
  * @method SpriteSheet.removeSpriteImage(child)
  **/
  SpriteSheet.prototype.removeSpriteImage = function(child) {
    for (var i=0;i<this.sprites.length;i++) {
      if (this.sprites[i].id == child.id) {
        var c = this.sprites[i];
        this.sprites.splice(i, 1);
        return c;
      }
    }
    return null;
  }

  /**
  * Exposing the SpriteSheet to the NEngine global object.
  **/
  NEngine.SpriteSheet = SpriteSheet;

}(NEngine));
