import Phaser from 'phaser';
import logo from 'images/logo.png';

var config = {
    type: Phaser.AUTO,
    parent: 'app',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', logo);
}

function create ()
{
    var logo = this.add.image(400, 150, 'logo');

    this.tweens.add({
        targets: logo,
        y: 450,
        duration: 2000,
        ease: 'Power2',
        yoyo: true,
        loop: -1
    });

}
