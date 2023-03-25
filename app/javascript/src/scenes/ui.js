import Phaser from 'phaser';

export default class UI extends Phaser.Scene {

  init() {
    this.coinsCollected = 0;
    this.levelCollected = 1;
  }

  create() {
    this.scoreText = this.add.text(12, 12, `スコア: ${this.coinsCollected}`, { fontSize: '32px', fill: '#ffffff' });

    this.game = this.scene.get('game');

    this.game.events.on('coinCollected', () => {
      this.coinsCollected++;
      this.scoreText.setText(`スコア: ${this.coinsCollected}`);
    });

    this.levelText = this.add.text(12, 48, `レベル: ${this.levelCollected}`, { fontSize: '32px', fill: '#ffffff' });

    this.game.events.on('levelCollected', () => {
      this.levelCollected++;
      this.levelText.setText(`レベル: ${this.levelCollected}`);
    });

    this.game.events.on('levelLoosed', () => {
      this.levelCollected = 1;
      this.levelText.setText(`レベル: ${this.levelCollected}`);
    });
  }
};