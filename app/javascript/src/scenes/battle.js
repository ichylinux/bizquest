import Phaser from 'phaser';
import DataEnemy from "../groups/dataEnemy";
import DataPlayer from "../groups/dataPlayer";

export default class Battle extends Phaser.Scene {
    //コンストラクタ
    constructor() {
        super();

        //バトルの開始を宣言する
        this.outBattle = false;
        //バトルの終了を宣言する
        this.onBattle = false;
        //画面に表示するテキストの内容を表す
        this.displayText = "empty";
        //画面にテキストを表示する要請を宣言する
        this.sendText = false;
        //バトルの進行段階を表す
        this.phase = "initial";
    }

    update(keys) {
        //バトル開始時の処理
        if (this.onBattle === true) {
            this.setStatus();
            this.displayText = "バトル開始\r\nウィザードが現れた\r\n*Wキーで続行"
            this.sendText = true;
            this.onBattle = false;
            this.phase = "waiting";
        }


        //プレイヤーの選択を待ってバトルを進行
        if (keys.W.isDown) {
            switch (this.phase) {
                //行動選択画面
                case "waiting":
                    this.displayText = "*Sキーで攻撃";
                    this.sendText = true;
                    this.phase = "selection";
                    break;

                //バトル勝利時の処理
                case "win":
                    this.displayText = "ウィザードに勝利した"
                    this.sendText = true;

                    setTimeout(
                        () => { this.outBattle = true; }, 2000
                    );
                    break;

                //バトル敗北時の処理
                case "loose":
                    this.displayText = "ウィザードに敗北した"
                    this.sendText = true;

                    setTimeout(
                        () => { this.outBattle = true; }, 2000
                    );
                    break;

            }
        }

        //プレイヤーの行動選択を取得
        if (keys.S.isDown && this.phase == "selection") {
            this.playerAction = "attack";
            this.battleManager();
        }

    }

    //プレイヤーとバトル相手のステータスを作成
    setStatus() {
        this.enemy = new DataEnemy("wizard");
        this.enemyHP = this.enemy.HP;
        this.player = new DataPlayer(1);
        this.playerHP = this.player.HP
        this.playerAction = "initial";
        this.enemyAction = "initial";
        this.playerDamage = -1;
        this.enemyDamage = -1;
    }

    //１ターンの間の出来事を処理
    battleManager() {

        //与ダメージを更新
        this.setDamage("attack", "attack");

        //勝敗・バトル継続の判定
        if (this.enemyHP - this.enemyDamage <= 0) {
            this.displayText = `ウィザードに${this.enemyDamage}のダメージ、ウィザードは力尽きた\r\n*Wキーで続行`;
            this.sendText = true;
            this.phase = "win";
        } else if (this.playerHP - this.playerDamage <= 0) {
            this.displayText = `ウィザードに${this.enemyDamage}のダメージ\r\nプレイヤーに${this.playerDamage}のダメージ、プレイヤーは力尽きた\r\n*Wキーで続行`;
            this.sendText = true;
            this.phase = "loose";
        } else {

            //HPを更新
            this.enemyHP = this.enemyHP - this.enemyDamage;
            this.playerHP = this.playerHP - this.playerDamage;

            this.displayText = `ウィザードに${this.enemyDamage}のダメージ\r\nプレイヤーに${this.playerDamage}のダメージ\r\nプレイヤーのHPは残り${this.playerHP}だ！\r\n*Wキーで続行`;
            this.sendText = true;
            this.phase = "waiting";
        }
    }

    //与ダメージの計算
    setDamage(playerAction, enemyAction) {
        switch (playerAction) {
            case "attack":
                switch (enemyAction) {
                    case "attack":
                        this.enemyDamage = this.player.power;
                        this.playerDamage = this.enemy.power;
                        break;
                }
        }
    }
};