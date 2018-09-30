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

export default class ColorPalette {
  constructor() {
    this.length = 3;
  }

  // eslint-disable-next-line class-methods-use-this
  getColor(index) {
    switch (index % 3) {
      case 0:
        return 'black';
      case 1:
        return 'tomato';
      case 2:
        return 'silver';
      default:
        throw Error('ColorPalette length exceeded!');
    }
  }
}
