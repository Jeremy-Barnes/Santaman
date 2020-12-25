export default class Menu extends Phaser.Scene
{
    button: Phaser.GameObjects.Image;
    constructor(){
        super('menu');
   }

    preload(){
        this.load.image('button', 'assets/button.png');
    }
    
    create ()
    {
        var r1 = this.add.rectangle(300,300, 300, 300, 0xFF0000);
        this.button = new Phaser.GameObjects.Image(this, 300,300,'button').setScale(.1);
        this.button.setVisible(true);
        this.button.setInteractive().on('pointerdown', ()=>{this.scene.pause('menu'); this.scene.setVisible(false,'menu'); this.scene.resume('NorthPoleDropZone')})
        this.add.text(200, 200, 'Santa Attack', { font: '25px Slackey', fill: '#ffffff' });
        this.add.existing(this.button);
    }
}