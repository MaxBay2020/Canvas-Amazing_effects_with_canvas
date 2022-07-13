import {useEffect, useRef} from "react";



const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let particles = []
    let maxRadius = 1
    let minRadius = 4


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

    function Particle(x, y, radius, color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.radians = Math.random() * Math.PI * 2
        this.velocity = 0.05
        // this.distanceFromCenter = {
        //     x: randomFromRange(50, 120),
        //     y: randomFromRange(50, 120)
        // }
        this.distanceFromCenter = randomFromRange(50, 150)
        this.lastMouse = {
            x: x,
            y: y
        }


        this.draw = lastPoint =>  {
            ctx.beginPath()
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.radius
            ctx.moveTo(lastPoint.x, lastPoint.y)
            ctx.lineTo(this.x, this.y)
            ctx.stroke()
            ctx.closePath()
        }

        this.move = () => {
            const lastPoint = {
                x: mouse.x, 
                y: mouse.y
                // x: this.x, 
                // y: this.y
            }
            
            this.radians += this.velocity

            this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05
            this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05


            this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter
            this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter
            this.draw(lastPoint)
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
        particles = []

        for (let i = 0; i < 100; i++){
            const radius = randomFromRange(minRadius, maxRadius)
            const color = randomColor(colors)
            const particle = new Particle(canvas.width / 2, canvas.height / 2, radius, color)
            particles.push(particle)
        }

    }


    const clearAll = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }



    const update = () => {
        requestAnimationFrame(update)
        ctx.fillStyle = 'rgba(255,255,255,0.05)'
        ctx.fillRect(0,0,canvas.width,canvas.height)

        particles.forEach(particle => particle.move())
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
