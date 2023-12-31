class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame); 
        scene.add.existing(this); 
        this.isFiring = false; 
        this.moveSpeed = 2; 
        this.sfxRocket = scene.sound.add('sfx_rocket'); 
        
    }

    //
    create() { 
        //code taken and implemented from Phaser sandbox example (pointer lock system)
        //https://phaser.io/examples/v3/view/input/mouse/pointer-lock
        mouse.on('pointerdown', function(pointer){
            this.input.mouse.requestPointerLock(pointer); 
        }, this); 
        
    }

    update() {

        mouse.on('pointermove', function(pointer) { 
            if(!this.isFiring){
                //code for mouse control implemented from breakout example 
                //https://phaser.io/examples/v3/view/games/breakout/breakout
                this.x = Phaser.Math.Clamp(pointer.x, borderUISize + borderPadding, game.config.width-borderPadding-borderUISize); 
                
                //this.x = pointer.movementX; 
                //this.x = Phaser.Math.Wrap(this.x, 0, game.renderer.width); 
                
            }
        }, this); 

        if(mouse.activePointer.leftButtonDown() && !this.isFiring){
            this.isFiring = true; 
            this.sfxRocket.play(); 
        }
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding){
            //this.y -= this.moveSpeed;

            //code taken and implemented from Phaser sandbox example (pointer lock system)
            //https://phaser.io/examples/v3/view/input/mouse/pointer-lock
            this.x = Phaser.Math.Clamp(mouse.x, borderUISize + borderPadding, game.config.width-borderPadding-borderUISize); 
            this.y = Phaser.Math.Clamp(mouse.y, borderUISize + borderPadding, game.config.width-borderPadding-borderUISize); 
            //this.x = Phaser.Math.Wrap(this.y, 0, game.renderer.width); 
            //this.y = Phaser.Math.Wrap(this.x, 0, game.renderer.height); 

        }
        if(this.y <= borderUISize * 3 + borderPadding){
            this.isFiring = false; 
            this.y = game.config.height - borderUISize - borderPadding; 
        }

        /*if(!this.isFiring){
            if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                this.x -= this.moveSpeed; 
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width){
                this.x += this.moveSpeed; 
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyF)){
            this.isFiring = true; 
            this.sfxRocket.play();
        }
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding){
            this.y -= this.moveSpeed; 
        }
        if(this.y <= borderUISize * 3 + borderPadding){
            this.isFiring = false; 
            this.y = game.config.height - borderUISize - borderPadding; 
        } */ 
    }

    reset(){
        this.isFiring = false; 
        //this.y = game.config.height - borderUISize - borderPadding; 
    }

}