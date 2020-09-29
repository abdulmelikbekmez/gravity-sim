let FPS = 60;

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
  is_collided: boolean;
}

class Matter implements IMatter {
  FPS: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
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
  is_collided: boolean;
  constructor(
    pos_x: number,
    pos_y: number,
    radius: number,
    density: number,
    FPS: number
  ) {
    this.is_collided = false;
    this.FPS = FPS;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
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
    this.gravity_constant = 6.674 * 10 ** 0;
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

  measure_vel() {
    this.vel_x += this.acc_x / FPS;
    this.vel_y += this.acc_y / FPS;
  }
  measure_pos() {
    this.pos_x += this.vel_x / FPS;
    this.pos_y += this.vel_y / FPS;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.pos_x, this.pos_y, this.radius, 0, 2 * Math.PI);
    this.context.stroke();
  }
  reset() {
    this.acc_x = 0;
    this.acc_y = 0;
  }
  collision_detection(matter: Matter) {}
}

class App {
  FPS: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  matterArray: Array<Matter>;
  constructor() {
    this.FPS = 60;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.matterArray = [];
    this.creataMatterArray(30);
    this.appLoop();
  }

  creataMatterArray(matterNumber: number) {
    for (let index = 0; index < matterNumber; index++) {
      let x = Math.random() * this.canvas.width;
      let y = Math.random() * this.canvas.height;
      let radius = Math.random() * 50;
      this.matterArray.push(new Matter(x, y, radius, 1, this.FPS));
    }
  }

  appLoop() {
    setInterval(() => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let x of this.matterArray) {
        for (let y of this.matterArray) {
          if (x == y) {
            continue;
          }
          x.measure_acc(y);
        }
        x.measure_vel();
        x.measure_pos();
        x.draw();
      }

      this.matterArray.forEach((matter) => {
        matter.reset();
      });
    }, 1000 / this.FPS);
  }
}

const Game = new App();
