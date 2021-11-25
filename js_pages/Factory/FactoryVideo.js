import { FactoryItem } from "./FactoryItem.js";

export class FactoryVideo extends FactoryItem {
    constructor(data) {
        super(data);
        this._video = data.video;
        this._type = "video";
    }
    get url() { return this._video; }
}