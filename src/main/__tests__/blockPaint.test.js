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
    controlCanvas.width = 100;
    controlCanvas.height = 50;
    const controlCtx = controlCanvas.getContext('2d');
    controlCtx.beginPath();
    controlCtx.moveTo(0, 0);
    controlCtx.lineTo(0, 50);
    controlCtx.moveTo(25, 0);
    controlCtx.lineTo(25, 50);
    controlCtx.moveTo(50, 0);
    controlCtx.lineTo(50, 50);
    controlCtx.moveTo(75, 0);
    controlCtx.lineTo(75, 50);
    controlCtx.moveTo(100, 0);
    controlCtx.lineTo(100, 50);
    controlCtx.moveTo(0, 0);
    controlCtx.lineTo(100, 0);
    controlCtx.moveTo(0, 25);
    controlCtx.lineTo(100, 25);
    controlCtx.moveTo(0, 50);
    controlCtx.lineTo(100, 50);
    controlCtx.stroke();

    const canvas = document.createElement('CANVAS');
    canvas.width = 100;
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
    const appCanvas = new AppCanvas();
    // Mock function in grid class...
    const hideGrid = jest.fn();
    appCanvas.grid.toggleHide = hideGrid;

    appCanvas.toggleGrid();
    expect(hideGrid).toBeCalled();
  });

  test('should clear the canvas and then render the grid followed by the blocks', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = window.innerWidth;
    controlCanvas.height = window.innerHeight;
    const controlCtx = controlCanvas.getContext('2d');
    controlCtx.translate(0.5, 0.5);

    const appCanvas = new AppCanvas(50);

    // Mock grid render.
    const mockGridRender = jest.fn().mockName('mockGridRender');
    appCanvas.grid.render = mockGridRender;

    // Partially mocking some blocks.
    const mockBlockRender = jest.fn().mockName('mockBlockRender');
    let block;
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        block = new Block(i, j);
        block.render = mockBlockRender;
        appCanvas.blocks[`${block.toHashKey()}`] = block;
      }
    }

    appCanvas.render();
    expect(appCanvas.canvas.toDataURL()).toBe(controlCanvas.toDataURL());
    expect(mockGridRender).toBeCalled();
    expect(mockBlockRender.mock.calls).toHaveLength(100);
  });

  test('should correctly resize and render the canvas', () => {
    const mockAppCanvasRender = jest.fn();
    const appCanvas = new AppCanvas(100);
    appCanvas.render = mockAppCanvasRender;

    expect(appCanvas.canvas.width).toBe(window.innerWidth);
    expect(appCanvas.canvas.height).toBe(window.innerHeight);

    window.innerWidth = 500;
    window.innerHeight = 250;

    appCanvas.resize();
    expect(appCanvas.blockSize).toBe(100); // Should not change.
    expect(appCanvas.canvas.width).toBe(500);
    expect(appCanvas.canvas.height).toBe(250);
    expect(mockAppCanvasRender).toBeCalled();
  });

  test('should zoom in by increasing the block size and re-rendering', () => {
    const mockAppCanvasRender = jest.fn();
    const appCanvas = new AppCanvas(100);
    appCanvas.render = mockAppCanvasRender;

    appCanvas.zoomIn();
    expect(appCanvas.blockSize).toBeCloseTo(200);
    expect(appCanvas.canvas.width).toBe(window.innerWidth); // Should not change.
    expect(appCanvas.canvas.height).toBe(window.innerHeight); // Should not change.
    expect(mockAppCanvasRender).toBeCalled();
  });

  test('should zoom out by decreasing the block size and re-rendering', () => {
    const mockAppCanvasRender = jest.fn();
    const appCanvas = new AppCanvas(100);
    appCanvas.render = mockAppCanvasRender;

    appCanvas.zoomOut();
    expect(appCanvas.blockSize).toBeCloseTo(50);
    expect(appCanvas.canvas.width).toBe(window.innerWidth); // Should not change.
    expect(appCanvas.canvas.height).toBe(window.innerHeight); // Should not change.
    expect(mockAppCanvasRender).toBeCalled();
  });

  test('should pan the canvas left 12.965 pixels and up 4.12', () => {
    throw Error('Not implemented!');
  });
});
