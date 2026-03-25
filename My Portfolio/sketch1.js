let gridSize = 60;
let offset = 20;
let blocks = [];
let cars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildGrid();
  for (let i = 0; i < 10; i++) {
    createCar();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  blocks = [];
  cars = [];
  buildGrid();
  for (let i = 0; i < 10; i++) {
    createCar();
  }
}

function buildGrid() {
  blocks = [];
  let cols = Math.floor(width / gridSize);
  let rows = Math.floor(height / gridSize);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      blocks.push({
        x: i * gridSize + offset,
        y: j * gridSize + offset,
        gridX: i,
        gridY: j,
        phase: random(0, 6.28),
        speed: random(0.01, 0.03)
      });
    }
  }
}

function draw() {
  background(0);
  noStroke();

  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    let grey = map(sin(frameCount * block.speed + block.phase), -1, 1, 50, 80);
    let yn = noise(block.gridX, block.gridY, frameCount * 0.004);
    let yellowAmount = 0;

    if (yn > 0.6 && yn < 0.9) {
      if (yn < 0.75) {
        yellowAmount = map(yn, 0.6, 0.75, 0, 1);
      } else {
        yellowAmount = map(yn, 0.75, 0.9, 1, 0);
      }
    }

    let r = grey + (255 - grey) * yellowAmount;
    let g = grey + (200 - grey) * yellowAmount;
    let b = grey * (1 - yellowAmount);

    fill(r, g, b);
    rect(block.x, block.y, gridSize - offset, gridSize - offset);
  }

  for (let i = cars.length - 1; i >= 0; i--) {
    let car = cars[i];

    car.trail.push({ x: car.x, y: car.y });
    if (car.trail.length > 20) {
      car.trail.splice(0, 1);
    }

    if (car.dir === 0) car.y -= 2;
    else if (car.dir === 1) car.x += 2;
    else if (car.dir === 2) car.y += 2;
    else if (car.dir === 3) car.x -= 2;

    let cx = (car.x - offset / 2) % gridSize;
    let cy = (car.y - offset / 2) % gridSize;
    if (cx === 0 && cy === 0) {
      let r = random(1);
      if (r < 0.33) {
        car.dir = (car.dir + 3) % 4;
      } else if (r < 0.66) {
        car.dir = (car.dir + 1) % 4;
      }
    }

    for (let j = 0; j < car.trail.length; j++) {
      let alpha = map(j, 0, car.trail.length, 0, 200);
      fill(150, 0, 0, alpha);
      rect(car.trail[j].x - offset / 2, car.trail[j].y - offset / 2, offset, offset);
    }

    fill(150, 0, 0);
    rect(car.x - offset / 2, car.y - offset / 2, offset, offset);

    if (car.x < -20 || car.x > width + 20 || car.y < -20 || car.y > height + 20) {
      cars.splice(i, 1);
      createCar();
    }
  }
}

function createCar() {
  let car = {
    x: 0,
    y: 0,
    dir: 0,
    trail: []
  };

  let edge = floor(random(4));
  if (edge === 0) {
    car.x = random(width);
    car.y = offset / 2;
    car.dir = 2;
  } else if (edge === 1) {
    car.x = width - offset / 2;
    car.y = random(height);
    car.dir = 3;
  } else if (edge === 2) {
    car.x = random(width);
    car.y = height - offset / 2;
    car.dir = 0;
  } else {
    car.x = offset / 2;
    car.y = random(height);
    car.dir = 1;
  }

  car.x = round(car.x / gridSize) * gridSize + offset / 2;
  car.y = round(car.y / gridSize) * gridSize + offset / 2;

  cars.push(car);
}