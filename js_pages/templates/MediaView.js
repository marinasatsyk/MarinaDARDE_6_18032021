import { TemplateView } from "./TemplateView.js";

export class MediaView extends TemplateView {
    constructor(pParent, pClass = "") {
        super(pParent, pClass);
    }

    createContainer() {
        return this.createElement("article", this._class);
    }

    build(args) {
        let media = args[0];
        let rep = args[1];

        this._wrapper.tabIndex = 0;
        this._media = this.media(media, rep);

        this._wrapper.appendChild(this._media);

        let desc = this.createElement("div", "description", this._wrapper);
        desc.tabIndex = 0;
        let txt_desc = this.createElement("div", "text__description", desc);
        let h3 = this.createElement("h3", "", txt_desc);
        h3.title = "titre de la photo";
        h3.textContent = media.title;

        let span = this.createElement("span", "likes", desc);
        let likeCounter = this.createElement("span", "", span);
        likeCounter.textContent = +media.likes;
        this.createElement("span", "hidden", span).textContent = "likes";
        let heart = this.createElement("i", "fas fa-heart iterator", span);
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
        let elem = this.createElement("div", "img media_content");
        elem.tabIndex = 0;
        let img = this.createElement("img", "img_content allmedia", elem);
        img.src = file;
        img.alt = media.description;
        return elem;
    }

    mediaSlideShow(media, rep) {
        let file = rep + "/" + media.url.replace("-", "")
        let elem = this.createElement("div", "");
        elem.tabIndex = 0;
        let img = this.createElement("img", "", elem);
        img.src = file;
        img.alt = media.description;
        let title = this.createElement("div", "", elem);
        title.textContent = media.title;
        return elem;
    }
}

export class VideoView extends MediaView {
    media(media, rep) {
        let file = rep + "/" + media.url.replace("-", "")
        let elem = this.createElement("div", "video media_content");
        elem.tabIndex = 0;
        let video = this.createElement("video", "video_content allmedia", elem);
        video.src = file;
        video.alt = media.description;
        video.controls = true;
        return elem;
    }

    mediaSlideShow(media, rep) {
        let file = rep + "/" + media.url.replace("-", "")
        let elem = this.createElement("div", "");
        elem.tabIndex = 0;
        let video = this.createElement("video", "", elem);
        video.src = file;
        video.alt = media.description;
        video.controls = true;
        let title = this.createElement("div", "", elem);
        title.textContent = media.title;
        return elem;
    }
}