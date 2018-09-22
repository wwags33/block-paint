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

import { CanvasType, Canvas } from '../main';

describe('CanvasType object tests', () => {
  test('CanvasType should be OFFSCREEN', () => {
    expect(CanvasType.OFFSCREEN).toBeDefined();
    expect(CanvasType.OFFSCREEN).toBe(0);
  });

  test('CanvasType should be ONSCREEN', () => {
    expect(CanvasType.ONSCREEN).toBeDefined();
    expect(CanvasType.ONSCREEN).toBe(1);
  });

  test('CanvasType should not be OTHER', () => {
    expect(CanvasType.OTHER).toBeUndefined();
  });

  test('CanvasType should not add OTHER', () => {
    expect(() => {
      CanvasType.OTHER = 2;
      return CanvasType.OTHER;
    }).toThrow(TypeError);
  });

  test('CanvasType.toText should return type as a string', () => {
    expect(CanvasType.toText(CanvasType.OFFSCREEN)).toBe('offscreen');
    expect(CanvasType.toText(CanvasType.ONSCREEN)).toBe('onscreen');
  });

  test('CanvasType.toText should throw an error on invalid input', () => {
    expect(() => CanvasType.toText('input')).toThrow(Error);
  });
});


describe('Canvas object tests', () => {
  test('should create a canvans object with defaults', () => {
    const canvas = new Canvas();
    expect(canvas.domId).toBe('offscreen_canvas');
    expect(canvas.type).toBe(CanvasType.OFFSCREEN);
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
  });

  test('should create a canvans object with domId containing type', () => {
    const canvas = new Canvas(null, CanvasType.ONSCREEN);
    expect(canvas.domId).toBe('onscreen_canvas');
    expect(canvas.type).toBe(CanvasType.ONSCREEN);
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
  });

  test('should create a canvas object with provided values', () => {
    const canvas = new Canvas('canvas_id', CanvasType.ONSCREEN, 500, 200);
    expect(canvas.domId).toBe('canvas_id');
    expect(canvas.type).toBe(CanvasType.ONSCREEN);
    expect(canvas.width).toBe(500);
    expect(canvas.height).toBe(200);
  });

  test('should render a canvas element on #main_div', (
    () => {
      document.body.innerHTML = '<div id="main_div"><p>DOM fragment</p></div>';

      const canvas = new Canvas('canvas_id', CanvasType.ONSCREEN);
      canvas.render();
      expect(canvas.domNode).not.toBeNull();
      expect(document.getElementsByTagName('canvas')).toHaveLength(1);
      expect(document.getElementById('canvas_id')).not.toBeNull();
    }));

  test('should render a canvas element with custom dimensions on #main_div', (
    () => {
      document.body.innerHTML = '<div id="main_div"><p>DOM fragment</p></div>';

      const canvas = new Canvas('canvas_id', CanvasType.ONSCREEN, 200, 100);
      canvas.render();
      expect(canvas.domNode).not.toBeNull();
      expect(document.getElementsByTagName('canvas')).toHaveLength(1);
      expect(document.getElementById('canvas_id')).not.toBeNull();
      expect(document.getElementById('canvas_id').parentNode.innerHTML)
        .toMatch(/width="200"/);
      expect(document.getElementById('canvas_id').parentNode.innerHTML)
        .toMatch(/height="100"/);
    }));

  test('should create dom node, but not attach it', () => {
    document.body.innerHTML = '<div id="main_div"><p>DOM fragment</p></div>';

    const canvas = new Canvas('canvas_id', CanvasType.OFFSCREEN);
    canvas.render();
    expect(canvas.domNode).not.toBeNull();
    expect(document.getElementsByTagName('canvas')).toHaveLength(0);
    expect(document.getElementById('canvas_id')).toBeNull();
  });

/*  //resize event resizes the canvas

  //grid class defined

  //grid constructor works

  //resize event resizes grid
*/
});
