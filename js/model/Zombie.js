export default class Zombie{
    constructor(app, player){
        //attention, il y a déjà app dans player... peut-être qu'il y a quelquechose à faire de ce côté
        this.player= player;
        this.app= app;
        // console.log(this.player);

        //création des ennemis
        this.radius= 16;
        this.speed= 2;
        this.zombie= new PIXI.Graphics();
        let r= this.randomSpawnPoint();
        // console.log(r);
        this.zombie.position.set(r.x, r.y);
        this.zombie.beginFill(0xFF0000, 1);
        this.zombie.drawCircle(0, 0, this.radius);
        this.zombie.endFill();
        this.app.stage.addChild(this.zombie);
    }

    //spawning zombies
    randomSpawnPoint(){
        let edge= Math.floor(Math.random() * 4); //donne un chiffre en 0 et 3, pour les 4 coins du canvas
        let spawnPoint= new Victor(0, 0);
        let canvasSize= this.app.screen.width;
        // console.log(spawnPoint);
        switch(edge){
        case 0: //top
            spawnPoint.x= canvasSize * Math.random();
            break;
        case 1: //right
            spawnPoint.x= canvasSize;
            spawnPoint.y= canvasSize * Math.random();
            break;
        case 2: //bottom
            spawnPoint.x= canvasSize * Math.random();
            spawnPoint.y= canvasSize;
            break;
        default: //left
            spawnPoint.x= 0;
            spawnPoint.y= canvasSize * Math.random();
            break;
        }
        return spawnPoint;
        // console.log(spawnPoint);
    }
    
    update(){
        const e = new Victor(this.zombie.position.x, this.zombie.position.y);
        const s = new Victor(this.player.player.position.x, this.player.player.position.y);

        // console.log(e)
        // console.log(s.distance(e))
        //pour que l'ennemi s'arrête s'il rentre en collision avec le joueur et respawn
        console.log(this.player.width);
        if(e.distance(s) <= this.player.width / 2){
            
            let r2= this.randomSpawnPoint();
            // console.log(r);
            this.zombie.position.set(r2.x, r2.y);
            return;
        }else{
            const d= s.subtract(e);
            // console.log(d);
            const v= d.normalize().multiply(this.speed);
            this.zombie.position.set(this.zombie.position.x + v.x, this.zombie.position.y + v.y);
        }
        
    }
}