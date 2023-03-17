import Phaser from 'phaser';
import config from './config';
import Boot from './scenes/boot';
import Game from './scenes/game';
import UI from './scenes/ui';

class BizQuest extends Phaser.Game {
  // コンストラクター
  constructor () {
    super(config);

    // 起動画面
    // この画面を見せて時間稼ぎをしている間に、ゲームの必要な画像やマップ情報を読み込んでいる。
    this.scene.add('boot', Boot);

    // ゲームのメイン画面
    // ゲーム世界や、街、洞窟など各シーンを切り替えている。
    this.scene.add('game', Game);

    // ステータス画面
    // スコアの表示など、ゲームの状態を表示するためのシーン。
    // メイン画面の上に重ねて表示しているが、背景色が透明なので、メイン画面もちゃんと見えている。
    this.scene.add('ui', UI);

    // 起動画面を見せるでゲーム開始
    this.scene.start('boot');
  }
}

window.game = new BizQuest();
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight - 4);
});
