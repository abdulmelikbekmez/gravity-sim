"use strict";
var FPS = 60;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
function drawRect() {
    context.fillStyle = "#FF0000";
    context.fillRect(0, 0, 150, 75);
}
function drawCircle() {
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.fill();
}
var Matter = /** @class */ (function () {
    function Matter(pos_x, pos_y, radius, density) {
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
        this.gravity_constant = 6.674 * Math.pow(10, -2);
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
    Matter.prototype.measure_vel_pos = function () {
        this.vel_x += this.acc_x / FPS;
        this.vel_y += this.acc_y / FPS;
        this.pos_x += this.vel_x / FPS;
        this.pos_y += this.vel_y / FPS;
    };
    Matter.prototype.draw = function () {
        context.beginPath();
        context.arc(this.pos_x, this.pos_y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    };
    Matter.prototype.reset = function () {
        this.acc_x = 0;
        this.acc_y = 0;
    };
    return Matter;
}());
var matterArray = [new Matter(10, 10, 10, 50), new Matter(500, 100, 10, 50)];
for (var index = 0; index < 3; index++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var radius = Math.random() * 50;
    var density = Math.random() * 5;
    matterArray.push(new Matter(x, y, radius, 1));
}
setInterval(function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var _i = 0, matterArray_1 = matterArray; _i < matterArray_1.length; _i++) {
        var x = matterArray_1[_i];
        for (var _a = 0, matterArray_2 = matterArray; _a < matterArray_2.length; _a++) {
            var y = matterArray_2[_a];
            if (x == y) {
                continue;
            }
            x.measure_acc(y);
            x.measure_vel_pos();
            x.draw();
        }
    }
    matterArray.forEach(function (matter) {
        matter.reset();
    });
}, 1000 / FPS);
