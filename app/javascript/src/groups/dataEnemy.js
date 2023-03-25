export default class DataEnemy {
    constructor(name) {
        this.name = name;

        //敵のステータス値と行動決定関数を格納
        this.data = {
            wizard: {
                HP: 10,
                power: 2,
                magicPower: 3,
                action: () => {
                    let value = Math.floor(Math.random() * 3);
                    switch (value) {
                        case 0:
                            return "attack";
                        case 1:
                            return "magic";
                        case 2:
                            return "defence";
                    }
                }
            }
        };


        this.HP = this.getHP(name);
        this.power = this.getPower(name);
        this.magicPower = this.getMagicPower(name);
        this.action = this.getAction(name);

    }

    getHP(name) {
        return this.data[name]["HP"];
    }

    getPower(name) {
        return this.data[name]["power"];
    }

    getMagicPower(name) {
        return this.data[name]["magicPower"];
    }

    getAction(name) {
        return this.data[name]["action"];
    }
}
