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

        this.add.text(150, 50, 'Player Stats', {
            font: '60px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(150, 125, 'Speed: ' + this.playerAttributes.playerSpeed, {
            font: '30px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(150, 175, 'Attack: ' + this.playerAttributes.playerAttack, {
            font: '30px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(150, 225, 'Attack Speed: ' + this.playerAttributes.playerAttackSpeed, {
            font: '30px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(
            150, 
            275, 
            'Health: ' + Math.floor(this.playerAttributes.playerHealth) + '/' + Math.floor(this.playerAttributes.playerMaxHealth), 
            {
                font: '30px Chiller',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.add.text(430, 50, 'Skills ', {
            font: '60px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.playerAttributes.selectedSkills.forEach((skill, index) => {
            const baseX = 430;
            const baseY = 75; 
            const textSpacing = 75; 
            const skillBlockHeight = 150;
        
            this.add.text(
                baseX, 
                baseY + textSpacing * index, 
                `${skill.name}s`, 
                {
                    font: '30px Chiller',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);
        
            this.add.text(
                baseX, 
                baseY + textSpacing * index + 25, 
                `Damage - ${Math.floor(skill.damage)}`, 
                {
                    font: '20px Chiller',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);
        
            this.add.text(
                baseX, 
                baseY + textSpacing * index + 50, 
                `Proficiency - ${skill.proficiency}%`, 
                {
                    font: '20px Chiller',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);
        });
        
        
        this.add.text(680, 50, 'PowerUps ', {
            font: '60px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.playerAttributes.selectedPowerUps.forEach((powerUp, index) => {
            this.add.text(680, 75 + 50 * (index + 1), powerUp.name, {
                font: '20px Chiller',
                color: '#ffffff'
            }).setOrigin(0.5);

            this.add.text(680, 100 + 50 * (index + 1), 'N ' + powerUp.number , {
                font: '20px Chiller',
                color: '#ffffff'
            }).setOrigin(0.5);
        });

        this.add.text(100, 550, '< Back', {
            font: '64px Chiller',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Back());   
    }

    Back() {
        this.scene.stop();
        this.scene.resume('PauseScene');
    }
}