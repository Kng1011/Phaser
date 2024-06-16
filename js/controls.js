export default class ControlsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControlsScene' });
    }

    preload() {
        this.load.image('letras', 'assets/letras.png');
        this.load.image('setas', 'assets/setas.png');
        this.load.image('E', 'assets/E.png');
        this.load.image('Q', 'assets/Q.png');
        this.load.image('Z', 'assets/Z.png');
        this.load.image('M', 'assets/M.png');
    }

    create() {
        // Adicionando as imagens
        const letras = this.add.sprite(150, 100, 'letras').setScale(1);
        const setas = this.add.sprite(650, 100, 'setas').setScale(1);
        const E = this.add.sprite(150, 225, 'E').setScale(1);
        const Q = this.add.sprite(200, 350, 'Q').setScale(1);
        const Z = this.add.sprite(100, 350, 'Z').setScale(1);
        const M = this.add.sprite(600, 350, 'M').setScale(1);

        // Calculando a posição do texto para ficar entre as duas imagens
        const textX = (letras.x + setas.x) / 2;
        const textY = (letras.y + setas.y) / 2;

        // Adicionando textos
        const text = this.add.text(textX, textY, 'Movement', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const text2 = this.add.text(textX, textY + 125, 'Basic Attack',
            {font: '32px Arial',
             fill: '#fff'
            }
        ).setOrigin(0.5);

        const text3 = this.add.text(textX, textY + 250, 'Skills',
            {font: '32px Arial',
             fill: '#fff'
            }
        ).setOrigin(0.5);

        // Adicionando o botão de voltar
        const backButton = this.add.text(400, 500, 'Back', {
            font: '32px Arial',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.backMenu());

        // Ajustando profundidade para garantir a ordem de sobreposição correta
        letras.setDepth(1);
        text.setDepth(2);
        setas.setDepth(3);
        text2.setDepth(4);
        backButton.setDepth(5);
    }

    backMenu() {
        this.scene.start('MenuScene');
    }
}
