import 'phaser';

export default class NorthPoleDropZone extends Phaser.Scene
{
    private cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    private player : Phaser.Physics.Arcade.Sprite;
    private roofTop: Phaser.Physics.Arcade.StaticGroup;
    
    private targets : Phaser.Physics.Arcade.Sprite[] = [];

    private environment: Phaser.Physics.Arcade.StaticGroup;

    private lastTargetAddTime : number = 0; 
    private text;

    constructor ()
    {
        super('NorthPoleDropZone');
    }

    update(time, delta){

        this.text.setText([
            `${this.input.activePointer.worldX} world x ${this.input.x} input x`,
        ]);

        if(this.input.activePointer.isDown) {
            if(this.input.activePointer.x > this.player.x) {
                this.player.setVelocityX(160);
            }

        }
        else {
            if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-160);

                this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(160);

                this.player.anims.play('right', true);
            }
            else
            {
                this.player.setVelocityX(0);

                this.player.anims.play('turn');
            }

            if (this.cursors.up.isDown && this.player.body.touching.down)
            {
                this.player.setVelocityY(-330);
            }
        }
        this.conditionallyAddTarget(time);
    }

    conditionallyAddTarget(time: number){
        let rand = Math.random();
        if(rand < .7 && time - this.lastTargetAddTime > 1000) {
            this.lastTargetAddTime = time;
            let target = this.physics.add.sprite(-200, phaserGameHeight-200, 'target');

            target.anims.play("targetRight");

            target.anims.msPerFrame = Math.min((1000/15)/rand, 1000/11);

            target.setVelocityX(200 * rand);
            this.physics.add.collider(target, this.environment);
            target.setCollideWorldBounds(false);
            this.targets.push(target);
        }
    }


    preload()
    {
        this.load.image('ground', 'assets/platform.png');
        this.load.image('sky', 'assets/sky.png');

        this.load.spritesheet('santa', 
            'assets/theSantaman.png',
            { frameWidth: 96, frameHeight: 96 }
        );

        
        this.load.spritesheet('target', 
            'assets/target.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create(){

        let skyImage = this.add.image(phaserGameWidth/2, phaserGameHeight/2, 'sky');
        skyImage.setScale(phaserGameWidth/skyImage.width, phaserGameHeight/skyImage.height);
        this.createDropZone();
        this.loadSprites();

        this.input.mouse.disableContextMenu();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.addPointer(1);
        this.input.on('pointerup', function (pointer) {
            if(pointer.getDuration() < 200 && pointer.getDuration() > 1) {
                alert("wow!");
            }
        });
            this.text = this.add.text(10, 10, 'Use up to 4 fingers at once', { font: '16px Courier', fill: '#00ff00' });
        // const logo = this.add.image(400, 70, 'logo');
    }

    createDropZone(){
        this.environment = this.physics.add.staticGroup();

        this.environment.create(phaserGameWidth/2, phaserGameHeight, 'ground').setScale(2).refreshBody();//ground
        this.environment.create(phaserGameWidth/2, phaserGameHeight/4, 'ground');//perch
    }

    loadSprites(){
        this.player = this.physics.add.sprite(100, 50, 'santa');
        this.physics.add.collider(this.player, this.environment);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('santa', { start: 8, end: 16 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'santa', frame: 90 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('santa', { start: 98, end: 106 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "targetRight",
            frames: this.anims.generateFrameNumbers('target', { start: 5, end: 8 }),
            frameRate: 15,
            repeat: -1
        })
    }
}

const phaserGameWidth : number = 600;
const phaserGameHeight: number = 600;

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#00000',
    width: phaserGameWidth,
    height: phaserGameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: NorthPoleDropZone
};

const game = new Phaser.Game(config);
