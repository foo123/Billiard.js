/**
* DisplayObject.js by Nera Liu. Feb 5, 2011
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
* The DisplayObject class is the base class for all objects that can be placed on the display list. The display list manages all objects displayed in NEngine. Use the DisplayObjectContainer class to arrange the display objects in the display list. DisplayObjectContainer objects can have child display objects, while other display objects, such as Shape and StaticText objects, are "leaf" nodes that have only parents and siblings, no children.
**/

(function(NEngine) {

  /**
  * DisplayObject's constructor.
  **/
  function DisplayObject() {
    this.__displayobject_init();
  }

  DisplayObject.prototype.constructor = DisplayObject;

  /**
  * canvas used for hitTest
  **/
  DisplayObject.suppressCrossDomainErrors = false;
  DisplayObject._hitTestCanvas = document.createElement("canvas");
  DisplayObject._hitTestCanvas.width = DisplayObject._hitTestCanvas.height = 1;
  DisplayObject._hitTestContext = DisplayObject._hitTestCanvas.getContext("2d");

  /**
  * The unique ID of the DisplayObject.
  * @type Number
  **/
  DisplayObject.prototype.id = null;

  /**
  * Indicates the classname of the DisplayObject.
  * @type String
  **/
  DisplayObject.prototype.name = null;

  /** 
  * Indicates the global x coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer. 
  * @type Number
  **/
  DisplayObject.prototype.x = 0;

  /** 
  * Indicates the global y coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
  * @type Number
  **/
  DisplayObject.prototype.y = 0;

  /** 
  * Indicates the width of the display object, in pixels.
  * @type Number
  **/
  DisplayObject.prototype.width = 0;

  /** 
  * Indicates the height of the display object, in pixels.
  * @type Number
  **/
  DisplayObject.prototype.height = 0;

  /**
  * The scale factor of x coordination.
  * @type Number
  **/
  DisplayObject.prototype.scaleX = 1;

  /**
  * The scale factor of y coordination.
  * @type Number
  **/
  DisplayObject.prototype.scaleY = 1;

  /**
  * The skew factor of x coordination.
  * @type Number
  **/
  DisplayObject.prototype.skewX = 0;

  /**
  * The skew factor of y coordination.
  * @type Number
  **/
  DisplayObject.prototype.skewY = 0;

  /**
  * The origin of X for rotation.
  * @type Number
  **/
  DisplayObject.prototype.regX = 0;

  /**
  * The origin of Y for rotation.
  * @type Number
  **/
  DisplayObject.prototype.regY = 0;

  /**
  * Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation.
  * @type Number
  **/
  DisplayObject.prototype.rotation = 0;

  /**
  * The working matrix of the DisplayObject.
  * @type NEngine.Matrix2D
  **/
  DisplayObject.prototype._mtx = null;

  /**
  * [read-only] Indicates the local x coordinate of the mouse position, in pixels.
  * @type Number
  **/
  DisplayObject.prototype.mouseX = 0;

  /**
  * [read-only] Indicates the local y coordinate of the mouse position, in pixels.
  * @type Number
  **/
  DisplayObject.prototype.mouseY = 0;

  /**
  * the visibility flag of the DisplayObject
  * @type Boolean
  **/
  DisplayObject.prototype.visible = true;

  /**
  * the isFocus flag of the DisplayObject
  * @type Boolean
  **/
  DisplayObject.prototype.isFocus = false;

  /**
  * the inBounds flag of the DisplayObject
  * @type Boolean
  **/
  DisplayObject.prototype.isBounds = false;

  /**
  * Indicates the alpha transparency value of the object specified.
  * 0 is fully transparent, 1 is fully opaque.
  * @type Number
  **/
  DisplayObject.prototype.alpha = 1;

  /**
  * Indicates the shadow of the DisplayObject.
  * @type
  **/
  DisplayObject.prototype.shadow = null;

  /**
  * Indicates the compositeOperation of the DisplayObject.
  * @type String
  **/
  DisplayObject.prototype.compositeOperation = "";

  /**
  * A Boolean value that indicates whether the pointing hand (hand cursor) appears when the mouse rolls over a sprite in which the buttonMode property is set to true.
  * @type Boolean
  **/
  DisplayObject.prototype.cursor = null;

  /**
  * NEngine.Stage instance of the DisplayObject.
  * @type NEngine.Stage
  **/
  DisplayObject.prototype.stage = null;

  /**
  * The parent DisplayObject of the DisplayObject.
  * @type NEngine.DisplayObject
  **/
  DisplayObject.prototype.parent = null;

  /**
  * The cache Canvas of the DisplayObject.
  * @type htmlCanvasElement
  **/
  DisplayObject.prototype.cacheCanvas = null;

  /**
  * The ignoreCache flag of the DisplayObject.
  * @type Boolean 
  **/
  DisplayObject.prototype.ignoreCache = false;

  // DisplayObject.prototype.cashAsBitmap
  // DisplayObject.prototype.filter;
  // DisplayObject.prototype.mask
  // DisplayObject.prototype.opaqueBackground
  // DisplayObject.prototype.scrollRect
  // DisplayObject.prototype.scale9Grid
  // DisplayObject.prototype.root
  // DisplayObject.prototype.transform

  /**
  * onClick handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onClick = null;

  /**
  * onMouseDown handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onMouseDown = null;

  /**
  * onMouseUp handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onMouseUp = null;

  /**
  * onMouseOver handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onMouseOver = null;

  /**
  * onMouseMove handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onMouseMove = null;

  /**
  * onMouseOut handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onMouseOut = null;

  /**
  * onKeyDown handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onKeyDown = null;

  /**
  * onKeyUp handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onKeyUp = null;

  /**
  * onKeyPress handler of the DisplayObject.
  * (http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents)
  * @type Function
  **/
  DisplayObject.prototype.onKeyPress = null;

  /**
  * Draw the cached canvas on the ctx
  * @method DisplayObject.__draw(ctx, ignoreCache)
  **/
  DisplayObject.prototype.__draw = function(ctx, ignoreCache) {
	if (ignoreCache || !this.cacheCanvas) { return false; }
    ctx.drawImage(this.cacheCanvas, this.x-this.regX, this.y-this.regY);
    return true;
  }

  /**
  * Clone the DisplayObject object.
  * @method DisplayObject.clone()
  **/
  DisplayObject.prototype.clone = function() {
    var o = new DisplayObject();
    o.name = this.name;
    o.x = this.x;
    o.y = this.y;
    o.width = this.width;
    o.height = this.height;
    o.scaleX = this.scaleX;
    o.scaleY = this.scaleY;
    o.skewX = this.skewX;
    o.skewY = this.skewY
    o.regX = this.regX;
    o.regY = this.regY;
    o.rotation = this.rotation;
    o._mtx = this._mtx;
    o.mouseX = this.mouseX;
    o.mouseY = this.mouseY;
    o.visible = this.visible;
    // o.isFocus = this.isFocus;
    // o.isBounds = this.isBounds;
    o.alpha = this.alpha;
    o.shadow = this.shadow;
    o.compositeOperation = this.compositeOperation;
    o.stage = this.stage;
    o.parent = this.parent;
    o.cacheCanvas = this.cacheCanvas;
    o.ignoreCache = this.ignoreCache;
    return o;
  }

  /**
  * Return the string of DisplayObject object.
  * @method DisplayObject.toString()
  **/
  DisplayObject.prototype.toString = function() {
    return this.name + "(id:" + this.id + ")";
  }

  /**
  * Debug the DisplayObject to log facility.
  * @method DisplayObject.debug(obj)
  **/
  DisplayObject.prototype.debug = function(obj) {
    for(var prop in obj) {
      NEngine.utils.log(prop+"="+obj[prop]);
    }
  }

  /**
  * Generates a concatenated Matrix2D object representing the combined transform of
  * the display object and all of its parent DisplayObject up to the highest level ancestor
  * (usually the stage). This can be used to transform positions between coordinate spaces,
  * such as with localToGlobal and globalToLocal.
  * @method getConcatenatedMatrix
  * @param {Matrix2D} mtx Optional. A Matrix2D object to populate with the calculated values. If null, a new
  * Matrix object is returned.
  * @return {Matrix2D} a concatenated Matrix2D object representing the combined transform of
  * the display object and all of its parent DisplayObject up to the highest level ancestor (usually the stage).
  **/
  DisplayObject.prototype.getConcatenatedMatrix = function(mtx) {
    if (mtx) { mtx.identity(); }
    else { mtx = new NEngine.Matrix2D(); }
    var target = this;
    while (target != null) {
      // mtx.prependTransform(target.x, target.y, target.scaleX, target.scaleY, target.rotation, target.skewX,
      // target.skewY, target.regX, target.regY);
      target = target.parent;
    }
    return mtx;
  }

  /**
  * Apply the shadow style.
  * @method DisplayObject.applyShadow(ctx, shadow)
  **/
  DisplayObject.prototype.applyShadow = function(ctx, shadow) {
  }

  /**
  * Apply the fill/stroke style.
  * @method DisplayObject.applyStyle(ctx)
  **/
  DisplayObject.prototype.applyStyle = function(ctx) {
    if (this.fillStyle != null) { 
      this.__fillStyle = ctx.fillStyle;
      ctx.fillStyle = this.fillStyle.toRGB(); 
    }
    if (this.strokeStyle != null) { 
      this.__strokeStyle = ctx.strokeStyle;
      ctx.strokeStyle = this.strokeStyle.toRGB(); 
    }
  }

  /**
  * Reset the fill/stroke style.
  * @method DisplayObject.resetStyle(ctx)
  **/
  DisplayObject.prototype.resetStyle = function(ctx) {
    if (this.__fillStyle != null) { 
      ctx.fillStyle = this.__fillStyle;
    }
    if (this.__strokeStyle != null) { 
      ctx.strokeStyle = this.__strokeStyle;
    }
  }

  /**
  * Converts the point object from the Stage (global) coordinates to the display object's (local) coordinates.
  * @method DisplayObject.globalToLocal(x,y)
  **/
  DisplayObject.prototype.globalToLocal = function(globalX, globalY) { 
    return new Point(globalX-this.x, gloablY-this.y);
  }

  /**
  * Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.
  * @method DisplayObject.localToGlobal(x,y)
  **/
  DisplayObject.prototype.localToGlobal = function(localX, localY) {
    return new Point(localX+this.x, localY+this.y);
  }

  /**
  * Cache the DisplayObject on the cache canvas.
  * @method DisplayObject.cache()
  **/
  DisplayObject.prototype.cache = function() {
    var cache_ctx;
    if (this.cacheCanvas == null) { this.cacheCanvas = document.createElement("canvas"); }
    cache_ctx = this.cacheCanvas.getContext("2d");
    this.cacheCanvas.width  = this.width;
    this.cacheCanvas.height = this.height;
    cache_ctx.setTransform(1, 0, 0, 1, -this.x, -this.y);
    cache_ctx.clearRect(0, 0, this.width+1, this.height+1); 
    this.draw(cache_ctx, true);
  }

  /**
  * Update the DisplayObject on the cache canvas.
  * @method DisplayObject.cache()
  **/
  DisplayObject.prototype.updateCache = function() {
    this.cache();
  }

  /**
  * Clear the cache object in the DisplayObject.
  * @method DisplayObject.clearCache()
  **/
  DisplayObject.prototype.clearCache = function() {
    this.cacheCanvas = null;
  }

  /**
  * Init the DisplayObject of generating this.id and this.name.
  * @method DisplayObject.__displayobject_init(classname)
  **/
  DisplayObject.prototype.__displayobject_init = function(classname) {
    this._mtx = new NEngine.Matrix2D();
    this._mtx.identity();
    this.id = NEngine.utils.getUID();
    this.name = classname;
  }

  /*
  DisplayObject.prototype.getBounds = function() { }
  DisplayObject.prototype.getRect = function() { }
  */

  /**
  * Test whether the mouseX/Y is in bound of the DisplayObject.
  * @method DisplayObject.hitTest(x, y)
  **/
  DisplayObject.prototype.hitTest = function(x, y) { 
    var ctx = DisplayObject._hitTestContext;
    var canvas = DisplayObject._hitTestCanvas;

    ctx.setTransform(1,0,0,1,-x,-y);
    this.draw(ctx, true);

    var hit = this._testHit(ctx);

    canvas.width = 0;
    canvas.width = 1;
    return hit;
  }

  /**
  * Test the alpha value of the hitTest
  * @method DisplayObject._testHit(x, y)
  **/
  DisplayObject.prototype._testHit = function(ctx) {
    try {
      /*
      NEngine.utils.log(ctx.getImageData(0, 0, 1, 1).data[0]);
      NEngine.utils.log(ctx.getImageData(0, 0, 1, 1).data[1]);
      NEngine.utils.log(ctx.getImageData(0, 0, 1, 1).data[2]);
      NEngine.utils.log(ctx.getImageData(0, 0, 1, 1).data[3]);
      */
      var hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
    } catch (e) {
      if (!DisplayObject.suppressCrossDomainErrors) {
        throw "An error has occured. This is most likely due to security restrictions on reading canvas pixel " +
        "data with local or cross-domain images.";
      }
    }
    return hit;
  }

  /**
  * Test whether the mouseX/Y is in bound of the DisplayObject.
  * @method DisplayObject.inBounds(globalX, globalY)
  **/
  DisplayObject.prototype.inBounds = function(globalX, globalY) {
    var inBounds = (globalX >= this.x && globalY >= this.y && globalX < (this.x + this.width) && globalY < (this.y + this.height));
    return inBounds;
  }

  /**
  * Exposing the DisplayObject to the window global object.
  **/
  NEngine.DisplayObject = DisplayObject;

}(NEngine));
