import Zombie from "./Zombie.js";

export default class Spawner{
    constructor(app, player){
        this.horde= [];
        this.app= app;
        this.player= player;
        this.interval= setInterval(()=> this.spawn(), 1000);       
    }

    spawn(){
        if(this.player.dead) clearInterval(this.interval);
        for(let i=0; i < 3; i++){
            this.horde.push(new Zombie(this.app, this.player));    
        }
        return this.horde;
        
    }

    // get zombieRadius(){
    //     return this.horde.forEach(zombie => zombie.radius);
    // }
}