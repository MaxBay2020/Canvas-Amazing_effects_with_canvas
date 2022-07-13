import {useEffect, useRef} from "react";

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

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


        this.draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)

            ctx.strokeStyle = this.color
            ctx.stroke()

        }

        this.move = () => {

            this.draw()
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

    }


    const clearAll = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }



    const update = () => {
        requestAnimationFrame(update)
        clearAll()

    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
