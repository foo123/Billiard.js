/**
* InteractiveObject.js by Nera Liu. Feb 5, 2011
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
* The InteractiveObject class is the abstract base class for all display objects with which the user can interact, using the mouse, keyboard, or other user input device.
**/

(function(NEngine) {

  /**
  * InteractiveObject's constructor.
  **/
  function InteractiveObject() {
  }

  InteractiveObject.inheritsFrom(NEngine.DisplayObject);

  /**
  * Specifies whether this object receives mouse, or other user input, messages.
  * @type Boolean
  **/
  InteractiveObject.prototype.mouseEnabled = true;

  /**
  * Exposing the InteractiveObject to the NEngine global object.
  **/
  NEngine.InteractiveObject = InteractiveObject;

}(NEngine));
