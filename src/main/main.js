/**
 * Copyright © 2018 William Wager
 *
 *    This file is part of Block Paint.
 *
 *    Block Paint is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    any later version.
 *
 *    Block Paint is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with Block Paint.  If not, see <https://www.gnu.org/licenses/>.
 */

const LineOrientation = Object.freeze({
  VERTICAL: 0,
  HORIZONTAL: 1,
  isLineOrientation: function checkType(type) {
    switch (type) {
      case this.VERTICAL:
      case this.HORIZONTAL:
        return true;
      default:
        return false;
    }
  }
});

class Line {
  constructor(orientation, linePosition) {
    if (!LineOrientation.isLineOrientation(orientation)) {
      throw new TypeError('orientation must be a LineOrientation!');
    }
    const parsedLinePostition = Number.parseInt(linePosition, 10);
    if (Number.isNaN(parsedLinePostition)) {
      throw new TypeError('linePosition must be a number!');
    }
    this.orientation = orientation;
    this.linePosition = linePosition;
  }

  render(canvas, ctx) {
    ctx.beginPath();
    if (this.orientation === LineOrientation.VERTICAL) {
      ctx.moveTo(this.linePosition, 0);
      ctx.lineTo(this.linePosition, canvas.height);
    } else {
      ctx.moveTo(0, this.linePosition);
      ctx.lineTo(canvas.width, this.linePosition);
    }
    ctx.stroke();
  }
}

class Block {
  constructor(x, y, edgeLength, color = 'black') {
    const parsedX = Number.parseInt(x, 10);
    const parsedY = Number.parseInt(y, 10);
    const parsedEdgeLength = Number.parseInt(edgeLength, 10);
    if (Number.isNaN(parsedX) || Number.isNaN(parsedY) || Number.isNaN(parsedEdgeLength)) {
      throw new TypeError('x, y, and edgeLength must be numbers!');
    }
    this.x = parsedX;
    this.y = parsedY;
    this.edgeLength = parsedEdgeLength;
    this.color = color;
  }

  render(ctx) {
    if (this.edgeLength === 0) {
      return;
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.edgeLength, this.edgeLength);
  }
}

// // This may not be necessary in this file.
// const App = {
//   init: function initializeApp() {
//     // TODO
//   },
//   resize: function resizeMainCanvas() {
//     // TODO
//   },
//   settings: function showSettingsMenu() {
//     // TODO
//   },
//   website: function showPersonalWebsiteLink() {
//     // TODO
//   }
// };

export { LineOrientation, Line, Block };
