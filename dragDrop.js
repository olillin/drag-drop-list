/** @type {HTMLElement?} */
var grabbed = null
/** @type {DOMRect?} */
var grabbedRect = null

list.addEventListener('mousedown', event => {
    if (event.target === event.currentTarget) {
        return
    }
    grabbed = event.target
    grabbedRect = grabbed.getBoundingClientRect()
    grabbed.classList.add('grabbing')
    moveGrabbed(event.x, event.y)
})

window.addEventListener('mousemove', event => {
    moveGrabbed(event.x, event.y)
})

function moveGrabbed(mouseX, mouseY) {
    if (!grabbed) {
        return
    }

    let offsetX = mouseX - grabbedRect.x
    let offsetY = mouseY - grabbedRect.y
    grabbed.style.left = `${offsetX - grabbed.offsetWidth / 2}px`
    grabbed.style.top = `${offsetY - grabbed.offsetHeight / 2}px`

    let relativeY = (mouseY - list.getBoundingClientRect().top) / list.offsetHeight
    let desiredIndex = Math.floor(relativeY * list.children.length)
    if (desiredIndex < 0) {
        desiredIndex = 0
    } else if (desiredIndex >= list.children.length) {
        desiredIndex = list.children.length - 1
    }

    let currentIndex = Array.from(list.children).indexOf(grabbed)

    if (currentIndex != desiredIndex) {
        moveGrabbedIndex(currentIndex, desiredIndex)
        moveGrabbed(mouseX, mouseY)
    }
}

function moveGrabbedIndex(fromIndex, toIndex) {
    let after
    if (fromIndex > toIndex) {
        after = list.children[toIndex]
    } else {
        after = list.children[toIndex + 1]
    }

    const rects = Array.from(list.children).map(li => li.getBoundingClientRect())
    grabbedRect = rects[toIndex]
    list.removeChild(grabbed)
    if (after) {
        grabbed = list.insertBefore(grabbed, after)
    } else {
        grabbed = list.appendChild(grabbed)
    }

    for (let i = 0; i < list.children.length; i++) {
        if (i === toIndex) {
            continue
        }
        const li = list.children[i]
        const oldRect = rects[i]
        const newRect = li.getBoundingClientRect()
        li.classList.remove('moving')
        li.style.top = `${oldRect.top - newRect.top}px`
        setTimeout(() => {
            li.classList.add('moving')
            li.style.top = '0px'
        }, 0)
    }
}

window.addEventListener('mouseup', () => {
    grabbed = null
    grabbedRect = null
    for (let li of Array.from(list.children)) {
        li.classList.remove('grabbing')
        li.style.left = '0px'
        li.style.top = '0px'
    }
})
