import 'phaser';
import NorthPoleDropZone from './game';
import Pedestrian from './pedestrian';

export default class MrsClaus implements Pedestrian
{
    public sprite : Phaser.Physics.Arcade.Sprite;
    wounded : boolean = false;
    private phaser : NorthPoleDropZone;
    private splatTime = 0;
    private splats = 0;
    private direction: string;
    private vMulti: number;
    constructor (phaser : NorthPoleDropZone, xPos, yPos, direction : string)
    {
        this.phaser = phaser;
        let rand = Math.random();
        this.direction = direction;
        if(this.direction == 'left')
            this.vMulti = -1
        else 
            this.vMulti = 1;

        this.sprite = phaser.physics.add.sprite(xPos, yPos, 'mrsclaus').setScale(.66);
        this.sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.woundedHandler.bind(this));

        this.sprite.anims.play(`mrsclaus${direction}`);

        this.sprite.anims.msPerFrame = (this.sprite.anims.msPerFrame - (rand*(this.sprite.anims.msPerFrame-50)))

        this.sprite.setVelocityX(Math.max(200 * rand, 95)*this.vMulti);
        this.sprite.setData("object", this);
        this.sprite.name = 'mrsclaus';
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
        this.splats++;

        if(!this.wounded) {
            this.sprite.body.stop();
            this.sprite.body.enable = false;

            this.wounded = true;    
            this.sprite.play('mrsclaushurt', false, 0);
            this.sprite.body.enable = false;
            this.phaser.updateGameScore(-1000*this.splats, true, "You hit Mrs. Claus!");
            this.sprite.setVelocityX(0);
       }
    }

    public woundedHandler() // I just need these elves to stay dead
    {
        this.phaser.time.delayedCall(850, (() =>{
            this.splatTime = this.phaser.time.now;
            this.sprite.setY(this.sprite.y - 1);
        }).bind(this));
    }

    static create(phaser : Phaser.Scene){
        phaser.anims.create({
            key: 'mrsclausright',
            frames: phaser.anims.generateFrameNumbers('mrsclaus', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        phaser.anims.create({
            key: 'mrsclausleft',
            frames: phaser.anims.generateFrameNumbers('mrsclaus', { start: 4, end: 7 }),
            frameRate: 6,
            repeat: -1
        });
        phaser.anims.create({
            key: 'mrsclaushurt',
            frames: phaser.anims.generateFrameNumbers('mrsclaus', { start: 8, end: 9 }),
            frameRate: 3,
            repeat: 0
        });
    }

    static preloadAssets(phaser : Phaser.Scene){
        phaser.load.spritesheet('mrsclaus', 
            'assets/mrsclaus.png',
            { frameWidth: 80, frameHeight: 132 }
        );
       
    }
}
