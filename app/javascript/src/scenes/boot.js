import Phaser from 'phaser';
import worldMap from 'maps/world.json';
import innerMap from 'maps/inner.json';
import worldImage from 'images/gfx/world.png';
import innerImage from 'images/gfx/inner.png';
import player from 'images/gfx/character.png';

export default class Boot extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
    this.levels = {
      1: 'world',
      2: 'inner'
    };

    this.load.tilemapTiledJSON('world', worldMap);
    this.load.tilemapTiledJSON('inner', innerMap);
    this.load.spritesheet('world', worldImage, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('inner', innerImage, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player', player, { frameWidth: 16, frameHeight: 32 });
  }

  create () {
    this.scene.start('game', { level: 1, newGame: true, levels: this.levels });
  }
};
