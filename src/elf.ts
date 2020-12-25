import 'phaser';
import Pedestrian from './pedestrian';

export default class Elf implements Pedestrian
{
    public sprite : Phaser.Physics.Arcade.Sprite;
    wounded : boolean = false;
    private name : string;
    private phaser : Phaser.Scene;
    private splatTime = 0;
    private splats = 0;
    constructor (phaser : Phaser.Scene, xPos, yPos)
    {
        this.phaser = phaser;
        let rand = Math.random();
        this.name = "elf" + (Math.floor(Math.random() * Math.floor(4))+1);

        this.sprite = phaser.physics.add.sprite(xPos, yPos, this.name).setScale(.66);
        this.sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.woundedHandler.bind(this));

        this.sprite.anims.play(`${this.name}right`);

        this.sprite.anims.msPerFrame = (this.sprite.anims.msPerFrame - (rand*(this.sprite.anims.msPerFrame-50)))

        this.sprite.setVelocityX(Math.max(200 * rand, 95));
        this.sprite.setData("object", this);
    }

    public startWorldCollision(){
        (<Phaser.Physics.Arcade.Body>this.sprite.body).onWorldBounds = true;
        this.sprite.setCollideWorldBounds(true);
    }

    public collideWorldBounds(){
        this.sprite.destroy();
    }

    collide(collidedWith : Phaser.Types.Physics.Arcade.GameObjectWithBody)
    {
        if((this.phaser.time.now - this.splatTime) < (50 * this.splats)) {
            return;
        }
        if(!this.wounded) {
            this.splats++;
            this.wounded = true;    
            this.sprite.play(`${this.name}hurt`, false, 0);
            this.sprite.setY(this.sprite.y - 1);
            this.sprite.setVelocityX(0);
       }
    }

    public woundedHandler() // I just need these elves to stay dead
    {
        this.phaser.time.delayedCall(850, (() =>{
            this.splatTime = this.phaser.time.now;
            this.sprite.setVelocityX(150 + 25*this.splats);
            this.sprite.play(`${this.name}right`, true, 0);
            this.sprite.setY(this.sprite.y - 1);
            this.wounded = false;
        }).bind(this));
    }

    static create(phaser : Phaser.Scene){
        phaser.anims.create({
            key: "targetRight",
            frames: phaser.anims.generateFrameNumbers('target', { start: 5, end: 8 }),
            frameRate: 15,
            repeat: -1
        });
        phaser.anims.create({
            key: "elfHurt",
            frames: phaser.anims.generateFrameNumbers('target', { start: 9, end: 10 }),
            frameRate: 8,
            repeat: 0,

        });
        for(var i = 1; i < 5; i++){
            phaser.anims.create({
                key: `elf${i}right`,
                frames: phaser.anims.generateFrameNumbers(`elf${i}`, { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            });
            phaser.anims.create({
                key: `elf${i}left`,
                frames: phaser.anims.generateFrameNumbers(`elf${i}`, { start: 4, end: 7 }),
                frameRate: 6,
                repeat: -1
            });
            phaser.anims.create({
                key: `elf${i}hurt`,
                frames: phaser.anims.generateFrameNumbers(`elf${i}`, { start: 8, end: 9 }),
                frameRate: 3,
                repeat: 0
            });
        }

    }

    static preloadAssets(phaser : Phaser.Scene){
        phaser.load.spritesheet('target', 
            'assets/elf.png',
            { frameWidth: 32, frameHeight: 48 }
        );

        for(var i = 1; i < 5; i++){
            phaser.load.spritesheet(`elf${i}`, 
            `assets/elf${i}.png`,
            { frameWidth: 80, frameHeight: 120 });
        }
       
    }
}
