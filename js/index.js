// import * as PIXI from 'pixi.js';

import { textStyle, subTextStyle, zombies } from "./model/globals.js";
import Player from "./model/Player.js";
import Spawner from "./model/Spawner.js";
import { loader, canvas } from "./model/globals.js"
import Weather from "./model/Weather.js";
import GameState from "./model/GameState.js";

//trouver un moyen pour que les zombie ne meurent pas systématiquement quand ils nous mordent et qu'on tire quelquesoit la direction du tir
let options = {
    crossOrigin: true
};



// taille du canvas récupéré sur .html
let canvasSize = 400;



//instance de pixi
const app = new PIXI.Application({
    view: canvas,
    width: canvasSize,
    height: canvasSize,
    backgroundColor: 0x312A2B,
    resolution: 2
});

app.stage.interactive= true;

let cursorPosition= { x: 200, y: 200};

app.stage.on("pointermove", (e)=> {
    cursorPosition= e.data.global;          
});

let buttons= 0;
app.stage.on("pointerdown", e=> {
    cursorPosition= e.data.global;
    buttons= e.data.buttons;
});

app.stage.on("pointerup", e=> {
    buttons= e.data.buttons;
});

document.addEventListener("keydown", e => {
    if(e.code === "Space") buttons= 1;
});

document.addEventListener("keyup", e => {
    if(e.code === "Space") buttons= 0;
});

PIXI.settings.SCALE_MODE= PIXI.SCALE_MODES.NEAREST;

let endGame= false;

let score= 0;
let scoreText;

function displayScore(score){
    scoreText= new PIXI.Text(score);
    scoreText.style= new PIXI.TextStyle(subTextStyle);
    scoreText.x= app.screen.width - scoreText.width;
}

displayScore(score);


async function initGame(){
    app.gameState= GameState.PREINTRO;
    let gameScene= createScene("ZombieStorm", "Click to Continue");
    try{
        
        console.log("loading...");
        await loadAssets();
        console.log("loaded...");

        app.weather= new Weather(app);
        const player= new Player(app);
        
        player.scale= 4;

        let hordeSpawn;

        
        // let gameStartScene= createScene("ZombieStorm", "Click to Start");
        // gameStartScene.visible= false;
        // let gameOverScene= createScene("ZombieStorm", "Game Over");
        // gameOverScene.visible= false;
        // let gameRestartScene= createScene("ZombieStorm", "Restart");
        // gameRestartScene.visible= false;
        
        // if(player.dead) app.gameState.GAMEOVER;
        // //visible est l'inverse de gameStarted
        // gamePreIntroScene.visible= app.gameState === "preintro";
        // gameStartScene.visible= app.gameState === "start";
        // gameOverScene.visible= app.gameState === "gameover";

        // game loop, anim du projet, pour faire tourner le carré en fonction de la position de la souris, bouger les personnages
        function gameLoop(){
        
                
        //delta pour éviter les différences de framerate
        app.ticker.add((delta) => {
            if(player.dead) {
                if(!endGame){
                    endGame= true;
                    app.gameState= "gameover";
                }
            }
            
            //visible est l'inverse de gameStarted
            // gamePreIntroScene.visible= app.gameState === "preintro";
            // gameStartScene.visible= app.gameState === "start";
            // gameOverScene.visible= app.gameState === "gameover";
            
            // console.log(cursorPosition);

            player.update(delta, cursorPosition, buttons);
            // console.log(zombieSpawner.spawns)
            // zombieSpawn.forEach(zombie=> zombie.update());
            hordeSpawn.horde.forEach(zombie => {
                zombie.update(delta);
            });
            //5 et 16 sont les radius de collision, les mettre dans des variables
            bulletHitTest(player.shooting.bullets, hordeSpawn.horde, 1, 16);

            switch(app.gameState){
                case "preintro":
                    
                    break;
                case "intro":
                    
                    break;
                case "running":
                    
                    app.stage.removeChild(scoreText);
                    displayScore(score);
                    app.stage.addChild(scoreText);
                    
                    break;
                case "gameover":
                    gameScene= createScene("ZombieStorm", "Game Over");
                    app.gameState= "endgame";
                    // console.log("game over")
                    break;

                // case "endgame":
                //     gameScene.visible= false;
                //     break;
            }
            
            
        });
    }

    

    function clickHandler(e){
        // console.log(app.gameState);
        switch (app.gameState){
            case "preintro":
                
                gameScene.visible= false;
                gameScene= createScene("ZombieStorm", "Click to Start");
                app.gameState= "intro";
                music.play()
                break;

            case "intro":

                player.scale= 1;
                app.gameState= "start";
              
            case "start":
                
                gameScene.visible= false;
                // scoreText.visible= true;
                app.gameState= "running";
                hordeSpawn= new Spawner(app, player);
                app.weather.enableSound();
                gameLoop();
                zombieHorde.play();
                break;

            case "gameover":
                // gameScene.visible= false;
                // gameScene.visible= false;
                // gameScene= createScene("ZombieStorm", "This is the end...");
                app.gameState= "endgame";
                
            case "endgame":
                gameScene.visible= false;
                gameScene= createScene("ZombieStorm", "... restart ?");
                app.gameState= "restart";
                // gameScene.visible= false;
                // gameRestartScene.visible= true;
                // gameScene= createScene("ZombieStorm", "Restart");

            case "restart":
                document.addEventListener("click", ()=> {
                    location.reload();
                });
                document.addEventListener("touchstart", ()=> {
                    location.reload();
                });

            default:
                break;
            
        }
    }

    document.addEventListener("click", clickHandler);
    document.addEventListener("touchstart", clickHandler);
        

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
                score += 1;
                // console.log(score);
                let removedBullet= bullets.shift();
                //enlève bien les bullets mais pas les zombies ;)
                app.stage.removeChild(removedBullet);
                return score;
            }
        });
    });
}

//pour l'affichage du texte du jeu
function createScene(sceneText, sceneSubText){
    
    const sceneContainer= new PIXI.Container();
    const text= new PIXI.Text(sceneText, new PIXI.TextStyle(textStyle));
    text.x= app.screen.width / 2;
    text.y= 0;
    text.anchor.set(.5, 0);

    const subText= new PIXI.Text(sceneSubText, new PIXI.TextStyle(subTextStyle));
    subText.x= app.screen.width / 2;
    subText.y= 50;
    subText.anchor.set(.5, 0);

    sceneContainer.zIndex= 3;
    sceneContainer.addChild(text);
    sceneContainer.addChild(subText);
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


        loader.load();
        
        loader.onComplete.add(resolve);
        loader.onError.add(reject);        
    })
}

initGame();
