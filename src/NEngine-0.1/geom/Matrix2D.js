/**
* Matrix2D.js by Nera Liu. Feb 5, 2011
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
* The transformation matrix in 2D
[ x']   [ m11 m21 dx ] [ x ]   [ m11 * x + m21 * y + dx ]
[ y'] = [ m12 m22 dy ] [ y ] = [ m12 * x + m22 * y + dy ]
[ 1 ]   [ 0   0   1  ] [ 1 ]   [ 1 ]
m11 - x scale
m12 - y skew
m21 - x skew
m22 - y scale
dx - x displacement
dy - y displacement
* Convert angle to/from degree to/from radian.
* reference - http://www.senocular.com/flash/tutorials/transformmatrix/
**/

(function(NEngine) {

  /**
  * Matrix2D's constructor.
  **/
  function Matrix2D() {
    this.m11 = 1;
    this.m12 = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.dx = 0;
    this.dy = 0;
  }

  /**
  * The value of m11 in the 2D Matrix.
  * @type Number
  **/
  Matrix2D.prototype.m11 = 1;

  /**
  * The value of m12 in the 2D Matrix.
  * @type Number
  **/
  Matrix2D.prototype.m12 = 0;

  /**
  * The value of m21 in the 2D Matrix.
  * @type Number
  **/
  Matrix2D.prototype.m21 = 1;

  /**
  * The value of m22 in the 2D Matrix.
  * @type Number
  **/
  Matrix2D.prototype.m22 = 0;

  /**
  * The value of dx in the 2D Matrix.
  * @type Number
  **/
  Matrix2D.prototype.dx = 0;

  /**
  * The value of dy in the 2D Matrix.
  * @type Number
  **/
  Matrix2D.prototype.dy = 0;

  /**
  * The translate transformation of 2D matrix. Please note that the function is additive.
  * @method Matrix2D.translate(tx, ty)
  **/
  Matrix2D.prototype.translate = function(tx, ty) {
    tx = parseFloat(tx);
    ty = parseFloat(ty);
    this.dx = this.dx + tx;
    this.dy = this.dy + ty;
  }

  /**
  * The scale transformation of 2D matrix. Please note that the function is multiplicative.
  * @method Matrix2D.scale(sx, sy)
  **/
  Matrix2D.prototype.scale = function(sx, sy) {
    sx = parseFloat(sx);
    sy = parseFloat(sy);
    this.m11 = this.m11 * sx;
    this.dx = this.dx * sx;
    this.m22 = this.m22 * sy;
    this.dy = this.dx * sy;
  }

  /**
  * Performs the transformation of skew. (not yet test)
  * @method Matrix2D.skew(sx, sy)
  **/
  Matrix2D.prototype.skew = function(sx, sy) {
    sx = parseFloat(sx);
    sy = parseFloat(sy);
    sx = sx*Math.PI/180;
    sy = sy*Math.PI/180;
    this.append(Math.cos(sy), Math.sin(sy), -Math.sin(sx), Math.cos(sx), 0, 0);
  }

  /**
  * The rotate transformation of 2D matrix. Please note that the function is multiplicative.
  * @method Matrix2D.rotate(radian)
  **/
  Matrix2D.prototype.rotate = function(radian) {
    radian = parseFloat(radian);
    var cos = Math.cos(radian);
    var sin = Math.sin(radian);

    var m11 = this.m11;
    var m12 = this.m12;
    var m21 = this.m21;
    var m22 = this.m22;
    var dx = this.dx;
    var dy = this.dy;

    this.m11 = m11*cos - m12*sin;
    this.m12 = m11*sin + m12*cos;
    this.m21 = m21*cos - m22*sin;
    this.m22 = m21*sin + m22*cos;
    this.dx = dx*cos - dy*sin;
    this.dy = dx*sin + dy*cos;
  }

  /**
  * Performs the opposite transformation of the original matrix.
  * @method Matrix2D.invert()
  **/
  Matrix2D.prototype.invert = function() {
    var m11 = this.m11;
    var m12 = this.m12;
    var m21 = this.m21;
    var m22 = this.m22;
    var dx = this.dx;
    var dy = this.dy;
    var n = m11*m22-m12*m21;

    this.m11 = m22/n;
    this.m12 = -m12/n;
    this.m21 = -m21/n;
    this.m22 = m11/n;
    this.dx = (m21*dy-m22*dx)/n;
    this.dy = -(m11*dy-m12*dx)/n;
  }

  /**
  * The identity 2D matrix.
  * @method Matrix2D.identity()
  **/
  Matrix2D.prototype.identity = function() {
    this.m11 = 1;
    this.m12 = 0;
    this.dx = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.dy = 0;
  }

  /**
  * The prepend the 2D matrix.
  * @method Matrix2D.prepend(m11, m12, m21, m22, dx, dy)
  **/
  Matrix2D.prototype.prepend = function(m11, m12, m21, m22, dx, dy) {
    m11 = parseFloat(m11);
    m12 = parseFloat(m12);
    m21 = parseFloat(m21);
    m22 = parseFloat(m22);
    dx = parseFloat(dx);
    dy = parseFloat(dy);

    var pm11 = this.m11;
    var pm12 = this.m12;
    var pm21 = this.m21;
    var pm22 = this.m22;
    var pdx = this.dx;
    var pdy = this.dy;

    this.m11 = m11*pm11 + m12*pm21 + dx*0;
    this.m12 = m11*pm12 + m12*pm22 + dx*0;
    this.m21 = m21*pm11 + m22*pm21 + dy*0;
    this.m22 = m21*pm12 + m22*pm22 + dy*0;
    this.dx = m11*pdx + m12*pdy + dx*1;
    this.dy = m21*pdx + m22*pdy + dy*1;
  }

  /**
  * The prepend the 2D matrix.
  * @method Matrix2D.prependMatrix2D(mtx)
  **/
  Matrix2D.prototype.prependMatrix2D = function(mtx) {
    this.prepend(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.dx, mtx.dy);
  }

  /**
  * The append the 2D matrix.
  * @method Matrix2D.append(m11, m12, m21, m22, dx, dy)
  **/
  Matrix2D.prototype.append = function(m11, m12, m21, m22, dx, dy) {
    m11 = parseFloat(m11);
    m12 = parseFloat(m12);
    m21 = parseFloat(m21);
    m22 = parseFloat(m22);
    dx = parseFloat(dx);
    dy = parseFloat(dy);

    var am11 = this.m11;
    var am12 = this.m12;
    var am21 = this.m21;
    var am22 = this.m22;
    var adx = this.dx;
    var ady = this.dy;

    this.m11 = am11*m11 + am12*m21 + adx*0;
    this.m12 = am11*m12 + am12*m22 + adx*0;
    this.m21 = am21*m11 + am22*m21 + ady*0;
    this.m22 = am21*m12 + am22*m22 + ady*0;
    this.dx = am11*dx + am12*dy + adx*1;
    this.dy = am21*dx + am22*dy + ady*1;
  }

  /**
  * The append the 2D matrix.
  * @method Matrix2D.appendMatrix2D(mtx)
  **/
  Matrix2D.prototype.appendMatrix2D = function(mtx) {
    this.append(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.dx, mtx.dy);
  }

  /**
  * Clone the Matrix2D object.
  * @method Matrix2D.clone()
  **/
  Matrix2D.prototype.clone = function() {
    var o = new Matrix2D();
    o.m11 = this.m11;
    o.m12 = this.m12;
    o.m21 = this.m21;
    o.m22 = this.m22;
    o.dx = this.dx;
    o.dy = this.dy;
    return o;
  }

  /**
  * Returns the result of applying the geometric transformation represented by the Matrix object to the specified point.
  * @method Matrix2D.transformPoint(point)
  **/
  Matrix2D.prototype.transformPoint = function(point) {
    var newpoint = new NEngine.Point(point.x, point.y);
    newpoint.x = this.m11 * point.x + this.m21 * point.y + this.dx;
    newpoint.y = this.m12 * point.x + this.m22 * point.y + this.dy;
    return newpoint;
  }

  /**
  * The concat the 2D matrix.
  * A*B -> B.concat(A);
  * @method Matrix2D.concat(m11, m12, m21, m22, dx, dy)
  **/
  Matrix2D.prototype.concat = function(m11, m12, m21, m22, dx, dy) {
    return this.prepend(m11, m12, m21, m22, dx, dy);
  }

  /**
  * The concat the 2D matrix.
  * A*B -> B.concat(A);
  * @method Matrix2D.concatMatrix2D(mtx)
  **/
  Matrix2D.prototype.concatMatrix2D = function(mtx) {
    this.concat(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.dx, mtx.dy);
  }

  /**
  * Return the string of Matrix2D object.
  * @method Matrix2D.toString()
  **/
  Matrix2D.prototype.toString = function() {
    return "(m11:" + this.m11+ ",m12:" + this.m12 + ",m21:" + this.m21 + ",m22:" + this.m22 + ",dx:" + this.dx + ",dy:" + this.dy + ")";
  }

  /**
  * Exposing the Matrix2D to the NEngine global object.
  **/
  NEngine.Matrix2D = Matrix2D;

}(NEngine));
