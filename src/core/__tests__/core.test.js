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

import CanvasType from '../core';
// const core = require('../core.js'); // Change to new import.

console.log(CanvasType);

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
    CanvasType.OTHER = 2;
    expect(CanvasType.OTHER).toBeUndefined();
  });
});

/*
describe('Canvas object tests', () => {
  DOM fragment for canvas tests.
  const fragment = document.createElement('body');
  fragment.innerHTML = '<div id="main_div"><p>DOM fragment</p></div>';

  //Object contructor tests
  //class defined
  //constructor args work
  test('should create a canvans object', () => {
    expect(new Canvas()).not.toBeNull();
  });

  //render creates a canvas element on the dom
  test('should render a canvas element on #main_div', () => {
    const canvas = new Canvas();
    canvas.render({context: fragment});
    expect(fragment).toBe('<div id="main_div">canvas/div>')
  });

  //resize event resizes the canvas

  //grid class defined

  //grid constructor works

  //resize event resizes grid


});
*/
