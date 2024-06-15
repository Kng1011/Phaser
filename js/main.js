import GameScene from './function.js';
import GameOverScene from './again.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [GameScene, GameOverScene]
};

var game = new Phaser.Game(config);
