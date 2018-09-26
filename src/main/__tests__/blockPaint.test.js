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

import {
  Block,
  Grid,
  AppCanvas
} from '../blockPaint';

describe('Block class tests', () => {
  test('should create a Block object with defaults', () => {
    const block = new Block();
    expect(block.blockX).toBe(0);
    expect(block.blockY).toBe(0);
    expect(block.colorIndex).toBe(0);
    expect(block.toHashKey()).toBe('Block_0_0');
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const testDict = {
        [block.toHashKey()]: block
      };
    }).not.toThrow(SyntaxError);
  });

  test('should increment colorIndex', () => {
    const block = new Block();
    expect(block.colorIndex).toBe(0);
    block.nextColor();
    expect(block.colorIndex).toBe(1);
  });

  test('should draw a block on the canvas', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 500;
    controlCanvas.height = 250;
    const controlCtx = controlCanvas.getContext('2d');
    controlCtx.fillStyle = 'tomato';
    controlCtx.fillRect(100, 200, 100, 100);

    const testCanvas = document.createElement('CANVAS');
    testCanvas.width = 500;
    testCanvas.height = 250;
    const testCtx = testCanvas.getContext('2d');

    const mockColorPalette = {
      palette: ['black', 'tomato'],
      getColor: function getColorAtIndex(i) {
        return this.palette[i];
      }
    };

    const block = new Block(1, 2, 1);
    block.render(testCtx, 100, mockColorPalette);

    expect(testCanvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });

  test('should draw a block on the canvas with an offset', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 500;
    controlCanvas.height = 250;
    const controlCtx = controlCanvas.getContext('2d');
    controlCtx.fillStyle = 'silver';
    controlCtx.fillRect(120, 213, 100, 100);

    const testCanvas = document.createElement('CANVAS');
    testCanvas.width = 500;
    testCanvas.height = 250;
    const testCtx = testCanvas.getContext('2d');

    const mockColorPalette = {
      palette: ['black', 'silver'],
      getColor: function getColorAtIndex(i) {
        return this.palette[i];
      }
    };

    const block = new Block(1, 2);
    block.nextColor();
    block.render(testCtx, 100, mockColorPalette, { x: 20, y: 13 });

    expect(testCanvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });

  test('should gracefully handle off-canvas draws', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 500;
    controlCanvas.height = 250;

    const testCanvas = document.createElement('CANVAS');
    testCanvas.width = 500;
    testCanvas.height = 250;
    const testCtx = testCanvas.getContext('2d');

    const mockColorPalette = {
      palette: ['black', 'tomato'],
      getColor: function getColorAtIndex(i) {
        return this.palette[i];
      }
    };

    const block = new Block(7, 2);
    block.render(testCtx, 100, mockColorPalette);

    expect(testCanvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });
});

describe('Grid class tests', () => {
  test('should create grid object', () => {
    const grid = new Grid();
    expect(grid.hide).toBe(false);
  });

  test('should draw a grid on render', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 50;
    controlCanvas.height = 50;
    const controlCtx = controlCanvas.getContext('2d');
    controlCtx.lineWidth = 2;
    controlCtx.beginPath();
    controlCtx.moveTo(0, 0);
    controlCtx.lineTo(0, 50);
    controlCtx.moveTo(25, 0);
    controlCtx.lineTo(25, 50);
    controlCtx.moveTo(50, 0);
    controlCtx.lineTo(50, 50);
    controlCtx.moveTo(0, 0);
    controlCtx.lineTo(50, 0);
    controlCtx.moveTo(0, 25);
    controlCtx.lineTo(50, 25);
    controlCtx.moveTo(0, 50);
    controlCtx.lineTo(50, 50);
    controlCtx.stroke();

    const canvas = document.createElement('CANVAS');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');

    const grid = new Grid();

    grid.render(ctx, 25, canvas.width, canvas.height);
    expect(canvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });

  test('should not draw a grid when hideFlag is on', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 100;
    controlCanvas.height = 100;

    const canvas = document.createElement('CANVAS');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    const grid = new Grid();
    grid.toggleHide();

    grid.render(ctx, 10, canvas.width, canvas.height, { x: 4, y: 7 });
    expect(canvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });
});

describe('AppCanvas class tests', () => {
  test('should create AppCanvas object', () => {
    const appCanvas = new AppCanvas();
    expect(appCanvas.blockSize).toBe(100);
    expect(appCanvas.offset).toEqual({ x: 0, y: 0 });
    expect(appCanvas.canvas).toBeDefined();
  });

  test('should toggle the hide flag on its grid', () => {
    throw Error('Not implemented!');
    const appCanvas = new AppCanvas();
    // Spy Grid class...
    appCanvas.toggleGrid();
    // Expect Grid.toggleHide to be called.
  });

  test('should clear the canvas and then render the grid followed by the blocks', () => {
    throw Error('Not implemented!');
    const appCanvas = new AppCanvas(50);
    // Add some blocks
    // Spy grid and block renders. Grid.render once, block render times the number of blocks.
    appCanvas.render();
  });

  test('should correctly resize and render the canvas', () => {
    throw Error('Not implemented!');
    // reset the size.
    // verify the canvas size
    // verify render was called (mock function)
  });

  test('should zoom in by increasing the block size and re-rendering', () => {
    throw Error('Not implemented!');
  });

  test('should zoom out by decreasing the block size and re-rendering', () => {
    throw Error('Not implemented!');
  });

  test('should pan the canvas left 13 pixels and up 4', () => {
    throw Error('Not implemented!');
  });
});
