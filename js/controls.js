export default class ControlsScene extends Phaser.Scene {
    constructor() {
        super({key: 'ControlsScene'});
    }

    preload() {
        this.load.image('letras', 'assets/letras.png');
        this.load.image('setas', 'assets/setas.png');
    }

    create() {
        const letras = this.add.sprite(100, 300, 'letras').setScale(1);
        const setas = this.add.sprite(700, 300, 'setas');

        const textX = (leftImage.x + rightImage.x) / 2;
        const textY = (leftImage.y + rightImage.y) / 2;

        const text = this.add.text(textX, textY, 'Movimento', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const backButton = this.add.text(400, 400, 'Back',
            {font: '32px Arial',
             fill: '#fff'
            }
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.backMenu());
    }

    backMenu() {
        this.scene.start('MenuScene');
    }
}