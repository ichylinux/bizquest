import "phaser";

export default class Town extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player', 4);
        this.scene = scene;
    
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
      }
    
}