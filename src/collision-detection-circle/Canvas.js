import {useEffect, useRef} from "react";

const Canvas = () => {
    const canvasRef = useRef(null)
    let canvas, ctx

    let mouse = {
        x: undefined,
        y: undefined
    }
    let particles = []

    const radiusValue = 15
    const speed = 5
    const minDistance = 120
    const maxOpacity = 0.8


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

    const mouseMove = e => {
        mouse.x = e.x
        mouse.y = e.y
    }

    const resizeWindow = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
    }



    const init = () => {
        particles = []

        for (let i = 0; i < 200; i++) {
            // const radius = randomFromRange(4, 25)
            const radius = radiusValue
            let x = randomFromRange(radius, canvas.width - radius)
            let y = randomFromRange(radius, canvas.height - radius)
            const color = randomColor(colors)
            let newParticle = new Particle(x, y, radius, color)

            if(i !== 0){
                for (let j = 0; j < particles.length; j++) {
                    const distance = distanceDiff(newParticle, particles[j])
                    if(distance < newParticle.radius + particles[j].radius){
                        newParticle.x = randomFromRange(radius, canvas.width - radius)
                        newParticle.y = randomFromRange(radius, canvas.height - radius)
                        j = -1
                    }
                }
            }

            particles.push(newParticle)
        }
    }

    const randomColor = (colors) => {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const randomFromRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }


    function Particle(x, y, radius, color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.opacity = 0.2
        this.velocity = {
            x: (Math.random() - 0.5) * speed,
            y: (Math.random() - 0.5) * speed
        }
        this.mass = 1

        this.draw = () =>  {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false)

            ctx.save()
            ctx.globalAlpha = this.opacity
            ctx.fillStyle = this.color
            ctx.fill()
            ctx.restore()

            ctx.strokeStyle = this.color
            ctx.stroke()

        }

        this.move = particles => {
            this.draw()
            collision(this, particles)

            this.x += this.velocity.x
            this.y += this.velocity.y

            detectWalls(this)

            mouseCollision(this)
        }
    }

    const mouseCollision = (particle) => {
        const xDistance = mouse.x - particle.x
        const yDistance = mouse.y - particle.y
        const distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))

        if(distance < minDistance && particle.opacity < maxOpacity){
            particle.opacity += 0.02
        }else if(particle.opacity > 0){
            particle.opacity -= 0.02
            particle.opacity = Math.max(0, particle.opacity)
        }
    }

    const collision = (particle, particles) => {
        const rest = particles.filter(item => item !== particle)
        rest.forEach(item =>{
            const distance = distanceDiff(particle, item)
            if(distance < particle.radius + item.radius){
                let temp = item
                item.color = particle.color
                particle.color = temp.color
                resolveCollision(particle, item)
            }
        })
    }

    const resolveCollision = (particle, otherParticle) => {
        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding particles
            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

            // Store mass in var for better readability in collision equation
            const m1 = particle.mass;
            const m2 = otherParticle.mass;

            // Velocity before equation
            const u1 = rotate(particle.velocity, angle);
            const u2 = rotate(otherParticle.velocity, angle);

            // Velocity after 1d collision equation
            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            // Final velocity after rotating axis back to original location
            const vFinal1 = rotate(v1, -angle);
            const vFinal2 = rotate(v2, -angle);

            // Swap particle velocities for realistic bounce effect
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;

            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }
    }

    const rotate = (velocity, angle) => {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };

        return rotatedVelocities;
    }

    const detectWalls = particle => {
        const {x, y, radius, velocity} = particle
        if(x - radius < 0 || x + radius > canvas.width)
            velocity.x *= -1
        if(y - radius < 0 || y + radius > canvas.width)
            velocity.y *= -1
    }


    const clearAll = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }

    const distanceDiff = (circle1, circle2) => {
        const xDistance = circle1.x - circle2.x
        const yDistance = circle1.y - circle2.y
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
    }

    const update = () => {
        requestAnimationFrame(update)
        clearAll()

        particles.forEach(particle => particle.move(particles))

    }

    return (
        <div className='canvasContainer'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default Canvas;
