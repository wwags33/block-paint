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

import { LineOrientation, Line, Block } from '../main';

describe('LineOrientation oject tests', () => {
  test('should have VERTICAL', () => {
    expect(LineOrientation.VERTICAL).toBeDefined();
  });

  test('should have HORIZONTAL', () => {
    expect(LineOrientation.HORIZONTAL).toBeDefined();
  });

  test('should not add OTHER', () => {
    expect(LineOrientation.OTHER).toBeUndefined();
    expect(() => {
      LineOrientation.OTHER = 3;
    }).toThrow(TypeError);
  });

  test('should say true when is LineOrientation', () => {
    expect(LineOrientation.isLineOrientation(LineOrientation.VERTICAL)).toBe(true);
  });

  test('should say false when not LineOrientation', () => {
    expect(LineOrientation.isLineOrientation('Will')).toBe(false);
  });
});

describe('Line class tests', () => {
  test('should create a line object', () => {
    const line = new Line(LineOrientation.VERTICAL, 5);
    expect(line instanceof Line).toBe(true);
    expect(line.orientation).toBe(LineOrientation.VERTICAL);
    expect(line.linePosition).toBe(5);
  });

  test('should throw TypeErrors for bad input', () => {
    expect(() => new Line(LineOrientation.DIAGONAL, 10)).toThrow(TypeError);
    expect(() => new Line(LineOrientation.HORIZONTAL, 'Tom')).toThrow(TypeError);
  });

  test('should draw vertical line on canvas', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 20;
    controlCanvas.height = 20;
    const controlCtx = controlCanvas.getContext('2d');
    controlCtx.beginPath();
    controlCtx.moveTo(10, 0);
    controlCtx.lineTo(10, 20);
    controlCtx.stroke();

    const canvas = document.createElement('CANVAS');
    canvas.width = 20;
    canvas.height = 20;
    const ctx = canvas.getContext('2d');
    const line = new Line(LineOrientation.VERTICAL, 10);
    line.render(canvas, ctx);

    expect(canvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });

  test('should draw horizontal line on canvas', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 20;
    controlCanvas.height = 20;
    const controlCtx = controlCanvas.getContext('2d');
    controlCtx.beginPath();
    controlCtx.moveTo(0, 10);
    controlCtx.lineTo(20, 10);
    controlCtx.stroke();

    const canvas = document.createElement('CANVAS');
    canvas.width = 20;
    canvas.height = 20;
    const ctx = canvas.getContext('2d');
    const line = new Line(LineOrientation.HORIZONTAL, 10);
    line.render(canvas, ctx);

    expect(canvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });
});

describe('Block class tests', () => {
  test('should create a bock object', () => {
    const block = new Block(0, 0, 10);
    expect(block instanceof Block).toBe(true);
    expect(block.x).toBe(0);
    expect(block.y).toBe(0);
    expect(block.edgeLength).toBe(10);
    expect(block.color).toBe('black');
  });

  test('should throw TypeErrors on bad input', () => {
    expect(() => new Block('Deb', 0, 20)).toThrow(TypeError);
    expect(() => new Block(0, true, 25)).toThrow(TypeError);
    expect(() => new Block(5, 10, { length: 10 })).toThrow(TypeError);
  });

  test('should draw block on canvas', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 100;
    controlCanvas.height = 50;
    const controlCtx = controlCanvas.getContext('2d');
    controlCtx.fillStyle = 'tomato';
    controlCtx.fillRect(10, 12, 15, 15);

    const canvas = document.createElement('CANVAS');
    canvas.width = 100;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    const block = new Block(10, 12, 15, 'tomato');
    block.render(ctx);

    expect(canvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });

  test('should not draw block if edgeLength is 0', () => {
    const controlCanvas = document.createElement('CANVAS');
    controlCanvas.width = 200;
    controlCanvas.height = 150;

    const canvas = document.createElement('CANVAS');
    canvas.width = 200;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    const block = new Block(10, 20, 0);
    block.render(ctx);

    expect(canvas.toDataURL()).toBe(controlCanvas.toDataURL());
  });
});
