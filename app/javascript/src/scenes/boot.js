import Phaser from 'phaser';

import worldMap from 'maps/world.json';
import innerMap from 'maps/inner.json';
import townMap from 'maps/town.json';

import worldImage from 'images/gfx/world.png';
import innerImage from 'images/gfx/inner.png';
import townImage from 'images/gfx/world.png';

import playerImage from 'images/gfx/character.png';
import fontImage from 'images/gfx/font.png';
import objectsImage from 'images/gfx/objects.png';
import butterflyImage from 'images/butterfly.png';

import logoImage from 'images/logo.png';
import wizardImage from 'images/enemies/wizard.png';

export default class Boot extends Phaser.Scene {

  preload() {
    this.levels = {
      1: 'world',
      2: 'town',
      3: 'battle',
      4: 'inner'
    };

    this.load.tilemapTiledJSON('world', worldMap);
    this.load.tilemapTiledJSON('inner', innerMap);
    this.load.tilemapTiledJSON('town', townMap);

    this.load.spritesheet('world', worldImage, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('inner', innerImage, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('town', townImage, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player', playerImage, { frameWidth: 16, frameHeight: 32 });
    this.load.spritesheet('font', fontImage, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('objects', objectsImage, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('butterfly', butterflyImage, {frameWidth: 32, frameHeight: 32});

    this.load.image('logo', logoImage);
    this.load.image('wizard', wizardImage);
  }

  create () {
    // ロゴを画面の中央に表示
    let offsetX = this.sys.canvas.width / 2;
    let offsetY = this.sys.canvas.height / 2;
    this.add.sprite(offsetX, offsetY, 'logo');

    // 2000ミリ秒（2秒）後にメイン画面にシーンを切り替えるためのタイマーを設定
    setTimeout(() => {
      // 500ミリ秒（0.5秒）かけてフェードアウト（カメラを真っ暗に）
      this.cameras.main.fade(500, 0, 0, 0);
      this.cameras.main.on('camerafadeoutcomplete', () => {
        this.scene.start('game', { newGame: true, levelTo: 1, levels: this.levels });
        this.scene.start('ui');
      });
    }, 2000);
  }
};
