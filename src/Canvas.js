import './canvas.css'
import {useEffect, useRef} from "react";



const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx
    let circles = []

    let maxRadius = 30
    let minRadius = 2
    let growSpeed = 1
    let shrunkSpeed = 0.2

    let colors = [
        '#3a86ff',
        '#8338ec',
        '#ff006e',
        '#fb5607',
        '#ffbe0b',
    ]

    useEffect(() => {
        canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx = canvas.getContext("2d")

        init()

        window.addEventListener('mousemove', mouseMove)
        window.addEventListener('resize', resizeWindow)

        update()

        return () => {
            window.removeEventListener('mousemove', mouseMove)
            window.removeEventListener('resize', resizeWindow)
        }
    }, [])

    let mouse = {
        x: undefined,
        y: undefined
    }
    const mouseMove = e => {
        mouse.x = e.x
        mouse.y = e.y
    }

    const resizeWindow = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
    }

    const init = () => {
        circles = []

        for (let i = 0; i < 400; i++) {
            const radius = Math.random() * 3 + 1
            const x = Math.random() * (canvas.width - radius * 2) + radius
            const y = Math.random() * (canvas.height - radius * 2) + radius
            const dx = (Math.random() - 0.5)
            const dy = (Math.random() - 0.5)
            const circle = new Circle(x, y, radius, dx, dy)
            circles.push(circle)
        }
    }


    function Circle(x, y, radius, dx, dy){
        this.x = x
        this.y = y
        this.radius = radius
        this.minRadius = radius
        this.dx = dx
        this.dy = dy
        this.color = colors[Math.floor(Math.random() * colors.length)]

        this.draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)
            ctx.fillStyle = this.color
            ctx.fill()
        }

        this.move = () => {
            this.draw()
            if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
                this.dx *= -1
            }
            if(this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
                this.dy *= -1
            }
            this.x += this.dx
            this.y += this.dy

            if(Math.abs(mouse.x - this.x) < 50 && Math.abs(mouse.y - this.y) < 50 && this.radius < maxRadius)
                this.radius += growSpeed
            else if(this.radius > this.minRadius)
                this.radius -= shrunkSpeed
        }
    }


    const clearAll = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }


    const update = () => {
        requestAnimationFrame(update)
        clearAll()
        circles.forEach( circle => circle.move())
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
