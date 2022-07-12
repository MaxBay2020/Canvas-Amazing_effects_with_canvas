import {useEffect, useRef} from "react";

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let ball
    let count = 400
    let balls = []
    let gravity = 1
    let friction = 0.59
    let colors = [
        '#d90429',
        '#ef233c',
        '#edf2f4',
        '#8d99ae',
        '#2b2d42',
    ]


    useEffect(() => {
        canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx = canvas.getContext("2d")

        init()

        window.addEventListener('click', clickMouse)
        window.addEventListener('resize', resizeWindow)

        update()

        return () => {
            window.removeEventListener('click', clickMouse)
            window.removeEventListener('resize', resizeWindow)
        }
    }, [])

    let mouse = {
        x: undefined,
        y: undefined
    }
    const clickMouse = () => {
        init()
    }

    const resizeWindow = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
    }

    const init = () => {
        balls = []

        for (let i = 0; i < count; i++) {
            const radius = randomFromRange(6, 24)
            const x = randomFromRange(radius, canvas.width - radius)
            const y = randomFromRange(canvas.height / 4, canvas.height - radius)
            const dx = randomFromRange(-2, 2)
            const dy = randomFromRange(-1, 1)
            const color = randomColor(colors)
            ball = new Ball(x, y, dx, dy,radius, color)
            balls.push(ball)
        }
    }

    const randomColor = (colors) => {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const randomFromRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }


    function Ball(x, y, dx, dy, radius, color){
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.radius = radius
        this.color = color

        this.draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)
            ctx.fillStyle = this.color
            ctx.stroke()
            ctx.fill()
        }

        this.drop = () => {
            this.draw()
            if(this.y + this.radius + this.dy > canvas.height){
                this.dy *= -1 * friction
            }else{
                this.dy += gravity
            }

            if(this.x + this.radius + this.dx >= canvas.width || this.x - this.radius <= 0){
                this.dx *= -1
            }

            this.x += this.dx
            this.y += this.dy
        }
    }


    const clearAll = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }


    const update = () => {
        requestAnimationFrame(update)

        clearAll()

        balls.forEach(ball => ball.drop())
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
