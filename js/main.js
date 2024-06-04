const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x:0, y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

var game = new Phaser.Game(config);
var cursors;
var player;

function preload(){
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
}

function create(){

    // Cria as animações de movimento: walkforward, walkbackward, walkleft, walkright

    this.anims.create({
        key: 'walkbackwards',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }), // Usa os frames de 0 a 4
        frameRate: 10,
        repeat: -1 // Repete a animação indefinidamente
    });

    this.anims.create({
        key: 'walkforward',
        frames: this.anims.generateFrameNumbers('player', { start: 48, end: 53 }), 
        frameRate: 10,
        repeat: -1 // Repete a animação indefinidamente
    });

    this.anims.create({
        key: 'walkleft',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 20 }), 
        frameRate: 10,
        repeat: -1 // Repete a animação indefinidamente
    });

    this.anims.create({
        key: 'walkright',
        frames: this.anims.generateFrameNumbers('player', { start: 32, end: 36 }), 
        frameRate: 10,
        repeat: -1 // Repete a animação indefinidamente
    });

    // Cria as animações de ataque: attackforward, attackbackward, attackleft, attackright

    this.anims.create({
        key: 'attackbackwards',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'attackright',
        frames: this.anims.generateFrameNumbers('player', { start: 37, end: 40 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'attackleft',
        frames: this.anims.generateFrameNumbers('player', { start: 21, end: 24 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'attackforward',
        frames: this.anims.generateFrameNumbers('player', { start: 54, end: 57 }),
        frameRate: 10,
        repeat: 0
    });

    attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Adiciona a sprite do jogador
    player = this.physics.add.sprite(400, 300, 'player').setScale(2);
    // Inicia a animação
    cursors = this.input.keyboard.createCursorKeys();
    
}

let direction = 'forward'; // Variável para rastrear a direção atual

function update() {
    if (Phaser.Input.Keyboard.JustDown(attackKey)) {
        if (!player.anims.isPlaying || player.anims.currentAnim.key.indexOf('attack') === -1) {
            player.anims.play('attack' + direction.toLowerCase(), true);
            console.log('attack' + direction);
        }
    } else if (cursors.left.isDown) {
        if (!player.anims.isPlaying || player.anims.currentAnim.key.indexOf('attack') === -1) {
            player.setVelocityX(-160);
            player.anims.play('walkleft', true);
            direction = 'left';
        }
    } else if (cursors.right.isDown) {
        if (!player.anims.isPlaying || player.anims.currentAnim.key.indexOf('attack') === -1) {
            player.setVelocityX(160);
            player.anims.play('walkright', true);
            direction = 'right';
        }
    } else if (cursors.up.isDown) {
        if (!player.anims.isPlaying || player.anims.currentAnim.key.indexOf('attack') === -1) {
            player.setVelocityY(-160);
            player.anims.play('walkforward', true);
            direction = 'forward';
        }
    } else if (cursors.down.isDown) {
        if (!player.anims.isPlaying || player.anims.currentAnim.key.indexOf('attack') === -1) {
            player.setVelocityY(160);
            player.anims.play('walkbackwards', true);
            direction = 'backwards';
        }
    } else {
        player.setVelocityX(0);
        player.setVelocityY(0);
        if (!player.anims.isPlaying || player.anims.currentAnim.key.indexOf('attack') === -1) {
            player.anims.stop();
        }
    }
}