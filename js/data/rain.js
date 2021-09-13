import { loader } from "../model/globals.js"

export let rain = {
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
}