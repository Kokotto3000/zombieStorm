// import * as PIXI from 'pixi.js';

import Player from "./model/Player.js";
import Spawner from "./model/Spawner.js";

// import Victor from "victor.js";
//import Matter from "matter-js";

//trouver un moyen pour que les zombie ne meurent pas systématiquement quand ils nous mordent et qu'on tire quelquesoit la direction du tir


// taille du canvas récupéré sur .html
let canvasSize = 512;
const canvas = document.getElementById("mycanvas");
//instance de pixi
const app = new PIXI.Application({
    view: canvas,
    width: canvasSize,
    height: canvasSize,
    backgroundColor: 0x5c812f
});

const player= new Player(app);
// console.log(player);
// const zombieSpawner= new Spawner(zombie);
// console.log(zombieSpawner.spawns);

// const zombieSpawn= [];


// const horde= setInterval(()=> {
//     for(let i=0; i < 3; i++){
//         zombieSpawn.push(new Zombie(app, player));    
//     }
// }, 5000);

let gameStartScene= createScene("Click to Start");
app.gameStarted= false;
let gameOverScene= createScene("Game Over");
gameOverScene.visible= false;

let hordeSpawn;

console.log(player.dead);

// console.log(hordeSpawn);

// console.log(zombieSpawner.spawn());

// zombieSpawner.spawns.forEach(zombie=> console.log(zombie.zombie));



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
            bulletHitTest(player.shooting.bullets, hordeSpawn.horde, 5, 16);
        });
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
    sceneContainer.zIndex= 1;
    sceneContainer.addChild(text);
    app.stage.addChild(sceneContainer);
    return sceneContainer;
}

function startGame(){
    if(!app.gameStarted){
        app.gameStarted= true;
        hordeSpawn= new Spawner(app, player);
         
        gameLoop();
    }
    return;
}


document.addEventListener("click", startGame);

