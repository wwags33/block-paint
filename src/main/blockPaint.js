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
    let x = this.blockX;
    let y = this.blockY;
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
    this.zoomInHandler = this.zoomIn.bind(this);
    this.zoomOutHandler = this.zoomOut.bind(this);

    // Pan mechanism.
    const boundPan = this.pan.bind(this);
    const panHandlers = (function panClosure() { // Closure to avoid using that/self.
      let dragCheckpointX = 0;
      let dragCheckpointY = 0;

      function initialDragCheckpointSet(event) {
        dragCheckpointX = event.clientX;
        dragCheckpointY = event.clientY;
      }

      function panAndCheckpointSet(event) {
        boundPan(event.clientX - dragCheckpointX, event.clientY - dragCheckpointY);
        dragCheckpointX = event.clientX;
        dragCheckpointY = event.clientY;
      }

      return {
        startDrag: initialDragCheckpointSet,
        continueDrag: panAndCheckpointSet
      };
    }());

    this.canvas.ondragstart = panHandlers.startDrag;
    this.canvas.ondrag = panHandlers.continueDrag;
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

  // Bind to AppCanvas object in listener.
  zoomIn() {
    this.blockSize = Math.ceil(this.blockSize * 2);
    this.render();
  }

  // Bind to AppCanvas object in listener.
  zoomOut() {
    this.blockSize = Math.ceil(this.blockSize / 2);
    this.render();
  }

  pan(x, y) {
    this.offset.x += x;
    this.offset.y += y;
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
      Object.values(this.blocks).forEach((block) => {
        block.blockX += moveX;
        block.blockY += moveY;
        newBlocks[`${block.toHashKey()}`] = block;
      });
      this.blocks = newBlocks;
    }
    this.render();
  }

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

// export default class App {
//   // setListeners() {
//   //   window.addEventListener('resize', this.resize());
//   //   this.canvasElement.addEventListener('click', this.paintBlock());
//   //   this.canvasElement.addEventListener('drag', this.pan());
//   // }

//   // save() {
//   //   const data = {
//   //     blockSize,
//   //     // colorPalette,
//   //     gridBlocks
//   //   };
//   //   return JSON.stringify(data);
//   // }

//   // load(data) {
//   //   // { blockSize, gridBlocks } = JSON.parse(data);
//   // }
// }

export {
  Block,
  Grid,
  AppCanvas
};
