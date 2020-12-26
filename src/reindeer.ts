import 'phaser';
import NorthPoleDropZone from './game';
import Pedestrian from './pedestrian';

export default class Reindeer implements Pedestrian
{
    public sprite : Phaser.Physics.Arcade.Sprite;
    wounded : boolean = false;
    private phaser : NorthPoleDropZone;
    private splatTime = 0;
    private splats = 0;
    constructor (phaser : NorthPoleDropZone, xPos, yPos)
    {
        this.phaser = phaser;
        let rand = Math.random();

        this.sprite = phaser.physics.add.sprite(xPos, yPos, 'reindeer').setScale(.66);

        this.sprite.setGravityY(-300 + (rand* -300));

        if(rand < .95) {
            this.sprite.setVelocityX(Math.max(400, 95));
        } else {
            this.sprite.setVelocityX(Math.max(1000, 95));
        }

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
        if(!this.wounded) {
            this.sprite.setGravityY(300);

            this.wounded = true;    
            this.sprite.setY(this.sprite.y - 1);
            this.phaser.updateGameScore(-1000*this.splats, true, "You hit a reindeer!");
            this.sprite.setVelocityX(0);
       }
    }

    static create(phaser : Phaser.Scene){
    }

    static preloadAssets(phaser : Phaser.Scene){
        phaser.load.image('reindeer', 
            'assets/reindeer.png',
        );
       
    }
}
