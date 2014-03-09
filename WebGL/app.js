var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='def\WebGL.d.ts' />
var Types;
(function (Types) {
    Types[Types["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    Types[Types["TRIANGLES"] = 4] = "TRIANGLES";
    Types[Types["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
})(Types || (Types = {}));
var Point = (function () {
    function Point(x, y) {
        this.x = 0;
        this.y = 0;
        if (x !== undefined)
            this.x = x;
        if (x !== undefined)
            this.y = y;
    }
    return Point;
})();
var Color = (function () {
    function Color(red, green, blue, alpha) {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 1;
        if (red !== undefined)
            this.red = red;
        if (green !== undefined)
            this.green = green;
        if (blue !== undefined)
            this.blue = blue;
        if (alpha !== undefined)
            this.alpha = alpha;
    }
    return Color;
})();
var Polygon = (function () {
    function Polygon(color, points) {
        this.type = 6 /* TRIANGLE_FAN */;
        this.color = color;
        if (points !== undefined)
            this.points = points;
    }
    Polygon.prototype.getVertex = function () {
        var res = new Array();
        for (var i = 0; i < this.points.length; i++) {
            res.push(this.points[i].x);
            res.push(this.points[i].y);
        }
        return new Float32Array(res);
    };
    Polygon.prototype.draw = function (gl, program) {
        var positionLocation = gl.getAttribLocation(program, 'a_position');
        var colorLocation = gl.getUniformLocation(program, 'u_color');
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        var vertex = this.getVertex();
        gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);
        gl.uniform4f(colorLocation, this.color.red, this.color.green, this.color.blue, this.color.alpha);
        gl.drawArrays(this.type, 0, vertex.length / 2);
    };
    return Polygon;
})();
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, width, height, color) {
        _super.call(this, color);
        this.type = 4 /* TRIANGLES */;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.getVertex = function () {
        var x1 = this.x;
        var x2 = this.x + this.width;
        var y1 = this.y;
        var y2 = this.y + this.height;
        return new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]);
    };
    return Rectangle;
})(Polygon);
var Square = (function (_super) {
    __extends(Square, _super);
    function Square(x, y, width, color) {
        _super.call(this, x, y, width, width, color);
    }
    return Square;
})(Rectangle);
var Triangle = (function (_super) {
    __extends(Triangle, _super);
    function Triangle(a, b, c, color) {
        _super.call(this, color);
        this.points = [a, b, c];
    }
    return Triangle;
})(Polygon);
var Circle = (function () {
    function Circle(cx, cy, r, color) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        if (color !== undefined)
            this.color = color;
    }
    Circle.prototype.getVertex = function () {
        var res = new Array();
        for (var i = 0; i < 360; i++) {
            var x = (Math.cos(i) * this.r) + this.cx;
            var y = (Math.sin(i) * this.r) + this.cy;
            res.push(this.cx);
            res.push(this.cy);
            res.push(x);
            res.push(this.cy);
            res.push(x);
            res.push(y);
        }
        return new Float32Array(res);
    };
    Circle.prototype.draw = function (gl, program) {
        var positionLocation = gl.getAttribLocation(program, 'a_position');
        var colorLocation = gl.getUniformLocation(program, 'u_color');
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        var vertex = this.getVertex();
        gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);
        gl.uniform4f(colorLocation, this.color.red, this.color.green, this.color.blue, this.color.alpha);
        gl.drawArrays(5 /* TRIANGLE_STRIP */, 0, vertex.length / 2);
    };
    return Circle;
})();
var Texture = (function () {
    function Texture(src) {
        this.image = new Image();
        this.image.src = src;
    }
    Texture.prototype.draw = function (gl, program) {
    };
    return Texture;
})();
var WebGLContext = (function () {
    function WebGLContext(canvas) {
        this.canvas = canvas;
        this.initialize();
    }
    WebGLContext.prototype.initialize = function () {
        this.gl = this.canvas.getContext('experimental-webgl');

        // SetUp a GLSL program
        var vertexShader = this.createShader('vertex', this.gl.VERTEX_SHADER);
        var fragmentShader = this.createShader('fragment', this.gl.FRAGMENT_SHADER);
        this.program = this.createProgram(vertexShader, fragmentShader);
        this.gl.useProgram(this.program);

        // Establecer la resolucion
        var resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);

        this.drawMario();
    };
    WebGLContext.prototype.drawRectangles = function () {
        var triangle = new Triangle(new Point(10, 10), new Point(10, 100), new Point(100, 100), new Color(1));
        triangle.draw(this.gl, this.program);
    };
    WebGLContext.prototype.drawMario = function () {
        var pixelwidth = 23;

        // Gorra
        var gorra1 = new Rectangle(pixelwidth * 3, pixelwidth * 0, pixelwidth * 5, pixelwidth * 1, new Color(1));
        gorra1.draw(this.gl, this.program);
        var gorra2 = new Rectangle(pixelwidth * 2, pixelwidth * 1, pixelwidth * 9, pixelwidth, new Color(1));
        gorra2.draw(this.gl, this.program);

        // Cara
        var cara1 = new Rectangle(pixelwidth * 2, pixelwidth * 2, pixelwidth * 7, pixelwidth * 3, new Color(0.97, 0.67, 0));
        cara1.draw(this.gl, this.program);
        var cara2 = new Rectangle(pixelwidth * 9, pixelwidth * 3, pixelwidth * 2, pixelwidth * 2, new Color(0.97, 0.67, 0));
        cara2.draw(this.gl, this.program);
        var cara3 = new Rectangle(pixelwidth * 11, pixelwidth * 4, pixelwidth, pixelwidth, new Color(0.97, 0.67, 0));
        cara3.draw(this.gl, this.program);
        var cara4 = new Rectangle(pixelwidth * 3, pixelwidth * 5, pixelwidth * 7, pixelwidth * 2, new Color(0.97, 0.67, 0));
        cara4.draw(this.gl, this.program);

        // Cabello
        var cabello1 = new Rectangle(pixelwidth * 2, pixelwidth * 2, pixelwidth * 3, pixelwidth * 1, new Color(0.44, 0.4, 0));
        cabello1.draw(this.gl, this.program);
        var cabello2 = new Rectangle(pixelwidth * 3, pixelwidth * 3, pixelwidth * 1, pixelwidth * 2, new Color(0.44, 0.4, 0));
        cabello2.draw(this.gl, this.program);
        var cabello3 = new Rectangle(pixelwidth * 4, pixelwidth * 4, pixelwidth, pixelwidth, new Color(0.44, 0.4, 0));
        cabello3.draw(this.gl, this.program);
        var cabello4 = new Rectangle(pixelwidth, pixelwidth * 3, pixelwidth, pixelwidth * 3, new Color(0.44, 0.4, 0));
        cabello4.draw(this.gl, this.program);
        var cabello5 = new Rectangle(pixelwidth * 2, pixelwidth * 5, pixelwidth, pixelwidth, new Color(0.44, 0.4, 0));
        cabello5.draw(this.gl, this.program);
        var cabello6 = new Rectangle(pixelwidth * 7, pixelwidth * 2, pixelwidth, pixelwidth * 2, new Color(0.44, 0.4, 0));
        cabello6.draw(this.gl, this.program);
        var cabello7 = new Rectangle(pixelwidth * 8, pixelwidth * 4, pixelwidth, pixelwidth, new Color(0.44, 0.4, 0));
        cabello7.draw(this.gl, this.program);
        var cabello8 = new Rectangle(pixelwidth * 7, pixelwidth * 5, pixelwidth * 4, pixelwidth, new Color(0.44, 0.4, 0));
        cabello8.draw(this.gl, this.program);

        // Oberol
        var oberol1 = new Rectangle(pixelwidth * 3, pixelwidth * 8, pixelwidth * 6, pixelwidth * 5, new Color(1));
        oberol1.draw(this.gl, this.program);
        var oberol2 = new Rectangle(pixelwidth * 4, pixelwidth * 7, pixelwidth, pixelwidth, new Color(1));
        oberol2.draw(this.gl, this.program);
        var oberol3 = new Rectangle(pixelwidth * 2, pixelwidth * 12, pixelwidth * 3, pixelwidth * 2, new Color(1));
        oberol3.draw(this.gl, this.program);
        var oberol4 = new Rectangle(pixelwidth * 7, pixelwidth * 12, pixelwidth * 3, pixelwidth * 2, new Color(1));
        oberol4.draw(this.gl, this.program);

        // cuerpo
        var cuerpo1 = new Rectangle(pixelwidth * 2, pixelwidth * 7, pixelwidth * 2, pixelwidth * 3, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);
        var cuerpo1 = new Rectangle(pixelwidth, pixelwidth * 8, pixelwidth, pixelwidth * 2, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);
        var cuerpo1 = new Rectangle(pixelwidth * 0, pixelwidth * 9, pixelwidth, pixelwidth, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);
        var cuerpo1 = new Rectangle(pixelwidth * 2, pixelwidth * 10, pixelwidth, pixelwidth, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);
        var cuerpo1 = new Rectangle(pixelwidth * 5, pixelwidth * 7, pixelwidth * 3, pixelwidth * 1, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);
        var cuerpo1 = new Rectangle(pixelwidth * 5, pixelwidth * 8, pixelwidth * 2, pixelwidth * 1, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);
        var cuerpo1 = new Rectangle(pixelwidth * 8, pixelwidth * 8, pixelwidth * 3, pixelwidth * 2, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);
        var cuerpo1 = new Rectangle(pixelwidth * 11, pixelwidth * 9, pixelwidth, pixelwidth, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);
        var cuerpo1 = new Rectangle(pixelwidth * 9, pixelwidth * 10, pixelwidth, pixelwidth, new Color(0.44, 0.4, 0));
        cuerpo1.draw(this.gl, this.program);

        // manos
        var mano1 = new Rectangle(pixelwidth * 0, pixelwidth * 10, pixelwidth * 2, pixelwidth * 3, new Color(0.97, 0.67, 0));
        mano1.draw(this.gl, this.program);
        var mano2 = new Rectangle(pixelwidth * 2, pixelwidth * 11, pixelwidth, pixelwidth, new Color(0.97, 0.67, 0));
        mano2.draw(this.gl, this.program);
        var mano3 = new Rectangle(pixelwidth * 4, pixelwidth * 10, pixelwidth, pixelwidth, new Color(0.97, 0.67, 0));
        mano3.draw(this.gl, this.program);
        var mano4 = new Rectangle(pixelwidth * 7, pixelwidth * 10, pixelwidth, pixelwidth, new Color(0.97, 0.67, 0));
        mano4.draw(this.gl, this.program);
        var mano5 = new Rectangle(pixelwidth * 9, pixelwidth * 11, pixelwidth, pixelwidth, new Color(0.97, 0.67, 0));
        mano5.draw(this.gl, this.program);
        var mano6 = new Rectangle(pixelwidth * 10, pixelwidth * 10, pixelwidth * 2, pixelwidth * 3, new Color(0.97, 0.67, 0));
        mano6.draw(this.gl, this.program);

        // pies
        var pie1 = new Rectangle(pixelwidth * 1, pixelwidth * 14, pixelwidth * 3, pixelwidth, new Color(0.44, 0.4, 0));
        pie1.draw(this.gl, this.program);
        var pie2 = new Rectangle(pixelwidth * 8, pixelwidth * 14, pixelwidth * 3, pixelwidth, new Color(0.44, 0.4, 0));
        pie2.draw(this.gl, this.program);
        var pie3 = new Rectangle(pixelwidth * 0, pixelwidth * 15, pixelwidth * 4, pixelwidth, new Color(0.44, 0.4, 0));
        pie3.draw(this.gl, this.program);
        var pie4 = new Rectangle(pixelwidth * 8, pixelwidth * 15, pixelwidth * 4, pixelwidth, new Color(0.44, 0.4, 0));
        pie4.draw(this.gl, this.program);
    };
    WebGLContext.prototype.createShader = function (id, type) {
        var shaderScript = document.getElementById(id).firstChild.nodeValue;
        if (!shaderScript) {
            console.log('Script con id ' + id + ' no encontrado');
            return null;
        }
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, shaderScript);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log(this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
    WebGLContext.prototype.createProgram = function (vertex, fragment) {
        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertex);
        this.gl.attachShader(program, fragment);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.log(this.gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    };
    return WebGLContext;
})();

window.onload = function () {
    var webgl = new WebGLContext(document.getElementById('canvas'));
};
//# sourceMappingURL=app.js.map
