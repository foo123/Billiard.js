/**
* Button.js by Nera Liu. Feb 5, 2011
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
* Represents a Button in x / y coordinates.
**/

(function(NEngine) {

  /**
  * Button's constructor.
  **/
  function Button(x, y, w, h, label) {
    this.__displayobject_init("Button");
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.regX = w/2;
    this.regY = h/2;
    this.label = new NEngine.StaticText(x+w/2,y+h/2,label,true);
    this.label.textAlign = "center";
    this.label.textBaseline = "middle";
    this.cursor = "pointer";
  }

  Button.inheritsFrom(NEngine.Rectangle);

  /**
  * The label of the NEngine.Button.
  * @type NEngine.StaticText
  **/
  Button.prototype.label = null;

  /**
  * The pixel change of the Button when MouseOver/MouseOut.
  * @type Number
  **/
  Button.prototype._sizeDelta = 3;

  /**
  * Clone the Button object.
  * @method Button.clone()
  **/
  Button.prototype.clone = function() {
    return new Button(this.x, this.y, this.width, this.height, this.label);
  }

  /**
  * Return the string of Button object.
  * @method Button.toString()
  **/
  Button.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",w:" + this.width + ",h:" + this.height + ")";
  }

  /**
  * The default onMouseOver handler of the Button.
  * @method Button.onMouseOver()
  **/
  Button.prototype.onMouseOver = function(e) {
    if (this._sizeDelta) {
      this.x = this.x - this._sizeDelta;
      this.y = this.y - this._sizeDelta;
      this.width  = this.width + (this._sizeDelta*2);
      this.height = this.height + (this._sizeDelta*2);
    }
  }

  /**
  * The default onMouseOver handler of the Button.
  * @method Button.onMouseOver()
  **/
  Button.prototype.onMouseOut = function(e) {
    if (this._sizeDelta) {
      this.x = this.x + this._sizeDelta;
      this.y = this.y + this._sizeDelta;
      this.width  = this.width - (this._sizeDelta*2);
      this.height = this.height - (this._sizeDelta*2);
    }
  }

  /**
  * Draw the Button on the canvas.
  * @method Button.draw(ctx)
  **/
  Button.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    this.applyStyle(ctx);
    if (this.filled) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
      this.label.draw(ctx, ignoreCache);
    } else {
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      this.label.draw(ctx, ignoreCache);
    }
    this.resetStyle(ctx);
  }

  /**
  * Exposing the Button to the NEngine global object.
  **/
  NEngine.Button = Button;

}(NEngine));
