class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame); 
        scene.add.existing(this); 
        this.isFiring = false; 
        this.moveSpeed = 2; 
        this.sfxRocket = scene.sound.add('sfx_rocket'); 
        
    }

    
    create() { //taken from Phaser sandbox example (pointer lock system)
        mouse.on('pointerdown', function(pointer){
            if(!this.isFiring){
                this.input.mouse.requestPointerLock(); 
            }
        }, this);

        mouse.on('pointermove', function(pointer){ //does not follow pointer :((
            if(!this.isFiring){
                this.x = pointer.movementX; 
                //this.y += pointer.movementY; 

                this.x = Phaser.Math.Wrap(this.x, 0, game.renderer.width); 
                //this.y = Phaser.Math.Wrap(this.y, 0, game.renderer.height); 
            }
        }, this); 
    }

    update() {

        if(mouse.activePointer.leftButtonDown() && !this.isFiring){
            this.isFiring = true; 
            this.sfxRocket.play(); 
        }
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding){
            this.y -= this.moveSpeed;
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
        this.y = game.config.height - borderUISize - borderPadding; 
    }

}