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
  ONSCREEN: 1,
  toText: function canvasTypeToText(type) {
    switch (type) {
      case CanvasType.OFFSCREEN:
        return 'offscreen';
      case CanvasType.ONSCREEN:
        return 'onscreen';
      default:
        throw new Error('Not a canvas type!');
    }
  }
});

class Canvas {
  // Dependency on global window object.
  constructor(domId, type = CanvasType.OFFSCREEN, width = 0, height = 0) {
    if (!domId) {
      // Will throw error if type is invalid.
      this.domId = `${CanvasType.toText(type)}_canvas`;
    } else {
      this.domId = String(domId);
    }

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

    this.domNode = null;
  }

  // Depends on document.
  // Onscreen depends on dom element with id 'main_div'
  render() {
    this.domNode = document.createElement('CANVAS');
    this.domNode.id = this.domId;
    this.domNode.width = this.width;
    this.domNode.height = this.height;
    if (this.type === CanvasType.ONSCREEN) {
      document.getElementById('main_div').appendChild(this.domNode);
    }
  }
}

export { CanvasType, Canvas };
