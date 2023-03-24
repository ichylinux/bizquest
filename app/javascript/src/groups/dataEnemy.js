export default class DataEnemy {
    constructor(name) {
        this.name = name;
        this.HP = this.getHP(name);
        this.power = this.getpower(name);
        this.magicPower = this.getmagicPower(name);
    }



    getHP(name) {
        switch (name) {
            case "wizard":
                return 10;
        }
    }

    getpower(name) {
        switch (name) {
            case "wizard":
                return 4;
        }
    }

    getmagicPower(name) {
        switch (name) {
            case "wizard":
                return 3;
        }
    }
}