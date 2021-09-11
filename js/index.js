// import * as PIXI from 'pixi.js';

import Player from "./model/Player.js";
import Spawner from "./model/Spawner.js";
import Zombie from "./model/Zombie.js";

// import Victor from "victor.js";
//import Matter from "matter-js";


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

const hordeSpawn= new Spawner(app, player);
// console.log(hordeSpawn);

// console.log(zombieSpawner.spawn());

// zombieSpawner.spawns.forEach(zombie=> console.log(zombie.zombie));

// game loop, anim du projet, pour faire tourner le carré en fonction de la position de la souris, bouger les personnages
app.ticker.add((delta) => {
    player.update();
    // console.log(zombieSpawner.spawns)
    // zombieSpawn.forEach(zombie=> zombie.update());
    hordeSpawn.horde.forEach(zombie => {
        zombie.update();
    });
    bulletHitTest(player.shooting.bullets, hordeSpawn.horde, 5, 16);
});

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
        })
    })
}