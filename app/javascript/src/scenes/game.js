import Phaser from 'phaser';
import Player from '../sprites/player';
import MyHome from '../sprites/myhome';
import Town from '../sprites/town';
import Coins from '../groups/coins';
import Enemies from '../groups/enemies';

import Wizard from '../enemies/wizard';

export default class Game extends Phaser.Scene {

  constructor(key) {
    super(key);
  }

  init(data) {
    this._LEVEL = data.level;
    this._LEVELS = data.levels;
    this._NEWGAME = data.newGame;
    this.levelName = this._LEVELS[this._LEVEL];
    this.playerData = data.player;
    this.nowLoading = false;
  }

  create() {
    this.scale = 2;
    this.cursors = this.input.keyboard.createCursorKeys();

    if (this._LEVEL == 3) {
      this.createBattleField();
      this.cameras.main.stopFollow();
    } else {
      this.createMap();
      this.createPlayer();
      this.createMyHome();
      this.createTown();
      this.createCoins();
      this.createEnemies();
      this.addCollisions();
      this.cameras.main.startFollow(this.player);
    }
  }

  update () {
    if (this._LEVEL == 3) {
      this.enemy.update(this.cursors);
    } else {
      this.player.update(this.cursors);
    }
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.blockedLayer);
    this.physics.add.collider(this.enemies, this.blockedLayer);
    this.physics.add.overlap(this.player, this.myhome, this.loadNextLevel.bind(this));
    this.physics.add.overlap(this.player, this.town, this.loadNextLevel.bind(this));
    this.physics.add.overlap(this.player, this.coins, this.coins.collectCoin.bind(this.coins));
    this.physics.add.overlap(this.player, this.enemies, this.enemies.startBattle.bind(this.enemies));
  }

  loadNextLevel(player, object) {
    if (!this.nowLoading) {
      this.cameras.main.fade(500, 0, 0, 0);
      this.cameras.main.on('camerafadeoutcomplete', () => {
        if (this._LEVEL == 1) {
          if (object == this.myhome) {
            this.scene.restart({ level: 2, levels: this._LEVELS, player: {direction: player.direction} });
          } else if (object == this.town) {
            this.scene.restart({ level: 4, levels: this._LEVELS, player: {direction: player.direction} });
          }
        } else if (this._LEVEL == 2) {
          this.scene.restart({ level: 1, levels: this._LEVELS, player: {direction: player.direction} });
        } else if (this._LEVEL == 3) {
          this.scene.restart({ level: 1, levels: this._LEVELS, player: {direction: player.direction} });
        } else if (this._LEVEL == 4) {
          this.scene.restart({ level: 1, levels: this._LEVELS, player: {direction: player.direction} });
        }
      });
      this.nowLoading = true;
    }
  }

  createMap() {
    this.add.tileSprite(0, 0, 5000, 5000, this.levelName, 16);
    this.map = this.make.tilemap({key: this.levelName});
    this.tiles = this.map.addTilesetImage(this.levelName);

    this.backgroundLayer = this.map.createStaticLayer('background', this.tiles, 0, 0);
    this.backgroundLayer.setScale(this.scale);

    this.blockedLayer = this.map.createStaticLayer('blocked', this.tiles, 0, 0);
    this.blockedLayer.setScale(this.scale);
    this.blockedLayer.setCollisionByExclusion([-1]);

    this.objectsLayer = this.map.createStaticLayer('objects', this.tiles, 0, 0);
    this.objectsLayer.setScale(this.scale);
  }

  createPlayer() {
    this.map.findObject('player', (obj) => {
      if (this._NEWGAME && this._LEVEL === 1) {
        if (obj.type === 'PlayerPosition') {
          this.player = new Player(this, obj.x * this.scale, obj.y * this.scale);
        }
      } else {
        let x = this.playerData.x || (obj.x * this.scale);
        let y = this.playerData.y || (obj.y * this.scale);
        this.player = new Player(this, x, y);
      }
    });
  }

  createMyHome() {
    this.map.findObject('myhome', (obj) => {
      if (this._LEVEL == 1 || this._LEVEL == 2) {
        this.myhome = new MyHome(this, (obj.x + 6) * this.scale, (obj.y - 6) * this.scale);
      }
    });
  }
  
  createTown() {
    this.map.findObject('town', (obj) => {
      if (this._LEVEL == 1 || this._LEVEL == 4) {
        this.town = new Town(this, (obj.x + 6) * this.scale, (obj.y - 6) * this.scale);
      }
    });
  }

  createCoins() {
    if (this._LEVEL == 1) {
      this.coinObjects = this.map.createFromObjects('coins', 'coin', {key: 'objects', frame: 132});
    }
    this.coins = new Coins(this.physics.world, this, [], this.coinObjects);
  }

  createEnemies() {
    if (this._LEVEL == 1) {
      this.butterflyObjects = this.map.createFromObjects('enemies', 'butterfly', {key: 'butterfly', frame: 0});
    }
    this.enemies = new Enemies(this.physics.world, this, [], this.butterflyObjects);
  }

  createBattleField() {
    this.enemy = new Wizard(this, this.sys.canvas.width / 2, 200);

    let maxRow = 5;
    let maxCol = 15;
    let startFrame = 45;
    let offsetX = this.sys.canvas.width / 2 - (16 * this.scale * maxCol / 2);
    let offsetY = this.sys.canvas.height - 50 - ((maxRow - 1) * 16 * this.scale);

    for (let i = 0; i < maxRow; i ++) {
      for (let j = 0; j < maxCol; j ++) {
        var image = new Phaser.GameObjects.Image(this, offsetX + (j * 16 * this.scale), offsetY + (i * 16 * this.scale), 'font', (i * maxCol) + j + startFrame);
        this.add.existing(image);
        image.setScale(this.scale);
      }
    }

    let name = '魔法使い';
    this.battleText = this.add.text(offsetX + 16, offsetY + 16, `${name}があらわれた。`, {fontSize: '16px', fill: '#000000'});
    this.promptText = this.add.text(offsetX + ((maxCol - 1) / 2 * 16 * this.scale), offsetY + (16 * 5), '▽', {fontSize: '16px', fill: '#000000'});
    this.time.addEvent({
      delay: 500,
      callback: this.blinkPrompt,
      loop: true,
      callbackScope: this
    });
  }
  
  blinkPrompt() {
    this.promptText.setVisible(!this.promptText.visible);
  }

};
