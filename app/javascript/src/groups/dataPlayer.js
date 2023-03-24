export default class DataPlayer {
    constructor(level) {
        this.level = level;
        this.HP = level * 2 + 18;
        this.power = level + 3;
        this.magicPower = level + 2;
    }
}