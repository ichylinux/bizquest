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
}