const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const startButton = document.getElementById('startButton');
        const onScreenKeyboard = document.getElementById('onScreenKeyboard');
        const stats = document.getElementById('stats');
        const gameOverScreen = document.getElementById('gameOver');
        const timeDisplay = document.getElementById('time');
        const speedDisplay = document.getElementById('speed');
        const accuracyDisplay = document.getElementById('accuracy');
        const finalTimeDisplay = document.getElementById('finalTime');
        const finalSpeedDisplay = document.getElementById('finalSpeed');
        const finalAccuracyDisplay = document.getElementById('finalAccuracy');

        let letters = [];
        let score = 0;
        let missed = 0;
        let startTime;
        let gameInterval;
        let letterInterval;
        let gameActive = false;
        let gameOverZoneHeight = 200;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Letter {
            constructor(char) {
                this.char = char;
                this.x = Math.random() * (canvas.width - 40) + 20;
                this.y = -40;
                this.speed = Math.random() * 2 + 1;
                this.size = 40;
            }

            draw() {
                ctx.fillStyle = '#ffffff';
                ctx.font = `${this.size}px Arial`;
                ctx.fillText(this.char, this.x, this.y);
            }

            update() {
                this.y += this.speed;
            }
        }

        function addLetter() {
            const charCode = Math.floor(Math.random() * 26) + 65;
            const letter = new Letter(String.fromCharCode(charCode));
            letters.push(letter);
        }

        function updateGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            
            ctx.fillStyle = '#282c34';
            ctx.fillRect(0, canvas.height - gameOverZoneHeight, canvas.width, gameOverZoneHeight);

            const currentTime = (Date.now() - startTime) / 1000;
            timeDisplay.textContent = currentTime.toFixed(1);
            speedDisplay.textContent = ((score / currentTime) * 60).toFixed(1);
            accuracyDisplay.textContent = ((score / (score + missed)) * 100 || 100).toFixed(1);

            letters.forEach((letter, index) => {
                letter.update();
                letter.draw();
                if (letter.y > canvas.height - gameOverZoneHeight) {
                    letters.splice(index, 1);
                    missed++;
                    endGame();
                }
            });
        }

        function startGame() {
            gameActive = true;
            letters = [];
            score = 0;
            missed = 0;
            startTime = Date.now();
            gameOverScreen.style.display = 'none';
            stats.style.display = 'block';
            onScreenKeyboard.style.display = 'block';
            startButton.style.display = 'none';
            gameInterval = setInterval(updateGame, 16);
            letterInterval = setInterval(addLetter, 1000);
        }

        function endGame() {
            gameActive = false;
            clearInterval(gameInterval);
            clearInterval(letterInterval);
            stats.style.display = 'none';
            onScreenKeyboard.style.display = 'none';
            gameOverScreen.style.display = 'block';
            startButton.style.display = 'none';
            const finalTime = (Date.now() - startTime) / 1000;
        finalTimeDisplay.textContent = finalTime.toFixed(1);
        finalSpeedDisplay.textContent = ((score / finalTime) * 60).toFixed(1);
        finalAccuracyDisplay.textContent = ((score / (score + missed)) * 100 || 100).toFixed(1);
        gameOverScreen.style.display = 'block';
        startButton.style.display = 'none';
    }

    function createOnScreenKeyboard() {
        const fragment = document.createDocumentFragment();
        const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        keys.forEach((key) => {
            const keyElement = document.createElement('div');
            keyElement.classList.add('key');
            keyElement.textContent = key;
            keyElement.addEventListener('click', () => handleKeyPress(key));
            fragment.appendChild(keyElement);
        });
        onScreenKeyboard.appendChild(fragment);
    }

    function handleKeyPress(key) {
        if (!gameActive) return;
        letters.forEach((letter, index) => {
            if (letter.char === key) {
                letters.splice(index, 1);
                score++;
            }
        });
    }

    startButton.addEventListener('click', () => {
        startGame();
        createOnScreenKeyboard();
    });

    
    document.addEventListener('keydown', (event) => {
        if (!gameActive) return;
        const key = event.key.toUpperCase();
        if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(key)) {
            handleKeyPress(key);
        }
    });
