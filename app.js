"use strict";
var FPS = 60;
var Matter = /** @class */ (function () {
    function Matter(pos_x, pos_y, radius, density, FPS) {
        this.is_collided = false;
        this.FPS = FPS;
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.density = density;
        this.radius = radius;
        this.mass = (4 / 3) * Math.PI * Math.pow(this.radius, 3);
        this.acc_x = 0;
        this.acc_y = 0;
        this.vel_x = 0;
        this.vel_y = 0;
        this.F_x = 0;
        this.F_y = 0;
        this.gravity_constant = 6.674 * Math.pow(10, 0);
    }
    Matter.prototype.measure_distance_x = function (matter) {
        return this.pos_x - matter.pos_x;
    };
    Matter.prototype.measure_distance_y = function (matter) {
        return this.pos_y - matter.pos_y;
    };
    Matter.prototype.measure_distance = function (matter) {
        return (Math.pow((Math.pow(this.measure_distance_x(matter), 2) +
            Math.pow(this.measure_distance_y(matter), 2)), (1 / 2)));
    };
    Matter.prototype.measure_gravity = function (matter) {
        return ((this.gravity_constant * this.mass * matter.mass) /
            Math.pow(this.measure_distance(matter), 2));
    };
    Matter.prototype.measure_acc = function (matter) {
        var total_force = this.measure_gravity(matter);
        var y_axis = this.measure_distance_y(matter) / this.measure_distance(matter);
        var x_axis = this.measure_distance_x(matter) / this.measure_distance(matter);
        if (this.measure_distance(matter) <= this.radius) {
            this.reset();
        }
        else {
            this.acc_x -= (total_force * x_axis) / this.mass;
            this.acc_y -= (total_force * y_axis) / this.mass;
        }
    };
    Matter.prototype.measure_vel = function () {
        this.vel_x += this.acc_x / FPS;
        this.vel_y += this.acc_y / FPS;
    };
    Matter.prototype.measure_pos = function () {
        this.pos_x += this.vel_x / FPS;
        this.pos_y += this.vel_y / FPS;
    };
    Matter.prototype.draw = function () {
        this.context.beginPath();
        this.context.arc(this.pos_x, this.pos_y, this.radius, 0, 2 * Math.PI);
        this.context.stroke();
    };
    Matter.prototype.reset = function () {
        this.acc_x = 0;
        this.acc_y = 0;
    };
    Matter.prototype.collision_detection = function (matter) { };
    return Matter;
}());
var App = /** @class */ (function () {
    function App() {
        this.FPS = 60;
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.matterArray = [];
        this.creataMatterArray(30);
        this.appLoop();
    }
    App.prototype.creataMatterArray = function (matterNumber) {
        for (var index = 0; index < matterNumber; index++) {
            var x = Math.random() * this.canvas.width;
            var y = Math.random() * this.canvas.height;
            var radius = Math.random() * 50;
            this.matterArray.push(new Matter(x, y, radius, 1, this.FPS));
        }
    };
    App.prototype.appLoop = function () {
        var _this = this;
        setInterval(function () {
            _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            for (var _i = 0, _a = _this.matterArray; _i < _a.length; _i++) {
                var x = _a[_i];
                for (var _b = 0, _c = _this.matterArray; _b < _c.length; _b++) {
                    var y = _c[_b];
                    if (x == y) {
                        continue;
                    }
                    x.measure_acc(y);
                }
                x.measure_vel();
                x.measure_pos();
                x.draw();
            }
            _this.matterArray.forEach(function (matter) {
                matter.reset();
            });
        }, 1000 / this.FPS);
    };
    return App;
}());
var Game = new App();
