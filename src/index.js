const { ipcRenderer } = require('electron')

ipcRenderer.on('preview', () => {
    document.getElementById("loadingSpan").classList.toggle("hidden")
    document.getElementById("realTimePreviewImage").src = "../out/screenshot.jpg?" + new Date().getTime();
})

const removeElement = (e) => {
    e.parentElement.remove()
}

const saveBanner = () => {
    ipcRenderer.send('saveBanner')
}

const createObject = () => {
    const parentElement = document.querySelector('#bannerDescriptions')
    const newElement = document.createElement('div')
    newElement.classList.add('descriptionObject', 'sectionItem')

    newElement.innerHTML = `
        <span>Create Description Object:</span>
        <div class="inputs">
          <div class="texts">
            <input type="text" class="d-title" placeholder="Title">
            <input type="text" class="d-description" placeholder="Description">
          </div>
          <input type="file" accept="image/jpeg,image/png,image/webp">
        </div>
        <button onclick="removeElement(this)" class="removeButton" >-</button>
      `
    parentElement.appendChild(newElement)

}

// The data filled in by the user is fetched.
const createBanner = () => {

    // Description object fetching...
    const descriptionObjects = []
    const basicElements = document.getElementsByClassName('descriptionObject')
    for (const el of basicElements) {
        const title = el.getElementsByTagName('input')[0].value
        const desc = el.getElementsByTagName('input')[1].value
        const image = el.getElementsByTagName('input')[2]
        if (!image.files[0]) continue;
        descriptionObjects.push({
            title,
            desc,
            image: image.files[0].path
        })
    }

    // Mini banner fetching...
    var miniBanner = null;
    if (document.getElementById("miniBanner")) {
        miniBanner = {
            title: document.querySelector('#miniBannerTitle').value,
            desc: document.querySelector('#miniBannerDesc').value,
            image: document.querySelector('#miniBannerImage').files[0]?.path
        }
    }

    document.getElementById("loadingSpan").classList.toggle("hidden")
    document.getElementById("realTimePreviewImage").src = ""

    ipcRenderer.send('createBanner', {
        color1: document.getElementById("color1").value,
        color2: document.getElementById("color2").value,
        main: {
            title: document.querySelector('#mainTitle').value,
            image: document.querySelector('#mainImage')?.files[0]?.path
        },
        mini: miniBanner,
        descriptionObjects
    })
}