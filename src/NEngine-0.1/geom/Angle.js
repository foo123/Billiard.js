/**
* Angle.js by Nera Liu. Feb 5, 2011
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
* Convert angle to/from degree to/from radian.
**/

(function(NEngine) {

  /**
  * Angle's constructor.
  **/
  function Angle() {
  }

  /**
  * Convert degree to radian.
  * @method Angle.degree2radian(degree)
  **/
  Angle.prototype.degree2radian = function(degree) {
    return ((Math.PI/180)*degree);
  }

  /**
  * Convert radian to degree.
  * @method Angle.radian2degree(raidan)
  **/
  Angle.prototype.radian2degree = function(radian) {
    return (radian/(Math.PI/180));
  }

  /**
  * Exposing the Angle to the NEngine global object.
  **/
  NEngine.Angle = Angle;

}(NEngine));
