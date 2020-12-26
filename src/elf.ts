import 'phaser';
import NorthPoleDropZone from './game';
import Pedestrian from './pedestrian';

export default class Elf implements Pedestrian
{
    public sprite : Phaser.Physics.Arcade.Sprite;
    wounded : boolean = false;
    private name : string;
    private phaser : NorthPoleDropZone;
    private splatTime = 0;
    private splats = 0;
    private vMulti = 1;
    private direction: string;
    constructor (phaser : NorthPoleDropZone, xPos, yPos, direction: string)
    {
        this.phaser = phaser;
        this.direction = direction;
        let rand = Math.random();
        this.name = "elf" + (Math.floor(Math.random() * Math.floor(4))+1);

        this.sprite = phaser.physics.add.sprite(xPos, yPos, this.name).setScale(.66);
        this.sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.woundedHandler.bind(this));

        this.sprite.anims.play(`${this.name}${this.direction}`);

        this.sprite.anims.msPerFrame = (this.sprite.anims.msPerFrame - (rand*(this.sprite.anims.msPerFrame-50)))

        if(this.direction == 'left')
            this.vMulti = -1
        else 
            this.vMulti = 1;
            
        this.sprite.setVelocityX(Math.max(200 * rand, 95)*this.vMulti);
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
        if((this.phaser.time.now - this.splatTime) < (100 * this.splats)) {
            this.sprite.setY(this.sprite.y - 1);
            return;
        }
        if(!this.wounded) {
            this.sprite.body.stop();
            this.sprite.body.enable = false;

            this.splats++;
            this.wounded = true;    
            this.sprite.play(`${this.name}hurt`, false, 0);
            this.sprite.setY(this.sprite.y - 1);
            this.sprite.setVelocityX(0);
            this.phaser.updateGameScore(10 - this.splats, false);
       }
    }

    public woundedHandler() // I just need these elves to stay dead
    {
        this.phaser.time.delayedCall(850, (() =>{
            this.splatTime = this.phaser.time.now;
            this.sprite.body.enable = true;
            this.sprite.setVelocityX(this.vMulti*(150 + 25*this.splats));
            this.sprite.anims.play(`${this.name}${this.direction}`, true, 0);
            this.sprite.setY(this.sprite.y - 1);
            this.wounded = false;
        }).bind(this));
    }

    static create(phaser : Phaser.Scene){
        
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

        for(var i = 1; i < 5; i++){
            phaser.load.spritesheet(`elf${i}`, 
            `assets/elf${i}.png`,
            { frameWidth: 80, frameHeight: 120 });
        }
       
    }
}
