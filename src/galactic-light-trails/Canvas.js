import {useEffect, useRef} from "react";

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let particles = []
    const particleCount = 500
    const minRadius = 0.2
    const maxRadius = 2

    let isMouseDown = false

    let radians = 0
    let speed = 0.003
    const shadowBlurValue = 10
    const accelerationSpeed = 0.0001
    const maxSpeed = 0.012

    let mouse = {
        x: undefined,
        y: undefined
    }

    let center = {
        x: undefined,
        y: undefined
    }

    // const colors = [
    //     '#0466c8',
    //     '#0353a4',
    //     '#002855',
    //     '#001845',
    //     '#001233',
    //     '#33415c',
    //     '#5c677d',
    //     '#979dac',
    // ]

    // const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
    const colors = ['#dd1c1a', '#fff1d0', '#f0c808', '#086788', '#06aed5']

    const bgColor = {
        r: 10,
        g: 10,
        b: 10,
        a: 1
    }

    const alphaSpeed = 0.01


    class Particle{

        constructor (x, y, radius){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = randomColor(colors)
        }

        draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)
            ctx.shadowColor = this.color
            ctx.shadowBlur = shadowBlurValue
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

        window.addEventListener('mousedown', mouseDown)
        window.addEventListener('mouseup', mouseUp)
        window.addEventListener('resize', resizeWindow)

        update()

        return () => {
            window.removeEventListener('mousedown', mouseDown)
            window.removeEventListener('mouseup', mouseUp)
            window.removeEventListener('resize', resizeWindow)
        }
    }, [])


    const mouseDown = () => {
        isMouseDown = true
    }

    const mouseUp = () => {
        isMouseDown = false
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
            const longSide = canvas.width > canvas.height ? canvas.width : canvas.height
            // const canvasWidth = canvas.width + 300
            // const canvasHeight = canvas.height + 300
            const x = Math.random() * longSide - longSide / 2
            const y = Math.random() * longSide - longSide / 2
            const radius = randomFromRange(minRadius, maxRadius)
            const particle = new Particle(x, y, radius)
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

        // 旋转画布
        ctx.save()
        ctx.translate(center.x, center.y)
        ctx.rotate(radians)
        particles.forEach(particle => particle.move())
        ctx.restore()

        radians += speed

        if(isMouseDown && bgColor.a >= 0.03 && speed < maxSpeed){
            bgColor.a -= alphaSpeed
            speed += accelerationSpeed
            console.log(speed)
        }else if(!isMouseDown && bgColor.a < 1 && speed > 0){
            bgColor.a += alphaSpeed
            speed -= accelerationSpeed
        }


    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
