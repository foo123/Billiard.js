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
