/**
* Loader.js by Nera Liu. Feb 5, 2011
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
* a Loader of the Stage
**/

(function(NEngine) {

  /**
  * Loader's constructor.
  **/
  function Loader(x, y, w, h) {
    this.__displayobject_init("Loader");
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.regX = w/2;
    this.regY = h/2;
    // specific
    this.label = new NEngine.StaticText(x+w/2,y+h/2,"0%",true);
    this.label.textAlign = "center";
    this.label.textBaseline = "middle";
    // specific
    this.image = new NEngine.Bitmap('images/big_loading.gif',x,y,w,h);
  }

  Loader.inheritsFrom(NEngine.Shape);

  /**
  * The label of the NEngine.Loader.
  * @type NEngine.StaticText
  **/
  Loader.prototype.label = null;

  /**
  * show Percentage?
  * @type Boolean
  **/
  Loader.prototype.showPercentage = false;

  /**
  * Is all asset ready?
  * @type Boolean
  **/
  Loader.prototype.ready = false;

  /**
  * An array of children of the DisplayObject.
  * @type NEngine.DisplayObject
  **/
  Loader.prototype._children = new Array();

  /**
  * [read-only] Returns the number of children of this object.
  * @type Number
  **/
  Loader.prototype.numChildren = 0;

  /**
  * Clone the Loader object.
  * @method Loader.clone()
  **/
  Loader.prototype.clone = function() {
    return new Loader(this.x, this.y, this.width, this.height);
  }

  /**
  * Return the string of Loader object.
  * @method Loader.toString()
  **/
  Loader.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",w:" + this.width + ",h:" + this.height + ")";
  }

  /**
  * Adds a child DisplayObject instance to this Loader instance.
  * @method Loader.addChild(child)
  **/
  Loader.prototype.addChild = function(child) {
    this.numChildren++;
    this._children.push(child);
  }

  /**
  * Removes the specified child DisplayObject instance from the child list of the Loader instance.
  * @method Loader.removeChild(child)
  **/
  Loader.prototype.removeChild = function(child) {
    for (var i=0;i<this._children.length;i++) {
      if (this._children[i].id == child.id) {
        var c = this._children[i];
        this._children.splice(i, 1);
        this.numChildren--;
        return c;
      }
    }
    return null;
  }

  /**
  * Check the readiness of the DisplayObject in the Loader.
  * @method Loader.isReady()
  **/
  Loader.prototype.isReady = function() {
    if (this.ready == true) { return true; }
    for (var i=0;i<this._children.length;i++) {
      if (typeof this._children[i].ready == 'boolean' && this._children[i].ready == false) { return false; }
    }
    this.ready = true;
    return true;
  }

  /**
  * Check the completion of loading the DisplayObject in the Loader.
  * @method Loader.progress()
  **/
  Loader.prototype.progress = function() {
    var ready_count = 0;
    for (var i=0;i<this._children.length;i++) {
      if (typeof this._children[i].ready == 'boolean' && this._children[i].ready == true) { ++ready_count; }
    }
    return ready_count;
  }

  // specific
  /**
  * Draw the Loader on the canvas. (default loader)
  * @method Loader.draw(ctx)
  **/
  Loader.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    this.applyStyle(ctx);
    this.image.draw(ctx, ignoreCache);
    if (this.showPercentage && this._children.length > 0) {
      var w = this.progress() / this._children.length; 
      this.label.text = Math.floor(w*100) + "%";
      this.label.draw(ctx, ignoreCache);
    } else if (this.showPercentage && this._children.length == 0) {
      this.label.text = "100%";
      this.label.draw(ctx, ignoreCache);
    }
    this.resetStyle(ctx);
  }
  // specific

  /**
  * Exposing the Loader to the NEngine global object.
  **/
  NEngine.Loader = Loader;

}(NEngine));
