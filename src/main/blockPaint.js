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
    return Block.getHashKey(this.blockX, this.blockY);
  }

  static getHashKey(blockX, blockY) {
    let x = blockX;
    let y = blockY;
    if (x < 0) {
      x = `n${Math.abs(x)}`;
    }
    if (y < 0) {
      y = `n${Math.abs(y)}`;
    }
    return `Block_${x}_${y}`;
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
    // Event Handlers.
    this.resizeHandler = this.resize.bind(this);
    this.zoomHandlers = {
      in: this.zoomIn.bind(this),
      out: this.zoomOut.bind(this)
    };
    this.colorPaletteHandlers = {
      overflowFold: this.colorPaletteOverflowFold.bind(this),
      overflowClear: this.colorPaletteOverflowClear.bind(this)
    };
    // Canvas event handlers.
    this.canvas.ondragstart = this.startPan.bind(this);
    this.canvas.ondrag = this.pan.bind(this);
    this.canvas.onclick = this.paintBlock.bind(this);
  }

  toggleGrid() {
    this.grid.toggleHide();
  }

  render() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.translate(0.5, 0.5);
    this.grid.render(ctx, this.blockSize, this.canvas.width, this.canvas.height, this.offset);
    Object.values(this.blocks).forEach(
      block => block.render(ctx, this.blockSize, this.colorPalette, this.offset)
    );
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.render();
  }

  zoomIn() {
    this.blockSize = Math.ceil(this.blockSize * 2);
    this.render();
  }

  zoomOut() {
    this.blockSize = Math.ceil(this.blockSize / 2);
    this.render();
  }

  startPan(event) {
    this.dragCheckpointX = event.clientX;
    this.dragCheckpointY = event.clientY;
  }

  pan(event) {
    this.offset.x += (event.clientX - this.dragCheckpointX);
    this.offset.y += (event.clientY - this.dragCheckpointY);
    this.dragCheckpointX = event.clientX;
    this.dragCheckpointY = event.clientY;
    let moveX = 0;
    let moveY = 0;
    if (this.offset.x >= this.blockSize) {
      moveX = 1;
      this.offset.x %= this.blockSize;
    } else if (this.offset.x <= (0 - this.blockSize)) {
      moveX = -1;
      this.offset.x %= this.blockSize;
    }
    if (this.offset.y >= this.blockSize) {
      moveY = 1;
      this.offset.y %= this.blockSize;
    } else if (this.offset.y <= (0 - this.blockSize)) {
      moveY = -1;
      this.offset.y %= this.blockSize;
    }
    if (moveX !== 0 || moveY !== 0) {
      const newBlocks = {};
      Object.values(this.blocks).forEach(
        (block) => {
          block.blockX += moveX;
          block.blockY += moveY;
          newBlocks[`${block.toHashKey()}`] = block;
        }
      );
      this.blocks = newBlocks;
    }
    this.render();
  }

  paintBlock(event) {
    const coordX = Math.floor(event.clientX / this.blockSize);
    const coordY = Math.floor(event.clientY / this.blockSize);
    let block = this.blocks[`${Block.getHashKey(coordX, coordY)}`];
    if (block) {
      block.nextColor();
      if (block.colorIndex >= this.colorPalette.length) {
        delete this.blocks[`${block.toHashKey()}`];
        this.render();
        return;
      }
    } else {
      block = new Block(coordX, coordY);
      this.blocks[`${block.toHashKey()}`] = block;
    }
    const ctx = this.canvas.getContext('2d');
    ctx.translate(0.5, 0.5);
    block.render(ctx, this.blockSize, this.colorPalette, this.offset);
  }

  colorPaletteOverflowFold() {
    Object.values(this.blocks).forEach(
      (block) => {
        block.colorIndex %= (this.colorPalette.length + 1);
        if (block.colorIndex === this.colorPalette.length) {
          delete this.blocks[`${block.toHashKey()}`];
        }
      }
    );
    this.render();
  }

  colorPaletteOverflowClear() {
    Object.values(this.blocks).forEach(
      (block) => {
        if (block.colorIndex >= this.colorPalette.length) {
          delete this.blocks[`${block.toHashKey()}`];
        }
      }
    );
    this.render();
  }
}

export {
  Block,
  Grid,
  AppCanvas
};
