import { FactoryItem } from "./FactoryItem.js";

export class FactoryImage extends FactoryItem {
    constructor(data) {
        super(data);
        this._image = data.image;
        this._type = "image";
    }

    get url() { return this._image; }
}