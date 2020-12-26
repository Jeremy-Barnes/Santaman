export default class Menu extends Phaser.Scene
{
    button: Phaser.GameObjects.Image;
    private titleText: Phaser.GameObjects.Text;
    private bodyText: Phaser.GameObjects.Text;

    public static titleStr : string;
    public static bodyStr : string;

    constructor(){
        super('menu');
   }

   update(){
        this.scene.setVisible(true,'menu')
        if(this.titleText.text != Menu.titleStr){
            this.titleText.setText(Menu.titleStr);
            let w = this.titleText.width;
            this.titleText.x = 300-(w/2);
        }
        if(this.bodyText.text != Menu.bodyStr){
            this.bodyText.setText(Menu.bodyStr);
            let w = this.bodyText.width;
            this.bodyText.x = 300-(w/2);
        }
   }

    preload(){
        this.load.image('button', 'assets/button.png');
    }
    
    create (){
        var r1 = this.add.rectangle(300,300, 300, 300, 0xFF0000);
        this.button = new Phaser.GameObjects.Image(this, 300,400,'button').setScale(.5);
        this.button.setVisible(true);
        this.button.setInteractive().on('pointerdown', ()=>{
            this.scene.setVisible(false,'menu');
            this.scene.resume('NorthPoleDropZone');
            this.scene.pause('menu'); 
        });
        
        Menu.titleStr = "Snowball Throw";
        Menu.bodyStr = "Throw snowballs at the elves below! \r\n    Make sure not to hit Mrs. Claus\r\n     or a reindeer.";
        this.titleText = this.add.text(157, 200, Menu.titleStr, { font: '30px Slackey', fill: '#ffffff' });
        this.bodyText = this.add.text(180, 300, Menu.bodyStr, { font: '15px Calibri', fill: '#ffffff' });
        this.add.existing(this.button);
    }

    static setTitle(title: string){
        Menu.titleStr = title;
    }

    static setBody(body: string){
        Menu.bodyStr = body;
    }
}