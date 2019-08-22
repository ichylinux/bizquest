import Phaser from 'phaser';
import Player from '../sprites/player';
import MyHome from '../sprites/myhome';
import Coins from '../groups/coins';
import Enemies from '../groups/enemies';

export default class Game extends Phaser.Scene {

  constructor(key) {
    super(key);
  }

  init(data) {
    this._LEVEL = data.level;
    this._LEVELS = data.levels;
    this._NEWGAME = data.newGame;
    this.playerDirection = data.playerDirection;
    this.loadingLevel = false;
  }

  create() {
    this.scale = 2;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createMap();
    this.createPlayer();
    this.createMyHome();
    this.createCoins();
    this.createEnemies();
    this.addCollisions();
    this.cameras.main.startFollow(this.player);
  }

  update () {
    this.player.update(this.cursors);
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.blockedLayer);
    this.physics.add.overlap(this.player, this.myhome, this.loadNextLevel.bind(this));
    this.physics.add.overlap(this.coins, this.player, this.coins.collectCoin.bind(this.coins));
  }

  createPlayer() {
    this.map.findObject('player', (obj) => {
      if (this._NEWGAME && this._LEVEL === 1) {
        if (obj.type === 'PlayerPosition') {
          this.player = new Player(this, obj.x * this.scale, obj.y * this.scale);
        }
      } else {
        this.player = new Player(this, obj.x * this.scale, obj.y * this.scale);
      }
    });
  }

  createMyHome() {
    this.map.findObject('myhome', (obj) => {
      if (this._LEVEL === 1) {
        this.myhome = new MyHome(this, (obj.x + 6) * this.scale, (obj.y - 6) * this.scale);
      } else if (this._LEVEL === 2) {
        this.myhome = new MyHome(this, (obj.x + 6) * this.scale, (obj.y - 6) * this.scale);
      }
    });
  }
  
  createCoins() {
    if (this._LEVEL == 1) {
      this.coinObjects = this.map.createFromObjects('coins', 'Coin', {key: 'objects', frame: 132});
    }
    this.coins = new Coins(this.physics.world, this, [], this.coinObjects);
  }

  createEnemies() {
    if (this._LEVEL == 1) {
      this.butterflyObjects = this.map.createFromObjects('enemies', 'butterfly', {key: 'butterfly', frame: 0});
    }
    this.enemies = new Enemies(this.physics.world, this, [], this.butterflyObjects);
  }

  createMap() {
    let levelName = this._LEVELS[this._LEVEL];

    this.add.tileSprite(0, 0, 4000, 4000, levelName, 16);
    this.map = this.make.tilemap({key: levelName});
    this.tiles = this.map.addTilesetImage(levelName);

    this.backgroundLayer = this.map.createStaticLayer('background', this.tiles, 0, 0);
    this.backgroundLayer.setScale(this.scale);

    this.objectsLayer = this.map.createStaticLayer('objects', this.tiles, 0, 0);
    this.objectsLayer.setScale(this.scale);

    this.blockedLayer = this.map.createStaticLayer('blocked', this.tiles, 0, 0);
    this.blockedLayer.setScale(this.scale);
    this.blockedLayer.setCollisionByExclusion([-1]);
  }

  loadNextLevel() {
    if (!this.loadingLevel) {
      this.cameras.main.fade(500, 0, 0, 0);
      this.cameras.main.on('camerafadeoutcomplete', () => {
        if (this._LEVEL === 1) {
          this.scene.restart({ level: 2, levels: this._LEVELS, newGame: false, playerDirection: this.playerDirection });
        } else if (this._LEVEL === 2) {
          this.scene.restart({ level: 1, levels: this._LEVELS, newGame: false, playerDirection: this.playerDirection });
        }
      });
      this.loadingLevel = true;
    }
  }
};
