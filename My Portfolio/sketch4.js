// ============================================================
// RETRO PIXEL CITY — FULL PARALLAX (8 Layers, sub-pixel scroll)
// ============================================================

const PIXEL = 4;
let W, H, cols, rows;

// Buffers — one per layer
let bufSky, bufClouds, bufFar, bufMid, bufNear, bufGround, bufProps, bufFG;

let scrollX = 0;

// Layer speeds (multipliers of base scroll)
const SCROLL_SPEED  = 0.4;
const CLOUD_SPEED   = 0.05;
const FAR_SPEED     = 0.15;
const MID_SPEED     = 0.4;
const NEAR_SPEED    = 0.6;
const GROUND_SPEED  = 0.7;
const PROPS_SPEED   = 0.75;
const FG_SPEED      = 0.95;

// --- PALETTE ---
const SKY_BANDS = [
  '#1a0a3a', '#2d1b69', '#5c2d91', '#8b3a8f', '#c0476e',
  '#e8654a', '#f4943e', '#f9c74f', '#fce38a', '#fff5cc',
];
const SUN_COLOR = '#ffe066';
const SUN_GLOW  = '#f9a825';

const FAR_BUILDING_COLORS  = ['#1a0a2e', '#1f0f38', '#251545'];
const MID_BUILDING_COLORS  = ['#2a1548', '#331d55', '#3d2562', '#472d6f'];
const NEAR_BUILDING_COLORS = ['#3a1e5c', '#452870', '#503282', '#5a3c90'];
const WINDOW_ON  = '#fce38a';
const WINDOW_DIM = '#f4943e';
const WINDOW_OFF_MID  = '#3a2060';
const WINDOW_OFF_NEAR = '#4a2870';

// --- DATA ---
let stars = [];
let clouds = [];
let farBuildings = [];
let midBuildings = [];
let nearBuildings = [];
let streetProps = [];
let fgElements = [];

// ============================================================
// SETUP
// ============================================================

function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  noSmooth();

  cols = Math.ceil(W / PIXEL) + 2;
  rows = Math.ceil(H / PIXEL);

  createBuffers();
  generateAll();
}

function createBuffers() {
  bufSky    = createGraphics(cols, rows); bufSky.noSmooth();    bufSky.noStroke();
  bufClouds = createGraphics(cols, rows); bufClouds.noSmooth(); bufClouds.noStroke();
  bufFar    = createGraphics(cols, rows); bufFar.noSmooth();    bufFar.noStroke();
  bufMid    = createGraphics(cols, rows); bufMid.noSmooth();    bufMid.noStroke();
  bufNear   = createGraphics(cols, rows); bufNear.noSmooth();   bufNear.noStroke();
  bufGround = createGraphics(cols, rows); bufGround.noSmooth(); bufGround.noStroke();
  bufProps  = createGraphics(cols, rows); bufProps.noSmooth();   bufProps.noStroke();
  bufFG     = createGraphics(cols, rows); bufFG.noSmooth();     bufFG.noStroke();
}

function generateAll() {
  initStars();
  generateClouds();
  generateFarBuildings();
  generateMidBuildings();
  generateNearBuildings();
  generateStreetProps();
  generateFGElements();
}

// ============================================================
// GENERATORS
// ============================================================

function initStars() {
  stars = [];
  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.floor(random(cols)),
      y: Math.floor(random(rows * 0.28)),
      blink: random(0.02, 0.08),
      phase: random(TWO_PI)
    });
  }
}

function generateClouds() {
  clouds = [];
  let totalW = cols * 4;
  let x = 0;
  while (x < totalW) {
    let w = Math.floor(random(12, 35));
    let h = Math.floor(random(3, 7));
    let y = Math.floor(random(rows * 0.15, rows * 0.4));
    let slices = [];
    for (let sy = 0; sy < h; sy++) {
      let indent = (sy === 0 || sy === h - 1) ? Math.floor(random(2, w * 0.3)) : Math.floor(random(0, 3));
      let sw = w - indent * 2;
      if (sw < 3) sw = 3;
      slices.push({ indent, sw });
    }
    clouds.push({ x, y, w, h, slices });
    x += w + Math.floor(random(20, 60));
  }
}

function generateFarBuildings() {
  farBuildings = [];
  let totalW = cols * 3;
  let x = 0;
  while (x < totalW) {
    let w = Math.floor(random(8, 20));
    let h = Math.floor(random(rows * 0.15, rows * 0.35));
    let col = random(FAR_BUILDING_COLORS);
    let hasSpire = random() > 0.7;
    let spireH = hasSpire ? Math.floor(random(4, 10)) : 0;
    farBuildings.push({ x, w, h, col, hasSpire, spireH });
    x += w + Math.floor(random(1, 4));
  }
}

function generateMidBuildings() {
  midBuildings = [];
  let totalW = cols * 3;
  let x = 0;
  while (x < totalW) {
    let w = Math.floor(random(10, 28));
    let h = Math.floor(random(rows * 0.2, rows * 0.45));
    let col = random(MID_BUILDING_COLORS);
    let winCols = Math.floor((w - 2) / 3);
    let winRows = Math.floor((h - 4) / 4);
    let windows = [];
    for (let wy = 0; wy < winRows; wy++) {
      let row = [];
      for (let wx = 0; wx < winCols; wx++) {
        let r = random();
        row.push(r < 0.35 ? 'on' : (r < 0.55 ? 'dim' : 'off'));
      }
      windows.push(row);
    }
    let roofType = random() < 0.4 ? 'flat' : (random() < 0.5 ? 'antenna' : 'watertower');
    midBuildings.push({ x, w, h, col, winCols, winRows, windows, roofType });
    x += w + Math.floor(random(2, 6));
  }
}

function generateNearBuildings() {
  nearBuildings = [];
  let totalW = cols * 3;
  let x = 0;
  while (x < totalW) {
    let w = Math.floor(random(14, 35));
    let h = Math.floor(random(rows * 0.28, rows * 0.55));
    let col = random(NEAR_BUILDING_COLORS);
    let winCols = Math.floor((w - 3) / 4);
    let winRows = Math.floor((h - 6) / 5);
    let windows = [];
    for (let wy = 0; wy < winRows; wy++) {
      let row = [];
      for (let wx = 0; wx < winCols; wx++) {
        let r = random();
        row.push(r < 0.4 ? 'on' : (r < 0.6 ? 'dim' : 'off'));
      }
      windows.push(row);
    }
    let hasFireEscape = random() > 0.6;
    let roofType = random() < 0.3 ? 'flat' : (random() < 0.5 ? 'antenna' : 'watertower');
    nearBuildings.push({
      x, w, h, col, winCols, winRows, windows,
      hasFireEscape, roofType
    });
    x += w + Math.floor(random(1, 4));
  }
}

function generateStreetProps() {
  streetProps = [];
  let totalW = cols * 3;
  let x = 0;
  while (x < totalW) {
    let kind = random(['lamppost', 'tree', 'bench', 'mailbox', 'trashcan', 'phonebooth']);
    streetProps.push({ x, kind });
    x += Math.floor(random(15, 35));
  }
}

function generateFGElements() {
  fgElements = [];
  let totalW = cols * 3;
  let x = 0;
  while (x < totalW) {
    let kind = random(['pole', 'fence', 'hydrant']);
    let h = kind === 'pole' ? Math.floor(random(rows * 0.3, rows * 0.6)) : 0;
    fgElements.push({ x, kind, h });
    x += Math.floor(random(kind === 'fence' ? 8 : 25, kind === 'fence' ? 12 : 50));
  }
}

// ============================================================
// LAYER DRAWING FUNCTIONS
// ============================================================

// ---- SKY (static) ----

function drawSky(buf) {
  let bandH = Math.ceil(rows / SKY_BANDS.length);
  for (let i = 0; i < SKY_BANDS.length; i++) {
    buf.fill(SKY_BANDS[i]);
    buf.rect(0, i * bandH, cols, bandH + 1);
  }
  for (let s of stars) {
    let brightness = Math.sin(frameCount * s.blink + s.phase);
    if (brightness > 0.3) {
      buf.fill(255, 255, 255, Math.floor(map(brightness, 0.3, 1, 60, 220)));
      buf.rect(s.x, s.y, 1, 1);
    }
  }
  // sun
  let sunR = Math.floor(rows * 0.08);
  let sunX = Math.floor(cols * 0.65);
  let sunY = Math.floor(rows * 0.55);
  buf.fill(SUN_GLOW);
  for (let dy = -(sunR + 2); dy <= sunR + 2; dy++) {
    let hw = Math.floor(Math.sqrt(Math.max(0, (sunR + 2) * (sunR + 2) - dy * dy)));
    buf.rect(sunX - hw, sunY + dy, hw * 2, 1);
  }
  buf.fill(SUN_COLOR);
  for (let dy = -sunR; dy <= sunR; dy++) {
    let hw = Math.floor(Math.sqrt(Math.max(0, sunR * sunR - dy * dy)));
    buf.rect(sunX - hw, sunY + dy, hw * 2, 1);
  }
  buf.fill(249, 199, 79, 170);
  for (let dy = -sunR; dy <= sunR; dy += 3) {
    let hw = Math.floor(Math.sqrt(Math.max(0, sunR * sunR - dy * dy)));
    if (hw > 0) buf.rect(sunX - hw, sunY + dy, hw * 2, 1);
  }
}

// ---- CLOUDS ----

function drawClouds(buf, intOffset) {
  buf.clear();
  let wrapW = cols * 4;
  for (let c of clouds) {
    let cx = ((c.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.5;
    if (cx + c.w < -5 || cx > cols + 5) continue;
    for (let sy = 0; sy < c.h; sy++) {
      let sl = c.slices[sy];
      buf.fill(255, 255, 255, 30);
      buf.rect(cx + sl.indent, c.y + sy, sl.sw, 1);
    }
  }
}

// ---- FAR SKYLINE ----

function drawFarSkyline(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.68);
  let wrapW = cols * 3;
  for (let b of farBuildings) {
    let bx = ((b.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.5;
    if (bx + b.w < -2 || bx > cols + 2) continue;
    let by = groundY - b.h;
    buf.fill(b.col);
    buf.rect(bx, by, b.w, b.h + (rows - groundY));
    if (b.hasSpire) {
      let sx = bx + Math.floor(b.w / 2);
      buf.fill(b.col);
      buf.rect(sx, by - b.spireH, 1, b.spireH);
      if (Math.sin(frameCount * 0.015 + b.x) > 0.3) {
        buf.fill('#ff3344');
        buf.rect(sx, by - b.spireH, 1, 1);
      }
    }
  }
}

// ---- MID BUILDINGS ----

function drawMidBuildings(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.72);
  let wrapW = cols * 3;
  for (let b of midBuildings) {
    let bx = ((b.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.5;
    if (bx + b.w < -2 || bx > cols + 2) continue;
    let by = groundY - b.h;
    buf.fill(b.col);
    buf.rect(bx, by, b.w, b.h + (rows - groundY));

    if (b.roofType === 'antenna') {
      let ax = bx + Math.floor(b.w * 0.3);
      buf.fill(b.col); buf.rect(ax, by - 6, 1, 6);
      if (Math.sin(frameCount * 0.02 + b.x * 0.5) > 0.2) {
        buf.fill('#ff5555'); buf.rect(ax, by - 6, 1, 1);
      }
    } else if (b.roofType === 'watertower') {
      let wtx = bx + Math.floor(b.w * 0.5) - 2;
      buf.fill('#2a1845'); buf.rect(wtx, by - 4, 1, 4); buf.rect(wtx + 3, by - 4, 1, 4);
      buf.fill('#3d2562'); buf.rect(wtx - 1, by - 7, 6, 3);
    }

    let wx0 = bx + 2, wy0 = by + 3;
    for (let wy = 0; wy < b.winRows; wy++) {
      for (let wx = 0; wx < b.winCols; wx++) {
        let st = b.windows[wy][wx];
        let flickering = st === 'on' && Math.sin(frameCount * 0.03 + b.x + wx * 7 + wy * 13) > 0.95;
        buf.fill((st === 'on' && !flickering) ? WINDOW_ON : (st === 'dim' ? WINDOW_DIM : WINDOW_OFF_MID));
        buf.rect(wx0 + wx * 3, wy0 + wy * 4, 2, 2);
      }
    }
  }
}

// ---- NEAR BUILDINGS ----

function drawNearBuildings(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.76);
  let wrapW = cols * 3;

  for (let b of nearBuildings) {
    let bx = ((b.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.5;
    if (bx + b.w < -5 || bx > cols + 5) continue;
    let by = groundY - b.h;

    // main body
    buf.fill(b.col);
    buf.rect(bx, by, b.w, b.h + (rows - groundY));

    // slightly lighter edge highlight (left side)
    buf.fill(255, 255, 255, 15);
    buf.rect(bx, by, 1, b.h);

    // roof details
    if (b.roofType === 'antenna') {
      let ax = bx + Math.floor(b.w * 0.4);
      buf.fill(b.col); buf.rect(ax, by - 5, 1, 5);
      if (Math.sin(frameCount * 0.02 + b.x * 0.7) > 0.3) {
        buf.fill('#ff4444'); buf.rect(ax, by - 5, 1, 1);
      }
    } else if (b.roofType === 'watertower') {
      let wtx = bx + Math.floor(b.w * 0.6) - 2;
      buf.fill('#3a1e5c'); buf.rect(wtx, by - 4, 1, 4); buf.rect(wtx + 4, by - 4, 1, 4);
      buf.fill('#503282'); buf.rect(wtx - 1, by - 7, 7, 3);
    }

    // fire escape
    if (b.hasFireEscape) {
      let fex = bx + b.w - 4;
      for (let fy = by + 5; fy < groundY - 5; fy += 8) {
        buf.fill('#2a1845');
        buf.rect(fex, fy, 3, 1);       // platform
        buf.rect(fex + 2, fy, 1, 8);   // ladder
      }
    }

    // windows (bigger for near layer)
    let wx0 = bx + 3, wy0 = by + 4;
    for (let wy = 0; wy < b.winRows; wy++) {
      for (let wx = 0; wx < b.winCols; wx++) {
        let st = b.windows[wy][wx];
        let flickering = st === 'on' && Math.sin(frameCount * 0.025 + b.x + wx * 11 + wy * 17) > 0.96;
        buf.fill((st === 'on' && !flickering) ? WINDOW_ON : (st === 'dim' ? WINDOW_DIM : WINDOW_OFF_NEAR));
        buf.rect(wx0 + wx * 4, wy0 + wy * 5, 2, 3);
      }
    }
  }
}

// ---- GROUND / ROAD ----

function drawGroundLayer(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.76);

  // sidewalk
  buf.fill('#2d1b50');
  buf.rect(0, groundY, cols, 3);

  // curb
  buf.fill('#3a2568');
  buf.rect(0, groundY + 3, cols, 1);

  // road
  buf.fill('#1a0a2e');
  buf.rect(0, groundY + 4, cols, rows - groundY - 4);

  // road center line dashes
  let dashY = groundY + 4 + Math.floor((rows - groundY - 4) * 0.45);
  buf.fill('#3a2568');
  for (let dx = 0; dx < cols + 20; dx += 12) {
    let ddx = ((dx - intOffset) % (cols + 20) + (cols + 20)) % (cols + 20) - 10;
    buf.rect(ddx, dashY, 6, 1);
  }

  // subtle road texture
  buf.fill('#1f0e35');
  for (let dx = 0; dx < cols + 10; dx += 7) {
    let ddx = ((dx - intOffset * 2) % (cols + 10) + (cols + 10)) % (cols + 10) - 5;
    buf.rect(ddx, groundY + 6, 1, 1);
  }
}

// ---- STREET PROPS (lampposts, trees, benches, etc.) ----

function drawStreetProps(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.76);
  let wrapW = cols * 3;

  for (let p of streetProps) {
    let px = ((p.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.3;
    if (px < -10 || px > cols + 10) continue;

    if (p.kind === 'lamppost') {
      buf.fill('#2a1845');
      buf.rect(px, groundY - 18, 1, 18);
      buf.rect(px - 2, groundY - 18, 5, 1);
      buf.fill('#fce38a');
      buf.rect(px - 1, groundY - 17, 1, 1);
      buf.rect(px + 1, groundY - 17, 1, 1);
      buf.fill(252, 227, 138, 35);
      buf.rect(px - 3, groundY - 19, 7, 4);

    } else if (p.kind === 'tree') {
      buf.fill('#3a1e2a');
      buf.rect(px, groundY - 8, 2, 8);
      buf.fill('#2d4a1e');
      buf.rect(px - 3, groundY - 14, 8, 4);
      buf.rect(px - 2, groundY - 16, 6, 2);
      buf.rect(px - 1, groundY - 17, 4, 1);
      buf.fill('#3d6428');
      buf.rect(px - 2, groundY - 15, 3, 2);

    } else if (p.kind === 'bench') {
      buf.fill('#4a3060');
      buf.rect(px, groundY - 3, 6, 1);
      buf.rect(px, groundY - 4, 1, 1);
      buf.rect(px + 5, groundY - 4, 1, 1);
      buf.rect(px, groundY - 2, 1, 2);
      buf.rect(px + 5, groundY - 2, 1, 2);

    } else if (p.kind === 'mailbox') {
      buf.fill('#3040a0');
      buf.rect(px, groundY - 5, 4, 5);
      buf.fill('#253588');
      buf.rect(px, groundY - 6, 4, 1);
      buf.fill('#1a1a4a');
      buf.rect(px + 1, groundY - 4, 2, 1);

    } else if (p.kind === 'trashcan') {
      buf.fill('#3a3a3a');
      buf.rect(px, groundY - 4, 3, 4);
      buf.fill('#4a4a4a');
      buf.rect(px - 1, groundY - 5, 5, 1);

    } else if (p.kind === 'phonebooth') {
      buf.fill('#8b3a3a');
      buf.rect(px, groundY - 10, 5, 10);
      buf.fill('#5c2d91');
      buf.rect(px + 1, groundY - 9, 3, 7);
      buf.fill(252, 227, 138, 50);
      buf.rect(px + 1, groundY - 9, 3, 7);
    }
  }
}

// ---- FOREGROUND (poles, fence sections, hydrants) ----

function drawForeground(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.76);
  let bottomY = rows;
  let wrapW = cols * 3;

  for (let f of fgElements) {
    let fx = ((f.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.3;
    if (fx < -10 || fx > cols + 10) continue;

    if (f.kind === 'pole') {
      buf.fill('#1a0a1e');
      buf.rect(fx, bottomY - f.h, 2, f.h);
      let crossY = bottomY - f.h + 3;
      buf.rect(fx - 3, crossY, 8, 1);
      buf.fill('#1a0a1e');
      buf.rect(fx + 5, crossY, 1, 1);
      buf.rect(fx + 6, crossY + 1, 1, 1);

    } else if (f.kind === 'fence') {
      buf.fill('#1f0f28');
      buf.rect(fx, groundY + 2, 1, 8);
      buf.fill(30, 15, 40, 180);
      buf.rect(fx, groundY + 3, 8, 1);
      buf.rect(fx, groundY + 7, 8, 1);
      buf.fill(30, 15, 40, 100);
      for (let cx = 0; cx < 8; cx += 2) {
        buf.rect(fx + cx, groundY + 4, 1, 1);
        buf.rect(fx + cx + 1, groundY + 5, 1, 1);
        buf.rect(fx + cx, groundY + 6, 1, 1);
      }

    } else if (f.kind === 'hydrant') {
      buf.fill('#c0476e');
      buf.rect(fx, groundY + 1, 3, 4);
      buf.fill('#e8654a');
      buf.rect(fx - 1, groundY + 2, 5, 1);
      buf.rect(fx, groundY, 3, 1);
    }
  }
}

// ============================================================
// MAIN DRAW
// ============================================================

function draw() {
  scrollX += SCROLL_SPEED;

  // Per-layer scroll (floating point)
  let cloudScroll  = scrollX * CLOUD_SPEED;
  let farScroll    = scrollX * FAR_SPEED;
  let midScroll    = scrollX * MID_SPEED;
  let nearScroll   = scrollX * NEAR_SPEED;
  let groundScroll = scrollX * GROUND_SPEED;
  let propsScroll  = scrollX * PROPS_SPEED;
  let fgScroll     = scrollX * FG_SPEED;

  // Split into int + frac for sub-pixel compositing
  let cloudInt  = Math.floor(cloudScroll),  cloudFrac  = cloudScroll  - cloudInt;
  let farInt    = Math.floor(farScroll),    farFrac    = farScroll    - farInt;
  let midInt    = Math.floor(midScroll),    midFrac    = midScroll    - midInt;
  let nearInt   = Math.floor(nearScroll),   nearFrac   = nearScroll   - nearInt;
  let gndInt    = Math.floor(groundScroll), gndFrac    = groundScroll - gndInt;
  let propsInt  = Math.floor(propsScroll),  propsFrac  = propsScroll  - propsInt;
  let fgInt     = Math.floor(fgScroll),     fgFrac     = fgScroll     - fgInt;

  // Draw each layer
  drawSky(bufSky);
  drawClouds(bufClouds, cloudInt);
  drawFarSkyline(bufFar, farInt);
  drawMidBuildings(bufMid, midInt);
  drawNearBuildings(bufNear, nearInt);
  drawGroundLayer(bufGround, gndInt);
  drawStreetProps(bufProps, propsInt);
  drawForeground(bufFG, fgInt);

  // Composite with sub-pixel offsets
  background(0);
  image(bufSky,    0,                    0, W,          H);
  image(bufClouds, -cloudFrac * PIXEL,   0, W + PIXEL,  H);
  image(bufFar,    -farFrac   * PIXEL,   0, W + PIXEL,  H);
  image(bufMid,    -midFrac   * PIXEL,   0, W + PIXEL,  H);
  image(bufNear,   -nearFrac  * PIXEL,   0, W + PIXEL,  H);
  image(bufGround, -gndFrac   * PIXEL,   0, W + PIXEL,  H);
  image(bufProps,  -propsFrac * PIXEL,   0, W + PIXEL,  H);
  image(bufFG,     -fgFrac    * PIXEL,   0, W + PIXEL,  H);
}

// ---- RESIZE ----

function windowResized() {
  W = windowWidth;
  H = windowHeight;
  resizeCanvas(W, H);
  cols = Math.ceil(W / PIXEL) + 2;
  rows = Math.ceil(H / PIXEL);
  createBuffers();
  generateAll();
}
