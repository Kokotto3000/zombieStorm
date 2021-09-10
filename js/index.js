// import * as PIXI from 'pixi.js';

// import Victor from "../victor.js";
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

//taille du carré
let squareWidth = 32;
// instance de ce "carré"
const square = new PIXI.Sprite(PIXI.Texture.WHITE);
// on met son "ancre au milieu"
square.anchor.set(0.5);
//on met de le "carré" au milieu du canvas
square.position.set(app.screen.width / 2, app.screen.height / 2);
// le carré est bien sûr un carré
square.width = square.height = squareWidth;
//sa couleur
square.tint = 0xea985d;

//affichage du carré
app.stage.addChild(square);

//création des ennemis
let enemyRadius= 16;
let enemySpeed= 2;
const enemy= new PIXI.Graphics();
let r= randomSpawnPoint();
console.log(r);
enemy.position.set(r.x, r.y);
enemy.beginFill(0xFF0000, 1);
enemy.drawCircle(0, 0, enemyRadius);
enemy.endFill();
app.stage.addChild(enemy);

//game loop, anim du projet, pour faire tourner le carré en fonction de la position de la souris, bouger les personnages
app.ticker.add((delta) => {
  const cursorPosition = app.renderer.plugins.interaction.mouse.global;
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
  let angle =
    Math.atan2(
      cursorPosition.y - square.position.y,
      cursorPosition.x - square.position.x
    ) +
    Math.PI / 2;
  square.rotation = angle;

  let e = new Victor(enemy.position.x, enemy.position.y);
  let s= new Victor(square.position.x, square.position.y);

  //pour que l'ennemi s'arrête s'il rentre en collision avec le joueur et respawn
  if(e.distance(s) < squareWidth / 2 ){
    let r= randomSpawnPoint();
    enemy.position.set(r.x, r.y);
    return;
  }
  let d= s.subtract(e);
  console.log(d);
  let v= d.normalize().multiply(enemySpeed);
  enemy.position.set(enemy.position.x + v.x, enemy.position.y + v.y);
});

//spawning zombies
function randomSpawnPoint(){
  let edge= Math.floor(Math.random() * 4); //donne un chiffre en 0 et 3, pour les 4 coins du canvas
  let spawnPoint= new Victor(0, 0);
  console.log(spawnPoint);
  switch(edge){
    case 0: //top
      spawnPoint.x= canvasSize * Math.random();
      break;
    case 1: //right
      spawnPoint.x= canvasSize;
      spawnPoint.y= canvasSize * Math.random();
      break;
    case 2: //bottom
      spawnPoint.x= canvasSize * Math.random();
      spawnPoint.y= canvasSize;
      break;
    default: //left
      spawnPoint.x= 0;
      spawnPoint.y= canvasSize * Math.random();
      break;
  }
  return spawnPoint;
}
