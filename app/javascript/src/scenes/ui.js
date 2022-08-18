import Phaser from 'phaser';

export default class UI extends Phaser.Scene {

  constructor (key) {
    super(key);
  }

  init () {
    this.coinsCollected = 0;
  }

  create () {
    this.scoreText = this.add.text(12, 12, `スコア: ${this.coinsCollected}`, {fontSize: '32px', fill: '#ffffff'});

    this.game = this.scene.get('game');

    this.game.events.on('coinCollected', () => {
      this.coinsCollected++;
      this.scoreText.setText(`スコア: ${this.coinsCollected}`);
    });
  }
};
