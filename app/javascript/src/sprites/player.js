import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'player', 0);
    this.scene = scene;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setScale(this.scene.scale);
  }

  update (cursors) {
    this.setVelocity(0);

		// stop player from moving where chainging to another level
    if (this.scene.loadingLevel) {
      return;
    }

    let velocity = 200;

    if (cursors.up.isDown) {
      this.setVelocityY(velocity * -1);
    } else if (cursors.down.isDown) {
      this.setVelocityY(velocity);
    }

    if (cursors.left.isDown) {
      this.setVelocityX(velocity * -1);
    } else if (cursors.right.isDown) {
      this.setVelocityX(velocity);
    }
  }
}