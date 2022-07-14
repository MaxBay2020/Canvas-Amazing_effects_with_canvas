import {useEffect, useRef} from "react";

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let particles = []

    const gravity = 0.005
    const friction = 0.99
    const speed = 10


    let mouse = {
        x: undefined,
        y: undefined
    }
    const radius = 5
    const particleCount = 600

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
        a: 0.1
    }

    class Particle{

        constructor (x, y, radius, velocity){
            this.x = x
            this.y = y
            this.radius = radius
            // this.color = colors[Math.floor(Math.random() * colors.length)]
            this.color = `rgb(${randomFromRange(0, 255)}, ${randomFromRange(0, 255)}, ${randomFromRange(0, 255)})`
            this.velocity = velocity
            this.alpha = 1
        }



        draw = () =>  {
            ctx.save()
            ctx.globalAlpha = this.alpha
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)
            ctx.fillStyle = this.color
            ctx.fill()
            ctx.restore()
        }

        move = () => {
            this.draw()
            this.velocity.x *= friction
            this.velocity.y *= friction
            this.velocity.y += gravity
            this.x += this.velocity.x
            this.y += this.velocity.y
            this.alpha -= 0.01
        }
    }


    useEffect(() => {
        canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx = canvas.getContext("2d")

        init()

        window.addEventListener('click', fire)
        window.addEventListener('resize', resizeWindow)

        update()

        return () => {
            window.removeEventListener('click', fire)
            window.removeEventListener('resize', resizeWindow)
        }
    }, [])

    const fire = (e) => {
        mouse = {
            x: e.x,
            y: e.y
        }

        const angleIncrement = Math.PI * 2 / particleCount

        for (let i = 0; i < particleCount; i++) {
            const velocity = {
                x: Math.cos(angleIncrement * i) * Math.random() * speed,
                y: Math.sin(angleIncrement * i) * speed
            }
            const particle = new Particle(mouse.x, mouse.y, radius, velocity)
            particles.push(particle)
        }
    }

    const mouseMove = e => {
        mouse.x = e.x
        mouse.y = e.y
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
        // particles = []
        // const particle = new Particle(canvas.width / 2, canvas.height / 2, 20)
        // particles.push(particle)
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
        particles.forEach((particle, i) => {
            if(particle.alpha > 0){
                particle.move()
            }else{
                particles.splice(i,1)
            }
        })
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
