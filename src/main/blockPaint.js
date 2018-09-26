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

import ColorPalette from './colorPalette';

class Block {
  constructor(blockX = 0, blockY = 0, colorIndex = 0) {
    this.blockX = blockX;
    this.blockY = blockY;
    this.colorIndex = colorIndex;
  }

  /* The colorIndex cannot be decreased. The block should be deleted when it rolls over.
   * This corresponds to cycling back to the default (canvas background) color.
   */
  nextColor() {
    this.colorIndex += 1;
  }

  toHashKey() {
    return `Block_${this.blockX}_${this.blockY}`;
  }

  render(ctx, blockSize, colorPalette, offset = { x: 0, y: 0 }) {
    const absoluteX = this.blockX * blockSize + offset.x;
    const absoluteY = this.blockY * blockSize + offset.y;
    ctx.fillStyle = colorPalette.getColor(this.colorIndex); // getColor will handle overflows.
    ctx.fillRect(absoluteX, absoluteY, blockSize, blockSize);
  }
}

/*
 * The cost of a separate mutable palette requires that block data may change when the color palette
 * changes. All blocks with colorIndexes above the color palette size will be rolled over into the
 * new color palette. The user must be adequately informed of this before color palette changes are
 * pushed and they must be allowed to save their existing canvas to recover later.
 *
 */

class Grid {
  constructor() {
    this.hide = false;
  }

  toggleHide() {
    this.hide = !this.hide;
  }

  render(ctx, blockSize, canvasWidth, canvasHeight, offset = { x: 0, y: 0 }) {
    if (this.hide) return;
    // Set width to 2 to decrease anti-aliasing effects.
    ctx.lineWidth = 2;
    // Draw a poly-line for performance.
    ctx.beginPath();
    let numLines = Math.floor(canvasWidth / blockSize);
    for (let x = 0; x <= numLines; x += 1) {
      const pixelPosition = x * blockSize + offset.x;
      ctx.moveTo(pixelPosition, 0);
      ctx.lineTo(pixelPosition, canvasHeight);
    }
    numLines = Math.floor(canvasHeight / blockSize);
    for (let y = 0; y <= numLines; y += 1) {
      const pixelPosition = y * blockSize + offset.y;
      ctx.moveTo(0, pixelPosition);
      ctx.lineTo(canvasWidth, pixelPosition);
    }
    ctx.stroke();
  }
}

class AppCanvas {
  constructor(blockSize = 100, offset = { x: 0, y: 0 }) {
    this.blockSize = blockSize;
    this.offset = offset;
    this.grid = new Grid();
    this.blocks = {};
    this.canvas = document.createElement('CANVAS');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.colorPalette = new ColorPalette();
  }

  toggleGrid() {
    this.grid.toggleHide();
  }

  render() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.grid.render(ctx, this.blockSize, this.canvas.width, this.canvas.height, this.offset);
    this.blocks.values().foreach(
      block => block.render(ctx, this.blockSize, this.colorPalette, this.offset)
    );
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.render();
  }

  // zoomIn() {
  //   this.blockSize = Math.ceil(this.blockSize * 2);
  //   this.grid.updateLines(this.blockSize, this.canvasElement.width, this.canvasElement.height);
  //   this.render();
  // }

  // zoomOut() {
  //   this.blockSize = Math.ceil(this.blockSize / 2);
  //   this.grid.updateLines(this.blockSize, this.canvasElement.width, this.canvasElement.height);
  //   this.render();
  // }

  // pan() {
  //   // this.clientX clientY
  // Don't forget the whole overflow mechanic here.
  // }

  // paintBlock(app) {
  //   const coordinateX = Math.floor(this.clientX / app.blockSize);
  //   const coordinateY = Math.floor(this.clientY / app.blockSize);
  //   const coordinateString = `X${coordinateX}Y${coordinateY}`;
  //   const block = app.gridBlocks[coordinateString]
  //   if (block) {
  //     block.colorIndex += 1;
  //     if (block.colorIndex >= app.colorPalette.paletteSize) {
  //       delete app.gridBlocks[coordinateString];
  //       // unpaint block????
  //     }
  //   } else {
  //     app.gridBlocks[coordinateString] = new GridBlock(app.blockSize, coordinateX, coordinateY);
  //   }
  //   gridBlock.render();
  // }
}

export default class App {
  // setListeners() {
  //   window.addEventListener('resize', this.resize());
  //   this.canvasElement.addEventListener('click', this.paintBlock());
  //   this.canvasElement.addEventListener('drag', this.pan());
  // }

  // save() {
  //   const data = {
  //     blockSize,
  //     // colorPalette,
  //     gridBlocks
  //   };
  //   return JSON.stringify(data);
  // }

  // load(data) {
  //   // { blockSize, gridBlocks } = JSON.parse(data);
  // }
}

export {
  Block,
  Grid,
  AppCanvas
};
