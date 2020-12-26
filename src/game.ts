import 'phaser';
import Elf from './elf'
import Pedestrian from './pedestrian';
import Snowball from './snowball';
import Menu from './menu'
import MrsClaus from './mrsclaus';
import Reindeer from './reindeer';
import Goblin from './goblin';

export default class NorthPoleDropZone extends Phaser.Scene
{
    static restart: boolean = false;
    private cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    private player : Phaser.Physics.Arcade.Sprite;

    private pedestrians : Phaser.GameObjects.Group;

    private ground: Phaser.Physics.Arcade.StaticGroup;
    private santaFallZone: Phaser.Physics.Arcade.StaticGroup;

    private santaPerch: Phaser.Physics.Arcade.StaticGroup;

    private lastTargetAddTime : number = 0; 
    private mrsClausSpawned : boolean;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private firstStart = true;
    constructor ()
    {
        super('NorthPoleDropZone');
    }

    update(time, delta){
        if(NorthPoleDropZone.restart){
            NorthPoleDropZone.restart = false;
            this.scene.restart();
            return;
        }
        if(this.input.activePointer.isDown) {
            if((this.input.activePointer.x - this.player.x) > 45) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            } else if((this.input.activePointer.x - this.player.x) < -45) {
                this.player.anims.play('left', true);
                this.player.setVelocityX(-160);
            } else {
                this.player.body.stop();
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

                this.player.anims.play('front');
            }
        }
        this.conditionallyAddTarget(time);
    }

    addSnowball(santaX: number, santaY: number){
        let snowball = new Snowball(this, santaX, santaY + 20);
        this.physics.add.collider(snowball.sprite, this.pedestrians/*this.targetsElf.map(elf => elf.sprite)*/, this.collide.bind(this));
        this.physics.add.collider(snowball.sprite, this.ground, snowball.collide.bind(snowball));
    }

    collide(object1 : Phaser.Types.Physics.Arcade.GameObjectWithBody, object2 : Phaser.Physics.Arcade.Sprite)
    {
        object1.getData('object').collide(object2);
        object2.getData('object').collide(object1);
    }

    private conditionallyAddTarget(time: number){
        let rand = Math.random();

        if(rand > .98 && time - this.lastTargetAddTime >  Math.max(600-this.score/300, ((1000)- Math.pow(2, this.score/55)))){
            let reindeer = new Reindeer(this, 0, 200 + (Math.random() * 300));
            this.pedestrians.add(reindeer.sprite, true);
            reindeer.startWorldCollision();
        }
        if(rand < .7 && time - this.lastTargetAddTime > (800)) {
            this.lastTargetAddTime = time;
            let dir = 'left';
            let x = 610;
            if(rand < .3) {
                dir = 'right';
                x = -10;
            }
            let elf = new Elf(this, x, phaserGameHeight-80, dir)
            this.pedestrians.add(elf.sprite, true);
            elf.startWorldCollision();
        }
        if(rand > .95  && time - this.lastTargetAddTime > 500 && !this.mrsClausSpawned) {
            this.mrsClausSpawned = true;

            let dir = 'left';
            let x = 600;
            if(Math.random() < .4) {
                dir = 'right';
                x = -10;
            }

            let mc = new MrsClaus(this, x, phaserGameHeight-100, dir)
            this.pedestrians.add(mc.sprite, true);
            mc.startWorldCollision();
        } else if(this.mrsClausSpawned) {
            if(!this.pedestrians.getChildren().find(x => x.name == "mrsclaus"))
            this.mrsClausSpawned = false;
        }
        if(rand >= .99 && time - this.lastTargetAddTime > 500) {
            this.lastTargetAddTime = time;
            let dir = 'left';
            let x = 610;
            if(rand > .995) {
                dir = 'right';
                x = -10;
            }
            let gob = new Goblin(this, x, phaserGameHeight-80, dir)
            this.pedestrians.add(gob.sprite, true);
            gob.startWorldCollision();
        }
    }


    public preload()
    {
        this.load.image('ground', 'assets/ground.png');
        this.load.image('building', 'assets/building.png');
        this.load.image('side1', 'assets/side1.png');
        this.load.image('side2', 'assets/side2.png');
        this.load.image('santaperch', 'assets/santaperch.png')
        this.load.image('sky', 'assets/sky.png');

        this.load.spritesheet('santa', 
            'assets/santasheet.png',
            { frameWidth: 116, frameHeight: 144 }
        );
        Elf.preloadAssets(this);
        Goblin.preloadAssets(this);
        Reindeer.preloadAssets(this);
        MrsClaus.preloadAssets(this);
        Snowball.preloadAssets(this);
    }

    public create(){
        this.score = 0;

        this.input.mouse.disableContextMenu();

        let skyImage = this.add.image(phaserGameWidth/2, phaserGameHeight/2, 'sky');
        skyImage.setScale(phaserGameWidth/skyImage.width, phaserGameHeight/skyImage.height);
        this.createDropZone();

        this.loadSantaman();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.addPointer(1);
        this.input.on('pointerup', function (pointer) {
            if(pointer.getDuration() < 200 && pointer.getDuration() > 1) {
                this.addSnowball(this.player.x, this.player.y);
            }
        }.bind(this));

        this.input.keyboard.on('keydown-SPACE', function (event) {
            this.addSnowball(this.player.x, this.player.y);
        }.bind(this));
        this.input.keyboard.addCapture('SPACE');

        Elf.create(this);
        Goblin.create(this);
        Reindeer.create(this);
        MrsClaus.create(this);
        this.pedestrians = this.add.group();        
        this.physics.world.setBounds(-200, -200, phaserGameWidth+400, phaserGameHeight + 400, true, true, true, true);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_BOUNDS, (a) => {
             a.gameObject.getData('object').collideWorldBounds();
        });
        this.physics.add.collider(this.pedestrians, this.ground);

        this.scoreText = this.add.text(500, 25, this.score.toString(), { font: '25px Slackey', fill: '#ffffff' });

        if(this.firstStart == true){
            this.firstStart = false;
            this.scene.run('menu');
            this.scene.pause();
        }
    }

    public updateGameScore(points: number, gameOver: boolean, message: string = null){
        this.score += points;
        this.scoreText.setText(this.score.toString());
        if(gameOver){
            this.time.delayedCall(1500, (() =>{
                NorthPoleDropZone.restart = true;
            }), null, this);

            this.time.delayedCall(1300, (() =>{
                Menu.setTitle("Game Over!");
                if(message){
                    Menu.setBody(message);
                }
                this.scene.pause();

                this.scene.run('menu');
            }), null, this);
        }
    }

    createDropZone(){

        this.santaPerch = this.physics.add.staticGroup();
        this.santaPerch.create(phaserGameWidth/2, phaserGameHeight-230, 'building').setScale(.5).refreshBody();//perch

        var side1 = this.physics.add.staticGroup();
        side1.create(0, 365, 'side1').setScale(.5).refreshBody();

        var side2 = this.physics.add.staticGroup();
        side2.create(phaserGameWidth, 420, 'side2').setScale(.5).refreshBody();

        this.ground = this.physics.add.staticGroup();
        this.ground.create(phaserGameWidth/2, phaserGameHeight, 'ground').setScale(.5).refreshBody();//ground


    }

    loadSantaman(){
        this.player = this.physics.add.sprite(300, 80, 'santa').setScale(.66);
        this.player.setSize(2, 144);
        this.player.setDisplaySize(116*.66, 144*.66);
        
        this.physics.add.collider(this.player, this.santaPerch);
        this.player.setBounce(.1);
        this.physics.add.collider(this.player, this.ground, (() => 
            {
                // this.player.body.enable = false;
                // this.updateGameScore(0, true, "Santa fell off the roof! \r\n Christmas is ruined!")
            }).bind(this));
        this.player.setCollideWorldBounds(true);

        this.santaFallZone = this.physics.add.staticGroup();
        this.santaFallZone.create(phaserGameWidth/2, 400, 'ground')
        this.santaFallZone.setVisible(false);
        this.physics.add.overlap(this.santaFallZone, this.player,  (() => 
        {
            this.updateGameScore(0, true, "Santa fell off the roof! \r\n Christmas is ruined!")
        }).bind(this));

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('santa', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('santa', { start: 2, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'front',
            frames: this.anims.generateFrameNumbers('santa', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        var parapet = this.physics.add.staticGroup();
        parapet.create(phaserGameWidth/2, 165, 'santaperch').setScale(.5).refreshBody();
        
    }
}

const phaserGameWidth : number = 600;
const phaserGameHeight: number = 600;

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#00000',
    width: phaserGameWidth,
    height: phaserGameHeight + 300,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [NorthPoleDropZone, Menu]
};

const game = new Phaser.Game(config);
