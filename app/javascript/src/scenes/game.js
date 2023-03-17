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
    this._NEWGAME = data.newGame;
    if (this._NEWGAME) {
      this._LEVEL = 1;
    } else {
      this._LEVEL = data.levelTo;
    }

    this._LEVELS = data.levels;
    this.levelFrom = data.levelFrom;
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
      this.createMyHome();
      this.createTown();
      this.createPlayer();
      this.createCoins();
      this.createEnemies();
      this.addCollisions();
      this.cameras.main.startFollow(this.player);
    }
  }

  update() {
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
            this.scene.restart({ levelFrom: 1, levelTo: 2, levels: this._LEVELS, player: {direction: player.direction, x: player.x, y: player.y} });
          } else if (object == this.town){
            this.scene.restart({ levelFrom: 1, levelTo: 4, levels: this._LEVELS, player: {direction: player.direction, x: player.x, y: player.y} });
          }
        } else if (this._LEVEL == 2) {
          this.scene.restart({ levelFrom: 2, levelTo: 1, levels: this._LEVELS, player: {direction: player.direction, x: this.playerData.x, y: this.playerData.y} });
        } else if (this._LEVEL == 3) {
          this.scene.restart({ levelFrom: 3, levelTo: 1, levels: this._LEVELS, player: {direction: player.direction, x: this.playerData.x, y: this.playerData.y} });
        } else if (this._LEVEL == 4) {
          this.scene.restart({ levelFrom: 4, levelTo: 1, levels: this._LEVELS, player: {direction: player.direction, x: this.playerData.x, y: this.playerData.y} });
        }
      });
      this.nowLoading = true;
    }
  }

  createMap() {
    this.add.tileSprite(0, 0, 5000, 5000, this.levelName, 16);
    this.map = this.make.tilemap({key: this.levelName});
    this.tiles = this.map.addTilesetImage(this.levelName);

    this.backgroundLayer = this.map.createLayer('background', this.tiles, 0, 0);
    this.backgroundLayer.setScale(this.scale);

    this.blockedLayer = this.map.createLayer('blocked', this.tiles, 0, 0);
    this.blockedLayer.setScale(this.scale);
    this.blockedLayer.setCollisionByExclusion([-1]);

    this.objectsLayer = this.map.createLayer('objects', this.tiles, 0, 0);
    this.objectsLayer.setScale(this.scale);
  }

  createMyHome() {
    this.map.findObject('myhome', (obj) => {
      this.myhome = new MyHome(this, obj.x * this.scale, obj.y * this.scale);
      this.myhome.setSize(obj.width * this.scale, obj.height * this.scale);
    });
  }
  
  createTown() {
    this.map.findObject('town',(obj) => {
      this.town = new Town(this, obj.x * this.scale, obj.y * this.scale);
      this.town.setSize(obj.width * this.scale, obj.height * this.scale);
    });
  }

  createPlayer() {
    this.map.findObject('player', (obj) => {
      if (this._NEWGAME) {
        this.player = new Player(this, obj.x * this.scale, obj.y * this.scale);
      } else if (this._LEVEL == 1 && this.levelFrom != 3) {
        let x = this.playerData.x;
        let y = this.playerData.y + 16 * this.scale;
        this.player = new Player(this, x, y);
      } else {
        this.player = new Player(this, obj.x * this.scale, obj.y * this.scale);
      }
    });
  }

  createCoins() {
    if (this._LEVEL == 1) {
      this.coinObjects = this.map.createFromObjects('coins', {name: 'coin', key: 'objects', frame: 132});
    }
    this.coins = new Coins(this.physics.world, this, [], this.coinObjects);
  }

  createEnemies() {
    if (this._LEVEL == 1) {
      this.butterflyObjects = this.map.createFromObjects('enemies', {name: 'butterfly', key: 'butterfly', frame: 0});
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

    let name = 'ウィザード';
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
