/**
*
* Scene.js
* A simple, performant and versatile Scene Graph API supporting HTML/CSS, SVG and Canvas rendering
* @VERSION 1.0.0
* https://github.com/foo123/Scene.js
*
**/
(function(window) {
"use strict";

var proto = 'prototype',
    stdMath = Math,
    PI = stdMath.PI,
    INF = Infinity,
    def = Object.defineProperty,
    HAS = Object[proto].hasOwnProperty,
    toString = Object[proto].toString,
    document = window.document,
    documentElement = document.documentElement,
    body = document.body,
    cnt = 0;

function Scene(container, width, height)
{
    if (!(this instanceof Scene)) return new Scene(container, width, height);
    var self = this,
        children = [],
        emptyContainer = false,
        scaling = 1.0,
        left = 0,
        top = 0,
        throttle_resize = false,
        throttle_scroll = false,
        throttle_interval = 40, // 40ms
        update_html,
        update_svg,
        update_canvas,
        update,
        pointer,
        dispatch,
        offset,
        resize,
        scroll;
    if (container)
    {
        width = width || 0;
        height = height || 0;
        offset = function() {
            var el = container;
            left = el.offsetLeft || 0;
            top = el.offsetTop || 0;
            while (el=el.parentNode)
            {
                if ((documentElement !== el) && (body !== el))
                {
                    left -= el.scrollLeft || 0;
                    top -= el.scrollTop || 0;
                }
                left += el.offsetLeft || 0;
                top += el.offsetTop || 0;
            }
        };
        resize = function(now) {
            if (true === now)
            {
                offset();
                self.scaling = (container.clientWidth || width)/width;
                return;
            }
            if (!throttle_resize)
            {
                // throttle
                setTimeout(function() {
                    offset();
                    self.scaling = (container.clientWidth || width)/width;
                    throttle_resize = false;
                }, throttle_interval);
                throttle_resize = true;
            }
        };
        scroll = function(now) {
            if (true === now)
            {
                offset();
                return;
            }
            if (!throttle_scroll)
            {
                // throttle
                setTimeout(function() {
                    offset();
                    throttle_scroll = false;
                }, throttle_interval);
                throttle_scroll = true;
            }
        };
        pointer = function(evt) {
            /*if (isDescendantOf(evt.target, container))
            {*/
            if (null != evt.touches)
            {
                if (evt.touches.length)
                {
                    self.pointer = Array.prototype.map.call(evt.touches, function(evt) {
                        return {
                            x: (evt.pageX - left)/scaling,
                            y: (evt.pageY - top)/scaling
                        };
                    });
                }
            }
            else if ((null != evt.pageX) && (null != evt.pageY))
            {
                self.pointer = [{
                    x: (evt.pageX - left)/scaling,
                    y: (evt.pageY - top)/scaling
                }];
            }
            dispatch(evt);
            /*}*/
        };
        dispatch = function(evt) {
            if (container && evt.type && children && children.length)
            {
                for (var handler='on'+String(evt.type).toLowerCase(),o,n=children.length,i=0; i<n; ++i)
                {
                    o = children[i];
                    if (o && (o.scene === self) && ("function" === typeof o[handler]))
                    {
                        o[handler](evt);
                    }
                }
            }
        };
        update_html = function() {
            if (self.needsUpdate)
            {
                if (emptyContainer)
                {
                    container.textContent = '';
                    emptyContainer = false;
                }
                scaling = container.clientWidth/width;
                setStyle(container, {
                    'height': String(stdMath.round(scaling * height)) + 'px'
                });
            }
            for (var o,el,mtx,n=children.length,i=0; i<n; ++i)
            {
                o = children[i];
                if (!o || !(el=o.el))
                {
                    children.splice(i, 1);
                    --i;
                    --n;
                    continue;
                }
                if (o.scene !== self)
                {
                    if (el.parentNode === container) container.removeChild(el);
                    children.splice(i, 1);
                    --i;
                    --n;
                    continue;
                }
                if (self.needsUpdate || o.needsUpdate)
                {
                    if (el.firstChild !== o.content)
                    {
                        el.textContent = ''; // empty
                        if (o.content)
                        {
                            el.appendChild(o.content);
                            setStyle(el.firstChild, {
                                'position': 'relative',
                                'display': 'block',
                                'box-sizing': 'border-box',
                                'transform-origin': '0 0'
                            });
                        }
                    }
                    var style = {},
                        w = String(stdMath.round(scaling * o.scaleX * o.width)) + 'px',
                        h = String(stdMath.round(scaling * o.scaleY * o.height)) + 'px',
                        z = String(stdMath.round(o.z)),
                        a = o.alpha.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''),
                        display = getStyle(el, 'display'),
                        pointerEvents = getStyle(el, 'pointer-events');
                    if (el.id !== o.id) el.id = o.id;
                    if (el.className !== o.className) el.className = o.className;
                    if (o.visible && (display !== 'block')) style['display'] = 'block';
                    if (!o.visible && (display !== 'none')) style['display'] = 'none';
                    if (o.pointerEvents && (pointerEvents !== 'auto')) style['pointer-events'] = 'auto';
                    if (!o.pointerEvents && (pointerEvents !== 'none')) style['pointer-events'] = 'none';
                    if (getStyle(el, 'width') !== w) style['width'] = w;
                    if (getStyle(el, 'height') !== h) style['height'] = h;
                    if (getStyle(el, 'opacity') !== a) style['opacity'] = a;
                    if (getStyle(el, 'z-index') !== z) style['z-index'] = z;
                    /*if (o.useTransform)
                    {*/
                        /*style['transform-origin'] = (scaling * o.scaleX * o.x0).toFixed(4)+'px '+(scaling * o.scaleY * o.y0).toFixed(4)+'px';
                        style['transform'] = 'translate('+(scaling * o.x - scaling * o.scaleX * o.x0).toFixed(4)+'px,'+(scaling * o.y - scaling * o.scaleY * o.y0).toFixed(4)+'px) rotate('+String(o.rotation)+'rad)';*/
                        mtx = get_matrix(scaling * o.x - scaling * o.scaleX * o.x0, scaling * o.y - scaling * o.scaleY * o.y0, o.rotation, scaling * o.scaleX * o.x0, scaling * o.scaleY * o.y0, o.skewX, o.skewY, 1, 1, o.matrix);
                        style['transform'] = 'matrix('+mtx.a.toFixed(4)+','+mtx.b.toFixed(4)+','+mtx.c.toFixed(4)+','+mtx.d.toFixed(4)+','+mtx.e.toFixed(4)+','+mtx.f.toFixed(4)+')';
                    /*}
                    else
                    {
                        style['left'] = (scaling * o.x - scaling * o.scaleX * o.x0).toFixed(4) + 'px';
                        style['top'] = (scaling * o.y - scaling * o.scaleY * o.y0).toFixed(4) + 'px';
                        style['transform-origin'] = (scaling * o.scaleX * o.x0).toFixed(4)+'px '+(scaling * o.scaleY * o.y0).toFixed(4)+'px';
                        style['transform'] = 'rotate('+String(o.rotation)+'rad)';
                    }*/
                    setStyle(setStyle(el, style).firstChild, {
                        'transform': 'scale('+(scaling * o.scaleX).toFixed(4)+','+(scaling * o.scaleY).toFixed(4)+')'
                    });
                    if (el.parentNode !== container) container.appendChild(el);
                    o.needsUpdate = false;
                }
            }
            self.needsUpdate = false;
        };
        update_svg = function() {
            if (self.needsUpdate)
            {
                if (emptyContainer)
                {
                    container.textContent = '';
                    emptyContainer = false;
                }
                var wid = container.clientWidth, hei;
                scaling = wid/width;
                hei = stdMath.round(scaling * height);
                setStyle(setAttr(container, {
                    'viewBox': '0 0 '+String(wid-1)+' '+String(hei-1)+'',
                    'width': String(wid),
                    'height': String(hei)
                }), {
                    //'width': String(wid) + 'px',
                    'height': String(hei) + 'px'
                });
            }
            var needs_reorder = false, o, el, mtx, n = children.length, i;
            for (i=1; i<n; ++i)
            {
                if (children[i-1].z > children[i].z)
                {
                    needs_reorder = true;
                    break;
                }
            }
            if (needs_reorder)
            {
                children = children.map(function(o, i) {
                    return [o, i];
                }).sort(function(a, b) {
                    return (a[0].z - b[0].z) || (a[1] - b[1]);
                }).map(function(oi) {
                    return oi[0];
                });
            }
            for (i=0; i<n; ++i)
            {
                o = children[i];
                if (!o || !(el=o.el))
                {
                    children.splice(i, 1);
                    --i;
                    --n;
                    continue;
                }
                if (o.scene !== self)
                {
                    if (el.parentNode === container) container.removeChild(el);
                    children.splice(i, 1);
                    --i;
                    --n;
                    continue;
                }
                if (self.needsUpdate || o.needsUpdate)
                {
                    if (el.firstChild !== o.content)
                    {
                        el.textContent = ''; // empty
                        if (o.content) el.appendChild(o.content);
                    }
                    var style = {}, attr = {},
                        a = o.alpha.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''),
                        display = getStyle(el, 'display'),
                        pointerEvents = getStyle(el, 'pointer-events');
                    if (el.id !== o.id) el.id = o.id;
                    if (getAttr(el, 'class') !== o.className) attr['class'] = o.className;
                    if (o.visible && (display === 'none')) style['display'] = '';
                    if (!o.visible && (display !== 'none')) style['display'] = 'none';
                    if (o.pointerEvents && (pointerEvents !== 'auto')) style['pointer-events'] = 'auto';
                    if (!o.pointerEvents && (pointerEvents !== 'none')) style['pointer-events'] = 'none';
                    if (getStyle(el, 'fill-opacity') !== a) {style['fill-opacity'] = a; style['stroke-opacity'] = a;}
                    mtx = get_matrix(scaling * o.x - scaling * o.scaleX * o.x0, scaling * o.y - scaling * o.scaleY * o.y0, o.rotation, scaling * o.scaleX * o.x0, scaling * o.scaleY * o.y0, o.skewX, o.skewY, scaling * o.scaleX, scaling * o.scaleY, o.matrix);
                    attr['transform'] = 'matrix('+mtx.a.toFixed(4)+','+mtx.b.toFixed(4)+','+mtx.c.toFixed(4)+','+mtx.d.toFixed(4)+','+mtx.e.toFixed(4)+','+mtx.f.toFixed(4)+')';
                    /*attr['transform'] = 'translate('+(scaling * (o.x - o.scaleX * o.x0)).toFixed(4)+' '+(scaling * (o.y - o.scaleY * o.y0)).toFixed(4)+') rotate('+(o.rotation*180/PI).toFixed(4)+' '+(scaling * o.scaleX * o.x0).toFixed(4)+' '+(scaling * o.scaleY * o.y0).toFixed(4)+') scale('+(scaling * o.scaleX).toFixed(4)+' '+(scaling * o.scaleY).toFixed(4)+')';*/
                    setStyle(setAttr(el, attr), style);
                    if (needs_reorder || (el.parentNode !== container)) container.appendChild(el);
                    o.needsUpdate = false;
                }
                else if (needs_reorder)
                {
                    container.appendChild(el);
                }
            }
            self.needsUpdate = false;
        };
        update_canvas = function() {
            if (self.needsUpdate)
            {
                var wid = container.clientWidth, hei;
                scaling = wid/width;
                hei = stdMath.round(scaling * height);
                container.width = wid;
                container.height = hei;
                emptyContainer = false;
            }
            if (self.needsUpdate || (0 < children.filter(function(o) {return o.needsUpdate;}).length))
            {
                var needs_reorder = false, o, el, mtx, n = children.length, i;
                for (i=1; i<n; ++i)
                {
                    if (children[i-1].z > children[i].z)
                    {
                        needs_reorder = true;
                        break;
                    }
                }
                if (needs_reorder)
                {
                    children = children.map(function(o, i) {
                        return [o, i];
                    }).sort(function(a, b) {
                        return (a[0].z - b[0].z) || (a[1] - b[1]);
                    }).map(function(oi) {
                        return oi[0];
                    });
                }
                var ctx = container.getContext("2d");
                ctx.resetTransform();
                ctx.clearRect(0, 0, container.width, container.height);
                for (i=0; i<n; ++i)
                {
                    o = children[i];
                    if (!o || !(el=o.el) || (o.scene !== self))
                    {
                        children.splice(i, 1);
                        --i;
                        --n;
                        continue;
                    }
                    if (el.firstChild !== o.content)
                    {
                        el.textContent = ''; // empty
                        if (o.content) el.appendChild(o.content);
                    }
                    if (o.visible && ((el.firstChild instanceof Image) || is_el(el.firstChild, 'img') || is_el(el.firstChild, 'canvas')))
                    {
                        /*ctx.resetTransform();
                        ctx.scale(scaling, scaling);
                        ctx.translate(o.x + o.scaleX * o.x0, o.y + o.scaleY * o.y0);
                        ctx.rotate(o.rotation);
                        ctx.translate(-(o.x + o.scaleX * o.x0), -(o.y + o.scaleY * o.y0));*/
                        mtx = get_matrix(scaling * o.x - scaling * o.scaleX * o.x0, scaling * o.y - scaling * o.scaleY * o.y0, o.rotation, scaling * o.scaleX * o.x0, scaling * o.scaleY * o.y0, o.skewX, o.skewY, scaling * o.scaleX, scaling * o.scaleY, o.matrix);
                        ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.e, mtx.f);
                        ctx.globalAlpha = o.alpha;
                        ctx.globalCompositeOperation = "source-over";
                        ctx.drawImage(el.firstChild, 0, 0, o.width, o.height);
                        ctx.resetTransform();
                        ctx.globalAlpha = 1;
                    }
                    o.needsUpdate = false;
                }
            }
            self.needsUpdate = false;
        };
        update = function() {
            if (container)
            {
                if (self.autoUpdate) self.update();
                window.requestAnimationFrame(update);
            }
        };

        def(self, 'width', {
            get: function() {
                return width;
            },
            set: function(v) {
                if (width !== v)
                {
                    width = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'height', {
            get: function() {
                return height;
            },
            set: function(v) {
                if (height !== v)
                {
                    height = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'scaling', {
            get: function() {
                return scaling;
            },
            set: function(v) {
                if (scaling !== v)
                {
                    scaling = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        self.pointer = [{x:0, y:0}];

        self.dispose = function() {
            if (container)
            {
                removeEvent(window, 'touchmove', pointer, {passive:false, capture:false});
                removeEvent(window, 'touchend', pointer, {passive:false, capture:false});
                removeEvent(window, 'touchstart', pointer, {passive:false, capture:false});
                removeEvent(window, 'mousemove', pointer, {passive:false, capture:false});
                removeEvent(window, 'mouseup', pointer, {passive:false, capture:false});
                removeEvent(window, 'mousedown', pointer, {passive:false, capture:false});
                removeEvent(window, 'click', pointer, {passive:false, capture:false});
                removeEvent(window, 'dblclick', pointer, {passive:false, capture:false});
                removeEvent(window, 'pointermove', pointer, {passive:false, capture:false});
                removeEvent(window, 'pointerup', pointer, {passive:false, capture:false});
                removeEvent(window, 'pointerdown', pointer, {passive:false, capture:false});
                removeEvent(window, 'wheel', dispatch, {passive:false, capture:false});
                removeEvent(window, 'dragend', dispatch, {passive:false, capture:false});
                removeEvent(window, 'dragstart', dispatch, {passive:false, capture:false});
                removeEvent(window, 'keyup', dispatch, {passive:false, capture:false});
                removeEvent(window, 'keydown', dispatch, {passive:false, capture:false});
                //removeEvent(window, 'keypress', dispatch, {passive:false, capture:false});
                removeEvent(window, 'resize', resize, false);
                removeEvent(window, 'scroll', scroll, true);
                //window.cancelAnimationFrame(update);
                children.forEach(function(o) {o.scene = null;});
                children = [];
                if (is_el(container, 'canvas'))
                {
                    container.getContext("2d").clearRect(0, 0, container.width, container.height);
                }
                else if (is_el(container, 'svg'))
                {
                    container.textContent = '';
                }
                else
                {
                    container.textContent = '';
                }
                container = null;
            }
        };
        self.empty = function() {
            children.forEach(function(o) {o.scene = null;});
            children = [];
            emptyContainer = true;
            self.needsUpdate = true;
            return self;
        };
        self.hasChild = function(o) {
            return (o instanceof Scene.DisplayObject2D) && (o.scene === self) && (-1 < children.indexOf(o));
        };
        self.addChild = function(o) {
            if (container && (o instanceof Scene.DisplayObject2D) && (-1 === children.indexOf(o)))
            {
                o.scene = self;
                o.elType = is_el(container, 'svg') ? 'svg' : 'html';
                o.needsUpdate = true;
                children.push(o);
            }
            return self;
        };
        self.removeChild = function(o) {
            var i = o instanceof Scene.DisplayObject2D ? children.indexOf(o) : -1;
            if ((-1 < i) && (o.scene === self)) o.scene = null;
            return self;
        };
        self.getChildById = function(id) {
            return children.filter(function(o) {return (o.scene === self) && (o.id === id);})[0] || null;
        };
        self.update = function() {
            if (container)
            {
                if (is_el(container, 'canvas'))
                {
                    update_canvas();
                }
                else if (is_el(container, 'svg'))
                {
                    update_svg();
                }
                else
                {
                    update_html();
                }
            }
        };

        // init
        if (!is_el(container, 'svg')) setStyle(container, {'overflow': 'hidden'});
        self.empty();
        resize(true);

        addEvent(window, 'touchmove', pointer, {passive:false, capture:false});
        addEvent(window, 'touchend', pointer, {passive:false, capture:false});
        addEvent(window, 'touchstart', pointer, {passive:false, capture:false});
        addEvent(window, 'mousemove', pointer, {passive:false, capture:false});
        addEvent(window, 'mouseup', pointer, {passive:false, capture:false});
        addEvent(window, 'mousedown', pointer, {passive:false, capture:false});
        addEvent(window, 'click', pointer, {passive:false, capture:false});
        addEvent(window, 'dblclick', pointer, {passive:false, capture:false});
        addEvent(window, 'pointermove', pointer, {passive:false, capture:false});
        addEvent(window, 'pointerup', pointer, {passive:false, capture:false});
        addEvent(window, 'pointerdown', pointer, {passive:false, capture:false});
        addEvent(window, 'wheel', dispatch, {passive:false, capture:false});
        addEvent(window, 'dragend', dispatch, {passive:false, capture:false});
        addEvent(window, 'dragstart', dispatch, {passive:false, capture:false});
        addEvent(window, 'keyup', dispatch, {passive:false, capture:false});
        addEvent(window, 'keydown', dispatch, {passive:false, capture:false});
        //addEvent(window, 'keypress', dispatch, {passive:false, capture:false});
        addEvent(window, 'resize', resize, false);
        addEvent(window, 'scroll', scroll, true);
        window.requestAnimationFrame(update);
    }
}
Scene[proto] = {
    constructor: Scene,
    dispose: null,
    autoUpdate: true,
    needsUpdate: false,
    update: null,
    empty: null,
    hasChild: null,
    addChild: null,
    removeChild: null,
    getChildById: null,
    width: 0,
    height: 0,
    scaling: 1,
    pointer: null
};

function DisplayObject2D(content, type)
{
    if (!(this instanceof DisplayObject2D)) return new DisplayObject2D(content, type);
    var self = this,
        x = 0, y = 0, z = 0,
        x0 = 0, y0 = 0, a = 1,
        sx = 1, sy = 1,
        skx = 0, sky = 0,
        r = 0, mtx = null,
        w = 0, h = 0,
        vis = true,
        pointer = true,
        transxy = true,
        id = '', cls = '',
        el_html = null,
        el_svg = null,
        c = null;

    if (content)
    {
        def(self, 'id', {
            get: function() {
                return id;
            },
            set: function(v) {
                v = String(v);
                if (id !== v)
                {
                    id = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'className', {
            get: function() {
                return cls;
            },
            set: function(v) {
                v = String(v);
                if (cls !== v)
                {
                    cls = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'x', {
            get: function() {
                return x;
            },
            set: function(v) {
                if (x !== v)
                {
                    x = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'y', {
            get: function() {
                return y;
            },
            set: function(v) {
                if (y !== v)
                {
                    y = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'z', {
            get: function() {
                return z;
            },
            set: function(v) {
                if (z !== v)
                {
                    z = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'x0', {
            get: function() {
                return x0;
            },
            set: function(v) {
                if (x0 !== v)
                {
                    x0 = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'y0', {
            get: function() {
                return y0;
            },
            set: function(v) {
                if (y0 !== v)
                {
                    y0 = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, '_x0', {
            get: function() {
                return (self.scene ? self.scene.scaling : 1) * sx * x0;
            },
            set: nop,
            enumerable: true,
            configurable: false
        });
        def(self, '_y0', {
            get: function() {
                return (self.scene ? self.scene.scaling : 1) * sy * y0;
            },
            set: nop,
            enumerable: true,
            configurable: false
        });
        def(self, 'width', {
            get: function() {
                return w;
            },
            set: function(v) {
                if (w !== v)
                {
                    w = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'height', {
            get: function() {
                return h;
            },
            set: function(v) {
                if (h !== v)
                {
                    h = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'scaleX', {
            get: function() {
                return sx;
            },
            set: function(v) {
                if (sx !== v)
                {
                    sx = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'scaleY', {
            get: function() {
                return sy;
            },
            set: function(v) {
                if (sy !== v)
                {
                    sy = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'skewX', {
            get: function() {
                return skx;
            },
            set: function(v) {
                if (skx !== v)
                {
                    skx = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'skewY', {
            get: function() {
                return sky;
            },
            set: function(v) {
                if (sky !== v)
                {
                    sky = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'rotation', {
            get: function() {
                return r;
            },
            set: function(v) {
                if (r !== v)
                {
                    r = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'matrix', {
            get: function() {
                if (!mtx) mtx = Scene.Matrix2D.EYE();
                return mtx;
            },
            set: function(v) {
                if ((v instanceof Scene.Matrix2D) && !v.equ(mtx))
                {
                    mtx = v.clone();
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'alpha', {
            get: function() {
                return a;
            },
            set: function(v) {
                if (a !== v)
                {
                    a = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'visible', {
            get: function() {
                return vis;
            },
            set: function(v) {
                v = !!v;
                if (vis !== v)
                {
                    vis = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'pointerEvents', {
            get: function() {
                return pointer;
            },
            set: function(v) {
                v = !!v;
                if (pointer !== v)
                {
                    pointer = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'useTransform', {
            get: function() {
                return transxy;
            },
            set: function(v) {
                v = !!v;
                if (transxy !== v)
                {
                    transxy = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'content', {
            get: function() {
                return c;
            },
            set: function(v) {
                if (is_string(v))
                {
                    var cont = 'SVG' === String(self.elType || 'html').toUpperCase() ? document.createElementNS('http://www.w3.org/2000/svg', 'g') : document.createElement('div');
                    cont.innerHTML = v.trim();
                    v = cont.firstChild;
                }
                if (c !== v)
                {
                    c = v;
                    self.needsUpdate = true;
                }
            },
            enumerable: true,
            configurable: false
        });
        def(self, 'el', {
            get: function() {
                if ('SVG' === String(self.elType || 'html').toUpperCase())
                {
                    if (false === el_svg) return null;
                    if (!el_svg)
                    {
                        el_svg = setAttr(setStyle(
                            document.createElementNS('http://www.w3.org/2000/svg', 'g'), {
                            'pointer-events': 'auto'
                            }), {
                            'transform-origin': '0 0'
                        });
                    }
                    return el_svg;
                }
                else
                {
                    if (false === el_html) return null;
                    if (!el_html)
                    {
                        el_html = setStyle(document.createElement('div'), {
                            'overflow': 'hidden',
                            'position': 'absolute',
                            'left': '0',
                            'top': '0',
                            'transform-origin': '0 0',
                            'display': 'block',
                            'pointer-events': 'auto'
                        });
                    }
                    return el_html;
                }
            },
            set: nop,
            enumerable: true,
            configurable: false
        });

        self.dispose = function() {
            self.scene = null;
            mtx = null;
            el_html = false;
            el_svg = false;
            c = null;
        };

        // init
        self.id = '--display-object-'+String(stdMath.floor(++cnt))+'-'+String(stdMath.round(1000*stdMath.random()));
        self.elType = type || 'html';
        self.content = content;
    }
}
DisplayObject2D[proto] = {
    constructor: DisplayObject2D,
    dispose: null,
    needsUpdate: false,
    id: '',
    className: '',
    elType: 'html',
    name: '',
    scene: null,
    el: null,
    content: null,
    x: 0,
    y: 0,
    z: 0,
    x0: 0,
    y0: 0,
    _x0: 0,
    _y0: 0,
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    rotation: 0,
    matrix: null,
    alpha: 1,
    visible: true,
    pointerEvents: true,
    useTransform: true
};
([
 'touchmove'
,'touchend'
,'touchstart'
,'mousemove'
,'mouseup'
,'mousedown'
,'click'
,'dblclick'
,'pointermove'
,'pointerup'
,'pointerdown'
,'wheel'
,'dragend'
,'dragstart'
,'keyup'
,'keydown'
]).forEach(function(evt) {
    DisplayObject2D[proto]['on' + evt.toLowerCase()] = null;
});
Scene.DisplayObject2D = DisplayObject2D;

function Matrix2D(m11, m12, m13, m21, m22, m23)
{
    var self = this, sx = 1, sy = 1;
    if (arguments.length)
    {
        self.m11 = m11;
        self.m12 = m12;
        self.m13 = m13;
        self.m21 = m21;
        self.m22 = m22;
        self.m23 = m23;
    }
    // aliases
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
    def(self, 'a', {
        get: function() {
            return self.m11;
        },
        set: function(a) {
            self.m11 = sx = a;
        }
    });
    def(self, 'c', {
        get: function() {
            return self.m12;
        },
        set: function(c) {
            self.m12 = c;
        }
    });
    def(self, 'e', {
        get: function() {
            return self.m13;
        },
        set: function(e) {
            self.m13 = e;
        }
    });
    def(self, 'b', {
        get: function() {
            return self.m21;
        },
        set: function(b) {
            self.m21 = b;
        }
    });
    def(self, 'd', {
        get: function() {
            return self.m22;
        },
        set: function(d) {
            self.m22 = sy = d;
        }
    });
    def(self, 'f', {
        get: function() {
            return self.m23;
        },
        set: function(f) {
            self.m23 = f;
        }
    });
    def(self, 'is2D', {
        get: function() {
            return true;
        },
        set: nop
    });
    def(self, 'isIdentity', {
        get: function() {
            return  (self.m11 === 1)
                 && (self.m12 === 0)
                 && (self.m13 === 0)
                 && (self.m21 === 0)
                 && (self.m22 === 1)
                 && (self.m23 === 0)
             ;
        },
        set: nop
    });
    def(self, 'sx', {
        get: function() {
            return sx;
        },
        set: function(s) {
            sx *= s;
        }
    });
    def(self, 'sy', {
        get: function() {
            return sy;
        },
        set: function(s) {
            sy *= s;
        }
    });
}
Matrix2D[proto] = {
    constructor: Matrix2D,
    flag: '',
    is2D: true,
    isIdentity: true,
    m11: 1,
    m12: 0,
    m13: 0,
    m21: 0,
    m22: 1,
    m23: 0,
    m31: 0,
    m32: 0,
    m33: 1,
    a: null,
    b: null,
    c: null,
    d: null,
    e: null,
    f: null,
    clone: function() {
        var self = this, m;
        m  = new Matrix2D(
        self.m11, self.m12, self.m13,
        self.m21, self.m22, self.m23
        );
        m.sx = self.sx;
        m.sy = self.sy;
        return m;
    },
    equ: function(other) {
        var self = this;
        if (other instanceof Matrix2D)
        {
            return  (self.m11 === other.m11)
                 && (self.m12 === other.m12)
                 && (self.m13 === other.m13)
                 && (self.m21 === other.m21)
                 && (self.m22 === other.m22)
                 && (self.m23 === other.m23)
             ;
        }
        return false;
    },
    mul: function(other) {
        var self = this, m;
        if (other instanceof Matrix2D)
        {
            m = new Matrix2D(
            self.m11*other.m11 + self.m12*other.m21,
            self.m11*other.m12 + self.m12*other.m22,
            self.m11*other.m13 + self.m12*other.m23 + self.m13,
            self.m21*other.m11 + self.m22*other.m21,
            self.m21*other.m12 + self.m22*other.m22,
            self.m21*other.m13 + self.m22*other.m23 + self.m23
            );
            m.sx = self.sx * other.sx;
            m.sy = self.sy * other.sy;
            return m;
        }
    },
    inv: function() {
        var self = this,
            a00 = self.m11, a01 = self.m12, a02 = self.m13,
            a10 = self.m21, a11 = self.m22, a12 = self.m23,
            det2 = a00*a11 - a01*a10,
            i00 = 0, i01 = 0, i10 = 0, i11 = 0, m;

        if (0 === det2) return null;
        i00 = a11/det2; i01 = -a01/det2;
        i10 = -a10/det2; i11 = a00/det2;
        m = new Matrix2D(
        i00, i01, -i00*a02 - i01*a12,
        i10, i11, -i10*a02 - i11*a12
        );
        m.sx = 1/self.sx;
        m.sy = 1/self.sy;
        return m;
    },
    transform: function(x, y, res) {
        if ((2 === arguments.length) && y && y.length)
        {
            res = y;
            y = x[1];
            x = x[0];
        }
        else if (1 === arguments.length)
        {
            y = x[1];
            x = x[0];
        }
        var self = this,
            tx = self.m11*x + self.m12*y + self.m13,
            ty = self.m21*x + self.m22*y + self.m23;
        if (res && res.length)
        {
            res[0] = tx;
            res[1] = ty;
        }
        else
        {
            res = [
                tx,
                ty
            ];
        }
        return res;
    }
};
Matrix2D.translate = function(tx, ty) {
    return new Matrix2D(
    1, 0, tx || 0,
    0, 1, ty || 0
    );
};
Matrix2D.scale = function(sx, sy, ox, oy) {
    ox = ox || 0;
    oy = oy || 0;
    var m = new Matrix2D(
    sx, 0,  ox - sx*ox,
    0,  sy, oy - sy*oy
    );
    m.sx = sx;
    m.sy = sy;
    return m;
};
Matrix2D.rotate = function(theta, ox, oy) {
    ox = ox || 0;
    oy = oy || 0;
    theta = theta || 0;
    var cos = stdMath.cos(theta), sin = stdMath.sin(theta);
    return new Matrix2D(
    cos, -sin, ox - cos*ox + sin*oy,
    sin,  cos, oy - cos*oy - sin*ox
    );
};
Matrix2D.skewX = function(s) {
    return new Matrix2D(
    1, s || 0, 0,
    0, 1, 0
    );
};
Matrix2D.skewY = function(s) {
    return new Matrix2D(
    1, 0, 0,
    s || 0, 1, 0
    );
};
Matrix2D.EYE = function() {
    return new Matrix2D(
    1, 0, 0,
    0, 1, 0
    );
};
Scene.Matrix2D = Matrix2D;

// utils ---------------------------------
function nop() {}
function get_matrix(x, y, rotation, x0, y0, skewx, skewy, scalex, scaley, matrix)
{
    // allow for transformations like rotation and skew to be performed differently by the user
    if (matrix.isIdentity) matrix = Scene.Matrix2D.rotate(rotation, x0, y0).mul(Scene.Matrix2D.skewX(skewx)).mul(Scene.Matrix2D.skewY(skewy));
    return Scene.Matrix2D.translate(x, y).mul(matrix).mul(Scene.Matrix2D.scale(scalex, scaley));
}
function is_string(x)
{
    return "string" === typeof x;
}
function is_obj(x)
{
    return (null != x) && ("object" === typeof x);
}
function is_array(x)
{
    return "[object Array]" === toString.call(x);
}
function is_el(el, tag)
{
    if (!el || !el.tagName) return false;
    return String(el.tagName).toUpperCase() === String(tag).toUpperCase();
}
function is_type(el, type)
{
    if (!el || !el.namespaceURI) return false;
    switch (String(type).toUpperCase())
    {
        case 'SVG':
            return 'http://www.w3.org/2000/svg' === el.namespaceURI;
        case 'MATHML':
            return 'http://www.w3.org/1998/Math/MathML' === el.namespaceURI;
        case 'HTML':
            return 'http://www.w3.org/1999/xhtml' === el.namespaceURI;
        case 'XML':
            return !!el.tagName;
        default:
            return false;
    }
}
function hasEventOptions()
{
    if (null == hasEventOptions.supported)
    {
        var passiveSupported = false, options = {};
        try {
            def(options, 'passive', {
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
        hasEventOptions.supported = passiveSupported;
    }
    return hasEventOptions.supported;
}
function addEvent(el, event, handler, options)
{
    if (el)
    {
        if (el.attachEvent) el.attachEvent('on' + event, handler);
        else el.addEventListener(event, handler, hasEventOptions() ? options : (is_obj(options) ? !!options.capture : !!options));
    }
    return el;
}
function removeEvent(el, event, handler, options)
{
    if (el)
    {
        if (el.detachEvent) el.detachEvent('on' + event, handler);
        else el.removeEventListener(event, handler, hasEventOptions() ? options : (is_obj(options) ? !!options.capture : !!options));
    }
    return el;
}
function getStyle(el, prop)
{
    if (is_array(prop))
    {
        return prop.reduce(function(style, prop) {
            style[prop] = el ? el.style.getPropertyValue(prop) : '';
            return style;
        }, {});
    }
    return el ? el.style.getPropertyValue(prop) : '';
}
function setStyle(el, style)
{
    if (el && style)
    {
        for (var prop in style)
        {
            if (HAS.call(style, prop))
            {
                if (!style[prop] || ('' === style[prop]))
                {
                    el.style.removeProperty(prop);
                }
                else
                {
                    el.style.setProperty(prop, style[prop]);
                }
            }
        }
    }
    return el;
}
function getAttr(el, at)
{
    if (is_array(at))
    {
        return at.reduce(function(attr, at) {
            attr[at] = el ? el.getAttribute(at) : '';
            return attr;
        }, {});
    }
    return el ? el.getAttribute(at) : '';
}
function setAttr(el, attr)
{
    if (el && attr)
    {
        for (var at in attr)
        {
            if (HAS.call(attr, at))
            {
                if ((null == attr[at]) || ('' === attr[at]))
                {
                    el.removeAttribute(at);
                }
                else
                {
                    el.setAttribute(at, attr[at]);
                }
            }
        }
    }
    return el;
}
function hasClass(el, className)
{
    if (!el) return false;
    return el.classList
        ? el.classList.contains(className)
        : -1 !== (' ' + el.className + ' ').indexOf(' ' + className + ' ')
    ;
}
function addClass(el, className)
{
    if (el)
    {
        if (el.classList) el.classList.add(className);
        else if (!hasClass(el, className)) el.className = '' === el.className ? className : (el.className + ' ' + className);
    }
    return el;
}
function removeClass(el, className)
{
    if (el)
    {
        if (el.classList) el.classList.remove(className);
        else el.className = (' ' + el.className + ' ').replace(' ' + className + ' ', ' ').trim();
    }
    return el;
}
function isDescendantOf(el_1, el_2)
{
    while (el_1)
    {
        if (el_1 === el_2) return true;
        el_1 = el_1.parentNode;
    }
    return false;
}
Scene.addEvent = addEvent;
Scene.removeEvent = removeEvent;
Scene.getStyle = getStyle;
Scene.setStyle = setStyle;
Scene.getAttr = getAttr;
Scene.setAttr = setAttr;
Scene.hasClass = hasClass;
Scene.addClass = addClass;
Scene.removeClass = removeClass;

// export it
Scene.VERSION = "1.0.0";
window.Scene = Scene;
})(window);