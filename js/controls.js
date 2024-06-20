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
        this.load.spritesheet('fireball', 'assets/fireball.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('DarkAttack1', 'assets/DarkVFX1.png', { frameWidth: 40, frameHeight: 32 });
        this.load.image('Frame', 'assets/Frame.png');
    }

    create() {
        // Adicionando as imagens
        const letras = this.add.sprite(150, 100, 'letras' ).setScale(1);
        const setas = this.add.sprite(650, 100, 'setas').setScale(1);
        const E = this.add.text(150, 210, 'E',{
            font: '30px Chiller',
            fill: '#ffffff'
        }).setScale(2);
        const Q = this.add.text(190, 320, 'Q', {
            font: '30px Chiller',
            fill: '#ffffff'
        }).setScale(2);
        const Z = this.add.text(90, 320, 'Z', {
            font: '30px Chiller',
            fill: '#ffffff'
        }).setScale(2);
        const M = this.add.text(590, 320, 'M', {
            font: '30px Chiller',
            fill: '#ffffff'
        });

        // Calculando a posição do texto para ficar entre as duas imagens
        const textX = (letras.x + setas.x) / 2;
        const textY = (letras.y + setas.y) / 2;

        // Adicionando textos
        const text = this.add.text(textX, textY, 'Movement', {
            font: '64px Chiller',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const text2 = this.add.text(textX, textY + 140, 'Basic Attack',
            {font: '64px Chiller',
             fill: '#ffffff'
            }
        ).setOrigin(0.5);

        const text3 = this.add.text(textX, textY + 250, 'Skills',
            {font: '64px Chiller',
             fill: '#fff'
            }
        ).setOrigin(0.5);

        const frame1 = this.add.sprite(100, 420, 'Frame').setScale(1.8);
        let skillGraphic1;
        skillGraphic1 = this.add.sprite(92, 420, 'fireball').setScale(1.5);

        const frame2 = this.add.sprite(200, 420, 'Frame').setScale(1.8);
        let skillGraphic2;
        skillGraphic2 = this.add.sprite(200, 420, 'DarkAttack1').setScale(1.5);

        const frame3 = this.add.sprite(600, 420, 'Frame').setScale(1.8);
        let skillGraphic3;
        skillGraphic3 = this.add.text(600 , 420, 'Flash', { fontSize: '17px', color: '#fff' }).setOrigin(0.5);

        frame1.setDepth(6);
        skillGraphic1.setDepth(7);       

        frame2.setDepth(8);
        skillGraphic2.setDepth(9);

        frame3.setDepth(10);
        skillGraphic3.setDepth(11);

        // Adicionando o botão de voltar
        const backButton = this.add.text(100, 550, '< Back', {
            font: '64px Chiller',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.backMenu());

        // Ajustando profundidade para garantir a ordem de sobreposição correta
        letras.setDepth(1);
        text.setDepth(2);
        setas.setDepth(3);
        text2.setDepth(4);
        text3.setDepth(5);
        backButton.setDepth(12);
    }

    backMenu() {
        this.scene.start('MenuScene');
    }
}
