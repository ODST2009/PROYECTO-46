class Game {
    constructor() {
        // Inicialización si es necesario
    }

    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        });
    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }

    async start() {
        if (gameState === 0) {
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form();
            form.display();
        }

        player1 = createSprite(200, 500);
        player1.addImage("player1", player_img);

        player2 = createSprite(800, 500);
        player2.addImage("player2", player_img);
        players = [player1, player2];

        obstacleGroup = new Group(); // Inicializa el grupo de obstáculos
        fruitGroup = new Group();    // Asegúrate de que fruitGroup también esté inicializado
    }

    play() {
        form.hide();

        Player.getPlayerInfo();
        player.getPlayerAtEnd();
        image(back_img, 0, 0, 1000, 800);

        var x = 100;
        var y = 200;
        var index = 0;
        drawSprites();

        for (var plr in allPlayers) {
            index += 1;
            x = 500 - allPlayers[plr].distance;
            y = 500;

            players[index - 1].x = x;
            players[index - 1].y = y;

            if (index === player.index) {
                fill("black");
                textSize(25);
                text(allPlayers[plr].name, x - 25, y + 25);
            }

            textSize(25);
            fill("white");
            text("Jugador 1: " + allPlayers[plr].score, 50, 50); // Usa el nombre correcto desde allPlayers
            text("Jugador 2: " + allPlayers[plr].score, 50, 100); // Usa el nombre correcto desde allPlayers
        }

        if (player.score >= 5) {
            gameState = 2; // Cambia a estado 2 (Finalización del juego)
            player.rank += 1;
            Player.updatePlayerAtEnd(player.rank);
            player.update();
            this.showRank();
        }

        if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
            player.distance -= 10;
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.index !== null) {
            player.distance += 10;
            player.update();
        }

        // Generar frutas cada 20 cuadros
        if (frameCount % 20 === 0) {
            var fruits = createSprite(random(100, 1000), 0, 100, 100);
            fruits.velocityY = 6;
            var rand = Math.round(random(1, 5));
            switch (rand) {
                case 1: fruits.addImage("fruit1", fruit1_img);
                    break;
                case 2: fruits.addImage("fruit1", fruit2_img);
                    break;
                case 3: fruits.addImage("fruit1", fruit3_img);
                    break;
                case 4: fruits.addImage("fruit1", fruit4_img);
                    break;
                case 5: fruits.addImage("fruit1", fruit5_img);
                    break;
            }
            fruitGroup.add(fruits);
        }

        // Generar obstáculos cada 40 cuadros
        if (frameCount % 40 === 0) {
            this.addObstacles();
        }

        if (player.index !== null) {
            // Verificar si las frutas tocan a los jugadores
            for (var i = 0; i < fruitGroup.length; i++) {
                if (fruitGroup.get(i).isTouching(players)) {
                    fruitGroup.get(i).destroy();
                    player.score += 1;
                    player.update();
                }
            }

            // Verificar si los obstáculos tocan a los jugadores
            if (obstacleGroup.isTouching(players)) {
                gameState = 2;  // Cambia el estado del juego a 2 para finalizar
            }
        }

        if (gameState === 2) {
            this.gameOver();  // Mostrar el fin del juego
        }
    }

    addObstacles() {
        var x = random(100, 1000); 
        var y = 0; 
        var obstacle = createSprite(x, y);
        obstacle.addImage("obstacle", obstacleImage);
        obstacle.velocityY = 4;
        obstacle.scale = 0.15;
        obstacleGroup.add(obstacle);  
    }

    showRank() {
        alert("¡Impresionante! ¡Terminaste el juego! Tu posición es: " + player.rank);
    }

    gameOver() {
        textSize(40);
        fill("white");
        text("FIN DEL JUEGO", windowWidth / 2 - 200, windowHeight / 2 - 100); // Usar coordenadas relativas
    }

    end() {
        console.log("Game Ended");
        console.log(player.rank);
        this.gameOver();
    }
}

