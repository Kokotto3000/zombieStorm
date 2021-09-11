export default class Shooting{
    constructor(app, player){
        // console.log(player);
        this.app= app;
        this.player= player;
        this.bulletSpeed= 4;
        this.bullets= [];
        this.bulletRadius= 5;
        this.maxBullets= 30;
    }

    fire(){
        //pour empêcher de remplir le tableau à l'infini, pas la meilleure soluce, à améliorer
        if(this.bullets.length >= this.maxBullets){
            let bullet= this.bullets.shift();
            //enlève bien les bullets mais pas les zombies ;)
            this.app.stage.removeChild(bullet);            
        }

        this.bullets.forEach(bullet=> this.app.stage.removeChild(bullet));

        this.bullets= this.bullets.filter(b=> 
            Math.abs(b.position.x) < this.app.screen.width &&
            Math.abs(b.position.y) < this.app.screen.height
            );

        this.bullets.forEach(bullet=> this.app.stage.addChild(bullet));
        
        const bullet= new PIXI.Graphics();
        // console.log(this.player)
        bullet.position.set(this.player.position.x, this.player.position.y);
        bullet.beginFill(0x0000ff, 1);
        bullet.drawCircle(0, 0, this.bulletRadius);
        bullet.endFill();
        let angle= this.player.rotation - Math.PI / 2;
        bullet.velocity= new Victor(
            Math.cos(angle), 
            Math.sin(angle))
            .multiply(this.bulletSpeed);
        this.bullets.push(bullet);
        this.app.stage.addChild(bullet);
        //attention il faut retirer les bullets du tableau au fu et à mesure qu'elles sont sensées disparaître
        // console.log(this.bullets.length, this.app.stage.children.length);
    }

    set shoot(shooting){
        if(shooting){
            this.fire();
            this.interval= setInterval(()=> this.fire(), 500);
        }else{
            clearInterval(this.interval);
        }
    }

    update(delta){
        this.bullets.forEach(bullet=> bullet.position.set(bullet.position.x + bullet.velocity.x * delta, bullet.position.y + bullet.velocity.y * delta));
    }
}