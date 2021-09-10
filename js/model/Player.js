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
    }

    update(){
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
    }
}