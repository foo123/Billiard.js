/**
* Shape.js by Nera Liu. Feb 5, 2011
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
* Represents a Shape.
**/

(function(NEngine) {

  /**
  * Shape's constructor.
  **/
  function Shape() {
    this.__displayobject_init("Shape");
  }

  Shape.inheritsFrom(NEngine.InteractiveObject);

  /**
  * Is the Shape filled when draw?
  * @type Boolean
  **/
  Shape.prototype.filled = false;

  /**
  * fillStyle of the Shape
  * @type NEngine.Color
  **/
  Shape.prototype.fillStyle = null;

  /**
  * strokeStyle of the Shape
  * @type NEngine.Color
  **/
  Shape.prototype.strokeStyle = null;

  /**
  * The rotation in radian.
  * @type Number
  **/
  Shape.prototype.rotation = 0;

  /**
  * Clone the Shape object.
  * @method Shape.clone()
  **/
  Shape.prototype.clone = function() {
    return new Shape();
  }

  /**
  * Return the string of Shape object
  * @method Shape.toString()
  **/
  Shape.prototype.toString = function() {
    return this.name + "(id:" + this.id + ")";
  }

  /**
  * Exposing the Shape to the NEngine global object.
  **/
  NEngine.Shape = Shape;

}(NEngine));
