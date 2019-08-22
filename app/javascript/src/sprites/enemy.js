import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'butterfly', 0);
    this.scene = scene;
    this.scale = 1;
    this.animationKey = 'butterfly';

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setScale(this.scale * this.scene.scale);
    
    this.createMove();
  }

  createMove() {
    let frameRate = 8;
    let start = 0;
    let end = start + 7;

    this.anims.animationManager.create({
      key: this.animationKey,
      frames: this.anims.animationManager.generateFrameNumbers(this.animationKey, {start: start, end: end}),
      frameRate: frameRate,
      repeat: -1
    });

    this.anims.play(this.animationKey, true);
    this.setVelocityX(-20); // image is facing to the left

    this.scene.time.addEvent({
      delay: Math.floor(Math.random() * 1000) + 1000,
      callback: this.changeDirection,
      loop: true,
      callbackScope: this
    });
  }
  
  changeDirection() {
    this.flipX = this.randomFlip();
    if (this.flipX) {
      this.setVelocityX(20);
    } else {
      this.setVelocityX(-20);
    }

    if (this.randomFlip()) {
      this.setVelocityY(10 * Math.floor(Math.random() * 2));
    } else {
      this.setVelocityY(-1 * 10 * Math.floor(Math.random() * 2));
    }
  }
  
  randomFlip() {
    return Math.floor(Math.random() * 2) == 1;
  }
  
}