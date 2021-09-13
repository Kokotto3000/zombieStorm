import Shooting from "./Shooting.js";
import { loader } from "./globals.js";

export default class Player{
    constructor(app){
        this.app= app;
        // console.log(this.app);
        //taille du carré/joueur
        this.width = 32;
        
        let sheet= loader.resources["hero"].spritesheet;        
        this.idle= new PIXI.AnimatedSprite(sheet.animations.idle); 
        
        this.shoot= new PIXI.AnimatedSprite(sheet.animations.shoot);
        this.player= new PIXI.AnimatedSprite(sheet.animations.idle);
        //trouver qqch pour que les zombies qui arrivent de haut soiebt derrière et ceux dessous, devant
        // this.player.zIndex= 1;
        this.player.anchor.set(.5, .3);
        this.player.position.set(app.screen.width / 2, app.screen.height / 2);
        this.player.animationSpeed= 0.1;
        this.player.play();
        this.player.zIndex= 1;
        // return this.player;
        // // le carré est bien sûr un carré
        // this.player.width = this.player.height = this.width;
        // //sa couleur
        // this.player.tint = 0xea985d;

        //affichage du carré
        this.app.stage.addChild(this.player);

        this.lastMouseButton= 0;
        this.shooting= new Shooting(app, this.player);
    
        //health bar
        this.maxHealth= 100;
        this.health= this.maxHealth;
        const margin= 16;
        const barHeight= 8;
        this.healthBar= new PIXI.Graphics();
        this.healthBar.beginFill(0xff0000);
        this.healthBar.initialWidth= app.screen.width - 2 * margin;
        this.healthBar.drawRect(margin, app.screen.height - barHeight - margin/2, this.healthBar.initialWidth, barHeight);
        this.healthBar.endFill();
        this.healthBar.zIndex= 3;
        this.app.stage.sortableChildren= true;
        this.app.stage.addChild(this.healthBar);
        this.dead= false;
    }

    bitten(){
        this.health -= 1;
        this.healthBar.width= (this.health/this.maxHealth)* this.healthBar.initialWidth;
        if(this.health <= 0) this.dead= true;
    }

    update(delta){
        if(this.dead) return;
        // this.bitten();
        const mouse= this.app.renderer.plugins.interaction.mouse;
        const cursorPosition = this.app.renderer.plugins.interaction.mouse.global;
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
        let angle =
            Math.atan2(
            cursorPosition.y - this.player.position.y,
            cursorPosition.x - this.player.position.x
            ) +
            Math.PI / 2;
            // le joueur tourne en fonction de cet angle
        this.rotation= angle;
        this.player.angle= this.rotation;
        this.player.scale.x= cursorPosition.x < this.player.position.x ? -1 : 1;

        if(mouse.buttons !== this.lastMouseButton){

            this.player.textures= mouse.buttons === 0 ? this.idle.textures : this.shoot.textures;
            this.shooting.shoot= mouse.buttons !== 0;
            this.lastMouseButton= mouse.buttons;
        }
        this.shooting.update(delta);
    }

    set scale(s){
        this.player.scale.set(s);
    }
    
    get scale(){
        return this.player.scale;
    }
}