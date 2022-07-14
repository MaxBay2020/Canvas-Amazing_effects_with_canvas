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

        // update()

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
        ctx.beginPath()
        ctx.moveTo(0,canvas.height/2)
        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.strokeStyle = 'teal'
        ctx.stroke()
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
