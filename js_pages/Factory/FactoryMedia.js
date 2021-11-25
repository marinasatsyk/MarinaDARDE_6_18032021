/** FACTORY METHOD*/

class FactoryMedia {
    constructor() {

    }




}


function FactoryImage_(media) {
    let folders = media.attributes[0].value.split("/");
    let key = folders[folders.length - 1];
    let obj = MAP_Media.get(key);
    return `<img src=${media.attributes[0].value} alt="${obj.title}">
	<div>${obj.title}</div>`;
}

function FactoryVideo_(media) {
    let folders = media.attributes[0].value.split("/");
    let key = folders[folders.length - 1];
    let obj = MAP_Media.get(key);
    return `<video src=${media.attributes[0].value} alt="${obj.title}" controls>
	<div>${obj.title}</div>`;
}

function FactoryMedia_(media) {
    switch (media.localName) {
        case "video":
            return FactoryVideo(media);
        default:
            return FactoryImage(media);
    }
}