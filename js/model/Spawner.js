import Zombie from "./Zombie.js";

export default class Spawner{
    constructor(app, player){
        this.horde= [];
        this.app= app;
        this.player= player;
        this.spawn();     
    }

    spawn(){
        setInterval(()=> {
            for(let i=0; i < 3; i++){
                this.horde.push(new Zombie(this.app, this.player));    
            }
        }, 5000);
        return this.horde;
    }

    get zombieRadius(){
        return this.horde.forEach(zombie => zombie.radius);
    }
}