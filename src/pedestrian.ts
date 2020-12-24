import 'phaser';
import Collidable from './collidable';

export default interface Pedestrian extends Collidable
{
    sprite : Phaser.Physics.Arcade.Sprite;
    wounded : boolean;
    
    collide(object1 : Phaser.Types.Physics.Arcade.GameObjectWithBody, object2 : Phaser.Physics.Arcade.Sprite);
}
