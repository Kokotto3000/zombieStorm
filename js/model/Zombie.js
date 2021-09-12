import { zombies, loader } from "./globals.js";

export default class Zombie{
    constructor(app, player){
        //attention, il y a déjà app dans player... peut-être qu'il y a quelquechose à faire de ce côté
        this.player= player;
        this.app= app;
        // console.log(this.player);

        //création des ennemis
        // this.radius= 16;
        this.speed= 2;
        this.zombie= new PIXI.Graphics();
        let r= this.randomSpawnPoint();
        // console.log(r);

        let zombieName= zombies[Math.floor(Math.random()*zombies.length)];
        this.speed= zombieName === "quickzee" ? 1 : .25;
        let sheet= loader.resources[`./js/data/${zombieName}.json`].spritesheet;
        this.zombie= new PIXI.AnimatedSprite(sheet.animations.walk);
        this.bite= new PIXI.AnimatedSprite(sheet.animations.attack);
        this.die= new PIXI.AnimatedSprite(sheet.animations.die);
        this.zombie.animationSpeed= zombieName === "quickzee" ? .2 : .1;
        this.zombie.play();
        this.zombie.anchor.set(.5);
        this.zombie.position.set(r.x, r.y);
        this.zombie.zIndex= r.zIndex;
        // this.zombie.beginFill(0xFF0000, 1);
        // this.zombie.drawCircle(0, 0, this.radius);
        // this.zombie.endFill();
        this.app.stage.addChild(this.zombie);
    }

    attack(){
        if(this.attacking) return;
        this.attacking= true;
        this.interval= setInterval(()=> this.player.bitten(), 500);
        this.zombie.textures= this.bite.textures;
        this.zombie.animationSpeed= .1;
        this.zombie.play();
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
            spawnPoint.zIndex= 0;
            break;
        case 1: //right
            spawnPoint.x= canvasSize;
            spawnPoint.y= canvasSize * Math.random();
            spawnPoint.zIndex= 1;
            break;
        case 2: //bottom
            spawnPoint.x= canvasSize * Math.random();
            spawnPoint.y= canvasSize;
            spawnPoint.zIndex= 2;
            break;
        default: //left
            spawnPoint.x= 0;
            spawnPoint.y= canvasSize * Math.random();
            spawnPoint.zIndex= 0;
            break;
        }
        return spawnPoint;
        // console.log(spawnPoint);
    }
    
    update(delta){
        // if(this.player.dead) return;
        const e = new Victor(this.zombie.position.x, this.zombie.position.y);
        const s = new Victor(this.player.player.position.x, this.player.player.position.y);

        // console.log(e)
        // console.log(s.distance(e))
        //pour que l'ennemi s'arrête s'il rentre en collision avec le joueur et respawn
        // console.log(this.player.width);
        if(e.distance(s) <= this.player.width / 2){
            this.attack();
            // let r2= this.randomSpawnPoint();
            // // console.log(r);
            // this.zombie.position.set(r2.x, r2.y);
            return;
        }else{
            const d= s.subtract(e);
            // console.log(d);
            const v= d.normalize().multiply(this.speed * delta);
            this.zombie.scale.x= v.x < 0 ? 1 : -1;
            this.zombie.position.set(this.zombie.position.x + v.x, this.zombie.position.y + v.y);
        }
        
    }

    kill(){
        clearInterval(this.interval);
        // this.app.stage.removeChild(this.zombie);
        this.zombie.textures= this.die.textures;
        this.zombie.zIndex= 0;
        this.zombie.loop= false;
        //si on veut que le zombie disparaisse au bout d'un certain temps
        this.zombie.onComplete = ()=> setTimeout(()=> this.app.stage.removeChild(this.zombie), 10000);
        this.zombie.play();
    }
}