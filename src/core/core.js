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


const CanvasType = Object.freeze({
  OFFSCREEN: 0,
  ONSCREEN: 1
});

class Canvas {
  // Dependency on global window object.
  constructor(domId, type = CanvasType.OFFSCREEN, width = 0, height = 0) {
    this.type = type;

    if (width === 0) {
      this.width = window.innerWidth;
    } else {
      this.width = width;
    }

    if (height === 0) {
      this.height = window.innerHeight;
    } else {
      this.height = height;
    }
  }
}

module.exports = { CanvasType, Canvas };
