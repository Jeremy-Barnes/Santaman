import 'phaser';
import Collidable from './collidable';
import Pedestrian from './pedestrian';

export default class Snowball implements Collidable
{
    public sprite : Phaser.Physics.Arcade.Sprite;
    constructor (phaser : Phaser.Scene, xPos, yPos)
    {
        let rand = Math.random();
        this.sprite = phaser.physics.add.sprite(xPos, yPos, "snowball");
        this.sprite.setScale(.12);
        this.sprite.setVelocityY(100);
        this.sprite.setData("object", this);
        this.sprite.setCollideWorldBounds(true);
    }

    collide(collidedWith : Phaser.Types.Physics.Arcade.GameObjectWithBody)
    {
        this.sprite.destroy();
    }

  

    static preloadAssets(phaser : Phaser.Scene){
        phaser.load.image('snowball', 'assets/snowball.png');
    }
}
