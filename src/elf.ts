import 'phaser';
import Pedestrian from './pedestrian';

export default class Elf implements Pedestrian
{
    public sprite : Phaser.Physics.Arcade.Sprite;
    wounded : boolean = false;
    constructor (phaser : Phaser.Scene, xPos, yPos)
    {
        let rand = Math.random();
        this.sprite = phaser.physics.add.sprite(xPos, yPos, 'target');
        this.sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.woundedHandler.bind(this));

        this.sprite.anims.play("targetRight");

        this.sprite.anims.msPerFrame = Math.min((1000/15)/rand, 1000/11);

        this.sprite.setVelocityX(200 * rand);
        this.sprite.setCollideWorldBounds(false);
        this.sprite.setData("object", this);
    }

    collide(collidedWith : Phaser.Types.Physics.Arcade.GameObjectWithBody)
    {
       if(!this.wounded) {
            this.wounded = true;    
            this.sprite.play("elfHurt", false, 0);
            this.sprite.setVelocityX(0);
       }
    }

    public woundedHandler() // I just need these elves to stay dead
{
        this.sprite.setVelocityX(100);
        this.sprite.play("targetRight", true, 0);
        this.wounded = false;
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
    }

    static preloadAssets(phaser : Phaser.Scene){
        phaser.load.spritesheet('target', 
            'assets/elf.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
}
