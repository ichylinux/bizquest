import Phaser from 'phaser';
import map from 'maps/world.json';
import sprite from 'images/gfx/world.png';

export default class Boot extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
    this.load.tilemapTiledJSON('world', map);
    this.load.spritesheet('world', sprite, { frameWidth: 16, frameHeight: 16 });
  }

  create () {
    this.scene.start('game');
  }
};
