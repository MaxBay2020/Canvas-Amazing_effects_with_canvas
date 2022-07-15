import {useEffect, useRef} from "react";

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let particles = []
    const particleCount = 400
    const radius = 10

    let mouse = {
        x: undefined,
        y: undefined
    }

    let center = {
        x: undefined,
        y: undefined
    }

    let colors = [
        '#3a86ff',
        '#8338ec',
        '#ff006e',
        '#fb5607',
        '#ffbe0b',
    ]

    const bgColor = {
        r: 255,
        g: 255,
        b: 255,
        a: 0.01
    }

    class Particle{

        constructor (x, y, radius){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = colors[Math.floor(Math.random() * colors.length)]
        }



        draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)
            ctx.fillStyle = this.color
            ctx.fill()
        }

        move = () => {
            this.draw()
        }
    }


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


    const mouseMove = e => {
        mouse.x = e.x
        mouse.y = e.y
    }

    const resizeWindow = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
    }

    const randomColor = (colors) => {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const randomFromRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }


    const init = () => {
        center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }
        particles = []

        for (let i = 0; i < particleCount; i++) {
            const particle = new Particle(center.x, center.y, radius)
            particles.push(particle)
        }
    }


    const clearAll = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }

    const clearWithOpacity = () => {
        const {r,g,b,a} = bgColor
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        ctx.fillRect(0,0,canvas.width,canvas.height)
    }


    const update = () => {
        requestAnimationFrame(update)
        clearAll()
        particles.forEach(particle => particle.move())
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
