import React, { useEffect, useRef } from 'react'

import getCanvasDpr from '../../utils/getCanvasDpr'

function GradientBackground() {
  const canvasRef = useRef()

  useEffect(() => handleCanvas(canvasRef.current), [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}

function handleCanvas(canvas) {
  /* ---
  | STATE AND PARAMETERS
  --- */

  const _ = canvas.getContext('2d')
  const dpr = getCanvasDpr(_)
  const state = {
    width: 0,
    height: 0,
    minSize: 0,
    minRadius: 0,
    maxRadius: 0,
    backgroundColor: '#ffffff',
    colors: ['#39e662', '#39e662', '#39e662'],
    nPoints: 6,
    pointSpeed: 1.5,
    pointRadialSpeed: 1,
    points: [],
    animationFrameId: null,
  }

  _.scale(dpr, dpr)

  start()

  /* ---
  | LOGIC
  --- */

  function start() {
    window.addEventListener('resize', handleResize)
    handleResize()
    loop()
  }

  function stop() {
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(state.animationFrameId)
  }

  function loop() {
    draw()
    update()

    state.animationFrameId = requestAnimationFrame(loop)
  }

  function handleResize() {
    canvas.width = state.width = window.innerWidth * dpr
    canvas.height = state.height = (window.innerHeight - 76) * dpr

    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight - 76}px`

    state.minSize = Math.min(state.width, state.height)
    state.minRadius = state.minSize / 2
    state.maxRadius = state.minSize

    state.points.length = 0

    for (let i = 0; i < state.nPoints; i++) {
      state.points.push({
        r: randomBetween(state.minRadius, state.maxRadius),
        x: randomBetween(0, state.width),
        y: randomBetween(0, state.height),
        dr: (Math.random() > 0.5 ? -1 : 1) * state.pointRadialSpeed,
        dx: randomBetween(-state.pointSpeed, state.pointSpeed),
        dy: randomBetween(-state.pointSpeed, state.pointSpeed),
        color: randomItem(state.colors),
      })
    }
  }

  function draw() {
    _.fillStyle = state.backgroundColor
    _.fillRect(0, 0, state.width, state.height)

    state.points.forEach(point => {
      drawCircle(point.x, point.y, point.r, point.color)
    })

    const bottomGradient = _.createLinearGradient(0, 0, 0, state.height)
    bottomGradient.addColorStop(0, `${state.backgroundColor}00`)
    bottomGradient.addColorStop(0.5, `${state.backgroundColor}00`)
    bottomGradient.addColorStop(1, state.backgroundColor)

    _.fillStyle = bottomGradient
    _.fillRect(0, 0, state.width, state.height)
  }

  function drawCircle(x, y, radius, color) {
    const gradient = _.createRadialGradient(x, y, radius * 0.01, x, y, radius)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, `${color}00`)

    _.fillStyle = gradient
    _.beginPath()
    _.arc(x, y, radius, 0, Math.PI * 2)
    _.fill()
  }

  function update() {
    state.points.forEach(point => {
      point.r += point.dr
      point.x += point.dx
      point.y += point.dy

      if (point.r < state.minRadius) {
        point.r = state.minRadius
        point.dr *= -1
      }
      else if (point.r > state.maxRadius) {
        point.r = state.maxRadius
        point.dr *= -1
      }
      if (point.x < 0) {
        point.x = 0
        point.dx *= -1
      }
      else if (point.x > state.width) {
        point.x = state.width
        point.dx *= -1
      }
      if (point.y < 0) {
        point.y = 0
        point.dy *= -1
      }
      else if (point.y > state.height) {
        point.y = state.height
        point.dy *= -1
      }
    })
  }

  function randomBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a
  }

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  return stop
}

export default GradientBackground
