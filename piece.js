// Piezas del tangram como jerarquía de clases ES6.
// Cada pieza es un polígono definido por vértices en coordenadas locales;
// el dibujado, la detección de clics (hit-testing geométrico), el arrastre
// y la exportación viven en la clase base. Las subclases solo definen
// su forma (vértices) y, si hace falta, comportamiento extra.

class Piece {
  constructor(id, spawnArea) {
    this._id = id;
    this._spawnArea = spawnArea;
    this._position = createVector();
    this._rotation = 0;
    this._color = color('red');
  }

  get id() {
    return this._id;
  }

  get position() {
    return this._position;
  }

  set position(position) {
    this._position = position;
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(rotation) {
    this._rotation = rotation;
  }

  // Vértices del polígono en coordenadas locales. Cada subclase los define.
  vertices() {
    throw new Error(`${this._id}: vertices() no implementado`);
  }

  randomize() {
    const area = this._spawnArea;
    this._position = createVector(
      random(area.xMin, area.xMax),
      random(area.yMin, area.yMax)
    );
    this._rotation = 15 * round(random(0, 25));
    // Máximo 254 para que ninguna pieza tenga canales en 255: la detección
    // de victoria cuenta píxeles blancos (255) de las siluetas.
    this._color = color(random(0, 254), random(0, 254), random(0, 254));
  }

  rotateBy(degrees) {
    this._rotation += degrees;
  }

  moveBy(dx, dy) {
    this._position.x += dx;
    this._position.y += dy;
  }

  display(selected) {
    push();
    translate(this._position.x, this._position.y);
    rotate(this._rotation);
    scale(SCALING);
    fill(this._color);
    if (selected) {
      // 250 y no 255: visible como resaltado pero invisible para el
      // conteo de píxeles blancos que decide si el nivel está resuelto.
      stroke(250);
      strokeWeight(3 / SCALING);
    } else {
      stroke(0);
      strokeWeight(1 / SCALING);
    }
    this._drawPolygon(this.vertices());
    pop();
  }

  // Dibuja la silueta blanca del nivel usando los datos del JSON
  // ({position, rotation, rever?}).
  displaySilhouette(data) {
    push();
    translate(data.position[0], data.position[1]);
    rotate(data.rotation[0]);
    scale(SCALING);
    fill(255);
    stroke(255);
    this._drawPolygon(this.silhouetteVertices(data));
    pop();
  }

  silhouetteVertices(_data) {
    return this.vertices();
  }

  _drawPolygon(vertices_) {
    beginShape();
    for (const v of vertices_) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }

  // Hit-testing geométrico: lleva el punto a coordenadas locales
  // (deshace traslación, rotación y escala) y comprueba si cae
  // dentro del polígono. No depende del color en pantalla.
  contains(x, y) {
    const dx = x - this._position.x;
    const dy = y - this._position.y;
    const c = cos(this._rotation);
    const s = sin(this._rotation);
    const localX = (dx * c + dy * s) / SCALING;
    const localY = (-dx * s + dy * c) / SCALING;
    return Piece.pointInPolygon(localX, localY, this.vertices());
  }

  export() {
    return {
      id: this._id,
      position: [this._position.x, this._position.y],
      rotation: [this._rotation],
    };
  }

  // Algoritmo de ray casting: cuenta cuántos lados cruza un rayo
  // horizontal que sale del punto; impar = dentro.
  static pointInPolygon(px, py, vertices_) {
    let inside = false;
    for (let i = 0, j = vertices_.length - 1; i < vertices_.length; j = i++) {
      const a = vertices_[i];
      const b = vertices_[j];
      const crosses =
        a.y > py !== b.y > py &&
        px < ((b.x - a.x) * (py - a.y)) / (b.y - a.y) + a.x;
      if (crosses) {
        inside = !inside;
      }
    }
    return inside;
  }
}

class Square extends Piece {
  constructor(id, edge, spawnArea) {
    super(id, spawnArea);
    this._edge = edge;
  }

  vertices() {
    const h = this._edge / 2;
    return [
      { x: -h, y: -h },
      { x: h, y: -h },
      { x: h, y: h },
      { x: -h, y: h },
    ];
  }
}

// Triángulo isósceles con la base arriba y el ápice abajo. Los tres
// tamaños del tangram (grande, mediano, pequeño) comparten esta forma
// y solo cambian sus dimensiones.
class Triangle extends Piece {
  constructor(id, halfBase, halfHeight, spawnArea) {
    super(id, spawnArea);
    this._halfBase = halfBase;
    this._halfHeight = halfHeight;
  }

  vertices() {
    return [
      { x: 0, y: this._halfHeight },
      { x: this._halfBase, y: -this._halfHeight },
      { x: -this._halfBase, y: -this._halfHeight },
    ];
  }
}

class Parallelogram extends Piece {
  constructor(id, unit, spawnArea) {
    super(id, spawnArea);
    this._unit = unit;
    this._reversed = false;
  }

  get reversed() {
    return this._reversed;
  }

  reverse() {
    this._reversed = !this._reversed;
  }

  vertices() {
    return this.verticesFor(this._reversed);
  }

  verticesFor(reversed) {
    const u = this._unit;
    const base = [
      { x: -u / 8, y: -u / 8 },
      { x: (6 * u) / 16, y: -u / 8 },
      { x: u / 8, y: u / 8 },
      { x: (-6 * u) / 16, y: u / 8 },
    ];
    return reversed ? base.map((v) => ({ x: -v.x, y: v.y })) : base;
  }

  // La silueta respeta el estado espejado guardado en el nivel.
  silhouetteVertices(data) {
    return this.verticesFor(Boolean(data.rever));
  }

  export() {
    return { ...super.export(), rever: this._reversed };
  }
}
