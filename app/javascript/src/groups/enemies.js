import 'phaser';
import Enemy from '../sprites/enemy';

export default class Enemies extends Phaser.Physics.Arcade.Group {

  constructor(world, scene, children, spriteArray) {
    super(world, scene, children);
    this.scene = scene;

    this.createEnemies(scene, spriteArray);
  }

  createEnemies(scene, spriteArray) {
    spriteArray.forEach(sprite => {
      sprite.x *= this.scene.scale;
      sprite.y *= this.scene.scale;
      sprite.setScale(this.scene.scale);

      const enemy = new Enemy(scene, sprite.x, sprite.y);
      this.add(enemy);
      sprite.destroy();
    });
  }

  startBattle(player, enemy) {
    if (!this.scene.nowLoading) {
      this.scene.cameras.main.fade(1000, 0, 0, 0);
      this.scene.cameras.main.on('camerafadeoutcomplete', () => {
        this.scene.scene.restart({ level: 3, levels: this.scene._LEVELS, playerDirection: this.scene.playerDirection, playerX: this.scene.player.x, playerY: this.scene.player.y });
      });
      this.scene.nowLoading = true;
    }
  }
}