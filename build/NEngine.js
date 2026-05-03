/**
* NEngine.js by Nera Liu. Feb 5, 2011
* Modified by Nikos M., 2026
*
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
**//**
* NEngine.js by Nera Liu. Feb 5, 2011
* Modified by Nikos M., 2026
*
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
* The NEngine Object is the global object continaing the classes, properties and methods of the engine.
**/
var NEngine = {
  /**
  * Version information of the NEngine
  **/
  version : {
    /**
    * The version string of the NEngine.
    * @property version.name
    * @type String
    **/
    name    : 'alpha 0.1',
    /**
    * The version number of the NEngine.
    * @property version.number
    * @type Number
    **/
    number  : 0.1
  }
};

/**
* The NEngine.env Object contains information on the environment that NEngine is running on.
* @property env
* @type Object
**/
NEngine.env = {
  /**
  * The env string to representing the running environment.
  * @property env.name
  * @type String
  **/
  name : '',
  /**
  * The env type to representing the running environment.
  * @property env.type
  * @type String
  **/
  type : '',
  /**
  * The env debug mode enable?
  * @property env.debug
  * @type Number
  **/
  debug : 1,
  /**
  * The time interval of the Clock in milliseconds.
  * @type Number
  **/
  interval : 34
};

/**
* The constant for web browser.
* @property env.BROWSER
* @type String
**/
NEngine.env.BROWSER = 'browser';

/**
* The constant for mobile device.
* @property env.MOBILE
* @type String
**/
NEngine.env.MOBILE = 'mobile';

/**
* The constant for console.
* @property env.CONSOLE
* @type String
**/
NEngine.env.CONSOLE = 'console';

/**
* The NEngine.utils Object contains all the utility method for the NEngine.
* @property utils
* @type Object
**/
NEngine.utils = {
  /**
  * The unique DisplayObject id
  * @property utils_next_ID.
  * @type Number
  **/
  _next_ID : 0
};

/**
* Generate the unquie ID for DislayObject.
* @method utils.getUID
**/
NEngine.utils.getUID = function() {
  return ++this._next_ID;
}

/**
* Same object in memory?
* @method utils.assertSame(obj1, obj2)
**/
NEngine.utils.assertSame = function(obj1, obj2) {
  if (obj1 == obj2) {
    return true;
  } else {
    return false;
  }
}

/**
* Log the message to the logging facilities of the environment. All parameters are passed through.
* @method utils.log
**/
NEngine.utils.log = function() {

  if (NEngine.env.debug) {
    switch (NEngine.env.type) {
    case NEngine.env.BROWSER:
      try {
        if (typeof(console) !== 'undefined' && console && console.log) {
                    console.log.apply(NEngine, arguments);
                }
      } catch (e) {
        console.log(Array.prototype.join.apply(arguments, [',']));
      }
      break;
    case NEngine.env.MOBILE:
      break;
    case NEngine.env.CONSOLE:
      break;
    }
  }

};

/**
* Get the timestamp of the system.
* @method utils.getTimestamp
**/
NEngine.utils.getTimestamp = function() {
  return Math.round((new Date()).getTime() / 1000);
};

/**
* Get the timestamp of the system in millisecond.
* @method utils.getTimestampInMS
**/
NEngine.utils.getTimestampInMS = function() {
  return Math.round((new Date()).getTime());
};

// handle events uniformly
NEngine.hasEventOptions = function() {
    if (null == NEngine.hasEventOptions.supported)
    {
        var passiveSupported = false, options = {};
        try {
            Object.defineProperty(options, 'passive', {
                get: function(){
                    passiveSupported = true;
                    return false;
                }
            });
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch(e) {
            passiveSupported = false;
        }
        NEngine.hasEventOptions.supported = passiveSupported;
    }
    return NEngine.hasEventOptions.supported;
}
NEngine.addEvent = function(target, event, handler, options) {
    if (target.attachEvent) target.attachEvent('on' + event, handler);
    else target.addEventListener(event, handler, NEngine.hasEventOptions() ? options : ('object' === typeof(options) ? !!options.capture : !!options));
};
NEngine.removeEvent = function(target, event, handler, options) {
    // if (el.removeEventListener) not working in IE11
    if (target.detachEvent) target.detachEvent('on' + event, handler);
    else target.removeEventListener(event, handler, NEngine.hasEventOptions() ? options : ('object' === typeof(options) ? !!options.capture : !!options));
};

/**
* The main of the NEngine, everything starts from here.
* @method NEngine.init
**/
(NEngine.init = function() {
  /**
  * init the environment for the NEngine
  **/
  NEngine.env.type = NEngine.env.BROWSER;
  NEngine.utils.log("NEngine.init - done");
}());

/**
* The inherit util functions for class inheritance.
* @method Function.inheritsFrom
**/
Function.prototype.inheritsFrom = function(parentClassOrObject) {
  if (parentClassOrObject.constructor == Function) {
    this.prototype = new parentClassOrObject;
    this.prototype.constructor = this;
    this.prototype.parent = parentClassOrObject.prototype;
  } else {
    this.prototype = parentClassOrObject;
    this.prototype.constructor = this;
    this.prototype.parent = parentClassOrObject;
  }
  return this;
};
/**
* Clock.js by Nera Liu. Feb 5, 2011
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
* Clock of the game engine.
**/

(function(NEngine) {

  /**
  * Clock's constructor.
  **/
  function Clock() {
    throw "Clock cannot be instantiated.";
  }

  /**
  * The interval ID of the setInterval.
  * @type Number
  **/
  Clock._intervalID = 0;

  /**
  * The time interval of the Clock in milliseconds.
  * @type Number
  **/
  Clock._interval = 0;

  /**
  * The start time of the Clock.
  * @type Number
  **/
  Clock._startTime = 0;

  /**
  * The last tick time of the Clock.
  * @type Number
  **/
  Clock._lastTickTime = 0;

  /**
  * How many tick since the Clock starts.
  * @type Number
  **/
  Clock._tick = 0;

  /**
  * Is the Clock paused?
  * @type Boolean 
  **/
  Clock._paused = false;

  /**
  * All the DisplayObject listening to the clock.
  * @type Array 
  **/
  Clock._listeners = new Array();

  /**
  * The exact time difference of the Clock.
  * @type Number 
  **/
  Clock._diff = 0;

  /**
  * Adds a DisplayObject instance to this Clock.
  * @method Clock.addListeners(displayobject)
  **/
  Clock.addListeners = function(displayobject) {
    Clock.pause();
    Clock._listeners.push(displayobject);
    Clock.start();
  }

  /**
  * Removes the specified DisplayObject instance from the listener list of the Clock.
  * @method Clock.removeListeners(displayobject)
  **/
  Clock.removeListeners = function(displayobject) {
    for (var i=0;i<Clock._listeners.length;i++) {
      if (Clock._listeners[i] == displayobject) {
        Clock.pause();
        var c = Clock._listeners[i];
        Clock._listeners.splice(i, 1);
        Clock.start();
        return c;
      }
    }
    return null;
  }

  /**
  * Set the interval of the Clock.
  * @method Clock.setInterval(interval)
  **/
  Clock.setInterval = function(interval) {
    Clock.pause();
    Clock._interval = interval;
  }

  /**
  * Get the interval of the Clock.
  * @method Clock.getInterval()
  **/
  Clock.getInterval = function() {
    return Clock._interval;
  }

  /**
  * Pause the Clock.
  * @method Clock.setPaused(value)
  **/
  Clock.setPaused = function(value) {
    Clock._paused = value;
  }

  /**
  * Is the Clock paused?
  * @method Clock.getPaused()
  **/
  Clock.getPaused = function() {
    return Clock._paused;
  }

  /**
  * Get the frame rate of the Clock. 
  * @method Clock.getFPS()
  **/
  Clock.getFPS = function() {
    return 1000/Clock._interval;
  }

  /**
  * Return the string of Clock object.
  * @method Clock.toString()
  **/
  Clock.toString = function() {
    var d = new Date();
    return "unixts:" + d.getTime() + "," + d;
  }

  /**
  * Start the Clock.
  * @method Clock.start()
  **/
  Clock.start = function() {
    if (Clock._intervalID > 0) { clearInterval(Clock._intervalID); }
    if (Clock._interval <= 0) { return; }
    Clock.setPaused(false);
    Clock._intervalID = setInterval(Clock.tick, Clock._interval);
  }

  /**
  * Pause the Clock.
  * @method Clock.pause()
  **/
  Clock.pause = function() {
    Clock.setPaused(true);
    if (Clock._intervalID > 0) { clearInterval(Clock._intervalID); }
  }

  /**
  * Tick the Clock.
  * @method Clock.tick()
  **/
  Clock.tick = function() {
    Clock._tick++;
    currentTime = Clock._getTime();
    Clock._diff = Math.abs(currentTime) - Math.abs(Clock._lastTickTime);
    Clock._lastTickTime = currentTime;

    for (var i=0;i<Clock._listeners.length;i++) {
      if (Clock._listeners[i].tick) {
        Clock._listeners[i].tick();
      }
    }
  }

  /**
  * Get the current unixtime of the Clock.
  * @method Clock._getTime()
  **/
  Clock.getTime = function() {
    return new Date().getTime();
  }
  Clock._getTime = function() {
    return new Date().getTime();
  }

  Clock._startTime = Clock._getTime();

  /**
  * Exposing the Clock to the NEngine global object.
  **/
  NEngine.Clock = Clock;

}(NEngine));
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
/**
* Point.js by Nera Liu. Feb 5, 2011
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
* Represents a point in x / y coordinates.
**/

(function(NEngine) {

  /**
  * Point's constructor.
  **/
  function Point(x, y) {
    this.name = "Point";
    this.x = x;
    this.y = y;
  }

  /**
  * Clone the Point object.
  * @method Point.clone()
  **/
  Point.prototype.clone = function() {
    return new Point(this.x, this.y);
  }

  /**
  * Return the string of Point object.
  * @method Point.toString()
  **/
  Point.prototype.toString = function() {
    return this.name + "(x:" + this.x + ",y:" + this.y + ")";
  }

  /**
  * Exposing the Point to the NEngine global object.
  **/
  NEngine.Point = Point;

}(NEngine));
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
  * [read-only] Indicates the local touch points, in pixels.
  * @type Array
  **/
  DisplayObject.prototype.touches = null;

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
  * onTouchStart handler of the DisplayObject.
  * @type Function
  **/
  DisplayObject.prototype.onTouchStart = null;

  /**
  * onTouchEnd handler of the DisplayObject.
  * @type Function
  **/
  DisplayObject.prototype.onTouchEnd = null;

  /**
  * onTouchMove handler of the DisplayObject.
  * @type Function
  **/
  DisplayObject.prototype.onTouchMove = null;

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
    o.touches = this.touches;
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
  DisplayObject.prototype.skipBounds = false;

  /**
  * Exposing the DisplayObject to the window global object.
  **/
  NEngine.DisplayObject = DisplayObject;

}(NEngine));
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
/**
* Sprite.js by Nera Liu. Feb 5, 2011
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
* The Sprite class is a basic display list building block: a display list node that can display graphics and can also contain children. The Sprite class represents the main drawing area without timeline.
**/

(function(NEngine) {

  /**
  * Sprite's constructor.
  **/
  function Sprite(canvas) {
    if (canvas)
    {
        this.__displayobject_init("Sprite");
        this.__displayobjectcont_init();
        this.__stage_init(canvas);
        if (NEngine.Clock)
        {
            NEngine.Clock.setInterval(NEngine.env.interval);
            NEngine.Clock.addListeners(this);
            NEngine.Clock.start();
        }
    }
  }

  Sprite.inheritsFrom(NEngine.DisplayObjectContainer);

  /**
  * The canvas element of html object.
  * @type html object
  **/
  Sprite.prototype.canvas = null;

  /**
  * The NEngine.Graphics for drawing.
  * @type NEngine.Graphics
  **/
  Sprite.prototype.graphics = null;

  /**
  * Clear the canvas automatically?
  * @type Boolean
  **/
  Sprite.prototype.autoClear = true;

  /**
  * A Boolean value that indicates whether the pointing hand (hand cursor) appears when the mouse rolls over a sprite in which the buttonMode property is set to true.
  * @type Boolean
  **/
  Sprite.prototype.useHandCursor = true;

  // Sprite.prototype.buttonMode = null;
  // Sprite.prototype.dropTarget = null;
  // Sprite.prototype.hitArea = null;
  // Sprite.prototype.soundTransform = null;

  /**
  * Init the Sprite, in NEngine, we do not use the "capturing" for event handling.
  * reference - http://blog.neraliu.com/2009/09/20/javascript-dom-events-specification/
  * @method Sprite.__stage_init()
  **/
  Sprite.prototype.__stage_init = function(canvas) {
    this.stage = this;
    this.canvas = canvas;
    this.graphics = new NEngine.Graphics(this.canvas);

    var s = this;
    NEngine.addEvent(window, 'mousemove', function(e) { s._handleOnMouseMove(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'mouseup', function(e) { s._handleOnMouseUp(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'mousedown', function(e) { s._handleOnMouseDown(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'mouseover', function(e) { s._handleOnMouseOver(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'mouseout', function(e) { s._handleOnMouseOut(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'click', function(e) { s._handleOnClick(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'keydown', function(e) { s._handleOnKeyDown(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'keyup', function(e) { s._handleOnKeyUp(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'keypress', function(e) { s._handleOnKeyPress(e); }, {passive:false, capture:false});
    this.draw();
  }

  /**
  * The handler of mousemove event in the Sprite.
  * @method Sprite._handleOnMouseMove(e)
  **/
  Sprite.prototype._handleOnMouseMove = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
    this.mouseX = e.pageX-this.canvas.offsetLeft;
    this.mouseY = e.pageY-this.canvas.offsetTop;
    var inBounds = (this.mouseX >= 0 && this.mouseY >= 0 && this.mouseX < this.canvas.width && this.mouseY < this.canvas.height);
    if (!inBounds) return;

    if (this.onMouseMove) { this.onMouseMove(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = e.pageX-this.canvas.offsetLeft-this._children[i].x;
      this._children[i].mouseY = e.pageY-this.canvas.offsetTop -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      if(this._children[i].onMouseMove && this._children[i].onMouseMove instanceof Function) { this._children[i].onMouseMove(e); }
    }
  }

  /**
  * The handler of mouseup event in the Sprite.
  * @method Sprite._handleOnMouseUp(e)
  **/
  Sprite.prototype._handleOnMouseUp = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
    this.mouseX = e.pageX-this.canvas.offsetLeft;
    this.mouseY = e.pageY-this.canvas.offsetTop;
    if (this.onMouseUp) { this.onMouseUp(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = e.pageX-this.canvas.offsetLeft-this._children[i].x;
      this._children[i].mouseY = e.pageY-this.canvas.offsetTop -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      if(this._children[i].onMouseUp && this._children[i].onMouseUp instanceof Function) { this._children[i].onMouseUp(e); }
    }
  }

  /**
  * The handler of mousedown event in the Sprite.
  * @method Sprite._handleOnMouseDown(e)
  **/
  Sprite.prototype._handleOnMouseDown = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
    this.mouseX = e.pageX-this.canvas.offsetLeft;
    this.mouseY = e.pageY-this.canvas.offsetTop;
    if (this.onMouseDown) { this.onMouseDown(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = e.pageX-this.canvas.offsetLeft-this._children[i].x;
      this._children[i].mouseY = e.pageY-this.canvas.offsetTop -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      if(this._children[i].onMouseDown && this._children[i].onMouseDown instanceof Function) { this._children[i].onMouseDown(e); }
    }
  }

  /**
  * The handler of mouseover event in the Sprite.
  * @method Sprite._handleOnMouseOver(e)
  **/
  Sprite.prototype._handleOnMouseOver = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
    this.mouseX = e.pageX-this.canvas.offsetLeft;
    this.mouseY = e.pageY-this.canvas.offsetTop;
    if (this.onMouseOver) { this.onMouseOver(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = e.pageX-this.canvas.offsetLeft-this._children[i].x;
      this._children[i].mouseY = e.pageY-this.canvas.offsetTop -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      if(this._children[i].onMouseOver && this._children[i].onMouseOver instanceof Function) { this._children[i].onMouseOver(e); }
    }
  }

  /**
  * The handler of mouseout event in the Sprite.
  * @method Sprite._handleOnMouseOut(e)
  **/
  Sprite.prototype._handleOnMouseOut = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
    this.mouseX = e.pageX-this.canvas.offsetLeft;
    this.mouseY = e.pageY-this.canvas.offsetTop;
    if (this.onMouseOut) { this.onMouseOut(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = e.pageX-this.canvas.offsetLeft-this._children[i].x;
      this._children[i].mouseY = e.pageY-this.canvas.offsetTop -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      if(this._children[i].onMouseOut && this._children[i].onMouseOut instanceof Function) { this._children[i].onMouseOut(e); }
    }
  }

  /**
  * The handler of click event in the Sprite.
  * @method Sprite._handleOnClick(e)
  **/
  Sprite.prototype._handleOnClick = function(e) {
    if (!this.canvas) { this.mouseX = this.mouseY = null; return; }
    this.mouseX = e.pageX-this.canvas.offsetLeft;
    this.mouseY = e.pageY-this.canvas.offsetTop;
    if (this.onClick) { this.onClick(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].mouseX = e.pageX-this.canvas.offsetLeft-this._children[i].x;
      this._children[i].mouseY = e.pageY-this.canvas.offsetTop -this._children[i].y;
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].inBounds(this.mouseX, this.mouseY);
      if(inBounds && this._children[i].onClick && this._children[i].onClick instanceof Function) { this._children[i].onClick(e); }
    }
  }

  /**
  * The handler of keydown event in the Sprite.
  * @method Sprite._handleOnKeyDown(e)
  **/
  Sprite.prototype._handleOnKeyDown = function(e) {
    if (!this.canvas) { return; }
    if (this.onKeyDown) { this.onKeyDown(e); }
    for (var i=0;i<this._children.length;i++) {
      if(this._children[i].onKeyDown && this._children[i].onKeyDown instanceof Function) { this._children[i].onKeyDown(e); }
    }
  }

  /**
  * The handler of keyup event in the Sprite.
  * @method Sprite._handleOnKeyUp(e)
  **/
  Sprite.prototype._handleOnKeyUp = function(e) {
    if (!this.canvas) { return; }
    if (this.onKeyUp) { this.onKeyUp(e); }
    for (var i=0;i<this._children.length;i++) {
      if(this._children[i].onKeyUp && this._children[i].onKeyUp instanceof Function) { this._children[i].onKeyUp(e); }
    }
  }

  /**
  * The handler of keypress event in the Sprite.
  * @method Sprite._handleOnKeyUp(e)
  **/
  Sprite.prototype._handleOnKeyPress = function(e) {
    if (!this.canvas) { return; }
    if (this.onKeyPress) { this.onKeyPress(e); }
    for (var i=0;i<this._children.length;i++) {
      if(this._children[i].onKeyPress && this._children[i].onKeyPress instanceof Function) { this._children[i].onKeyPress(e); }
    }
  }

  /**
  * The clock handler.
  * @method Sprite.tick()
  **/
  Sprite.prototype.tick = function() {
    this.draw();
  }

  /**
  * Clear the canvas.
  * @method Sprite.clear()
  **/
  Sprite.prototype.clear = function() {
    if (this.canvas == null) { return; }
    this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height);
  }

  /**
  * Draw the canvas.
  * @method Sprite.draw()
  **/
  Sprite.prototype.draw = function() {
    if (this.canvas == null) { return; }
    if (this.autoClear) { this.clear(); }
   // if (this.useHandCursor) { this.canvas.style.setProperty('cursor','pointer'); }
    if (this.animate) { this.animate(); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].draw(this.graphics.ctx);
    }
  }

  /**
  * Return the string of Sprite object.
  * @method Sprite.toString()
  **/
  Sprite.prototype.toString = function() {
    return this.name + "(id:" + this.id + ")";
  }

  /**
  * Exposing the Sprite to the NEngine global object.
  **/
  NEngine.Sprite = Sprite;

}(NEngine));
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
    if (canvas)
    {
        this.__displayobject_init("Stage");
        this.__displayobjectcont_init();
        this.__stage_init(canvas);
        if (NEngine.Clock)
        {
            NEngine.Clock.setInterval(NEngine.env.interval);
            NEngine.Clock.addListeners(this);
            NEngine.Clock.start();
        }
    }
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
    NEngine.addEvent(window, 'touchmove', function(e) { s._handleOnTouchMove(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'touchend', function(e) { s._handleOnTouchEnd(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'touchstart', function(e) { s._handleOnTouchStart(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'mousemove', function(e) { s._handleOnMouseMove(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'mouseup', function(e) { s._handleOnMouseUp(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'mousedown', function(e) { s._handleOnMouseDown(e); }, {passive:false, capture:false});
    // NEngine.addEvent(window, 'mouseover', function(e) { s._handleOnMouseOver(e); }, {passive:false, capture:false});
    // NEngine.addEvent(window, 'mouseout', function(e) { s._handleOnMouseOut(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'click', function(e) { s._handleOnClick(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'keydown', function(e) { s._handleOnKeyDown(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'keyup', function(e) { s._handleOnKeyUp(e); }, {passive:false, capture:false});
    NEngine.addEvent(window, 'keypress', function(e) { s._handleOnKeyPress(e); }, {passive:false, capture:false});
    this.draw();
  }

  /**
  * The handler of touchmove event in the Stage.
  * @method Stage._handleOnTouchMove(e)
  **/
  Stage.prototype._handleOnTouchMove = function(e) {
    if (!this.canvas) { this.touches = null; this.mouseX = this.mouseY = null; return; }
    var self = this;
    this.touches = Array.prototype.map.call(e.touches, function(touch) {
        return {
            x: touch.pageX-self.canvas.globalOffsetLeft,
            y: touch.pageY-self.canvas.globalOffsetTop
        };
    });
    if (this.touches.length)
    {
        this.mouseX = this.touches[0].x;
        this.mouseY = this.touches[0].y;
    }
    var inBounds = 0 < this.touches.filter(function(touch) {return (touch.x >= 0 && touch.y >= 0 && touch.x < self.canvas.width && touch.y < self.canvas.height);}).length;
    if (!inBounds) return;

    if (this.onTouchMove) { this.onTouchMove(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].touches = this.touches.map(function(touch) {
          return {
            x: touch.x-self._children[i].x,
            y: touch.y-self._children[i].y,
          };
      });
      if (this._children[i].touches.length)
      {
          this._children[i].mouseX = this._children[i].touches[0].x;
          this._children[i].mouseY = this._children[i].touches[0].y;
      }
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].skipBounds || (0 < this._children[i].touches.filter(function(touch) {return self._children[i].inBounds(touch.x, touch.y);}).length);
      if(inBounds && this._children[i].onTouchMove && this._children[i].onTouchMove instanceof Function) { this._children[i].onTouchMove(e); }
    }
  }

  /**
  * The handler of touchend event in the Stage.
  * @method Stage._handleOnMouseUp(e)
  **/
  Stage.prototype._handleOnTouchEnd = function(e) {
    if (!this.canvas) { this.touches = null; this.mouseX = this.mouseY = null; return; }
    var self = this;
    this.touches = Array.prototype.map.call(e.touches, function(touch) {
        return {
            x: touch.pageX-self.canvas.globalOffsetLeft,
            y: touch.pageY-self.canvas.globalOffsetTop
        };
    });
    if (this.touches.length)
    {
        this.mouseX = this.touches[0].x;
        this.mouseY = this.touches[0].y;
    }
    if (this.onTouchEnd) { this.onTouchEnd(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].touches = this.touches.map(function(touch) {
          return {
            x: touch.x-self._children[i].x,
            y: touch.y-self._children[i].y,
          };
      });
      if (this._children[i].touches.length)
      {
          this._children[i].mouseX = this._children[i].touches[0].x;
          this._children[i].mouseY = this._children[i].touches[0].y;
      }
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].skipBounds || (0 < this._children[i].touches.filter(function(touch) {return self._children[i].inBounds(touch.x, touch.y);}).length);
      if(inBounds && this._children[i].onTouchEnd && this._children[i].onTouchEnd instanceof Function) { this._children[i].onTouchEnd(e); }
    }
  }

  /**
  * The handler of touchstart event in the Stage.
  * @method Stage._handleOnMouseDown(e)
  **/
  Stage.prototype._handleOnTouchStart = function(e) {
    if (!this.canvas) { this.touches = null; this.mouseX = this.mouseY = null; return; }
    var self = this;
    this.touches = Array.prototype.map.call(e.touches, function(touch) {
        return {
            x: touch.pageX-self.canvas.globalOffsetLeft,
            y: touch.pageY-self.canvas.globalOffsetTop
        };
    });
    if (this.touches.length)
    {
        this.mouseX = this.touches[0].x;
        this.mouseY = this.touches[0].y;
    }
    if (this.onTouchStart) { this.onTouchStart(e); }
    for (var i=0;i<this._children.length;i++) {
      this._children[i].touches = this.touches.map(function(touch) {
          return {
            x: touch.x-self._children[i].x,
            y: touch.y-self._children[i].y,
          };
      });
      if (this._children[i].touches.length)
      {
          this._children[i].mouseX = this._children[i].touches[0].x;
          this._children[i].mouseY = this._children[i].touches[0].y;
      }
      if(!this._children[i].mouseEnabled) { continue; }
      var inBounds = this._children[i].skipBounds || (0 < this._children[i].touches.filter(function(touch) {return self._children[i].inBounds(touch.x, touch.y);}).length);
      if(inBounds && this._children[i].onTouchStart && this._children[i].onTouchStart instanceof Function) { this._children[i].onTouchStart(e); }
    }
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
/**
* Graphics.js by Nera Liu. Feb 5, 2011
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
* This is the wrapper class for canvas api.
**/

(function(NEngine) {

  /**
  * Graphics's constructor
  **/
  function Graphics(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }

  /**
  * The canvas element of html object.
  * @type html object
  **/
  Graphics.prototype.canvas = null;

  /**
  * The Context of 2d canvas
  * @type html object
  **/
  Graphics.prototype.ctx = null;

  /**
  * Fill the stroke color of the Graphics
  * @method Graphics.strokeStyle(color)
  **/
  Graphics.prototype.strokeStyle = function(color) {
    if (this.ctx == null) return;
    this.ctx.strokeStyle = color.toRGB();
    return this;
  }

  /**
  * Fill the color of the Graphics
  * @method Graphics.fillStyle(color)
  **/
  Graphics.prototype.fillStyle = function(color) {
    if (this.ctx == null) return;
    this.ctx.fillStyle = color.toRGB();
    return this;
  }

  /**
  * Exposing the Graphics to the NEngine global object
  **/
  NEngine.Graphics = Graphics;

}(NEngine));
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
/**
* Bitmap.js by Nera Liu. Feb 5, 2011
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
* Represents a Bitmap in x / y coordinates.
**/

(function(NEngine) {

  /**
  * Bitmap's constructor.
  **/
  function Bitmap(image, x, y, w, h, sx, sy, sw, sh) {
    this.__displayobject_init("Bitmap");
    this.x = x;
    this.y = y;
    this.regX = w/2;
    this.regY = h/2;

    if (typeof image == "string") {
      this.image = new Image();
      var o = this;
      this.image.onload = function() {
        o.ready = true;
      }
      this.image.src = image;
    } else if (image instanceof Image) {
      this.image = image;
    } else {
      throw "Exception: the first parameter is not String or Image object"; 
    }

    if (w != undefined) { this.width = w; }
    if (h != undefined) { this.height = h; }
    if (sx != undefined) { this.sx = sx; }
    if (sy != undefined) { this.sy = sy; }
    if (sw != undefined) { this.sw = sw; }
    if (sh != undefined) { this.sh = sh; }
  }

  Bitmap.inheritsFrom(NEngine.Shape);

  /**
  * The image object.
  * @type Image
  **/
  Bitmap.prototype.image = null;

  /**
  * Is the Image ready?
  * @type Boolean
  **/
  Bitmap.prototype.ready = false;

  /**
  * The x displacement of the image object.
  * @type Number
  **/
  Bitmap.prototype.sx = null;

  /**
  * The y displacement of the image object.
  * @type Number
  **/
  Bitmap.prototype.sy = null;

  /**
  * The w displacement of the image object.
  * @type Number
  **/
  Bitmap.prototype.sw = null;

  /**
  * The h displacement of the image object.
  * @type Number
  **/
  Bitmap.prototype.sh = null;

  /**
  * Clone the Bitmap object.
  * @method Bitmap.clone()
  **/
  Bitmap.prototype.clone = function() {
    return new Bitmap(this.image.src);
  }

  /**
  * Return the string of Bitmap object.
  * @method Bitmap.toString()
  **/
  Bitmap.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",imageurl:" + this.image.src + ")";
  }

  /**
  * Draw the Bitmap on the canvas.
  * @method Bitmap.draw(ctx, ignoreCache)
  **/
  Bitmap.prototype.draw = function(ctx, ignoreCache) {
	if (this.__draw(ctx, ignoreCache)) { return true; }
    if (this.ready) {
      if (this.width && this.height && this.sx != undefined && this.sy != undefined && this.sw && this.sh) {
        ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height);
      } else if (this.width && this.height) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else {
        ctx.drawImage(this.image, this.x, this.y);
      }
    }
  }

  /**
  * Test whether the mouseX/Y is in bound of the Bitmap.
  * @method Bitmap.inBounds(globalX, globalY)
  **/
  Bitmap.prototype.inBounds = function(globalX, globalY) {
    var inBounds = (globalX >= this.x && globalY >= this.y && globalX < (this.x + this.width) && globalY < (this.y + this.height));
    if (this.stage) {
      if (inBounds) {
        var imagedata = this.stage.graphics.ctx.getImageData(globalX, globalY, 1, 1);
        return (imagedata.data[3]/255);
      }
    }
    return inBounds;
  }

  /**
  * Exposing the Bitmap to the NEngine global object.
  **/
  NEngine.Bitmap = Bitmap;

}(NEngine));
/**
* Rectangle.js by Nera Liu. Feb 5, 2011
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
* Represents a Rectangle in x / y coordinates.
**/

(function(NEngine) {

  /**
  * Rectangle's constructor.
  **/
  function Rectangle(x, y, w, h, filled) {
    this.__displayobject_init("Rectangle");
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.regX = w/2;
    this.regY = h/2;
    if (typeof filled == 'boolean') { this.filled = filled; }
  }

  Rectangle.inheritsFrom(NEngine.Shape);

  /**
  * Clone the Rectangle object.
  * @method Rectangle.clone()
  **/
  Rectangle.prototype.clone = function() {
    return new Rectangle(this.x, this.y, this.width, this.height, this.filled);
  }

  /**
  * Return the string of Rectangle object.
  * @method Rectangle.toString()
  **/
  Rectangle.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",w:" + this.width + ",h:" + this.height + ")";
  }

  /**
  * Draw the Rectangle on the canvas.
  * @method Rectangle.draw(ctx, ignoreCache)
  **/
  Rectangle.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    this.applyStyle(ctx);
    if (this.filled) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    this.resetStyle(ctx);
  }

  /**
  * Test whether the mouseX/Y is in bound of the Rectangle.
  * @method Rectangle.inBounds(globalX, globalY)
  **/
  Rectangle.prototype.inBounds = function(globalX, globalY) {
    var inBounds = (globalX >= this.x && globalY >= this.y && globalX < (this.x + this.width) && globalY < (this.y + this.height));
    return inBounds;
  }

  /**
  * Exposing the Rectangle to the NEngine global object.
  **/
  NEngine.Rectangle = Rectangle;

}(NEngine));
/**
* Circle.js by Nera Liu. Feb 5, 2011
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
* Represents a Circle wth x / y coordinates as center.
**/

(function(NEngine) {

  /**
  * Circle's constructor.
  **/
  function Circle(x, y, r, filled) {
    this.__displayobject_init("Circle");
    this.x = x;
    this.y = y;
    this.radius = r;
    this.regX = 0;
    this.regY = 0;
    if (typeof filled == 'boolean') { this.filled = filled; }
  }

  Circle.inheritsFrom(NEngine.Shape);

  /**
  * The radius of the Circle.
  * @type Number 
  **/
  Circle.prototype.radius = 0;

  /**
  * Clone the Circle object.
  * @method Circle.clone()
  **/
  Circle.prototype.clone = function() {
    return new Circle(this.x, this.y, this.r, this.filled);
  }

  /**
  * Return the string of Circle object.
  * @method Circle.toString()
  **/
  Circle.prototype.toString = function() {
    return this.name + "(id:" + this.id + ",x:" + this.x + ",y:" + this.y + ",r:" + this.radius + ")";
  }

  /**
  * Draw the Circle on the canvas.
  * @method Circle.draw(ctx, ignoreCache)
  **/
  Circle.prototype.draw = function(ctx, ignoreCache) {
    if (this.__draw(ctx, ignoreCache)) { return true; }
    this.applyStyle(ctx);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, new NEngine.Angle().degree2radian(0), new NEngine.Angle().degree2radian(360), true);
    if (this.filled) { ctx.fill(); } else { ctx.stroke(); }
    this.resetStyle(ctx);
  }

  /**
  * Test whether the mouseX/Y is in bound of the Circle.
  * @method Circle.inBounds(globalX, globalY)
  **/
  Circle.prototype.inBounds = function(globalX, globalY) {
    // throw "Exception: Circle.inBounds(globalX, globalY)";
    return false;
  }

  /**
  * Exposing the Circle to the NEngine global object.
  **/
  NEngine.Circle = Circle;

}(NEngine));
