/**
* Stage.js by Nera Liu. Feb 5, 2011
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
* The Stage class is a basic display list building block: a display list node that can display graphics and can also contain children. The Stage class represents the main drawing area with timeline.
**/

(function(NEngine) {

  /**
  * Stage's constructor.
  **/
  function Stage(canvas) {
	this.__displayobject_init("Stage");
    this.__displayobjectcont_init();
    this.__stage_init(canvas);
    NEngine.Clock.setInterval(NEngine.env.interval);
    NEngine.Clock.addListeners(this);
    NEngine.Clock.start();
  }

  Stage.inheritsFrom(NEngine.DisplayObjectContainer);

  /**
  * The canvas element of html object.
  * @type html object
  **/
  Stage.prototype.canvas = null;

  /**
  * The NEngine.Graphics for drawing.
  * @type NEngine.Graphics
  **/
  Stage.prototype.graphics = null;

  /**
  * Clear the canvas automatically?
  * @type Boolean
  **/
  Stage.prototype.autoClear = true;

  // Stage.prototype.buttonMode = null;
  // Stage.prototype.dropTarget = null;
  // Stage.prototype.hitArea = null;
  // Stage.prototype.soundTransform = null;

  /**
  * Init the Stage, in NEngine, we do not use the "capturing" for event handling.
  * reference - http://blog.neraliu.com/2009/09/20/javascript-dom-events-specification/
  * @method Stage.__stage_init()
  **/
  Stage.prototype.__stage_init = function(canvas) {
    this.stage = this;
    this.canvas = canvas;
    this.graphics = new NEngine.Graphics(this.canvas);
	
	// find canvas global offset
	this.canvas.globalOffsetLeft=this.canvas.offsetLeft;
	this.canvas.globalOffsetTop=this.canvas.offsetTop;
	var obj=this.canvas;
	while (obj=obj.offsetParent)
	{
		this.canvas.globalOffsetLeft+=obj.offsetLeft;
		this.canvas.globalOffsetTop+=obj.offsetTop;
	}
    var s = this;
    if (window.addEventListener) {
      window.addEventListener('mousemove', function(e) { s._handleOnMouseMove(e); }, false);
      window.addEventListener('mouseup', function(e) { s._handleOnMouseUp(e); }, false);
      window.addEventListener('mousedown', function(e) { s._handleOnMouseDown(e); }, false);
      // window.addEventListener('mouseover', function(e) { s._handleOnMouseOver(e); }, false);
      // window.addEventListener('mouseout', function(e) { s._handleOnMouseOut(e); }, false);
      window.addEventListener('click', function(e) { s._handleOnClick(e); }, false);
      window.addEventListener('keydown', function(e) { s._handleOnKeyDown(e); }, false);
      window.addEventListener('keyup', function(e) { s._handleOnKeyUp(e); }, false);
      window.addEventListener('keypress', function(e) { s._handleOnKeyPress(e); }, false);
    } else if (document.addEventListener) {
      document.addEventListener('mousemove', function(e) { s._handleOnMouseMove(e); }, false);
      document.addEventListener('mouseup', function(e) { s._handleOnMouseUp(e); }, false);
      document.addEventListener('mousedown', function(e) { s._handleOnMouseDown(e); }, false);
      // document.addEventListener('mouseover', function(e) { s._handleOnMouseOver(e); }, false);
      // document.addEventListener('mouseout', function(e) { s._handleOnMouseOut(e); }, false);
      document.addEventListener('click', function(e) { s._handleOnClick(e); }, false);
      document.addEventListener('keydown', function(e) { s._handleOnKeyDown(e); }, false);
      document.addEventListener('keyup', function(e) { s._handleOnKeyUp(e); }, false);
      document.addEventListener('keypress', function(e) { s._handleOnKeyPress(e); }, false);
    } else if (window.attachEvent) {
      window.attachEvent('mousemove', function(e) { s._handleOnMouseMove(e); });
      window.attachEvent('mouseup', function(e) { s._handleOnMouseUp(e); });
      window.attachEvent('mousedown', function(e) { s._handleOnMouseDown(e); });
      // window.attachEvent('mouseover', function(e) { s._handleOnMouseOver(e); });
      // window.attachEvent('mouseout', function(e) { s._handleOnMouseOut(e); });
      window.attachEvent('click', function(e) { s._handleOnClick(e); });
      window.attachEvent('keydown', function(e) { s._handleOnKeyDown(e); });
      window.attachEvent('keyup', function(e) { s._handleOnKeyUp(e); });
      window.attachEvent('keypress', function(e) { s._handleOnKeyPress(e); });
    }
    this.draw();
  }

  /**
  * The handler of mousemove event in the Stage.
  * @method Stage._handleOnMouseMove(e)
  **/
  Stage.prototype._handleOnMouseMove = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
	this.mouseX = e.pageX-this.canvas.globalOffsetLeft;
    this.mouseY = e.pageY-this.canvas.globalOffsetTop;
    var inBounds = (this.mouseX >= 0 && this.mouseY >= 0 && this.mouseX < this.canvas.width && this.mouseY < this.canvas.height);
    if (!inBounds) return;

    if (this.onMouseMove) { this.onMouseMove(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = this.mouseX-this._children[i].x;
      this._children[i].mouseY = this.mouseY -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].inBounds(this.mouseX, this.mouseY);
      if(inBounds && this._children[i].onMouseMove && this._children[i].onMouseMove instanceof Function) { this._children[i].onMouseMove(e); }
      var isBounds = this._children[i].isBounds;
      if (isBounds == false && inBounds && this._children[i].onMouseOver && this._children[i].onMouseOver instanceof Function) { 
        this._children[i].onMouseOver(e);
        this._children[i].isBounds = true;
        if (this._children[i].cursor) { this.canvas.style.cursor = this._children[i].cursor; }
      }
      if (isBounds && inBounds == false && this._children[i].onMouseOut && this._children[i].onMouseOut instanceof Function) { 
        this._children[i].onMouseOut(e);
        this._children[i].isBounds = false;
        if (this._children[i].cursor) { this.canvas.style.cursor = "auto"; }
      }
    }
  }

  /**
  * The handler of mouseup event in the Stage.
  * @method Stage._handleOnMouseUp(e)
  **/
  Stage.prototype._handleOnMouseUp = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
	this.mouseX = e.pageX-this.canvas.globalOffsetLeft;
    this.mouseY = e.pageY-this.canvas.globalOffsetTop;
    if (this.onMouseUp) { this.onMouseUp(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = this.mouseX-this._children[i].x;
      this._children[i].mouseY = this.mouseY -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].inBounds(this.mouseX, this.mouseY);
      if(inBounds && this._children[i].onMouseUp && this._children[i].onMouseUp instanceof Function) { this._children[i].onMouseUp(e); }
    }
  }

  /**
  * The handler of mousedown event in the Stage.
  * @method Stage._handleOnMouseDown(e)
  **/
  Stage.prototype._handleOnMouseDown = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
	this.mouseX = e.pageX-this.canvas.globalOffsetLeft;
    this.mouseY = e.pageY-this.canvas.globalOffsetTop;
    if (this.onMouseDown) { this.onMouseDown(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = this.mouseX-this._children[i].x;
      this._children[i].mouseY = this.mouseY -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].inBounds(this.mouseX, this.mouseY);
      if(inBounds && this._children[i].onMouseDown && this._children[i].onMouseDown instanceof Function) { this._children[i].onMouseDown(e); }
    }
  }

  /**
  * The handler of mouseover event in the Stage.
  * @method Stage._handleOnMouseOver(e)
  **/
  Stage.prototype._handleOnMouseOver = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
	this.mouseX = e.pageX-this.canvas.globalOffsetLeft;
    this.mouseY = e.pageY-this.canvas.globalOffsetTop;
    if (this.onMouseOver) { this.onMouseOver(e); }
    /* for the main Stage/Sprite only
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = e.pageX-this.canvas.offsetLeft-this._children[i].x;
      this._children[i].mouseY = e.pageY-this.canvas.offsetTop -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].inBounds(this.mouseX, this.mouseY);
      if(inBounds && this._children[i].onMouseOver && this._children[i].onMouseOver instanceof Function) { this._children[i].onMouseOver(e); }
    }
    */
  }

  /**
  * The handler of mouseout event in the Stage.
  * @method Stage._handleOnMouseOut(e)
  **/
  Stage.prototype._handleOnMouseOut = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
	this.mouseX = e.pageX-this.canvas.globalOffsetLeft;
    this.mouseY = e.pageY-this.canvas.globalOffsetTop;
    if (this.onMouseOut) { this.onMouseOut(e); }
    /* for the main Stage/Sprite only
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = e.pageX-this.canvas.offsetLeft-this._children[i].x;
      this._children[i].mouseY = e.pageY-this.canvas.offsetTop -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].inBounds(this.mouseX, this.mouseY);
      if(inBounds && this._children[i].onMouseOut && this._children[i].onMouseOut instanceof Function) { this._children[i].onMouseOut(e); }
    }
    */
  }

  /**
  * The handler of click event in the Stage.
  * @method Stage._handleOnClick(e)
  **/
  Stage.prototype._handleOnClick = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
	this.mouseX = e.pageX-this.canvas.globalOffsetLeft;
    this.mouseY = e.pageY-this.canvas.globalOffsetTop;
    if (this.onClick) { this.onClick(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = this.mouseX-this._children[i].x;
      this._children[i].mouseY = this.mouseY -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      /* hitTest not yet completed
      NEngine.utils.log(this._children[i].hitTest(this.mouseX, this.mouseY));
      */
      var inBounds = this._children[i].inBounds(this.mouseX, this.mouseY);
      if(inBounds && this._children[i].onClick && this._children[i].onClick instanceof Function) { this._children[i].onClick(e); }
    }
  }

  /**
  * The handler of keydown event in the Stage.
  * @method Stage._handleOnKeyDown(e)
  **/
  Stage.prototype._handleOnKeyDown = function(e) {
    if (!this.canvas) { return; }
    if (this.onKeyDown) { this.onKeyDown(e); }
    for (var i=0;i<this._children.length;i++) {
      if(this._children[i].onKeyDown && this._children[i].onKeyDown instanceof Function) { this._children[i].onKeyDown(e); }
    }
  }

  /**
  * The handler of keyup event in the Stage.
  * @method Stage._handleOnKeyUp(e)
  **/
  Stage.prototype._handleOnKeyUp = function(e) {
    if (!this.canvas) { return; }
    if (this.onKeyUp) { this.onKeyUp(e); }
    for (var i=0;i<this._children.length;i++) {
      if(this._children[i].onKeyUp && this._children[i].onKeyUp instanceof Function) { this._children[i].onKeyUp(e); }
    }
  }

  /**
  * The handler of keypress event in the Stage.
  * @method Stage._handleOnKeyPress(e)
  **/
  Stage.prototype._handleOnKeyPress = function(e) {
    if (!this.canvas) { return; }
    if (this.onKeyPress) { this.onKeyPress(e); }
    for (var i=0;i<this._children.length;i++) {
      if(this._children[i].onKeyPress && this._children[i].onKeyPress instanceof Function) { this._children[i].onKeyPress(e); }
    }
  }

  /**
  * The clock handler.
  * @method Stage.tick()
  **/
  Stage.prototype.tick = function() {
   this.draw();
  }

  /**
  * Clear the canvas.
  * @method Stage.clear()
  **/
  Stage.prototype.clear = function() {
    if (this.canvas == null) { return; }
    this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height);
  }

  /**
  * Draw the canvas.
  * @method Stage.draw()
  **/
  Stage.prototype.draw = function() {

    if (this.canvas == null) { return; }
    if (this.autoClear) { this.clear(); }

    for (var i=0;i<this._children.length;i++) {
      if (this._children[i].animate) { this._children[i].animate(); }
      if (!this._children[i].visible)  { continue; }

      var mtx = this._children[i]._mtx.clone();
      this.graphics.ctx.setTransform(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.dx, mtx.dy);
      if (this._children[i].rotation != 0) {
        this.graphics.ctx.translate(this._children[i].x+this._children[i].regX, this._children[i].y+this._children[i].regY);
        this.graphics.ctx.rotate(this._children[i].rotation);
        this.graphics.ctx.translate(-(this._children[i].x+this._children[i].regX), -(this._children[i].y+this._children[i].regY));
      }
      this.graphics.ctx.globalAlpha = this._children[i].alpha;
      this.graphics.ctx.globalCompositeOperation = this._children[i].compositeOperation || "source-over";
      // shadow?
      this._children[i].draw(this.graphics.ctx, this.ignoreCache);
    }
  }

  /**
  * Return the string of Stage object.
  * @method Stage.toString()
  **/
  Stage.prototype.toString = function() {
    return this.name + "(id:" + this.id + ")";
  }

  /**
  * Exposing the Stage to the NEngine global object.
  **/
  NEngine.Stage = Stage;

}(NEngine));
