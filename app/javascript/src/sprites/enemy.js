import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'butterfly', 0);
    this.scene = scene;
    this.scale = 0.5;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setScale(this.scale * this.scene.scale);
  }

}