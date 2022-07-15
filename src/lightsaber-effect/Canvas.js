import {useEffect, useRef} from "react"
import gsap from "gsap"

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let particles = []

    // 眼球效果
    // const radius = 130
    // 光剑效果
    const radius = 10
    const particleCount = 400
    let angle = 0
    const hueIncrement = 360 / particleCount
    const radiusIncrement = radius / particleCount

    let timer = 0

    let center = {
        x: undefined,
        y: undefined
    }

    let mouse = {
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
        r: 0,
        g: 0,
        b: 0,
        a: 0.05
    }

    class Particle{

        constructor (x, y, radius, distanceFromCenter, color){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.distanceFromCenter = distanceFromCenter
        }

        draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)
            ctx.fillStyle = this.color
            ctx.fill()
        }

        move = (timer) => {
            this.draw()

            // 光剑效果
            this.y = center.y + this.distanceFromCenter * Math.sin(angle)
            this.x = center.x + this.distanceFromCenter * Math.cos(angle)

            // 眼球效果
            // this.x = center.x + this.distanceFromCenter * Math.cos(angle) * Math.cos(timer)
            // this.y = center.y + this.distanceFromCenter * Math.sin(angle) * Math.sin(timer)
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
        gsap.to(mouse,
            {
                x: e.x - center.x,
                y: e.y - center.y,
                duration: 1
            })
        angle = Math.atan2(mouse.y, mouse.x)
    }

    const randomColor = (colors) => {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const randomFromRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const resizeWindow = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
    }

    const init = () => {
        center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        particles = []
        for (let i = 0; i < particleCount; i++) {
            const x = canvas.width / 2 + i * Math.cos(1)
            const y = canvas.height / 2 + i * Math.sin(1)
            const particle = new Particle(x, y, radius - radiusIncrement * i, i, `hsl(${hueIncrement * i }, 50%, 50%)`)
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
        clearWithOpacity()
        timer += 0.001
        particles.forEach(particle => particle.move(timer))
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
