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
    this.anims.create({
        key: 'walkbackward',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }), // Use os frames de 0 a 4
        frameRate: 10,
        repeat: -1 // Repete a animação indefinidamente
    });

    this.anims.create({
        key: 'walkforward',
        frames: this.anims.generateFrameNumbers('player', { start: 48, end: 53 }), // Use os frames de 0 a 4
        frameRate: 10,
        repeat: -1 // Repete a animação indefinidamente
    });

    this.anims.create({
        key: 'walkleft',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 20 }), // Use os frames de 0 a 4
        frameRate: 10,
        repeat: -1 // Repete a animação indefinidamente
    });

    this.anims.create({
        key: 'walkright',
        frames: this.anims.generateFrameNumbers('player', { start: 32, end: 37 }), // Use os frames de 0 a 4
        frameRate: 10,
        repeat: -1 // Repete a animação indefinidamente
    });

    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 7 }),
        frameRate: 10,
        repeat: 0
    });

    attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Adiciona a sprite do jogador
    player = this.physics.add.sprite(400, 300, 'player').setScale(2);
    // Inicia a animação
    cursors = this.input.keyboard.createCursorKeys();
    
}

function update(){
    // Move o jogador para a esquerda
    if (cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('walkleft', true);
    }
    // Move o jogador para a direita
    else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('walkright', true);
    }
    // Move o jogador para cima
    else if (cursors.up.isDown){
        player.setVelocityY(-160);
        player.anims.play('walkforward', true);
    }
    // Move o jogador para baixo
    else if (cursors.down.isDown){
        player.setVelocityY(160);
        player.anims.play('walkbackward', true);
    }
    // Faz o jogador parar quando nenhuma tecla está pressionada
    else{
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.stop(); // Para a animação
    }

    if (Phaser.Input.Keyboard.JustDown(attackKey)){
        player.anims.play('attack', true);
    }
}