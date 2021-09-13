import * as particles from '@pixi/particle-emitter';
import { loader } from './globals.js';

export default class Weather{
    constructor(app){
        console.log(loader);
        this.lightningGap= {min: 7000, max: 14000};
        this.app= app;
        this.createAudio();
        this.lightning= new PIXI.Sprite(PIXI.Texture.WHITE);
        this.lightning.width= this.lightning.height = app.screen.width;
        this.lightning.tint= 0xffffff;
        this.lightning.alpha= .8;
        this.flash();
        //rain
        const container= new PIXI.ParticleContainer();
        container.zIndex= 5;
        app.stage.addChild(container);
        // this.emitter= new particles.Emitter(container, upgradeConfig(rain, [loader.resources.rain.texture]));
        this.emitter= new particles.Emitter(container, {
            "lifetime": {
                "min": 0.81,
                "max": 0.81
            },
            "frequency": 0.004,
            "emitterLifetime": 0,
            "maxParticles": 1000,
            "addAtBack": false,
            "pos": {
                "x": 0,
                "y": 0
            },
            "behaviors": [
                {
                    "type": "alphaStatic",
                    "config": {
                        "alpha": 0.5
                    }
                },
                {
                    "type": "moveSpeedStatic",
                    "config": {
                        "min": 3000,
                        "max": 3000
                    }
                },
                {
                    "type": "scaleStatic",
                    "config": {
                        "min": 1,
                        "max": 1
                    }
                },
                {
                    "type": "rotationStatic",
                    "config": {
                        "min": 65,
                        "max": 65
                    }
                },
                {
                    "type": "textureRandom",
                    "config": {
                        "textures": [
                            loader.resources.rain.texture
                        ]
                    }
                },
                {
                    "type": "spawnShape",
                    "config": {
                        "type": "rect",
                        "data": {
                            "x": -600,
                            "y": -460,
                            "w": 900,
                            "h": 20
                        }
                    }
                }
            ]
        });
        
        // console.log(this.emitter);
        this.elapsed= Date.now();
        
        this.update= ()=> {
                let now= Date.now();
                this.emitter.update((now - this.elapsed) * .001);
                
                this.elapsed= now;
                
                requestAnimationFrame(this.update);
            }
        this.emitter.emit= true;
        this.update(this.emitter, this.elapse);
    }
    
    createAudio(){
        this.thunder= new Audio("../../assets/sound/thunder.mp3");
        this.rain= new Audio("../../assets/sound/rain.mp3");
        this.rain.loop= true;
        // this.rain.play();
        // this.thunder.play();
        // this.rain.addEventListener("ended", ()=> {
        //     this.thunder.play();
        //     this.rain.play();
            
        // });
    }

    async flash(){
        await new Promise((res)=>
        setTimeout(
            res,
            this.lightningGap.min +
                (this.lightningGap.max - this.lightningGap.min) *
                Math.random()
        ));
        this.app.stage.addChild(this.lightning);
        if(this.sound) this.thunder.play();
        await new Promise(res => setTimeout(res, 200));
        this.app.stage.removeChild(this.lightning);
        this.flash();
    }

    enableSound(){
        
        this.sound= true;    
        this.rain.play();
        this.app.stage.addChild(this.lightning);
        setTimeout(()=> this.app.stage.removeChild(this.lightning), 200);
        this.thunder.play();
    }
}