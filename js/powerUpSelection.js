export default class PowerUpSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PowerUpSelectionScene' });
        this.selectedSkills = [];
        this.selectedPowerUps = [];
        this.level = 0;
    }

    init(data) {
        this.selectedSkills = data.selectedSkills || [];
        this.selectedPowerUps = data.selectedPowerUps || [];
        this.level = data.level || 0;
    }

    create() {
        this.add.text(400, 50, 'Select a Power-Up', {
            font: '64px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5);

        if (this.level > 0) {
            this.add.text(400, 125, 'Level Completed(' + this.level + ')' , {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);   
        }
        
        const powerUps = [
            {
                name: 'Health Boost',
                description: 'Increases your health.',
                powerUpKey: 'health',
                number: 0
            },
            {
                name: 'Attack Boost',
                description: 'Increases your attack power.',
                powerUpKey: 'attack',
                number: 0
            },
            {
                name: 'Speed Boost',
                description: 'Increases your movement speed.',
                powerUpKey: 'speed',
                number: 0
            },
            {
                name: 'Attack Speed Boost',
                description: 'Increases your attack speed.',
                powerUpKey: 'attackSpeed',
                number: 0
            },
            {
                name: 'Cooldown Reduction',
                description: 'Reduces your ability cooldowns.',
                powerUpKey: 'cooldownReduction',
                number: 0
            },
            {
                name: 'Regeneration',
                description: 'Heals every time you kill an enemy.',
                powerUpKey: 'healOnKill',
                number: 0
            }
        ];


        const availablePowerUps = powerUps.filter(powerUp => !this.selectedPowerUps.some(selectedPowerUp => selectedPowerUp.powerUpKey === powerUp.powerUpKey));

 
        Phaser.Utils.Array.Shuffle(availablePowerUps);
        const selectedPowerUps = availablePowerUps.slice(0, 3);


        selectedPowerUps.forEach((powerUp, index) => {
            const yPos = 200 + index * 100;
            const powerUpButton = this.add.text(400, yPos, powerUp.name, {
                font: '64px Chiller',
                color: '#ffffff'
            }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.selectPowerUp(powerUp));

            this.add.text(400, yPos + 40, powerUp.description, {
                font: '36px Chiller',
                color: '#aaaaaa'
            }).setOrigin(0.5);
        });
    }

    selectPowerUp(powerUp) {
        
        this.selectedPowerUps.push(powerUp);
        this.scene.start('GameScene', { selectedSkills: this.selectedSkills, selectedPowerUps: this.selectedPowerUps });
    }
}
