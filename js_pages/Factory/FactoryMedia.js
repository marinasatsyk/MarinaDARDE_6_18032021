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