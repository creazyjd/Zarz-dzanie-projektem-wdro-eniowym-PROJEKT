import { ObstacleData } from "./obstacleData.js";
import { Player } from "./player.js";
import { htmlElementHandler } from "./htmlElementHandler.js";
import { Line } from "./line.js";
export class Obstacle {
    static obstacles = [];
    html_handler;
    line; //na której linii znajduje się przeszkoda
    distance = 1; //1 to najdalej przed graczem, 0 to poziom gracza, -1 za graczem
    obstacle_data;
    activated = false;
    constructor(obstacle_type, line) {
        this.line = line;
        this.obstacle_data = obstacle_type;
        this.html_handler = new htmlElementHandler("obstacle");
        this.html_handler.setImage("obstacles/" + this.obstacle_data.getName() + ".png");
    }
    async process() {
        this.move();
        this.checkForPlayer();
    }
    static async process() {
        Obstacle.obstacles.forEach(obstacle => {
            obstacle.process();
        });
    }
    getLine() {
        return this.line;
    }
    getDistanceFromPlayer() {
        return this.distance;
    }
    getEndDistanceFromPlayer() {
        return this.distance + this.obstacle_data.getLength();
    }
    isPlayerOnObstacleDistance() {
        if (this.getDistanceFromPlayer() <= 0 && this.getEndDistanceFromPlayer() >= 0) {
            return true;
        }
        return false;
    }
    isSolid() {
        return this.obstacle_data.isSolid();
    }
    delete() {
        this.html_handler.delete();
        let i = Obstacle.obstacles.indexOf(this);
        Obstacle.obstacles.splice(i, 1);
    }
    static deleteAllObstacles() {
        while (Obstacle.obstacles.length > 0) {
            Obstacle.obstacles[0].delete();
        }
    }
    static getObstacles() {
        return Obstacle.obstacles;
    }
    static spawnRandom(line) {
        Obstacle.spawn(ObstacleData.getRandomObstacleType(), line);
    }
    static spawnByName(obstacle_type, line) {
        Obstacle.spawn(ObstacleData.findByName(obstacle_type), line);
    }
    static spawn(obstacle_type, line) {
        Obstacle.obstacles.push(new Obstacle(obstacle_type, line));
    }
    move() {
        if (this.distance == 1) {
            this.distance -= 0.01;
        }
        this.distance -= Player.getMovement() * (1 - this.distance);
        if (this.distance <= -1) {
            this.delete();
            return;
        }
        this.html_handler.moveTo(this.line, this.distance);
    }
    activateEffect() {
        if (this.activated) {
            return;
        }
        this.activated = true;
        this.obstacle_data.activateEffect();
    }
    checkForPlayer() {
        if (this.isPlayerOnObstacleDistance() && this.line == Player.getLine() && this.isPlayerOnObstacleLevel()) {
            this.activateEffect();
        }
    }
    isPlayerOnObstacleLevel() {
        let obstacle_level = this.obstacle_data.getLevel();
        let player_level = Player.getLevel();
        if (obstacle_level == "full" || player_level == "full") {
            return true;
        }
        if (obstacle_level == player_level) {
            return true;
        }
        return false;
    }
    static async spawnRandomRow() {
        let row = [];
        for (let i = 0; i < Line.getLineAmount(); i++) {
            row.push(ObstacleData.getRandomObstacleType());
        }
        //jeżeli nie ma przeszkody, której można uniknąć, zamień losową przeszkodę na losową inną
        while (!(row.find(obstacle_data => obstacle_data.getLevel() != "full") instanceof ObstacleData)) {
            let i = Math.floor(Math.random() * row.length);
            row[i] = ObstacleData.getRandomObstacleType();
        }
        //spawn
        for (let i = 0; i < row.length; i++) {
            Obstacle.spawn(row[i], i);
        }
    }
}
