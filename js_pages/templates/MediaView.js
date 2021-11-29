import { TemplateView } from "./TemplateView.js";

// export class MediaView {


export class MediaView extends TemplateView {
    constructor(pParent, pClass = "") {
        super(pParent, pClass);
    }

    createContainer() {
        return TemplateView.createElement("article", this._class);
    }

    build(args) {
        let media = args[0];
        let rep = args[1];

        // this._wrapper.tabIndex = 0;
        this._media = this.media(media, rep);

        this._wrapper.appendChild(this._media);

        let desc = TemplateView.createElement("div", "description", this._wrapper);
        desc.tabIndex = 0;
        let txt_desc = TemplateView.createElement("div", "text__description", desc);
        let h3 = TemplateView.createElement("h3", "", txt_desc);
        h3.title = "titre de la photo";
        h3.textContent = media.title;

        let span = TemplateView.createElement("span", "likes", desc);
        let likeCounter = TemplateView.createElement("span", "", span);
        likeCounter.textContent = +media.likes;
        TemplateView.createElement("span", "hidden", span).textContent = "likes";
        let heart = TemplateView.createElement("i", "fas fa-heart iterator", span);
        heart.id = "media_" + media.id;
        heart.tabIndex = 0;
        this._heart = heart;
        this._likeCounter = likeCounter;
    }

    get heart() {
        return this._heart;
    }
    get likeCounter() {
        return this._likeCounter;
    }
    get mediaElement() {
        return this._media;
    }
}

export class ImageView extends MediaView {
    media(media, rep) {
        let file = rep + "/" + media.url.replace("-", "")
        let elem = TemplateView.createElement("div", "img media_content");
        elem.tabIndex = 0;
        let img = TemplateView.createElement("img", "img_content allmedia", elem);
        img.src = file;
        img.alt = media.description;
        return elem;
    }

}

export class VideoView extends MediaView {
    media(media, rep) {
        let file = rep + "/" + media.url.replace("-", "")
        let elem = TemplateView.createElement("div", "video media_content");
        elem.tabIndex = 0;
        let video = TemplateView.createElement("video", "video_content allmedia", elem);
        video.src = file;
        video.title = media.description;
        video.controls = true;
        return elem;
    }
}