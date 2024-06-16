export default class PowerUpSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PowerUpSelectionScene' });
    }

    create() {
        this.add.text(400, 50, 'Select a Power-Up', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const powerUps = [
            {
                name: 'Health Boost',
                description: 'Increases your health.',
                position: { x: 400, y: 200 },
                powerUpKey: 'health'
            },
            {
                name: 'Attack Boost',
                description: 'Increases your attack power.',
                position: { x: 400, y: 300 },
                powerUpKey: 'attack'
            },
            {
                name: 'Speed Boost',
                description: 'Increases your movement speed.',
                position: { x: 400, y: 400 },
                powerUpKey: 'speed'
            }
        ];

      
        powerUps.forEach(powerUp => {
            const powerUpButton = this.add.text(powerUp.position.x, powerUp.position.y, powerUp.name, {
                fontSize: '32px',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectPowerUp(powerUp.powerUpKey));

            this.add.text(powerUp.position.x, powerUp.position.y + 40, powerUp.description, {
                fontSize: '18px',
                color: '#aaaaaa'
            }).setOrigin(0.5);
        });
    }

    selectPowerUp(powerUp) {
        this.scene.start('GameScene', { selectedPowerUp: powerUp });
    }
}
