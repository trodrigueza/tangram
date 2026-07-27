// Botón rectangular con etiqueta y callback. Reemplaza los cinco objetos
// literales del original, que repetían la misma estructura y mezclaban
// la lógica de cada botón dentro de pick().

class Button {
  constructor({ label, x, y, w, h, background, textColor = 255, onPress }) {
    this._label = label;
    this._position = createVector(x, y);
    this._w = w;
    this._h = h;
    this._background = background;
    this._textColor = textColor;
    this._onPress = onPress;
  }

  contains(x, y) {
    return (
      abs(x - this._position.x) <= this._w / 2 &&
      abs(y - this._position.y) <= this._h / 2
    );
  }

  display() {
    const hovered = this.contains(mouseX, mouseY);
    push();
    translate(this._position.x, this._position.y);
    stroke(hovered ? 250 : 0);
    strokeWeight(1);
    fill(this._background);
    rect(0, 0, this._w, this._h);
    noStroke();
    fill(this._textColor);
    textSize(11);
    textFont('Helvetica');
    textAlign(CENTER, CENTER);
    text(this._label, 0, 0);
    pop();
  }

  // Devuelve true si el clic cayó dentro y el botón lo consumió.
  handlePress(x, y) {
    if (this.contains(x, y)) {
      this._onPress();
      return true;
    }
    return false;
  }
}
