/**
* DisplayObjectContainer.js by Nera Liu. Feb 5, 2011
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
* The DisplayObjectContainer class is the base class for all objects that can serve as display object containers on the display list. The display list manages all objects displayed in NEngine. Use the DisplayObjectContainer class to arrange the display objects in the display list. Each DisplayObjectContainer object has its own child list for organizing the z-order of the objects. The z-order is the front-to-back order that determines which object is drawn in front, which is behind, and so on.
**/

(function(NEngine) {

  /**
  * DisplayObjectContainer's constructor.
  **/
  function DisplayObjectContainer() {
    this.__displayobject_init('DisplayObjectContainter');
  }

  DisplayObjectContainer.inheritsFrom(NEngine.InteractiveObject);

  /**
  * An array of children of the DisplayObject.
  * @type NEngine.DisplayObject
  **/
  DisplayObjectContainer.prototype._children = new Array();

  /**
  * is the DisplayObject being dirty to redraw.
  * @type Boolean
  **/
  DisplayObjectContainer.prototype._isdirty = false;

  /**
  * [read-only] Returns the number of children of this object.
  * @type Number
  **/
  DisplayObjectContainer.prototype.numChildren = 0;

  // DisplayObjectContainer.prototype.mouseChildren;
  // DisplayObjectContainer.prototype.tabChildren;
  // DisplayObjectContainer.prototype.textSnapshot;

  /**
  * Init the DisplayObject of generating this.id and this.name.
  * @method DisplayObject.__displayobjectcont_init()
  **/
  DisplayObjectContainer.prototype.__displayobjectcont_init = function() {
    this._children = new Array();
  }

  /**
  * Adds a child DisplayObject instance to this DisplayObjectContainer instance.
  * @method DisplayObjectContainer.addChild(child)
  **/
  DisplayObjectContainer.prototype.addChild = function(child) {
    this.numChildren++;
    this._children.push(child);
    this._isdirty = true;
    child.parent = this;
    child.stage = this;
  }

  /**
  * Adds a child DisplayObject instance to this DisplayObjectContainer instance.
  * @method DisplayObjectContainer.addChildAt(child, index)
  **/
  DisplayObjectContainer.prototype.addChildAt = function(child, index) {
    throw "Exception: DisplayObjectContainer.addChildAt(child, index) not implemented";
    this._isdirty = true;
    child.parent = this;
    child.stage = this;
  }

  /**
  * Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself.
  * @method DisplayObjectContainer.contains(child)
  **/
  DisplayObjectContainer.prototype.contains = function(child) {
    for (var i=0;i<this._children.length;i++) {
      if (this._children[i].id == child.id) { return true; }
    }
    return false;
  }

  /**
  * Returns the child display object instance that exists at the specified index.
  * @method DisplayObjectContainer.getChildAt(index)
  **/
  DisplayObjectContainer.prototype.getChildAt = function(index) {
    if (this._children[index] != undefined) {
      return this._children[index];
    } else { return null; }
  }

  /**
  * Returns the child display object that exists with the specified name.
  * @method DisplayObjectContainer.getChildByName(name)
  **/
  DisplayObjectContainer.prototype.getChildByName = function(name) {
    throw "Exception: DisplayObjectContainer.getChildByName(name) not implemented";
    /*
    for (var i=0;i<this._children.length;i++) {
      if (this._children[i].name == name) { return this._children[i]; }
    }
    return null;
    */
  }

  /**
  * Returns the index position of a child DisplayObject instance.
  * @method DisplayObjectContainer.getChildIndex(child)
  **/
  DisplayObjectContainer.prototype.getChildIndex = function(child) {
    for (var i=0;i<this._children.length;i++) {
      if (this._children[i].id == child.id) { return i; }
    }
    return -1;
  }

  /**
  * Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
  * @method DisplayObjectContainer.removeChild(child)
  **/
  DisplayObjectContainer.prototype.removeChild = function(child) {
    for (var i=0;i<this._children.length;i++) {
      if (this._children[i].id == child.id) { 
        var c = this._children[i];
        c.parent = null;
        c.stage = null;
        this._children.splice(i, 1);
        this._isdirty = true;
        this.numChildren--;
        return c;
      }
    }
    return null;
  }

  /**
  * Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer.
  * @method DisplayObjectContainer.removeChildAt(index)
  **/
  DisplayObjectContainer.prototype.removeChildAt = function(index) {
    var c = this._children[index];
    c.parent = null;
    c.stage = null;
    this._children.splice(index, 1);
    this._isdirty = true;
    this.numChildren--;
    return c;
  }

  /**
  * Changes the position of an existing child in the display object container.
  * @method DisplayObjectContainer.setChildIndex(child, index)
  **/
  DisplayObjectContainer.prototype.setChildIndex = function(child, index) {
    throw "Exception: DisplayObjectContainer.setChildIndex(child, index) not implemented";
  }

  /**
  * Swaps the z-order (front-to-back order) of the two specified child objects.
  * @method DisplayObjectContainer.swapChildren(child1, child2)
  **/
  DisplayObjectContainer.prototype.swapChildren = function(child1, child2) {
    var index1 = -1; var index2 = -1;
    for (var i=0;i<this._children.length;i++) {
      if (this._children[i].id == child1.id) { index1 = i; }
      if (this._children[i].id == child2.id) { index2 = i; }
    }
    if (index1 != -1 && index2 != -1) {
      var tmp = this._children[index1];
      this._children[index1] = this._children[index2];
      this._children[index2] = tmp;
    }
  }

  /**
  * Swaps the z-order (front-to-back order) of the child objects at the two specified index positions in the child list.
  * @method DisplayObjectContainer.swapChildrenAt(index1, index2)
  **/
  DisplayObjectContainer.prototype.swapChildrenAt = function(index1, index2) {
    if (this._children[index1] != undefined && this._children[index2] != undefined) {
      var tmp = this._children[index1];
      this._children[index1] = this._children[index2];
      this._children[index2] = tmp;
    }
  }

  /*
  DisplayObjectContainer.prototype.areInaccessibleObjectsUnderPoint = function(point) {
    throw "Exception: DisplayObjectContainer.(reInaccessibleObjectsUnderPoint(point) not implemented";
  }
  */
  
  /**
  * Return the DisplayObject under the current points
  * @method DisplayObjectContainer.getObjectsUnderPoint(globalX, globalY)
  **/
  DisplayObjectContainer.prototype.getObjectsUnderPoint = function(globalX, globalY) {
    var inbound_obj = new Array();
    for (var i=0;i<this._children.length;i++) {
      if (this._children[i] instanceof DisplayObjectContainter) {
      } else {
        var inBounds = this._children[i].inBounds(globalX, globalY);
        if (inBounds) { inbound_obj.push(this._children[i]); }
      }
    }
    return inbound_obj;
  }

  /**
  * Exposing the DisplayObjectContainer to the NEngine global object.
  **/
  NEngine.DisplayObjectContainer = DisplayObjectContainer;

}(NEngine));
