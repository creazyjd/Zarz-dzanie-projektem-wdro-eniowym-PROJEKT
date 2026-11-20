import { Player } from "./player.js";

export class ObstacleData{
    // WSZYSTKIE RODZAJE PRZESZKÓD
    public static obstacle_types: ObstacleData[] = [
        new ObstacleData("backpack", "low", 1, 0.2, true, "slow"),
        new ObstacleData("infokiosk", "full", 1, 0.2, true, "death"),
        new ObstacleData("crowd", "full", 1, 0.2, true, "death"),
        new ObstacleData("lamp", "high", 1, 0.2, true, "slow"),
        new ObstacleData("puddle", "low", 1, 0.2, true, "slow"),
        new ObstacleData("screen", "low", 1, 0.2, true, "death")
    ];

    private level: string; // gdzie postać oberwie efektem przeszkody. low - można nad tym przeskoczyć, high - można się pod tym prześlizgnąć, full - nie ma bata
    private width: number; // ile linii zajmuje
    private length: number; // jak "długie" jest
    private name: string; //po nazwie będzie szukać pliku graficznego
    private solid: boolean; //czy przeszkoda blokuje linię
    private effect: string; //death lub slow, SLOW DO ZROBIENIA
   
    //private img;

    constructor(name: string, level: string, width: number, length: number, solid: boolean, effect: string){
        this.width = width;
        this.length = length;
        this.name = name;
        this.solid = solid;
        this.level = level;
        this.effect = effect;
    }

    public static findByName(name: string): ObstacleData{
        return ObstacleData.obstacle_types.find((obstacle_type) => (obstacle_type.name === name)) as ObstacleData
    }

    public getName(): string{
        return this.name
    }

    public getLength(): number{
        return this.length
    }

    public isSolid(): boolean{
        return this.solid
    }

    public static getRandomObstacleType(): ObstacleData{
        let i: number = Math.floor(Math.random() * ObstacleData.obstacle_types.length)
        return ObstacleData.obstacle_types[i]
    }

    public getLevel(): string{
        return this.level
    }

    public activateEffect(){
        switch (this.effect) {
            case "death":
                Player.death()
                break;
            
            case "slow":
                Player.slow(0)
                break
            default:
                break;
        }
    }
}