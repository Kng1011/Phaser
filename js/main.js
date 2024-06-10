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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var cursors;
var player;
let direction = 'forward'; // Variável para rastrear a direção atual do jogador
let darkness; // Variável para a escuridão
let lightMask; // Variável para a máscara de iluminação
let attackKey;
let fireballKey;

// Variáveis para o inimigo
let enemy;
let enemyHealth = 100; // Vida inicial do inimigo
let enemyHealthBar;
let enemyAttackRange = 50; // Alcance de ataque do inimigo

// Variáveis para a habilidade de fireball
let fireballs;
let canShootFireball = true;
let fireballCooldownTime = 2000; // 2 segundos
let fireballCooldownGraphic;

// Variáveis para a barra de vida do jogador
var playerHealth = 100; // Vida inicial do jogador
var playerHealthBar;
var playerHealthBarRed;


function preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fireball', 'assets/fireball.png', { frameWidth: 64, frameHeight: 32 });
    this.load.image('Frame', 'assets/Frame.png');
    this.load.image('lifebar1', 'assets/Lifebar1.png');
    this.load.image('lifebar2', 'assets/Lifebar2.png');
}

function create() {
    // Criação do mapa
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'tiles');
    const layer1 = map.createLayer('Camada de Blocos 1', tileset);

    // Cria as animações de movimento e ataque do jogador
    this.anims.create({
        key: 'walkbackwards',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkforward',
        frames: this.anims.generateFrameNumbers('player', { start: 48, end: 53 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkleft',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 20 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkright',
        frames: this.anims.generateFrameNumbers('player', { start: 32, end: 36 }),
        frameRate: 10,
        repeat: -1
    });

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

    // Cria as animações de movimento do inimigo usando a spritesheet do jogador
    this.anims.create({
        key: 'enemyWalkBackwards',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'enemyWalkForward',
        frames: this.anims.generateFrameNumbers('player', { start: 48, end: 55 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'enemyWalkRight',
        frames: this.anims.generateFrameNumbers('player', { start: 32, end: 39 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'enemyWalkLeft',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'enemyAttack',
        frames: this.anims.generateFrameNumbers('player', { start: 37, end: 40 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'fireballAnim',
        frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    fireballKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    // Adiciona a sprite do jogador
    player = this.physics.add.sprite(400, 300, 'player').setScale(2);

    // Cria a escuridão
    darkness = this.make.graphics();
    darkness.fillStyle(0x000000, 1);
    darkness.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    darkness.setAlpha(0.9); // Torna a escuridão semi-transparente para efeito visual

    // Cria uma camada para a escuridão e adiciona a máscara
    lightMask = this.make.graphics();
    lightMask.fillStyle(0xffffff, 1);
    lightMask.fillCircle(0, 0, 100);
    lightMask.setBlendMode(Phaser.BlendModes.ERASE);

    // Cria a máscara de luz
    const mask = darkness.createBitmapMask(lightMask);
    layer1.setMask(mask);

    cursors = this.input.keyboard.createCursorKeys();

    // Mapeia as teclas WASD
    this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Adiciona inimigo
    spawnEnemy.call(this);

    // Cria o grupo de fireballs
    fireballs = this.physics.add.group({
        defaultKey: 'fireball',
        maxSize: 10
    });

    // Adiciona a moldura
    const frame = this.add.sprite(60, 560, 'Frame').setScale(2.5);
    // Adiciona o gráfico de cooldown da habilidade um pouco abaixo da moldura
    fireballCooldownGraphic = this.add.sprite(50, 560, 'fireball').setScale(1.8); // Mudança na posição Y de 20 para 70

    // Define a profundidade para garantir que a skill fique sobre a moldura
    frame.setDepth(10);
    fireballCooldownGraphic.setDepth(11);

    // Adiciona a barra de vida do jogador
    playerHealthBarBg = this.add.sprite(0, 20, 'lifebar1').setOrigin(0, 0).setScale(2.5);
    playerHealthBar = this.add.sprite(0, 20, 'lifebar2').setOrigin(0, 0).setScale(2.5);
    playerHealthBarBg.setDepth(10);
    playerHealthBar.setDepth(11);
}

function update() {
    // Limpa a escuridão e redesenha
    darkness.clear();
    darkness.fillStyle(0x000000, 1);
    darkness.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Atualiza a posição da luz para seguir o jogador
    lightMask.clear();
    lightMask.fillStyle(0xffffff, 1);
    lightMask.fillCircle(player.x, player.y, 100);

    // Controle do jogador
    player.setVelocity(0);

    if (cursors.left.isDown || this.wasd.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('walkleft', true);
        direction = 'left';
    } else if (cursors.right.isDown || this.wasd.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('walkright', true);
        direction = 'right';
    }

    if (cursors.up.isDown || this.wasd.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('walkforward', true);
        direction = 'forward';
    } else if (cursors.down.isDown || this.wasd.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('walkbackwards', true);
        direction = 'backwards';
    }

    // Controle do ataque de melee
    if (Phaser.Input.Keyboard.JustDown(attackKey)) {
        player.anims.play('attack' + direction.toLowerCase(), true);
        dealDamage.call(this);
    }

    // Controle do ataque de fireball
    if (Phaser.Input.Keyboard.JustDown(fireballKey) && canShootFireball) {
        shootFireball.call(this);
    }

    // Atualiza a posição do inimigo para seguir o jogador
    if (enemy) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
        if (distance < enemyAttackRange) {
            // Inimigo ataca
            if (!enemy.anims.isPlaying || enemy.anims.currentAnim.key !== 'enemyAttack') {
                enemy.anims.play('enemyAttack', true);
                // Reduz a vida do jogador
                if (playerHealth > 0) {
                    playerHealth -= 5;
                }
            }
        } else {
            // Inimigo segue o jogador
            this.physics.moveToObject(enemy, player, 100);
            // Atualiza a animação do inimigo baseado na direção
            updateEnemyAnimation.call(this);
        }
    }

    // Atualiza a barra de vida do jogador
    updatePlayerHealthBar.call(this);

    // Atualiza a barra de vida do inimigo
    updateEnemyHealthBar.call(this);
}

function updatePlayerHealthBar() {
    // Atualiza a barra de vida do jogador com base na saúde atual
    const healthPercentage = playerHealth / 100;
    playerHealthBar.displayWidth = playerHealthBarBg.width * healthPercentage;
}

function spawnEnemy() {
    const randomX = Phaser.Math.Between(50, this.cameras.main.width - 50);
    const randomY = Phaser.Math.Between(50, this.cameras.main.height - 50);
    enemy = this.physics.add.sprite(randomX, randomY, 'player').setScale(2);
    enemyHealth = 100;

    // Cria a barra de vida do inimigo
    enemyHealthBar = this.add.graphics();
    updateEnemyHealthBar.call(this);
}

function dealDamage() {
    if (enemy && Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < enemyAttackRange) {
        enemyHealth -= 25;
        if (enemyHealth <= 0) {
            enemy.destroy();
            enemyHealthBar.destroy();
            spawnEnemy.call(this);
        }
    }
}

function updateEnemyHealthBar() {
    if (enemy && enemyHealthBar) {
        enemyHealthBar.clear();
        enemyHealthBar.fillStyle(0xff0000, 1);
        enemyHealthBar.fillRect(enemy.x - 32, enemy.y - 40, (enemyHealth / 100) * 64, 10);
    }
}

function updateEnemyAnimation() {
    if (enemy.body.velocity.x > 0) {
        enemy.anims.play('enemyWalkRight', true);
    } else if (enemy.body.velocity.x < 0) {
        enemy.anims.play('enemyWalkLeft', true);
    } else if (enemy.body.velocity.y > 0) {
        enemy.anims.play('enemyWalkForward', true);
    } else if (enemy.body.velocity.y < 0) {
        enemy.anims.play('enemyWalkBackwards', true);
    }
}

function shootFireball() {
    if (!canShootFireball) return;

    canShootFireball = false;
    fireballCooldownGraphic.setTint(0xff0000);

    // Cria a fireball
    const fireball = fireballs.get(player.x, player.y, 'fireball').setScale(2);
    fireball.anims.play('fireballAnim');
    this.physics.add.collider(fireball, enemy, hitEnemy, null, this);

    // Direção do disparo da fireball
    let velocityX = 0;
    let velocityY = 0;

    switch (direction) {
        case 'left':
            velocityX = -300;
            break;
        case 'right':
            velocityX = 300;
            break;
        case 'forward':
            velocityY = -300;
            break;
        case 'backwards':
            velocityY = 300;
            break;
    }

    fireball.setVelocity(velocityX, velocityY);

    // Configura o cooldown da fireball
    this.time.addEvent({
        delay: fireballCooldownTime,
        callback: () => {
            canShootFireball = true;
            fireballCooldownGraphic.clearTint();
        },
        callbackScope: this
    });
}

function hitEnemy(fireball, enemy) {
    fireball.destroy();
    enemyHealth -= 100;
    if (enemyHealth <= 0) {
        enemy.destroy();
        enemyHealthBar.destroy();
        spawnEnemy.call(this);
    }
}