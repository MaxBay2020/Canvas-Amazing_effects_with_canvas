import {useEffect, useRef} from "react";
import * as dat from 'dat.gui'

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let gui, wave, increment

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

    const strokeColor = {
        r: 100,
        g: 100,
        b: 100,
        a: 1
    }

    const bgColor = {
        r: 255,
        g: 255,
        b: 255,
        a: 0.01
    }


    useEffect(() => {
        canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx = canvas.getContext("2d")

        initGUI()

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

    // 初始化gui面板
    const initGUI = () => {
        gui = new dat.GUI()
        wave = {
            y: canvas.height / 2,
            length: 0.01,
            amplitude: 100,
            frequency: 0.01,
        }

        const waveInspector = gui.addFolder('Wave')
        waveInspector.add(wave, 'y', 0, canvas.height)
        waveInspector.add(wave, 'length', -0.1, 0.1)
        waveInspector.add(wave, 'amplitude', -300, 300)
        waveInspector.add(wave, 'frequency', -1, 1)
        waveInspector.open()

        const colorInspector = gui.addFolder('Color')
        colorInspector.add(strokeColor, 'r',0, 255)
        colorInspector.add(strokeColor, 'g',0, 255)
        colorInspector.add(strokeColor, 'b',0, 255)
        colorInspector.add(strokeColor, 'a',0, 1)
        colorInspector.open()

        const backgroundInspector = gui.addFolder('Background color')
        backgroundInspector.add(bgColor, 'r',0, 255)
        backgroundInspector.add(bgColor, 'g',0, 255)
        backgroundInspector.add(bgColor, 'b',0, 255)
        backgroundInspector.add(bgColor, 'a',0, 1)
        backgroundInspector.open()

        increment = wave.frequency
    }

    // 绘画直线
    const drawWave = () => {

        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let i = 0; i < canvas.width; i++) {
            ctx.lineTo(
                i,
                wave.y + Math.sin(i * wave.length + increment) * wave.amplitude * Math.sin(increment)
            )
        }

        const {r,g,b,a} = strokeColor
        ctx.strokeStyle = `rgba(${r*Math.sin(increment) % 255}, ${g*Math.sin(increment*2) % 255}, ${b*Math.sin(increment*3) % 255}, ${a})`
        ctx.stroke()
        // ctx.fillStyle = '#a8dadc'
        // ctx.fill()
        increment += wave.frequency
    }

    const init = () => {
        drawWave()
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
        drawWave()
    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
