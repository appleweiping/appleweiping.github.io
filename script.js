const root = document.documentElement
root.classList.add('js')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function initReveals() {
  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'))
  if (revealElements.length === 0) return

  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -10% 0px',
  })

  revealElements.forEach(element => observer.observe(element))
}

function initHeroPointer() {
  const hero = document.querySelector('[data-hero]')
  if (!(hero instanceof HTMLElement)) return
  if (prefersReducedMotion.matches || !window.matchMedia('(pointer: fine)').matches) return

  let rafId = 0
  let nextX = 50
  let nextY = 34

  function commit() {
    rafId = 0
    hero.style.setProperty('--hero-x', `${nextX}%`)
    hero.style.setProperty('--hero-y', `${nextY}%`)
  }

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect()
    nextX = ((event.clientX - rect.left) / rect.width) * 100
    nextY = ((event.clientY - rect.top) / rect.height) * 100
    if (rafId !== 0) return
    rafId = requestAnimationFrame(commit)
  })

  hero.addEventListener('pointerleave', () => {
    nextX = 50
    nextY = 34
    if (rafId !== 0) return
    rafId = requestAnimationFrame(commit)
  })
}

function buildSignalPath(points) {
  if (points.length === 0) return ''
  if (points.length === 1) {
    const point = points[0]
    return `M ${point.x} ${point.y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const midY = previous.y + (current.y - previous.y) / 2
    path += ` C ${previous.x} ${midY}, ${current.x} ${midY}, ${current.x} ${current.y}`
  }
  return path
}

function initSignalMap() {
  const shell = document.querySelector('[data-signal-shell]')
  if (!(shell instanceof HTMLElement)) return

  const svg = shell.querySelector('[data-signal-svg]')
  const track = shell.querySelector('[data-signal-track]')
  const progress = shell.querySelector('[data-signal-progress]')
  const dotsGroup = shell.querySelector('[data-signal-dots]')
  const sections = Array.from(shell.querySelectorAll('[data-story-section]'))
  const anchors = Array.from(shell.querySelectorAll('[data-signal-anchor]'))

  if (
    !(svg instanceof SVGSVGElement) ||
    !(track instanceof SVGPathElement) ||
    !(progress instanceof SVGPathElement) ||
    !(dotsGroup instanceof SVGGElement) ||
    sections.length === 0 ||
    anchors.length === 0
  ) {
    return
  }

  let rafId = 0
  let pathLength = 1

  function updateActiveSection() {
    const probe = window.innerHeight * 0.34
    let activeSection = sections[0]

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.top <= probe) activeSection = section
    })

    sections.forEach((section) => {
      const isActive = section === activeSection
      section.classList.toggle('is-active', isActive)
      const index = sections.indexOf(section)
      const dot = dotsGroup.children[index]
      if (!(dot instanceof SVGCircleElement)) return
      dot.classList.toggle('is-active', isActive)
    })
  }

  function updateProgressStroke() {
    const rect = shell.getBoundingClientRect()
    const viewport = window.innerHeight || document.documentElement.clientHeight
    const total = rect.height + viewport * 0.28
    const progressValue = Math.min(Math.max((viewport * 0.74 - rect.top) / total, 0), 1)
    progress.style.strokeDasharray = `${pathLength}`
    progress.style.strokeDashoffset = `${pathLength * (1 - progressValue)}`
  }

  function redraw() {
    rafId = 0

    const shellRect = shell.getBoundingClientRect()
    const width = shell.clientWidth
    const height = shell.scrollHeight

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    const points = anchors.map((anchor) => {
      const rect = anchor.getBoundingClientRect()
      return {
        x: rect.left - shellRect.left + rect.width / 2,
        y: rect.top - shellRect.top + rect.height / 2,
      }
    })

    if (points.length === 0) return

    const topPoint = {
      x: points[0].x,
      y: Math.max(points[0].y - 92, 0),
    }
    const bottomPoint = {
      x: points[points.length - 1].x,
      y: Math.min(points[points.length - 1].y + 108, height),
    }
    const fullPoints = [topPoint, ...points, bottomPoint]
    const pathData = buildSignalPath(fullPoints)

    track.setAttribute('d', pathData)
    progress.setAttribute('d', pathData)

    while (dotsGroup.firstChild) {
      dotsGroup.removeChild(dotsGroup.firstChild)
    }

    points.forEach((point) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      dot.setAttribute('class', 'signal-dot')
      dot.setAttribute('cx', `${point.x}`)
      dot.setAttribute('cy', `${point.y}`)
      dot.setAttribute('r', '6.5')
      dotsGroup.appendChild(dot)
    })

    pathLength = track.getTotalLength() || 1
    shell.classList.add('signal-ready')
    updateProgressStroke()
    updateActiveSection()
  }

  function schedule() {
    if (rafId !== 0) return
    rafId = requestAnimationFrame(redraw)
  }

  window.addEventListener('resize', schedule)
  window.addEventListener('scroll', () => {
    updateProgressStroke()
    updateActiveSection()
  }, { passive: true })

  schedule()
}

function initSpirit() {
  const canUseSpirit =
    !prefersReducedMotion.matches &&
    window.matchMedia('(pointer: fine)').matches &&
    window.innerWidth > 760

  if (!canUseSpirit) return

  const spirit = document.createElement('div')
  spirit.className = 'spirit'
  spirit.setAttribute('aria-hidden', 'true')
  spirit.innerHTML = `
    <svg viewBox="0 0 44 92" role="presentation">
      <path class="spirit-tail" d="M 23 79 C 17 69, 16 57, 20 45 C 23 35, 24 25, 21 14" />
      <path class="spirit-aura" d="M 17 26 C 17 19, 21 12, 27 12 C 31 12, 34 16, 34 22 C 34 29, 29 36, 24 42 C 20 38, 17 32, 17 26 Z" />
      <path class="spirit-core" d="M 19 25 C 19 18, 23 13, 28 13 C 31 13, 33 16, 33 20 C 33 27, 28 33, 23 38 C 20 35, 19 30, 19 25 Z" />
      <path class="spirit-edge" d="M 26 14 C 29 17, 30 21, 29 27 C 28 31, 26 34, 23 37 C 24 29, 23 21, 26 14 Z" />
    </svg>
  `
  document.body.appendChild(spirit)

  let rafId = 0
  let pointerX = window.innerWidth * 0.64
  let pointerY = window.innerHeight * 0.24
  let targetX = pointerX
  let targetY = pointerY
  let currentX = targetX
  let currentY = targetY
  let lastMoveTime = performance.now()
  let isVisible = false

  function animate(now) {
    const idleFor = now - lastMoveTime
    const isIdle = idleFor > 1200
    const driftX = Math.sin(now * 0.00115) * 4 + Math.sin(now * 0.00043) * 2.6
    const driftY = Math.cos(now * 0.001) * 6.5 + Math.sin(now * 0.00058) * 1.8
    const desiredX = targetX + 24 + driftX
    const desiredY = targetY - 40 + driftY
    const easing = isIdle ? 0.034 : 0.055

    currentX += (desiredX - currentX) * easing
    currentY += (desiredY - currentY) * easing

    const angle = Math.max(-9, Math.min(9, (desiredX - currentX) * 0.1))
    const scale = isIdle ? 0.97 : 1
    spirit.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${angle}deg) scale(${scale})`

    if (isVisible || Math.abs(desiredX - currentX) > 0.2 || Math.abs(desiredY - currentY) > 0.2) {
      rafId = requestAnimationFrame(animate)
      return
    }

    rafId = 0
  }

  function schedule() {
    if (rafId !== 0) return
    rafId = requestAnimationFrame(animate)
  }

  function showSpirit() {
    if (isVisible) return
    isVisible = true
    spirit.classList.add('is-visible')
    schedule()
  }

  function hideSpirit() {
    if (!isVisible) return
    isVisible = false
    spirit.classList.remove('is-visible')
    schedule()
  }

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    targetX = event.clientX
    targetY = event.clientY
    lastMoveTime = performance.now()
    showSpirit()
  }, { passive: true })

  document.addEventListener('mouseout', (event) => {
    if (event.relatedTarget !== null) return
    hideSpirit()
  })

  window.addEventListener('blur', hideSpirit)
}

function init() {
  initReveals()
  initHeroPointer()
  initSignalMap()
  initSpirit()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true })
} else {
  init()
}
