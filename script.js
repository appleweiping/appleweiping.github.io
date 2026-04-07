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

function init() {
  initReveals()
  initHeroPointer()
  initSignalMap()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true })
} else {
  init()
}
