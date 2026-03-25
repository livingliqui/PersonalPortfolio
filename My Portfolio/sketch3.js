let col1, col2;
let h = 0;
let x = 0;
let rectW = 1;
let z;
let u;
let h2 = 0;
let z2;
let s; // square size

function setup() {
  s = min(windowWidth, windowHeight);
  createCanvas(s, s);
  rectMode(CENTER);
  resetAnim();
  col1 = color('#DC143C');
  col2 = color('#F1C50F');
}

function resetAnim() {
  h = 0;
  h2 = 0;
  x = rectW / 2;
  z = s - rectW / 2;
  u = s * 0.3;
  z2 = s * 0.7;
}

function windowResized() {
  s = min(windowWidth, windowHeight);
  resizeCanvas(s, s);
  resetAnim();
  background(0);
}

function draw() {
  let col = lerpColor(col1, col2, x / (0.5 * width));
  let colb = lerpColor(col1, col2, h2 / (height / 2.5));
  noStroke();

  fill(col);
  rect(x, height / 2, rectW, h);
  fill(col);
  rect(z, height / 2, rectW, h);

  if (h < height) {
    h += 2;
    x++;
    z--;
  }

  if (h >= height && h2 < height / 2.5) {
    fill(colb);
    rect(u, height * 1 / 3, rectW, h2);
    fill(colb);
    rect(z2, height * 2 / 3, rectW, h2);

    h2 += 2;
    u++;
    z2--;
  }
}