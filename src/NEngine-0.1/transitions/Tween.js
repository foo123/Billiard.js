/**
* Tween.js by Nera Liu. Feb 5, 2011
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
* The animation class of NEngine.
**/

(function(NEngine) {

  /**
  * Tween's constructor.
  **/
  function Tween(obj, prop, animation, begin, end, duration, useSecond) {
    this.obj = obj;
    this.prop = prop;
    this.animation = animation;
    this.begin = begin;
    this.end = end;
    this.duration = duration;
    this.useSecond = useSecond;
    NEngine.Clock.addListeners(this);
  }

  /**
  * the start / stop thread of Tween
  * @type Boolean
  **/
  Tween.prototype._start = false;

  /**
  * The DisplayObject being animated.
  * @type NEngine.DisplayObject
  **/
  Tween.prototype.obj = null;

  /**
  * The DisplayObject's property being animated - alpha, x, y.
  * @type String
  **/
  Tween.prototype.prop = null;

  /**
  * The type of animation - regular, bounce, back, elastic, strong, none.
  * @type String 
  **/
  Tween.prototype.animation = null;

  /**
  * This is the position from which the animation will start.
  * @type Number
  **/
  Tween.prototype.begin = 0;

  /**
  * This is the position from which the animation will end.
  * @type Number
  **/
  Tween.prototype.end = 0;

  /**
  * This is the period for which the animation will run, the default unit for it is frames.
  * @type Number
  **/
  Tween.prototype.duration = 0;

  /**
  * Set this parameter to true if you want to the duration to be measured in seconds instead of frames.
  * @type Number
  **/
  Tween.prototype.useSecond = 0;

  /**
  * The orginal X value of the DisplayObject
  * @type Number
  **/
  Tween.prototype._originXValue = null;

  /**
  * The orginal Y value of the DisplayObject
  * @type Number
  **/
  Tween.prototype._originYValue = null;

  /**
  * Clone the Tween object.
  * @method Tween.clone()
  **/
  Tween.prototype.clone = function() {
    return new Tween(this.obj, this.prop, this.animation, this.begin, this.end, this.duration, this.useSecond);
  }

  /**
  * Return the string of Tween object.
  * @method Tween.toString()
  **/
  Tween.prototype.toString = function() {
    return "(obj:" + this.obj + ",prop:" + this.prop + ",animation:" + this.animation + ",begin:" + this.begin + ",end:" + this.end + ",duration:" + this.duration + ",useSecond:" + this.useSecond + ")";
  }

  /**
  * Draw the Tween on the canvas.
  * @method Tween.tick()
  **/
  Tween.prototype.tick = function() {
    if (this._start) {
      var delta;
      if (this.useSecond) {
        delta = Math.floor((this.end - this.begin)/(this.duration*(1000/NEngine.env.interval)));
      } else {
        delta = Math.floor((this.end - this.begin)/this.duration);
      }

      if (this.animation == "regular") {
        if (this.prop == "x") {
          if ((delta > 0 && this.obj.x < this.end) || (delta < 0 && this.obj.x > this.end)) {
            this.obj.x = this.obj.x + delta;
          }
        } else if (this.prop == "y") {
          if ((delta > 0 && this.obj.y < this.end) || (delta < 0 && this.obj.y > this.end)) {
            this.obj.y = this.obj.y + delta;
          }
        } else if (this.prop == "alpha") {
        }
      }
    }
  }

  /**
  * Start drawing the Tween on the canvas.
  * @method Tween.start()
  **/
  Tween.prototype.start = function() {
    this._start = true;
    this.obj.visible = true;
    if (this.animation == "regular") {
      if (this.prop == "x") {
        this.obj.x = this.begin;
        this._originXValue = this.obj.x;
      } else if (this.prop == "y") {
        this.obj.y = this.begin;
        this._originYValue = this.obj.y;
      }
    }
  }

  /**
  * End drawing the Tween on the canvas.
  * @method Tween.stop()
  **/
  Tween.prototype.stop = function() {
    this._start = false;
  }

  /**
  * Reset the drawing the Tween on the canvas.
  * @method Tween.reset()
  **/
  Tween.prototype.reset = function() {
    if (this.animation == "regular") {
      if (this.prop == "x") {
        this.obj.x = this._originXValue;
      } else if (this.prop == "y") {
        this.obj.y = this._originYValue;
      }
    }
  }

  /**
  * Exposing the Tween to the NEngine global object.
  **/
  NEngine.Tween = Tween;

}(NEngine));
