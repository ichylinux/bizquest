import 'phaser';

export default class Coins extends Phaser.Physics.Arcade.StaticGroup {

  constructor(world, scene, children, spriteArray) {
    super(world, scene);

    this.scene = scene;

    spriteArray = spriteArray || [];
    spriteArray.forEach(coin => {
      coin.x *= this.scene.scale;
      coin.y *= this.scene.scale;
      coin.setScale(this.scene.scale);
      this.world.enableBody(coin, 1);
      this.add(coin);
    });
    this.refresh();
  }

  collectCoin(player, coin) {
    this.remove(coin);
    coin.destroy();
    this.scene.events.emit('coinCollected');
  }
}
