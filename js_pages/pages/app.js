import { FactoryMedia } from "../Factory/FactoryMedia.js";
import { FactoryPhotographer } from "../Factory/FactoryPhotographer.js";
import { PhotographerView } from "../templates/PhotographerForm.js";
// import { TemplateView } from "../templates/TemplateView.js";

/* main function get Data  **/
class Application {

    constructor(file) {
        this._mapPhotographers = new Map();
        this._mapMedias = new Map();

        this._arrayPhotographers = [];
        this._arrayMedias = [];


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
        pData.photographers.map(lPhotographer => {
            let lFactoryPhotographer = new FactoryPhotographer(lPhotographer);
            this._arrayPhotographers.push(lFactoryPhotographer);
            this._mapPhotographers.set(lPhotographer.id, lFactoryPhotographer);
        })

        pData.media.map(lMedia => {
            let lMediaFactory = FactoryMedia.Create(lMedia);
            this._arrayMedias.push(lMediaFactory);
            this._mapMedias.set(lMedia.id, lMediaFactory);
        });

        this._arrayMedias.map(m => {
            this._mapPhotographers.get(m.photographerId).addMedia(m);
        })

        this.render();
    }

    render() {
        let main = document.querySelector(".photographers");

        this._arrayPhotographers.map(lFactoryPhotoGrapher => {

            let view = new PhotographerView(main, "photographe");

            view.render(lFactoryPhotoGrapher);
        })
    }
}

new Application("./data.json")