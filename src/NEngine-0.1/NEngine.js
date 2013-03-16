/**
* NEngine.js by Nera Liu. Feb 5, 2011
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
}
