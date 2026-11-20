import { Player } from "./player.js";
export class ObstacleData {
    // WSZYSTKIE RODZAJE PRZESZKÓD
    static obstacle_types = [
        new ObstacleData("backpack", "low", 1, 0.2, true, "slow"),
        new ObstacleData("infokiosk", "full", 1, 0.2, true, "death"),
        new ObstacleData("crowd", "full", 1, 0.2, true, "death"),
        new ObstacleData("lamp", "high", 1, 0.2, true, "slow"),
        new ObstacleData("puddle", "low", 1, 0.2, true, "slow"),
        new ObstacleData("screen", "low", 1, 0.2, true, "death")
    ];
    level; // gdzie postać oberwie efektem przeszkody. low - można nad tym przeskoczyć, high - można się pod tym prześlizgnąć, full - nie ma bata
    width; // ile linii zajmuje
    length; // jak "długie" jest
    name; //po nazwie będzie szukać pliku graficznego
    solid; //czy przeszkoda blokuje linię
    effect; //death lub slow, SLOW DO ZROBIENIA
    //private img;
    constructor(name, level, width, length, solid, effect) {
        this.width = width;
        this.length = length;
        this.name = name;
        this.solid = solid;
        this.level = level;
        this.effect = effect;
    }
    static findByName(name) {
        return ObstacleData.obstacle_types.find((obstacle_type) => (obstacle_type.name === name));
    }
    getName() {
        return this.name;
    }
    getLength() {
        return this.length;
    }
    isSolid() {
        return this.solid;
    }
    static getRandomObstacleType() {
        let i = Math.floor(Math.random() * ObstacleData.obstacle_types.length);
        return ObstacleData.obstacle_types[i];
    }
    getLevel() {
        return this.level;
    }
    activateEffect() {
        switch (this.effect) {
            case "death":
                Player.death();
                break;
            case "slow":
                Player.slow(0);
                break;
            default:
                break;
        }
    }
}
