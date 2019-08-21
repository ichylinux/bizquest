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
    this.randomFlip();
    this.play();
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
  }
  
  play() {
    this.anims.play(this.animationKey, true);
  }
  
  pause() {
    this.anims.pause();
  }
  
  resume() {
    this.anims.resume();
  }

  stop() {
    this.anims.stop();
  }
  
  update() {
    let flip = this.flipX;
    let nextFlip = this.randomFlip();
    
    if (flip != nextFlip) {
      this.pause();
      this.flipX = nextFlip;
      this.resume(); 
    }
  }
  
  randomFlip() {
    return Math.floor(Math.random() * 2) == 1;
  }
  
}