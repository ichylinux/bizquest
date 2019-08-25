import Phaser from 'phaser';

export default class Wizard extends Phaser.GameObjects.Image {

  constructor(scene, x, y) {
    super(scene, x, y, 'wizard', 0);
    this.scene.add.existing(this);
    this.setScale(this.scene.scale);
  }

  update(cursors) {
    if (cursors.space.isDown) {
    this.scene.loadNextLevel(1);
    }
  }

}
