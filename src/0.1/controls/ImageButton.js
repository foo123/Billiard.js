/**
* ImageImageButton.js by Nera Liu. Feb 5, 2011
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
* Represents a ImageImageButton in x / y coordinates.
**/

(function(NEngine) {

  /**
  * ImageButton's constructor.
  **/
  function ImageButton(x, y, w, h, image, imageMouseOver) {
    this.__displayobject_init("ImageButton");
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.regX = w/2;
    this.regY = h/2;
    this.image = new NEngine.Bitmap(image,x,y,w,h);
    this.imageMouseOver = new NEngine.Bitmap(imageMouseOver,x,y,w,h);
    this.active_image = this.image;
    this.cursor = "pointer";
  }

  ImageButton.inheritsFrom(NEngine.Button);

  /**
  * The MouseOver image.
  * @type NEngine.Bitmap
  **/
  ImageButton.prototype.imageMouseOver = null;

  /**
  * The image.
  * @type NEngine.Bitmap
  **/
  ImageButton.prototype.image = null;

  /**
  * The active image.
  * @type NEngine.Bitmap
  **/
  ImageButton.prototype.active_image = null;

  /**
  * Clone the ImageButton object.
  * @method ImageButton.clone()
  **/
  ImageButton.prototype.clone = function() {
    return new ImageButton(this.x, this.y, this.width, this.height, this.image, this.imageMouseOver);
  }

  /**
  * Return the string of ImageButton object.
  * @method ImageButton.toString()
  **/
  ImageButton.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",w:" + this.width + ",h:" + this.height + ")";
  }

  /**
  * The default onMouseOver handler of the ImageButton.
  * @method ImageButton.onMouseOver()
  **/
  ImageButton.prototype.onMouseOver = function(e) {
    if (this._sizeDelta) {
      this.x = this.x - this._sizeDelta;
      this.y = this.y - this._sizeDelta;
      this.width  = this.width + (this._sizeDelta*2);
      this.height = this.height + (this._sizeDelta*2);
      this.active_image = this.imageMouseOver;
      this.image.x = this.image.x - this._sizeDelta;
      this.image.y = this.image.y - this._sizeDelta;
      this.image.width  = this.image.width + (this._sizeDelta*2);
      this.image.height = this.image.height + (this._sizeDelta*2);
      this.imageMouseOver.x = this.imageMouseOver.x - this._sizeDelta;
      this.imageMouseOver.y = this.imageMouseOver.y - this._sizeDelta;
      this.imageMouseOver.width  = this.imageMouseOver.width + (this._sizeDelta*2);
      this.imageMouseOver.height = this.imageMouseOver.height + (this._sizeDelta*2);
    }
  }

  /**
  * The default onMouseOver handler of the ImageButton.
  * @method ImageButton.onMouseOver()
  **/
  ImageButton.prototype.onMouseOut = function(e) {
    if (this._sizeDelta) {
      this.x = this.x + this._sizeDelta;
      this.y = this.y + this._sizeDelta;
      this.width  = this.width - (this._sizeDelta*2);
      this.height = this.height - (this._sizeDelta*2);
      this.active_image = this.image;
      this.image.x = this.image.x + this._sizeDelta;
      this.image.y = this.image.y + this._sizeDelta;
      this.image.width  = this.image.width - (this._sizeDelta*2);
      this.image.height = this.image.height - (this._sizeDelta*2);
      this.imageMouseOver.x = this.imageMouseOver.x + this._sizeDelta;
      this.imageMouseOver.y = this.imageMouseOver.y + this._sizeDelta;
      this.imageMouseOver.width  = this.imageMouseOver.width - (this._sizeDelta*2);
      this.imageMouseOver.height = this.imageMouseOver.height - (this._sizeDelta*2);
    }
  }

  /**
  * Draw the ImageButton on the canvas.
  * @method ImageButton.draw(ctx)
  **/
  ImageButton.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    this.active_image.draw(ctx, ignoreCache);
  }

  /**
  * Exposing the ImageButton to the NEngine global object.
  **/
  NEngine.ImageButton = ImageButton;

}(NEngine));
