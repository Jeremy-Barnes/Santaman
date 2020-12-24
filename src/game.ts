import 'phaser';
import Elf from './elf'
import Pedestrian from './pedestrian';
import Snowball from './snowball';

export default class NorthPoleDropZone extends Phaser.Scene
{
    private cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    private player : Phaser.Physics.Arcade.Sprite;
    
    // private targets : Phaser.Physics.Arcade.Sprite[] = [];
    private targetsElf : Pedestrian[] = [];


    private ground: Phaser.Physics.Arcade.StaticGroup;
    private santaPerch: Phaser.Physics.Arcade.StaticGroup;

    private lastTargetAddTime : number = 0; 
    private text;

    constructor ()
    {
        super('NorthPoleDropZone');
    }

    update(time, delta){

        if(this.input.activePointer.isDown) {
            if(this.input.activePointer.x > this.player.x) {
                this.player.setVelocityX(160);
            } else if(this.input.activePointer.x < this.player.x) {
                this.player.setVelocityX(-160);
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

    addSnowball(santaX: number, santaY: number){
        let snowball = new Snowball(this, santaX, santaY-10);
        this.physics.add.collider(snowball.sprite, this.targetsElf.map(elf => elf.sprite), this.collide.bind(this));
        this.physics.add.collider(snowball.sprite, this.ground, snowball.collide.bind(snowball));
    }

    collide(object1 : Phaser.Types.Physics.Arcade.GameObjectWithBody, object2 : Phaser.Physics.Arcade.Sprite)
    {
        object1.getData('object').collide(object2);
        object2.getData('object').collide(object1);
    }

    private conditionallyAddTarget(time: number){
        let rand = Math.random();
        if(rand < .7 && time - this.lastTargetAddTime > 1000) {
            this.lastTargetAddTime = time;

            let elf = new Elf(this, -200, phaserGameHeight-200)
            this.targetsElf.push(elf);
            this.physics.add.collider(elf.sprite, this.ground);
            elf.sprite.setCollideWorldBounds(false);
        }
    }


    public preload()
    {
        this.load.image('ground', 'assets/platform.png');
        this.load.image('sky', 'assets/sky.png');

        this.load.spritesheet('santa', 
            'assets/theSantaman.png',
            { frameWidth: 96, frameHeight: 96 }
        );
        Elf.preloadAssets(this);
        Snowball.preloadAssets(this);
    }

    public create(){

        let skyImage = this.add.image(phaserGameWidth/2, phaserGameHeight/2, 'sky');
        skyImage.setScale(phaserGameWidth/skyImage.width, phaserGameHeight/skyImage.height);
        this.createDropZone();

        this.input.mouse.disableContextMenu();
        this.loadSantaman();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.addPointer(1);
        this.input.on('pointerup', function (pointer) {
            if(pointer.getDuration() < 200 && pointer.getDuration() > 1) {
                this.addSnowball(this.player.x, this.player.y);
            }
        }.bind(this));
        Elf.create(this);
        // this.text = this.add.text(10, 10, 'Use up to 4 fingers at once', { font: '16px Courier', fill: '#00ff00' });
    }

    createDropZone(){
        this.ground = this.physics.add.staticGroup();

        this.ground.create(phaserGameWidth/2, phaserGameHeight, 'ground').setScale(2).refreshBody();//ground
        this.santaPerch =  this.physics.add.staticGroup();
        this.santaPerch.create(phaserGameWidth/2, phaserGameHeight/4, 'ground');//perch
    }

    loadSantaman(){
        this.player = this.physics.add.sprite(100, 50, 'santa');
        this.physics.add.collider(this.player, this.santaPerch);
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
