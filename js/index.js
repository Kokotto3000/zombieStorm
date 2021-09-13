// import * as PIXI from 'pixi.js';

import { zombies } from "./model/globals.js";
import Player from "./model/Player.js";
import Spawner from "./model/Spawner.js";
import { loader} from "./model/globals.js"
import Weather from "./model/Weather.js";

//trouver un moyen pour que les zombie ne meurent pas systématiquement quand ils nous mordent et qu'on tire quelquesoit la direction du tir
let options = {
    crossOrigin: true
};

// taille du canvas récupéré sur .html
let canvasSize = 400;
const canvas = document.getElementById("mycanvas");
//instance de pixi
const app = new PIXI.Application({
    view: canvas,
    width: canvasSize,
    height: canvasSize,
    backgroundColor: 0x312A2B,
    resolution: 2
});

PIXI.settings.SCALE_MODE= PIXI.SCALE_MODES.NEAREST;

async function initGame(){

    try{
        
        console.log("loading...");
        await loadAssets();
        console.log("loaded...");

        app.weather= new Weather(app);
        const player= new Player(app);

        let hordeSpawn;

        let gameStartScene= createScene("Click to Start");
        app.gameStarted= false;
        let gameOverScene= createScene("Game Over");
        gameOverScene.visible= false;

        // game loop, anim du projet, pour faire tourner le carré en fonction de la position de la souris, bouger les personnages
        function gameLoop(){    
            //visible est l'inverse de gameStarted
            gameStartScene.visible= !app.gameStarted;
            //delta pour éviter les différences de framerate
            app.ticker.add((delta) => {
                gameOverScene.visible= player.dead;
                player.update(delta);        
                // console.log(zombieSpawner.spawns)
                // zombieSpawn.forEach(zombie=> zombie.update());
                hordeSpawn.horde.forEach(zombie => {
                    zombie.update(delta);
                });
                //5 et 16 sont les radius de collision, les mettre dans des variables
                bulletHitTest(player.shooting.bullets, hordeSpawn.horde, 5, 16);
            });
        }

        function startGame(){
            if(!app.gameStarted){
                app.gameStarted= true;
                hordeSpawn= new Spawner(app, player);
                app.weather.enableSound();
                gameLoop();
            }
            return;
        }

        document.addEventListener("click", startGame);

    }catch(error){
        console.log(error.message);
        console.log(error);
        console.log("load failed");
    }
}



function bulletHitTest(bullets, zombies, bulletRadius, zombieRadius){
    bullets.forEach((bullet)=> {
        zombies.forEach((zombie, index) => {
            let dx= zombie.zombie.position.x - bullet.position.x;
            let dy= zombie.zombie.position.y - bullet.position.y;
            let distance= Math.sqrt(dx*dx + dy*dy);
            if(distance < bulletRadius + zombieRadius){
                zombies.splice(index, 1);
                zombie.kill();
                let removedBullet= bullets.shift();
                //enlève bien les bullets mais pas les zombies ;)
                app.stage.removeChild(removedBullet);
            }
        });
    });
}

//pour l'affichage du texte du jeu
function createScene(sceneText){
    const sceneContainer= new PIXI.Container();
    const text= new PIXI.Text(sceneText);
    text.x= app.screen.width / 2;
    text.y= 0;
    text.anchor.set(.5, 0);
    sceneContainer.zIndex= 3;
    sceneContainer.addChild(text);
    app.stage.addChild(sceneContainer);
    return sceneContainer;
}



async function loadAssets(){
    return new Promise((resolve, reject) => {       
        // const loader= new PIXI.Loader();
        zombies.forEach(z => loader.add(`./js/data/${z}.json`, options));
        loader.add("hero", "./js/data/hero_male.json", options);
        loader.add("bullet", "./assets/img/bullet.png", options);
        loader.add("rain", "./assets/img/rain.png", options);
        // PIXI.sound.add('rain', './assets/sound/rain.mp3');
        // loader.add("rainSound", "", options);
        loader.load();
        
        loader.onComplete.add(resolve);
        loader.onError.add(reject);

        
    })
}

initGame();
