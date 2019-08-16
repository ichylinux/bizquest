import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload() {
  }

  create() {
    this.createMap();
  }

  createMap() {
    this.map = this.make.tilemap({ key: 'world' });
    this.tiles = this.map.addTilesetImage('world');
    this.backgroundLayer = this.map.createStaticLayer('background', this.tiles, 0, 0);
    this.blockedLayer = this.map.createStaticLayer('blocked', this.tiles, 0, 0);
  }
};
