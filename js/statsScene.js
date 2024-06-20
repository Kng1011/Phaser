export default class StatsScene extends Phaser.Scene{
    constructor(){
        super({key: 'StatsScene'});
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

    init(data){
        this.playerAttributes = data.playerAttributes;
    }  
    
    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(120, 150, 'Player Stats', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(120, 200, 'Speed: ' + this.playerAttributes.playerSpeed, {
            fontSize: '15px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(120, 250, 'Attack: ' + this.playerAttributes.playerAttack, {
            fontSize: '15px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(120, 300, 'Attack Speed: ' + this.playerAttributes.playerAttackSpeed, {
            fontSize: '15px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(120, 350, 'Health: ' + this.playerAttributes.playerHealth + '/' + this.playerAttributes.playerMaxHealth, {
            fontSize: '15px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 150, 'Skills ', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.playerAttributes.selectedSkills.forEach((skill, index) => {
            this.add.text(400, 150 + 50 * (index + 1), skill.name, {
                fontSize: '15px',
                color: '#ffffff'
            }).setOrigin(0.5);
        });

        this.add.text(650, 150, 'PowerUps ', {
            fontSize: '15px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.playerAttributes.selectedPowerUps.forEach((powerUp, index) => {
            this.add.text(650, 150 + 50 * (index + 1), powerUp.name, {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);
        });

        this.add.text(400, 400, 'Back', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Back());   
    }

    Back() {
        this.scene.stop();
        this.scene.resume('PauseScene');
    }
}