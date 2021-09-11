import Shooting from "./Shooting.js";

export default class Player{
    constructor(app){
        this.app= app;
        // console.log(this.app);
        //taille du carré/joueur
        this.width = 32;
        // instance de ce "carré"
        this.player = new PIXI.Sprite(PIXI.Texture.WHITE);
        // on met son "ancre au milieu"
        this.player.anchor.set(0.5);
        //on met de le "carré" au milieu du canvas
        this.player.position.set(app.screen.width / 2, app.screen.height / 2);
        // le carré est bien sûr un carré
        this.player.width = this.player.height = this.width;
        //sa couleur
        this.player.tint = 0xea985d;

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
        this.healthBar.zIndex= 1;
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
        this.player.rotation = angle;

        if(mouse.buttons !== this.lastMouseButton){
            this.shooting.shoot= mouse.buttons !== 0;
            this.lastMouseButton= mouse.buttons;
        }
        this.shooting.update(delta);
    }
}