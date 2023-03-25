export default class DataPlayer {
    constructor(level) {
        this.level = level;
        this.HP = level * 2 + 8;
        this.power = level + 1;
        this.magicPower = level + 2;
    }
}