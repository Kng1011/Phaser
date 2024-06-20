export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'});
        this.highscore = 0;
    }

    preload(){
        //pass
    }

    init(data){
        this.score = data.score;
        this.highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0 ;
        console.log(this.highScore);
    }
    create(){
        this.add.text(400, 200, 'Game Over',
            {font: '96px Chiller', fill: '#fff'}
        ).setOrigin(0.5);

        const restartButton = this.add.text(100, 550, 'Restart', 
            {font: '64px Chiller', fill: '#fff'}
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.restartGame());

        const leaveButton = this.add.text(700, 550, 'Leave',
            {font: '64px Chiller', fill: '#fff'}
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.leaveGame());
   
        this.add.text(400, 300, `Final Score: ${this.score}`,
            { font: '50px Chiller',
            fill: '#FFF' }).setOrigin(0.5);

        this.add.text(400, 360, `High Score: ${this.highScore}`,
            { font: '50px Chiller', 
              fill: '#FFF' }).setOrigin(0.5);
    }

    restartGame() {
        const randomScene = Math.random();

        if (randomScene < 0.5) {
            this.scene.start('SkillSelectionScene');
        } else {
            this.scene.start('PowerUpSelectionScene');
        }
    }

    leaveGame(){
        this.scene.start('MenuScene');
    }
}
