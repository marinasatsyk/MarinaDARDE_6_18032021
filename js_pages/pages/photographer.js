import { FactoryMedia } from "../Factory/FactoryMedia.js";
import { FactoryPhotographer } from "../Factory/FactoryPhotographer.js";
import { ImageView, VideoView } from "../templates/MediaView.js";
import { Modal } from "../templates/Modal.js";
import { PhotographerRatingsView, SinglePhotographerView } from "../templates/PhotographerForm.js";

/* main function get Data  **/
class Application {

    constructor(file) {
        this._mapPhotographers = new Map();
        this._mapMedias = new Map();

        this._arrayPhotographers = [];
        this._arrayMedias = [];

        const l_UrlParameters = new URLSearchParams(window.location.search);
        this._photographerId = parseInt(l_UrlParameters.get("photographe"));

        this.loadFile(file);
    }

    loadFile(file) {
        let ls = localStorage.getItem("database");
        if (ls) {
            ls = JSON.parse(ls);
            this.loadDatabase(ls);
        } else {
            fetch(file)
                .then(response => response.json())
                .then((result) => {
                    localStorage.setItem("database", JSON.stringify(result));
                    this.loadDatabase(result);
                })
        }
    }

    loadDatabase(pData) {
        let lDataPhotographer = pData.photographers.filter(
            lPhotographer => this._photographerId === lPhotographer.id
        );
        if (lDataPhotographer.length < 1) {
            alert("l'id du photographe est incorrecte");
            return false;
        }

        this._photographer = new FactoryPhotographer(lDataPhotographer[0]);
        console.log(this._photographer);
        this._arrayPhotographers.push(this._photographer);
        this._mapPhotographers.set(this._photographerId, this._photographer);

        pData.media.map(lMedia => {
            let lMediaFactory = FactoryMedia.Create(lMedia);
            this._arrayMedias.push(lMediaFactory);
            this._mapMedias.set(lMedia.id, lMediaFactory);
        });

        this._arrayMedias.map(m => {
            if (m.photographerId === this._photographerId)
                this._mapPhotographers.get(m.photographerId).addMedia(m);
        })

        this.render();
        this._modals = new Modal(this._photographer);

        this.renderMedia();
        this.enableSort();
    }

    render() {

        // crée la vue vue photographe (infos)
        let lPhotographerInfo = document.querySelector(".photographer_info");
        this._arrayPhotographers.map(lFactoryPhotographer => {
            let view = new SinglePhotographerView(lPhotographerInfo, "photographe");
            view.render(lFactoryPhotographer);
        })

        // crée la vue pour les tarifs et likes du photographe
        let main = document.querySelector("main");
        this._ratings = new PhotographerRatingsView(main, "rating_price_likes");

    }

    renderMedia() {

        // créations des vues des media
        let media_wrapper = document.querySelector(".wrapper_media");
        media_wrapper.innerHTML = "";

        let rep = "../FishEye_Photos/Sample_Photos/" + this._photographer.name.split(" ")[0].replace("-", "_");
        let MediaViews = [];
        let app = this;
        let lsLikes = localStorage.getItem("likes");
        if (lsLikes) lsLikes = JSON.parse(lsLikes);

        this._photographer.media.map(m => {
            let view = null;
            if (m.type == "image") {
                view = new ImageView(media_wrapper, "media");
                view.render([m, rep]);
            } else if (m.type == "video") {
                view = new VideoView(media_wrapper, "media");
                view.render([m, rep]);
            }
            if (view) {
                MediaViews.push([m, view]);
                view.heart.addEventListener("click", function() {
                    this.classList.toggle("liked");
                    m.swapLikes();
                    view.likeCounter.textContent = +m.likes;
                    app._ratings.render(app._photographer);
                })
                if (lsLikes) {
                    if (lsLikes.filter(m_id => m_id == m.id).length > 0) {
                        m.like();
                        view.heart.classList.toggle("liked");
                        view.likeCounter.textContent = +m.likes;
                    }
                }
            }
        })

        let nM = MediaViews.length;
        if (nM > 1) {
            for (let i = 0; i < nM; i++) {
                let i0 = (i + nM - 1) % nM;
                let i1 = (i + nM + 1) % nM;
                console.log(i0 + " " + i + " " + i1);
                MediaViews[i0][0].after = MediaViews[i][0];
                MediaViews[i1][0].before = MediaViews[i][0];

                MediaViews[i][0].before = MediaViews[i0][0];
                MediaViews[i][0].after = MediaViews[i1][0];
            }
        }

        MediaViews.map(arr => {
            this._modals.listen(arr[0], arr[1], rep);
        })

        this._ratings.render(this._photographer);
    }

    enableSort() {

        //animation menu sort media
        let arrow_sort = document.querySelector(".change_status_display");
        arrow_sort.addEventListener("click", (event) => {
            let menu_sort = document.querySelector(".wrapper_sort");
            menu_sort.classList.toggle("wrapper_anim");
            arrow_sort.classList.toggle("animation_arrow");
            event.preventDefault();
            event.stopPropagation();
        });

        document.querySelector(".like_sort").addEventListener("click", () => {
            this._photographer.media = this._photographer.media.sort(function(a, b) { return a.likes > b.likes ? -1 : 1; });
            console.log(this._photographer.media);
            this.renderMedia();
        });

        document.querySelector(".date_sort").addEventListener("click", () => {
            this._photographer.media = this._photographer.media.sort(function(a, b) { return a.date > b.date ? -1 : 1; });
            this.renderMedia();
        });

        document.querySelector(".text_sort").addEventListener("click", () => {
            this._photographer.media = this._photographer.media.sort(function(a, b) { return a.title > b.title ? 1 : -1; });
            this.renderMedia();
        });

    }
}

new Application("../data.json")