import {useEffect, useRef} from "react";

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let mouse = {
        x: undefined,
        y: undefined
    }

    let bigRectangle = {
        x: undefined,
        y: undefined,
        width: 300,
        height: 200
    }

    let smallRectangle = {
        x: undefined,
        y: undefined,
        width: 100,
        height: 50
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

        smallRectangle = {
            ...smallRectangle,
            x: mouse.x - smallRectangle.width / 2,
            y: mouse.y - smallRectangle.height / 2
        }
    }

    const resizeWindow = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
    }

    const init = () => {
        bigRectangle = {
            ...bigRectangle,
            x: canvas.width / 2 - bigRectangle.width / 2 ,
            y: canvas.height / 2 - bigRectangle.height / 2,
        }



    }


    const clearAll = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }

    const collisionDetection = () => {
        if(
            smallRectangle.x + smallRectangle.width >= bigRectangle.x &&
            smallRectangle.x <= bigRectangle.x + bigRectangle.width &&
            smallRectangle.y + smallRectangle.height >= bigRectangle.y &&
            smallRectangle.y <= bigRectangle.y + bigRectangle.height
        ){
            console.log('colliding!')
        }
    }

    const update = () => {
        requestAnimationFrame(update)
        clearAll()

        // big rectangle
        {
            ctx.fillStyle = 'teal'
            const {x, y, width, height} = bigRectangle
            ctx.fillRect(x, y, width, height)
        }

        // small rectangle
        {
            ctx.fillStyle = 'tomato'
            const {x, y, width, height} = smallRectangle
            ctx.fillRect(x, y, width, height)
        }

        collisionDetection()
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
