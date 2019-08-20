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

    if (cursors.up.isDown) {
      this.setVelocityY(this.getVelocity(cursors.up) * -1);
      this.scene.playerDirection = 'up';
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.getVelocity(cursors.down));
      this.scene.playerDirection = 'down';
    }

    if (cursors.left.isDown) {
      this.setVelocityX(this.getVelocity(cursors.left) * -1);
      this.scene.playerDirection = 'left';
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.getVelocity(cursors.right));
      this.scene.playerDirection = 'right';
    }

    if (this.isStanding()) {
      this.setFrame(this.getStandingFrame(this.scene.playerDirection));
    } else {
      this.anims.play(this.scene.playerDirection, true);
    }
  }

  isStanding() {
    return this.body.velocity.x === 0 && this.body.velocity.y === 0;
  }

  getStandingFrame(direction) {
    let standingPosition = {
      'up' : 34,
      'down' : 0,
      'left' : 51,
      'right' : 17
    };

    return standingPosition[direction];
  }
  
  getVelocity(key) {
    return key.ctrlKey ? 400 : 200;
  }
  
  createMove() {
    let frameRate = 5;
    let directions = ['up', 'down', 'left', 'right'];

    directions.forEach(direction => {
      let start = this.getStandingFrame(direction);
      let end = start + 3;

      this.anims.animationManager.create({
        key: direction,
        frames: this.anims.animationManager.generateFrameNumbers('player', {start: start, end: end}),
        frameRate: frameRate,
        repeat: -1
      });
    });
  }
}