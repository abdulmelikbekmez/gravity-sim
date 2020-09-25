let FPS = 60;
let canvas = document.getElementById!("canvas") as HTMLCanvasElement;
let context = <CanvasRenderingContext2D>canvas.getContext("2d");

function drawRect() {
  context.fillStyle = "#FF0000";
  context.fillRect(0, 0, 150, 75);
}

function drawCircle() {
  context.beginPath();
  context.arc(100, 75, 50, 0, 2 * Math.PI);
  context.fill();
}

interface IMatter {
  pos_x: number;
  pos_y: number;
  radius: number;
  mass: number;
  vel_x: number;
  vel_y: number;
  acc_x: number;
  acc_y: number;
  F_x: number;
  F_y: number;
  density: number;
}

class Matter implements IMatter {
  pos_x: number;
  pos_y: number;
  acc_x: number;
  acc_y: number;
  mass: number;
  radius: number;
  vel_x: number;
  vel_y: number;
  F_x: number;
  F_y: number;
  density: number;
  gravity_constant: number;

  constructor(pos_x: number, pos_y: number, radius: number, density: number) {
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.density = density;
    this.radius = radius;
    this.mass = (4 / 3) * Math.PI * this.radius ** 3;
    this.acc_x = 0;
    this.acc_y = 0;
    this.vel_x = 0;
    this.vel_y = 0;
    this.F_x = 0;
    this.F_y = 0;
    this.gravity_constant = 6.674 * 10 ** -2;
  }
  measure_distance_x(matter: Matter): number {
    return this.pos_x - matter.pos_x;
  }

  measure_distance_y(matter: Matter): number {
    return this.pos_y - matter.pos_y;
  }

  measure_distance(matter: Matter): number {
    return (
      (this.measure_distance_x(matter) ** 2 +
        this.measure_distance_y(matter) ** 2) **
      (1 / 2)
    );
  }

  measure_gravity(matter: Matter): number {
    return (
      (this.gravity_constant * this.mass * matter.mass) /
      this.measure_distance(matter) ** 2
    );
  }

  measure_acc(matter: Matter) {
    let total_force = this.measure_gravity(matter);
    let y_axis =
      this.measure_distance_y(matter) / this.measure_distance(matter);
    let x_axis =
      this.measure_distance_x(matter) / this.measure_distance(matter);
    if (this.measure_distance(matter) <= this.radius) {
      this.reset();
    } else {
      this.acc_x -= (total_force * x_axis) / this.mass;
      this.acc_y -= (total_force * y_axis) / this.mass;
    }
  }

  measure_vel_pos() {
    this.vel_x += this.acc_x / FPS;
    this.vel_y += this.acc_y / FPS;
    this.pos_x += this.vel_x / FPS;
    this.pos_y += this.vel_y / FPS;
  }

  draw() {
    context.beginPath();
    context.arc(this.pos_x, this.pos_y, this.radius, 0, 2 * Math.PI);
    context.stroke();
  }
  reset() {
    this.acc_x = 0;
    this.acc_y = 0;
  }
}

let matterArray = [new Matter(10, 10, 10, 50), new Matter(500, 100, 10, 50)];

for (let index = 0; index < 3; index++) {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  let radius = Math.random() * 50;
  let density = Math.random() * 5;
  matterArray.push(new Matter(x, y, radius, 1));
}

setInterval(function () {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let x of matterArray) {
    for (let y of matterArray) {
      if (x == y) {
        continue;
      }
      x.measure_acc(y);
      x.measure_vel_pos();
      x.draw();
    }
  }
  matterArray.forEach((matter) => {
    matter.reset();
  });
}, 1000 / FPS);
