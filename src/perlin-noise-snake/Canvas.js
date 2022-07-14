import {useEffect, useRef} from "react";
import {noise} from '@chriscourses/perlin-noise'

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let circles = []
    let time = 0

    let mouse = {
        x: undefined,
        y: undefined
    }

    let colors = [
        '#f07167',
        '#fed9b7',
        '#fdfcdc',
        '#00afb9',
        '#0081a7',
    ]

    const bgColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 0.01
    }

    let strokeColor = 'teal'

    class Circle{

        constructor (x, y, radius, offset){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = colors[Math.floor(Math.random() * colors.length)]
            this.offset = offset
        }



        draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)
            ctx.fillStyle = this.color
            ctx.fill()
            ctx.save()
            ctx.strokeStyle = strokeColor
            ctx.stroke()
            ctx.restore()
        }

        move = () => {
            strokeColor = randomColor(colors)
            this.draw()
            this.x = noise(time + this.offset + 20) * canvas.width
            this.y = noise(time + this.offset) * canvas.height
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
        circles = []
        for (let i = 0; i < 50; i++) {
            const radius = randomFromRange(6, 24)
            const circle = new Circle(-30,  -30, radius, i * 0.01)
            circles.push(circle)
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
        // clearAll()
        clearWithOpacity()
        circles.forEach(circle => circle.move())
        time += 0.005
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
