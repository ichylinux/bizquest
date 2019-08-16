import Phaser from 'phaser';
import config from './config';
import Boot from './scenes/boot';
import Game from './scenes/game';

class BizQuest extends Phaser.Game {
  constructor () {
    super(config);
    this.scene.add('boot', Boot);
    this.scene.add('game', Game);
    this.scene.start('boot');
  }
}

window.game = new BizQuest();
window.addEventListener('resize', (event) => {
  game.scale.resize(window.innerWidth, window.innerHeight - 4);
});
