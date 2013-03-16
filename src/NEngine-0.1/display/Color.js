/**
* Color.js by Nera Liu. Feb 5, 2011
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
* Represents color.
**/

(function(NEngine) {

  /**
  * Color's constructor.
  **/
  function Color(r, g, b, alpha) {
    if (r<0 || r>256 || r == undefined) { r = 0; }
    if (g<0 || g>256 || g == undefined) { g = 0; }
    if (b<0 || b>256 || b == undefined) { b = 0; }
    if (alpha<0 || alpha>1 || alpha == undefined) { alpha = 1; }
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = alpha;
  }

  /**
  * The reb component of RGB.
  * @type Number
  **/
  Color.prototype.r = 0;

  /**
  * The green component of RGB.
  * @type Number
  **/
  Color.prototype.g = 0;

  /**
  * The blue component of RGB.
  * @type Number
  **/
  Color.prototype.b = 0;

  /**
  * The alpha channel.
  * @type Number
  **/
  Color.prototype.alpha = 1;

  /**
  * Clone the Color object.
  * @method Color.clone()
  **/
  Color.prototype.clone = function() {
    return new Color(this.r, this.g, this.b, this.alpha);
  }

  /**
  * Return the string rgba of Color object.
  * @method Color.toRGB()
  **/
  Color.prototype.toRGB = function() {
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";
  }

  /**
  * Return the string CSS of Color object.
  * @method Color.toRGB()
  **/
  Color.prototype.toCSS = function() {
    return "#" + dechex(this.r) + dechex(this.g) + dechex(this.b);
  }

  /**
  * Exposing the Color to the NEngine global object.
  **/
  NEngine.Color = Color;

}(NEngine));
