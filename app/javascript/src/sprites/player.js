import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y) {
    super(scene, x, y, 'player', 0);
    this.scene = scene;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setScale(this.scene.scale);
    
    this.createMove();
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
      this.anims.play('up', true);
    } else if (cursors.down.isDown) {
      this.setVelocityY(velocity);
      this.anims.play('down', true);
    }

    if (cursors.left.isDown) {
      this.setVelocityX(velocity * -1);
      this.anims.play('left', true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(velocity);
      this.anims.play('right', true);
    }

    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      if (!this.anims.currentAnim) {
        this.setFrame(0);
      } else if (this.anims.currentAnim.key == 'up') {
        this.setFrame(34);
      } else if (this.anims.currentAnim.key == 'down') {
        this.setFrame(0);
      } else if (this.anims.currentAnim.key == 'left') {
        this.setFrame(51);
      } else if (this.anims.currentAnim.key == 'right') {
        this.setFrame(17);
      }
    }
  }
  
  createMove() {
    let frameRate = 5;

    this.anims.animationManager.create({
      key: 'up',
      frames: this.anims.animationManager.generateFrameNumbers('player', { start: 34, end: 37 }),
      frameRate: frameRate,
      repeat: -1
    });

    this.anims.animationManager.create({
      key: 'down',
      frames: this.anims.animationManager.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: frameRate,
      repeat: -1
    });

    this.anims.animationManager.create({
      key: 'left',
      frames: this.anims.animationManager.generateFrameNumbers('player', { start: 51, end: 54 }),
      frameRate: frameRate,
      repeat: -1
    });

    this.anims.animationManager.create({
      key: 'right',
      frames: this.anims.animationManager.generateFrameNumbers('player', { start: 17, end: 20 }),
      frameRate: frameRate,
      repeat: -1
    });
  }
}