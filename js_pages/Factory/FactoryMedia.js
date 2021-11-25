/** FACTORY METHOD*/

import { FactoryImage } from "./FactoryImage.js";
import { FactoryVideo } from "./FactoryVideo.js";

export class FactoryMedia {
    static Create(data) {
        if (data.hasOwnProperty("image")) {
            return new FactoryImage(data);
        } else if (data.hasOwnProperty("video")) {
            return new FactoryVideo(data);
        }
    }
}




/*
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
*/