class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    //list of problem :D 
 
    //high score not functioning 
    //timer not functioning 
    //check if mouse control (current implementation) is ok 
    //check if rocket control (current implementation) is ok
    //check if background music (current implementation) is ok
    //new enemy spaceships are moving off the screen (???)
    //scores being multiplied by some factor (???)


    //mods implemented (or attempted to)

    //mouse control (+5)
    //player controls rocket after its fired (+1)
    //new background sprite (+1)
    //parallax effect (+3)
    //new background music (+1)
    //speed increase after 30 secs (+1) 
    //new enemy spaceship (+5) 
    //high score (+1)
    //timer/countdown (+3) 

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('background', './assets/pixil-frame-0.png'); 
        this.load.image('stars', './assets/pixil-frame-1.png'); 
        this.load.image('hardmode', 'assets/pixil-frame-2.png'); ///not working? 
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0,0); 

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); 
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R); 
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); 
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); 

        mouse = this.input; 
    
        this.newship = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'hardmode', 0, 50).setOrigin(0,0);
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        
    
        this.newship.moveSpeed *= 1.25; //newship has high speed 

        this.halftime = this.time.delayedCall(game.settings.gameTimer/2, () => {
            this.ship01.moveSpeed *= 1.5;
            this.ship02.moveSpeed *= 1.5;
            this.ship03.moveSpeed *= 1.5;
            this.newship.moveSpeed *= 1.5; 
        }, null, this); 

        this.anims.create({
            key: 'explode', 
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        }); 

        this.timerText = this.add.text(16, 32, 'Timer: 60', { fontSize: '32px', fill: '#fff' });
        this.timer = 60;

        this.timedEvent = this.time.delayedCall(60000, ()=>{
            console.log(this.timer); 
            if(this.gameOver == false){
                this.timer--; 
                this.timerText.setText('Timer: ' + this.timer); //what var goes in here? 
            } 
        }, [], this); 
        



        //this.highScore = 0; //initialize high score 
        
        this.highScore = localStorage.getItem('highScore') || 0;

        this.p1Score = 0; 
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
          }
          this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
          this.highScoreText = this.add.text(16, 16, 'High Score: 0', { fontSize: '32px', fill: '#fff' });

          //this.add.text(16, 16, 'High Score: ', { fontSize: '32px', fill: '#fff' });

          // GAME OVER flag
          this.gameOver = false; 

          scoreConfig.fixedWidth = 0;
          this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
              this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
              this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
              this.gameOver = true; 
          }, null, this);  

        


    } 
    update(){
        
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.background.tilePositionX -= 1; 
        this.stars.tilePositionX -= 3; 

        if(!this.gameOver){
            this.p1Rocket.update(); 
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.newship.update(); 
        } 

        let progress = this.timedEvent.getProgress(); 
        let progressinSeconds = Math.round(progress * 100); 
        console.log(Math.round(progress * 100)); 
        this.timerText.setText(progressinSeconds); 
        //this.text.setText(`Event.progress: ${this.timedEvent.getProgress().toString().substr(0, 4)}`);
        

        if(this.checkCollision(this.p1Rocket, this.newship)){
            this.p1Rocket.reset(); 
            this.shipExplode(this.newship); 
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            //console.log('kaboom ship 03');
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
          }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            //console.log('kaboom ship 02');
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            //console.log('kaboom ship 01');
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);   
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
      }
    
    shipExplode(ship){
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });        
        this.p1Score += ship.points;
        //console.log(p1Score); how to print p1Score value????
        console.log('hi', this.p1Score, this.highScore)
        if (this.p1Score > this.highScore) {
            this.highScore = this.p1Score; 
            //console.log()
            this.highScoreText.setText('High Score: ' + this.highScore);
            localStorage.setItem('highScore', this.highScore);
        } 

        this.scoreLeft.text = this.p1Score; 
        this.sound.play('sfx_explosion');
    }

}
