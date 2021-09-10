// import * as PIXI from 'pixi.js';

import Player from "./model/Player.js";
import Zombie from "./model/Zombie.js";

// import Victor from "victor.js";
//import Matter from "matter-js";


// taille du canvas récupéré sur .html
let canvasSize = 256;
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

const zombie= new Zombie(app, player);

//game loop, anim du projet, pour faire tourner le carré en fonction de la position de la souris, bouger les personnages
app.ticker.add((delta) => {
    player.update();
    zombie.update();
});
