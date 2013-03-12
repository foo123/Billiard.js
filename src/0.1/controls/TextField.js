/**
* TextField.js by Nera Liu. Feb 5, 2011
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
* Represents a TextField in x / y coordinates.
**/

(function(NEngine) {

  /**
  * TextField's constructor.
  **/
  function TextField(x, y, w, h) {
    this.__displayobject_init("TextField");
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.regX = w/2;
    this.regY = h/2;
    this.label = new NEngine.StaticText(x+5,y+h/2,"",true);
    this.label.textAlign = "left";
    this.label.textBaseline = "middle";
  }

  TextField.inheritsFrom(NEngine.Rectangle);

  /**
  * The label of the NEngine.TextField.
  * @type NEngine.StaticText
  **/
  TextField.prototype.label = null;

  /**
  * The isFocus flash of the NEngine.TextField.
  * @type Boolean
  **/
  TextField.prototype.isFlash = false;

  /**
  * Clone the TextField object.
  * @method TextField.clone()
  **/
  TextField.prototype.clone = function() {
    return new TextField(this.x, this.y, this.width, this.height);
  }

  /**
  * Return the string of TextField object.
  * @method TextField.toString()
  **/
  TextField.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",w:" + this.width + ",h:" + this.height + ")";
  }

 /**
  * The default onMouseOver handler of the Button.
  * @method Button.onClick()
  **/
  TextField.prototype.onClick = function(e) {
    this.isFocus = true;
    this.label.text = "click";
  }

  /**
  * Draw the TextField on the canvas.
  * @method TextField.draw(ctx)
  **/
  TextField.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    this.applyStyle(ctx);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.label.draw(ctx, ignoreCache);
    this.resetStyle(ctx);
  }

  /**
  * Exposing the TextField to the NEngine global object.
  **/
  NEngine.TextField = TextField;

}(NEngine));
