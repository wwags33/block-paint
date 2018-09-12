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

import { CanvasType, Canvas } from '../core';

describe('CanvasType object tests', () => {
  test('CanvasType can be OFFSCREEN', () => {
    expect(CanvasType.OFFSCREEN).toBeDefined();
    expect(CanvasType.OFFSCREEN).toBe(0);
  });

  test('CanvasType can be ONSCREEN', () => {
    expect(CanvasType.ONSCREEN).toBeDefined();
    expect(CanvasType.ONSCREEN).toBe(1);
  });

  test('CanvasType cannot be OTHER', () => {
    expect(CanvasType.OTHER).toBeUndefined();
  });

  test('CanvasType cannot add OTHER', () => {
    expect(() => {
      CanvasType.OTHER = 2;
      return CanvasType.OTHER;
    }).toThrow(TypeError);
  });
});


describe('Canvas object tests', () => {
  test('should create a canvans object with defaults', () => {
    const canvas = new Canvas();
    expect(canvas.type).toBe(CanvasType.OFFSCREEN);
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
  });

  test('should create a canvas object with provided values', () => {
    const canvas = new Canvas(CanvasType.ONSCREEN, 500, 200);
    expect(canvas.type).toBe(CanvasType.ONSCREEN);
    expect(canvas.width).toBe(500);
    expect(canvas.height).toBe(200);
  });

  test('should not render an OFFSCREEN canvas', () => {
    const fragment = document.createElement('body');
    fragment.innerHTML = '<div id="main_div"><p>DOM fragment</p></div>';

    const canvas = new Canvas();
    canvas.render({ context: fragment });
    expect(document.getElementByTagName('canvas')).toBeNull();
  });

  test('should render a canvas element with default dimensions on #main_div', () => {
    const fragment = document.createElement('body');
    fragment.innerHTML = '<div id="main_div"><p>DOM fragment</p></div>';

    const canvas = new Canvas(CanvasType.ONSCREEN);
    canvas.render({ context: fragment });
    expect(document.getElementByTagName('canvas')).not.toBeNull();
  });

/*  //resize event resizes the canvas

  //grid class defined

  //grid constructor works

  //resize event resizes grid
*/
});
