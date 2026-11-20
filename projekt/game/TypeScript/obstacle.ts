import { ObstacleData } from "./obstacleData.js";
import { Player } from "./player.js";
import { htmlElementHandler } from "./htmlElementHandler.js";
import { Line } from "./line.js";

export class Obstacle{
    private static obstacles: Obstacle[] = []

    private html_handler: htmlElementHandler;
    private line: number; //na której linii znajduje się przeszkoda
    private distance: number = 1 //1 to najdalej przed graczem, 0 to poziom gracza, -1 za graczem
    private obstacle_data: ObstacleData;
    private activated: boolean = false

    private constructor(obstacle_type: ObstacleData, line: number){
        this.line = line
        this.obstacle_data = obstacle_type
        this.html_handler = new htmlElementHandler("obstacle")
        this.html_handler.setImage("obstacles/" + this.obstacle_data.getName() + ".png")
    }

    private async process(): Promise<void>{
        this.move()

        this.checkForPlayer()
    }

    public static async process(): Promise<void>{
        Obstacle.obstacles.forEach(obstacle => {
            obstacle.process()
        });
    }

    public getLine(): number{
        return this.line
    }

    public getDistanceFromPlayer(): number{
        return this.distance
    }

    public getEndDistanceFromPlayer(): number{
        return this.distance + this.obstacle_data.getLength()
    }

    public isPlayerOnObstacleDistance(): boolean{
        if(this.getDistanceFromPlayer() <= 0 && this.getEndDistanceFromPlayer() >= 0){
            return true
        }
        return false
    }

    public isSolid(): boolean{
        return this.obstacle_data.isSolid()
    }

    public delete(): void{
        this.html_handler.delete()
        let i: number = Obstacle.obstacles.indexOf(this)
        Obstacle.obstacles.splice(i, 1)
    }

    public static deleteAllObstacles(): void{
        while(Obstacle.obstacles.length > 0){
            Obstacle.obstacles[0].delete()
        }
    }

    public static getObstacles(): Obstacle[]{
        return Obstacle.obstacles
    }

    public static spawnRandom(line: number): void{
        Obstacle.spawn(ObstacleData.getRandomObstacleType(), line)
    }

    public static spawnByName(obstacle_type: string, line: number): void{
        Obstacle.spawn(ObstacleData.findByName(obstacle_type), line) 
    }

    public static spawn(obstacle_type: ObstacleData, line: number): void{
        Obstacle.obstacles.push(new Obstacle(obstacle_type, line))
    }

    private move(): void {
        if (this.distance == 1){
            this.distance -= 0.01
        }

        this.distance -= Player.getMovement() * (1 - this.distance)

        if (this.distance <= -1){
            this.delete()
            return
        }

        this.html_handler.moveTo(this.line, this.distance)
    }

    public activateEffect(): void{
        if (this.activated){
            return
        }

        this.activated = true

        this.obstacle_data.activateEffect()
    }

    private checkForPlayer(): void{
        if (this.isPlayerOnObstacleDistance() && this.line == Player.getLine() && this.isPlayerOnObstacleLevel()){
            this.activateEffect()
        }
    }

    private isPlayerOnObstacleLevel(): boolean{
        let obstacle_level = this.obstacle_data.getLevel()
        let player_level = Player.getLevel()

        if (obstacle_level == "full" || player_level == "full"){
            return true
        }

        if (obstacle_level == player_level){
            return true
        }

        return false
    }

    public static async spawnRandomRow(): Promise<void>{
        let row: ObstacleData[] = []
        
        for (let i = 0; i < Line.getLineAmount(); i++) {
            row.push(ObstacleData.getRandomObstacleType())
        }

        //jeżeli nie ma przeszkody, której można uniknąć, zamień losową przeszkodę na losową inną
        while(
            !(row.find(
                obstacle_data => obstacle_data.getLevel() != "full"
            ) instanceof ObstacleData)
        ){
            let i = Math.floor(Math.random() * row.length)
            row[i] = ObstacleData.getRandomObstacleType()
        }

        //spawn
        for (let i = 0; i < row.length; i++) {
            Obstacle.spawn(row[i], i)
        }
    }
}