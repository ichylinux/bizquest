import Phaser from 'phaser';
import DataEnemy from "../groups/dataEnemy";
import DataPlayer from "../groups/dataPlayer";

export default class Battle {
    //コンストラクタ
    constructor(scene, level) {
        this.scene = scene;
        //バトルの終了を宣言する
        this.outBattle = false;
        //バトルの開始を宣言する
        this.onBattle = false;
        //画面に表示するテキストの内容を表す
        this.displayText = "empty";
        //画面にテキストを表示する要請を宣言する
        this.sendText = false;
        //バトルの進行段階を表す
        this.phase = "initial";
        //プレイヤーのレベル（内部処理用）を表す
        this.level = level;
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


        //プレイヤーがテキストを読み終わるのを待ってバトルを進行
        if (Phaser.Input.Keyboard.JustDown(keys.W)) {
            this.battleManager();
        }

        //プレイヤーの行動選択を取得
        if (keys.A.isDown && this.phase == "selection") {
            this.playerAction = "attack";
            this.phase = "start";
            this.battleManager();
        }

        if (keys.S.isDown && this.phase == "selection") {
            this.playerAction = "magic";
            this.phase = "start";
            this.battleManager();
        }

        if (keys.D.isDown && this.phase == "selection") {
            this.playerAction = "defence";
            this.phase = "start";
            this.battleManager();
        }

    }


    //プレイヤーとバトル相手のステータスを作成
    setStatus() {
        this.enemy = new DataEnemy("wizard");
        this.enemyHP = this.enemy.HP;
        this.player = new DataPlayer(this.level);
        this.playerHP = this.player.HP
        this.playerAction = "initial";
        this.enemyAction = "initial";
        this.playerDamage = -1;
        this.enemyDamage = -1;
        this.turnResult = "initial";
        console.log(this.player.HP);
        console.log(this.player.power);
        console.log(this.player.magicPower);
    }

    //バトルの進行を管理
    battleManager() {
        switch (this.phase) {
            //行動選択画面
            case "waiting":
                this.displayText = "*Aキーで突撃\r\n*Sキーで魔法\r\n*Dキーで防御";
                this.sendText = true;
                this.phase = "selection";
                break;

            //プレイヤーと敵の行動を読み上げ
            case "start":

                //敵の行動を設定
                this.enemyAction = this.enemy.action();

                this.displayText = `プレイヤーは${this.actionReader(this.playerAction)}\r\nウィザードは${this.actionReader(this.enemyAction)}\r\n*Wキーで続行`;
                this.sendText = true;
                this.phase = "result";
                break;

            //このターンの結果を表示
            case "result":
                this.setResult(this.playerAction, this.enemyAction);
                this.displayText = this.turnResult;
                this.sendText = true;
                this.phase = "judge";
                break;

            case "judge":
                this.judgement()
                break;


            //バトル勝利時の処理
            case "win-back":
                this.displayText = "ウィザードに勝利した!\r\nレベルが1上がった!"
                this.sendText = true;

                this.scene.events.emit('levelCollected');

                this.phase = 'initial';

                setTimeout(
                    () => {
                        this.outBattle = true;
                    }, 2000);
                break;

            //バトル敗北時の処理
            case "loose-back":
                this.displayText = "ウィザードに敗北した"
                this.sendText = true;

                this.scene.events.emit('levelLoosed');

                setTimeout(
                    () => {
                        this.outBattle = true;
                    }, 2000);
                break;

        }
    }

    //勝敗・バトル継続の判定
    judgement() {
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

    //プレイヤーと敵の行動を読み上げる
    actionReader(action) {
        if (action == "attack") {
            return "突撃した";
        }
        if (action == "magic") {
            return "魔法の詠唱を開始した";
        }
        if (action == "defence") {
            return "固く身を守った";
        }
    }

    //ターンの結果を報告
    setResult(playerAction, enemyAction) {

        switch (playerAction) {
            case "attack":
                switch (enemyAction) {
                    case "attack":
                        this.enemyDamage = this.player.power;
                        this.playerDamage = this.enemy.power;
                        this.turnResult = "両者は激しくぶつかり合った!\r\n*Wキーで続行"
                        break;

                    case "magic":
                        this.enemyDamage = 2 * this.player.power;
                        this.playerDamage = this.enemy.magicPower - 2;
                        this.turnResult = "ウィザードはプレイヤーに突撃されて\r\n詠唱を完了できなかった!\r\nウィザードに大ダメージ!\r\n*Wキーで続行"
                        break;

                    case "defence":
                        this.enemyDamage = 0.5 * this.player.power;
                        this.playerDamage = 3 * this.enemy.power;
                        this.turnResult = "ウィザードはプレイヤーの攻撃を受け止め、\r\n痛烈なカウンターを放った!\r\nプレイヤーに大ダメージ!\r\n*Wキーで続行"
                        break;
                } break;

            case "magic":
                switch (enemyAction) {
                    case "attack":
                        this.enemyDamage = this.player.magicPower - 2;
                        this.playerDamage = 2 * this.enemy.power;
                        this.turnResult = "プレイヤーはウィザードに突撃されて\r\n詠唱を完了できなかった!\r\nプレイヤーに大ダメージ!\r\n*Wキーで続行"
                        break;

                    case "magic":
                        this.enemyDamage = this.player.magicPower;
                        this.playerDamage = this.enemy.magicPower;
                        this.turnResult = "両者は渾身の魔法をぶつけ合った!\r\n*Wキーで続行"
                        break;

                    case "defence":
                        this.enemyDamage = 0;
                        this.playerDamage = this.enemy.magicPower;
                        this.turnResult = "プレイヤーの魔法がウィザードの防御を貫いた!\r\nウィザードに大ダメージ!\r\n*Wキーで続行"
                        break;
                } break;

            case "defence":
                switch (enemyAction) {
                    case "attack":
                        this.enemyDamage = 3 * this.player.power;
                        this.playerDamage = 0.5 * this.enemy.power;
                        this.turnResult = "プレイヤーはウィザードの攻撃を受け止め、\r\n痛烈なカウンターを放った!\r\nウィザードに大ダメージ!\r\n*Wキーで続行"
                        break;

                    case "magic":
                        this.enemyDamage = 0;
                        this.playerDamage = this.enemy.magicPower;
                        this.turnResult = "ウィザードの魔法がプレイヤーの防御を貫いた!\r\nプレイヤーに大ダメージ!\r\n*Wキーで続行"
                        break;

                    case "defence":
                        this.enemyDamage = 0;
                        this.playerDamage = 0;
                        this.turnResult = "両者は守りを固めてお互いの様子を窺った!\r\n*Wキーで続行"
                        break;
                } break;
        }
    }
};