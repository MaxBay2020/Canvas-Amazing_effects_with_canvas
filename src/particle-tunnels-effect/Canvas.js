import {useEffect, useRef} from "react";

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let particles = []
    const particleCount = 50
    const radius = 5
    const interval = 200
    const timeToLive = 1000

    let color = undefined
    let hue = 0
    let hueRadians = 0

    let velocity = {
        x: undefined,
        y: undefined
    }

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
        r: 0,
        g: 0,
        b: 0,
        a: 0.1
    }

    class Particle{

        constructor (x, y, radius, velocity, color){
            this.x = x
            this.y = y
            this.radius = radius
            this.velocity = velocity
            this.color = color
            this.ttl = timeToLive
        }



        draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)
            ctx.fillStyle = this.color
            ctx.fill()
        }

        move = () => {
            this.draw()
            this.x += this.velocity.x
            this.y += this.velocity.y
            this.ttl--

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
    }


    const clearAll = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }

    const clearWithOpacity = () => {
        const {r,g,b,a} = bgColor
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        ctx.fillRect(0,0,canvas.width,canvas.height)
    }

    const spawnRing = () => {
        setTimeout(spawnRing, interval)
        color = randomColor(colors)
        hue = Math.sin(hueRadians)


        for (let i = 0; i < particleCount; i++) {
            const radiant = Math.PI * 2 / particleCount
            velocity = {
                x: Math.cos(radiant * i),
                y: Math.sin(radiant * i)
            }
            const x = mouse.x
            const y = mouse.y
            const particle = new Particle(x, y, radius, velocity, `hsl(${Math.abs(hue * 360)}, 50%, 50%)`)
            particles.push(particle)
        }

        hueRadians += 0.1
    }

    spawnRing()


    const update = () => {
        requestAnimationFrame(update)
        clearWithOpacity()
        particles.forEach((particle, index) => {
            if(particle.ttl < 0)
                particles.splice(index,1)
            else
                particle.move()
        })
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
