window.addEventListener('load', e => {
    const canvas = document.getElementById('canvas1');
    canvas.width = 1020;
    canvas.height = 520;

    ctx = canvas.getContext('2d');

    class Robot {
        constructor(x, y) {
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
            ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x, this.y, 20, 20);
        }
        update() {
            this.frame < 20 ? this.frame++ : this.frame = 0;
        }
    }

    class Game {
        constructor(ctx, color, stepx, stepy) {
            this.ctx = ctx;
            this.color = color;
            this.stepx = stepx;
            this.stepy = stepy;
            this.robots = [];
            this.timer = 0;
            this.interval = 50;
            this.running = false;

            //event listeners for the game
            canvas.addEventListener('click', e => {
                let x = e.offsetX - (e.offsetX % 20);
                let y = e.offsetY - (e.offsetY % 20);
                if(this.robots.filter(robot => robot.x == x && robot.y == y).length == 0) {
                    this.robots.push(new Robot(x, y));
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
            }

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
                let x = Math.floor(Math.random() * 50) * 20;
                let y = Math.floor(Math.random() * 25) * 20;
                this.robots.push(new Robot(x, y));
            };
        }
        init() {
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
                    requestAnimationFrame(animate);
                }
            }
            animate();
        }
        stop() {
            this.running = false;
        }
        clear() {
            this.stop();
            this.robots = [];
        }
    }

    const game = new Game(ctx, 'lightgray', 20, 20);
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