import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'app',
  width: window.innerWidth,
  height: window.innerHeight - 4,
  zoom: 1,
  resolution: 1,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    fps: {
      min: 2,
      target: 10,
      forceSetTimeOut: true
    },
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
}
