import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 }
    }
  }
}
