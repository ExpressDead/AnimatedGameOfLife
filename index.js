window.addEventListener('load', e => {
    const canvas = document.getElementById('canvas1');
    canvas.width = 1020;
    canvas.height = 520;

    ctx = canvas.getContext('2d');

    class Robot {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.spriteWidth = 900;
            this.spriteHeigth = 600;
            this.image = document.getElementById('robot');
            this.neighbours = 0;
            this.frame = 0;
            this.markedForDeletion = false;
        }
        draw() {
            ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x, this.y, this.game.stepx, this.game.stepy);
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
        }
        draw() {
            ctx.save();
            ctx.strokeStyle = this.color;
            ctx.strokeWidth = 0.5;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        addRobot(robot) {
            this.robot = robot;
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
            this.robots = [];
            this.timer = 0;
            this.interval = 50;
            this.running = false;

            //event listeners for the game
            canvas.addEventListener('click', e => {
                let x = e.offsetX - (e.offsetX % this.stepx);
                let y = e.offsetY - (e.offsetY % this.stepy);
                let cell = this.cells.filter(cell => cell.x == x && cell.y == y);
                console.log(cell);
                if(this.robots.filter(robot => robot.x == x && robot.y == y).length == 0) {
                    this.robots.push(new Robot(this, x, y));
                    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
                    this.draw();
                }
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
                cell.draw();
            });
            /*
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = 0.5;
            for (let i = this.stepx + 0.5; i < this.ctx.canvas.width; i += this.stepx) {
                this.ctx.beginPath();
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, this.ctx.canvas.height);
                this.ctx.stroke();
            }
            for (let i = this.stepy + 0.5; i < this.ctx.canvas.height; i += this.stepy) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(this.ctx.canvas.width, i);
                this.ctx.stroke();
            }*/

            // draw the robots currently in the game
            this.robots.forEach(robot => {
                robot.draw();
                robot.update();
            });
        }
        runGeneration() {
            // run the generation of robots
            if(this.timer > this.interval) {
                this.robots.forEach(robot => {
                    this.findNeighbours(robot);
                    if(robot.neighbours < 2 || robot.neighbours > 3) {
                        robot.markedForDeletion = true;
                    }
                    if(robot.neighbours == 0) {
                        robot.markedForDeletion = true;
                    }
                });
                this.robots = this.robots.filter(robot => !robot.markedForDeletion);
                this.timer = 0;
            } else {
                this.timer++;
            }
        }
        findNeighbours(robot) {
            // find the neighbours of each robot
            let rx = robot.x;
            let ry = robot.y;
            this.robots.forEach(r => {
                if(r.x == rx + this.stepx && r.y == ry) {
                    robot.neighbours++;
                } else if (r.x == rx - this.stepx && r.y == ry )
                    robot.neighbours++;
                else if (r.x == rx && r.y == ry + this.stepy)
                    robot.neighbours++;
                else if (r.x == rx && r.y == ry - this.stepy)
                    robot.neighbours++;
                else if (r.x == rx + this.stepx && r.y == ry + this.stepy)
                    robot.neighbours++;
                else if (r.x == rx - this.stepx && r.y == ry - this.stepy)
                    robot.neighbours++;
                else if (r.x == rx + this.stepx && r.y == ry - this.stepy)
                    robot.neighbours++;
                else if (r.x == rx - this.stepx && r.y == ry + this.stepy)
                    robot.neighbours++;
            });
        }
        randomPopulation() {
            // add random robots to the game
            for(let i = 1; i < 20; i++) {
                let x = Math.floor(Math.random() * 50) * this.stepx;
                let y = Math.floor(Math.random() * 25) * this.stepy;
                this.robots.push(new Robot(this, x, y));
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
            if(this.robots.length == 0) {
                 this.randomPopulation();
            }
            this.running = true;
            const animate = () => {
                this.runGeneration();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.draw();
                if(this.running) {
                    document.getElementById('currentState').innerHTML = 'Running...';
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
            this.robots = [];
        }
    }

    const game = new Game(ctx, 'lightgray', 100, 75);
    game.init();

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('currentState').innerHTML = 'Waiting...';
        game.draw();
    }

    animate(0);
});