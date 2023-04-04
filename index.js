window.addEventListener('load', e => {

    const canvas = document.getElementById('canvas1');
    canvas.width = 800;
    canvas.height = 500;

    ctx = canvas.getContext('2d');

    let sw = 900;
    let sh = 600;
    frameX = 0;

    let image = document.getElementById('robot');


    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(image, frameX * sw, 0, 909, 600, (canvas.width * 0.5) - 100, (canvas.height * 0.5) + 150, 175, 100);

        frameX < 20 ? frameX++ : frameX = 0;
        requestAnimationFrame(animate);
    }

    animate();

});