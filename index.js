window.addEventListener('load', e => {
    const canvas = document.getElementById('canvas1');
    canvas.width = 1020;
    canvas.height = 520;

    ctx = canvas.getContext('2d');
    
    document.getElementById('currentState').innerHTML = 'Waiting...';

    class Robot {
        constructor(cell) {
            this.cell = cell;
            this.spriteWidth = 900;
            this.spriteHeigth = 600;
            this.image = document.getElementById('robot');
            this.frame = 0;
        }
        draw() {
            if(this.cell.width < 20 || this.cell.height < 20) {
                ctx.save();
                ctx.fillStyle = 'black';
                ctx.fillRect(this.cell.x, this.cell.y, this.cell.width, this.cell.height);
                ctx.restore();
            } else{
                ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.cell.x, this.cell.y, this.cell.width, this.cell.height);
            }
        }
        update() {
            this.frame < 20 ? this.frame++ : this.frame = 0;
        }
    }

    class Cell {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = this.game.stepx;
            this.height = this.game.stepy;
            this.color = 'lightgrey';
            this.robot = null;
            this.populated = false;
            this.populatedNeighbors = 0;
        }
        attachRobot() {
            if(this.populated) return;
            this.robot = new Robot(this);
            this.populated = true;
            this.game.robotCount++;
        }
        detachRobot() {
            this.robot = null;
            this.populated = false;
            this.game.robotCount--;
        }
        draw() {
            ctx.save();
            ctx.strokeStyle = this.color;
            ctx.strokeWidth = 0.5;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.restore();
            if(this.populated) {
                this.robot.draw();
            }
        }
    }

    class Game {
        constructor(ctx, color, stepx, stepy) {
            this.ctx = ctx;
            this.width = ctx.canvas.width;
            this.height = ctx.canvas.height;
            this.color = color;
            this.stepx = stepx;
            this.stepy = stepy;
            this.cells = [];
            this.timer = 0;
            this.interval = 5;
            this.running = false;
            this.robotCount = 0;
            this.displayCells = true;

            //event listeners for the game
            canvas.addEventListener('click', e => {
                let x = e.offsetX - (e.offsetX % this.stepx);
                let y = e.offsetY - (e.offsetY % this.stepy);
                let cell = this.cells.filter(cell => cell.x == x && cell.y == y);
                cell[0].attachRobot();
                cell[0].robot.draw();
            });
            document.getElementById('start').addEventListener('click', e => {
                this.running = true;
                this.start(ctx);
            });
            document.getElementById('stop').addEventListener('click', e => {
                this.stop();
            });
            document.getElementById('clear').addEventListener('click', e => {
                this.clear();
            });
        }
        draw() {
            // draw the grid for the game
            this.cells.forEach(cell => {
                if(this.displayCells) cell.draw();
                if(cell.populated) {
                    cell.robot.draw();
                    cell.robot.update();
                }
            });
        }
        runGeneration() {
            //run the generation of robots
            this.findNeighbours();
            if(this.timer > this.interval) {
                this.cells.forEach(cell => {
                    if(cell.populated) {
                        if(cell.populatedNeighbors < 2 || cell.populatedNeighbors > 3) {
                            cell.detachRobot();
                        }
                    } else {
                        if(cell.populatedNeighbors == 3) {
                            cell.attachRobot();
                        }
                    }
                });
                this.timer = 0;
            } else {
                this.timer++;
            }
        }
        findNeighbours() {
            // find the count of populated neighbours for every cell
            this.cells.forEach(cell => {
                let x = cell.x;
                let y = cell.y;
                cell.populatedNeighbors = 0;
                let neighboursArray = [];   
                neighboursArray.push(this.cells.filter(cell => cell.x == x - this.stepx && cell.y == y - this.stepy));
                neighboursArray.push(this.cells.filter(cell => cell.x == x && cell.y == y - this.stepy));
                neighboursArray.push(this.cells.filter(cell => cell.x == x + this.stepx && cell.y == y - this.stepy));
                neighboursArray.push(this.cells.filter(cell => cell.x == x - this.stepx && cell.y == y));
                neighboursArray.push(this.cells.filter(cell => cell.x == x + this.stepx && cell.y == y));
                neighboursArray.push(this.cells.filter(cell => cell.x == x - this.stepx && cell.y == y + this.stepy));
                neighboursArray.push(this.cells.filter(cell => cell.x == x && cell.y == y + this.stepy));
                neighboursArray.push(this.cells.filter(cell => cell.x == x + this.stepx && cell.y == y + this.stepy));
                neighboursArray.forEach(neighbor => {
                    if(neighbor.length > 0 && neighbor[0].populated) {
                        cell.populatedNeighbors++;
                    }
                });
            });
        }
        randomPopulation() {
            // add random robots to the game
            for(let i = 1; i < 20; i++) {
                let randomizedWidth = Math.floor(Math.random() * this.width);
                let randomizedHeight = Math.floor(Math.random() * this.height);
                let x = randomizedWidth - (randomizedWidth % this.stepx);
                let y = randomizedHeight - (randomizedHeight % this.stepy);
                let cell = this.cells.filter(cell => cell.x == x && cell.y == y);
                cell[0].attachRobot();
            };
        }
        init() {
            // create the cells for the current canvas size
            for(let i = 0; i < this.ctx.canvas.width; i += this.stepx) {
                for(let j = 0; j < this.ctx.canvas.height; j += this.stepy) {
                    this.cells.push(new Cell(this, i, j));
                }
            }
        }
        start(ctx) {
            if(this.robotCount == 0) {
                 this.randomPopulation();
            }
            this.running = true;
            const animate = () => {
                this.runGeneration();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.draw();
                if(this.running) {
                    document.getElementById('currentState').innerHTML = 'Running...';
                    console.log(this.cells.filter(cell => cell.populated));
                    requestAnimationFrame(animate);
                }
            }
            animate();
        }
        stop() {
            this.running = false;
            document.getElementById('currentState').innerHTML = 'Waiting...';
        }
        clear() {
            this.stop();
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.cells = [];
            this.robotCount = 0;
            this.init();
            this.draw();
        }
    }

    const game = new Game(ctx, 'lightgray', 80, 80);
    game.init();

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw();
    }

    animate(0);
});