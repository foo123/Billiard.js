/**
* StaticText.js by Nera Liu. Feb 5, 2011
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
* Represents a StaticText in x / y coordinates.
**/

(function(NEngine) {

  /**
  * StaticText's constructor.
  **/
  function StaticText(x, y, text, filled) {
    this.__displayobject_init("StaticText");
    this.x = x;
    this.y = y;
    this.regX = 0;
    this.regY = 0;
    this.text = text;
    if (typeof filled == 'boolean') { this.filled = filled; }
  }

  StaticText.inheritsFrom(NEngine.Shape);

  /**
  * The text of the StaticText object.
  * @type String
  **/
  StaticText.prototype.text = null;

  /**
  * Please refer to https://developer.mozilla.org/en/Drawing_text_using_a_canvas.
  * @type String
  **/
  StaticText.prototype.font = "12pt Times New Roman";

  /**
  * Please refer to https://developer.mozilla.org/en/Drawing_text_using_a_canvas.
  * @type String
  **/
  StaticText.prototype.textAlign = "left";

  /**
  * Please refer to https://developer.mozilla.org/en/Drawing_text_using_a_canvas.
  * @type String
  **/
  StaticText.prototype.textBaseline = "bottom";

  /**
  * Please refer to https://developer.mozilla.org/en/Drawing_text_using_a_canvas.
  * @type String
  **/
  StaticText.prototype.maxWidth = 0;

  /**
  * Clone the StaticText object.
  * @method StaticText.clone()
  **/
  StaticText.prototype.clone = function() {
    var o = new StaticText(this.x, this.y, this.text, this.filled);
    o.font = this.font;
    o.textAlign = this.textAlign;
    o.textBaseline  = this.textBaseline;
    o.maxWidth = this.maxWidth;
    return o;
  }

  /**
  * Return the string of StaticText object.
  * @method StaticText.toString()
  **/
  StaticText.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",text:" + this.text + ")";
  }

  /**
  * Apply the text style.
  * @method StaticText.applyTextStyle(ctx)
  **/
  StaticText.prototype.applyTextStyle = function(ctx) {
    if (this.font) { ctx.font = this.font; }
    if (this.textAlign) { ctx.textAlign = this.textAlign; }
    if (this.textBaseline) { ctx.textBaseline = this.textBaseline; }
  }

  /**
  * Draw the StaticText on the canvas.
  * @method StaticText.draw(ctx, ignoreCache)
  **/
  StaticText.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    this.applyStyle(ctx);
    this.applyTextStyle(ctx);
    if (this.filled) { 
      ctx.fillText(this.text,this.x,this.y,this.maxWidth);
    } else {
      ctx.strokeText(this.text,this.x,this.y,this.maxWidth); 
    }
    this.resetStyle(ctx);
  }

  /**
  * Test whether the mouseX/Y is in bound of the StaticText.
  * @method StaticText.inBounds(globalX, globalY)
  **/
  StaticText.prototype.inBounds = function(globalX, globalY) {
    // throw "Exception: StaticText.inBounds(globalX, globalY)";
    return false;
  }

  /**
  * Exposing the StaticText to the NEngine global object.
  **/
  NEngine.StaticText = StaticText;

}(NEngine));
