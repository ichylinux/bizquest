import Phaser from 'phaser';
import Player from '../sprites/player';

export default class Game extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload() {
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createMap();
    this.createPlayer();
    this.addCollisions();
    this.cameras.main.startFollow(this.player);
  }

  update () {
    this.player.update(this.cursors);
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.blockedLayer);
  }

  createPlayer() {
    this.map.findObject('player', (obj) => {
      if (obj.type === 'StartingPoint') {
        this.player = new Player(this, obj.x, obj.y);
      }
    });
  }

  createMap() {
    this.map = this.make.tilemap({ key: 'world' });
    this.tiles = this.map.addTilesetImage('world');
    this.backgroundLayer = this.map.createStaticLayer('background', this.tiles, 0, 0);
    this.blockedLayer = this.map.createStaticLayer('blocked', this.tiles, 0, 0);
    this.blockedLayer.setCollisionByExclusion([-1]);
  }
};
