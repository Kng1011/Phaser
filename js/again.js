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

        const restartButton = this.add.text(400, 320, 'Restart', 
            {font: '64px Chiller', fill: '#fff'}
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.restartGame());

        const leaveButton = this.add.text(400, 420, 'Leave',
            {font: '64px Chiller', fill: '#fff'}
        ).setOrigin(0.5).setInteractive().on('pointerdown', () => this.leaveGame());
   
        this.add.text(400, 300, `Time: ${this.score}`,
            { fontSize: '32px',
            fill: '#FFF' }).setOrigin(0.5);

        this.add.text(400, 350, `High Score: ${this.highScore}`,
            { fontSize: '32px', 
              fill: '#FFF' }).setOrigin(0.5);
    }

    restartGame() {
        this.scene.start('GameScene');
        console.log('restart');
    }

    leaveGame(){
        this.scene.start('MenuScene');
    }
}
