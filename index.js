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
            this.frame = 0;
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
            this.slider = document.getElementById('cell-size');

            //event listeners for the game
            canvas.addEventListener('click', e => {
                let x = e.offsetX - (e.offsetX % this.stepx);
                let y = e.offsetY - (e.offsetY % this.stepy);
                this.robots.push(new Robot(x, y));
            });
            this.slider.addEventListener('change', e => {
                this.stepx = e.target.value;
                this.stepy = e.target.value;
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
        init() {
            // adding random seed robots to the game for testing & development
            for(let i = 1; i < 20; i++) {
                let x = Math.floor(Math.random() * 50) * this.stepx;
                let y = Math.floor(Math.random() * 25) * this.stepy;
                this.robots.push(new Robot(x, y));
            };
        }
    }

    const game = new Game(ctx, 'lightgray', 20, 20);
    game.init();

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw();

        requestAnimationFrame(animate);
    }

    animate();

    
});