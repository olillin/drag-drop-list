/** @type {HTMLElement} */
const input = document.getElementById('new-item')
/** @type {HTMLElement} */
const list = document.getElementById('list')
document.getElementById('create-new-item')?.addEventListener('click', createItem)
input?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        createItem()
    }
})

function createItem() {
    const text = input.value
    input.value = ''
    const li = document.createElement('li')
    li.innerHTML = text
    list.appendChild(li)
}
