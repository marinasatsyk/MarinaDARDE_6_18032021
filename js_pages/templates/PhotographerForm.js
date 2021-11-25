import { TemplateView } from "./TemplateView.js";

export class PhotographerView extends TemplateView {
    constructor(pParent, pClass = "") {
        super(pParent, pClass);
    }

    createContainer() {
        return this.createElement("section", this._class);
    }

    build(p) {
        this._wrapper.id = p.id;
        this._wrapper.ariaLabel = p.name;

        // Image clickable du photographe
        let lien_photographer = this.createElement("a", "", this._wrapper);
        lien_photographer.href = `./html_pages/photographer_page.html?photographe=${p.id}`;
        lien_photographer.id = "lien_photographer_" + p.id;
        let parentimg = this.createElement("div", "parent_img", lien_photographer);
        let img = this.createElement("img", "portrait img", parentimg);
        img.src = p.firstImage;
        console.log(p.firstImage);
        img.alt = ""; //"image aléatoire du photographe "+p.name;

        // nom du photographe
        this.createElement("h2", "name", lien_photographer).textContent = p.name;
        this.createElement("span", "hidden", lien_photographer).textContent = "lien vers la page du photographe " + p.name;

        // description - localisation etc ...
        let text = this.createElement("div", "text_for_photographer", this._wrapper);
        text.ariaLabelledby = p.id;
        text.tabIndex = 0;
        this.createElement("div", "city country", text).textContent = `${p.city}, ${p.country}`;
        this.createElement("div", "tagline", text).textContent = p.tagline;
        let price = this.createElement("div", "price", text);
        this.createElement("span", "", price).textContent = p.price;
        let slash = this.createElement("span", "", price);
        slash.textContent = "/";
        slash.ariaHidden = true;
        this.createElement("span", "hidden", price).textContent = "par";
        this.createElement("span", "", price).textContent = "jour";
    }
}

export class SinglePhotographerView extends TemplateView {
    constructor(pParent, pClass = "") {
        super(pParent, pClass);
    }

    createContainer() {
        return this.createElement("section", this._class);
    }

    build(p) {
        this._wrapper.id = p.id;
        this._wrapper.ariaLabel = p.name;

        this._wrapper.innerHTML =
            `<section class="photographe photographe_perso" id="${p.id}" >
            <span class="wraper_info_perso">
                <h2 class="name name_perso" tabindex="0">${p.name}</h2>
                
                <div class="citi_tagline_perso">
                    <div class="city country page_perso" tabindex="0">${p.city}, ${p.country}</div>
                    <div class="tagline page_perso" tabindex="0">${p.tagline}</div>
                </div>	

            </span>		
        
    
            <div class="form_modal contact">Contactez-moi</div>

            <div class="parent_img parent_img_perso">
                <img src=${"."+p.firstImage} class="portrait img" alt="${p.name}">
            </div>
            
        </section>`
    }
}


export class PhotographerRatingsView extends TemplateView {
    constructor(pParent, pClass = "") {
        super(pParent, pClass);
    }

    createContainer() {
        return this.createElement("div", this._class);
    }
    build(photographer) {
        this._wrapper.innerHTML =

            `<div class="wrapper_likes">
        <div class="num_like" tabindex="0">${photographer.ranks}</div>
        <span class="hidden" tabindex="0">likes</span>
        <i class="fas fa-heart"></i>
    </div>
    <div class="price page_perso" tabindex="0">
            ${photographer.price}€
            <span aria-hidden="true">/</span>
            <span class="hidden">par</span>
            jour
    </div>`
    }
}