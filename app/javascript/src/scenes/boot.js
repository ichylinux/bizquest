import Phaser from 'phaser';
import map from 'maps/world.json';
import sprite from 'images/gfx/world.png';
import player from 'images/gfx/character.png';

export default class Boot extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
    this.levels = {
      1: 'world',
      2: 'myhome'
    };

    this.load.tilemapTiledJSON('world', map);
    this.load.spritesheet('world', sprite, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player', player, { frameWidth: 16, frameHeight: 32 });
  }

  create () {
    this.scene.start('game', { level: 1, newGame: true, levels: this.levels });
  }
};
