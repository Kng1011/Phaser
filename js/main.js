const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
let enemy;
let enemyHealth = 100; // Vida inicial do inimigo
let enemyHealthBar;
let enemyAttackRange = 50; // Alcance de ataque do inimigo
let fireballs;
let canShootFireball = true;
let fireballCooldownTime = 2000; // 2 segundos
let fireballCooldownGraphic;

function preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fireball', 'assets/fireball.png', { frameWidth: 64, frameHeight: 32 });
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

    cursors = this.input.keyboard.createCursorKeys();

    // Adiciona inimigo
    spawnEnemy.call(this);

    // Cria o grupo de fireballs
    fireballs = this.physics.add.group({
        defaultKey: 'fireball',
        maxSize: 10
    });

    // Adiciona o indicador de cooldown do fireball
    fireballCooldownGraphic = this.add.image(60, 20, 'fireball').setScale(2).setFrame(0);
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

    // Aplica a máscara de iluminação à escuridão
    darkness.mask = new Phaser.Display.Masks.BitmapMask(this, lightMask);

    // Controle do jogador
    if (Phaser.Input.Keyboard.JustDown(attackKey)) {
        if (!player.anims.isPlaying || player.anims.currentAnim.key.indexOf('attack') === -1) {
            player.anims.play('attack' + direction.toLowerCase(), true);
            dealDamage.call(this);
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
            }
        } else {
            // Inimigo segue o jogador
            this.physics.moveToObject(enemy, player, 100);
            // Atualiza a animação do inimigo baseado na direção
            updateEnemyAnimation.call(this);
        }
    }

    // Atualiza a barra de vida do inimigo
    updateEnemyHealthBar.call(this);
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
    if (enemy) {
        this.physics.moveToObject(fireball, enemy, 300);
    }

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
