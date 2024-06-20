export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
        this.playerAttributes = {
            playerSpeed: 0,
            playerAttack: 0,
            playerAttackSpeed: 0,
            playerHealth: 0,
            playerMaxHealth: 0,
            selectedSkills: [],
            selectedPowerUps: []
        };

    }

    init(data) {
        this.playerAttributes = data.playerAttributes;
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(400, 150, 'Continue', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Continue());

        this.add.text(400, 250, 'Stats', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Leave());

        this.add.text(400, 350, 'Leave', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Leave());

    }

    Continue() {
        this.scene.stop();
        this.scene.resume('GameScene');
    }

    Leave() {
        this.scene.stop();  
        this.scene.stop('GameScene');
        this.scene.start('MenuScene');
    }
}