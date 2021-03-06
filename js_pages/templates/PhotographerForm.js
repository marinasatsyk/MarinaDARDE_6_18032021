import { TemplateView } from "./TemplateView.js";

// export class PhotographerView {

export class PhotographerView extends TemplateView {
    constructor(pParent, pClass = "") {
        super(pParent, pClass);
    }

    createContainer() {
        return TemplateView.createElement("section", this._class);
    }

    build(p) {

        this._wrapper.id = p.id;
        this._wrapper.ariaLabel = p.name;

        // Image clickable du photographe
        let lien_photographer = TemplateView.createElement("a", "", this._wrapper);
        lien_photographer.href = `./html_pages/photographer_page.html?photographe=${p.id}`;
        lien_photographer.id = "lien_photographer_" + p.id;
        let parentimg = TemplateView.createElement("div", "parent_img", lien_photographer);
        let img = TemplateView.createElement("img", "portrait img", parentimg);
        img.src = p.firstImage;

        img.alt = ""; //"image aléatoire du photographe "+p.name;

        // nom du photographe
        TemplateView.createElement("h2", "name", lien_photographer).textContent = p.name;
        TemplateView.createElement("span", "hidden", lien_photographer).textContent = "lien vers la page du photographe " + p.name;

        // description - localisation etc ...
        let text = TemplateView.createElement("div", "text_for_photographer", this._wrapper);
        text.ariaLabelledby = p.id;
        text.tabIndex = 0;
        TemplateView.createElement("div", "city country", text).textContent = `${p.city}, ${p.country}`;
        TemplateView.createElement("div", "tagline", text).textContent = p.tagline;
        let price = TemplateView.createElement("div", "price", text);
        TemplateView.createElement("span", "", price).textContent = p.price + "€";
        let slash = TemplateView.createElement("span", "", price);
        slash.textContent = "/";
        slash.ariaHidden = true;
        TemplateView.createElement("span", "hidden", price).textContent = "par";
        TemplateView.createElement("span", "", price).textContent = "jour";
    }
}

export class SinglePhotographerView extends TemplateView {

    constructor(pParent, pClass = "") {
        super(pParent, pClass);
    }

    createContainer() {
        return TemplateView.createElement("section", this._class);
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
        
    
            <div class="form_modal contact" tabindex = "0">Contactez-moi</div>

            <div class="parent_img parent_img_perso">
                <img src="../FishEye_Photos/Sample_Photos/Photographers_ID_Photos/${p.portrait}" class="portrait img" alt="${p.name}">
            </div>
            
        </section>`
    }
}


export class PhotographerRatingsView extends TemplateView {
    constructor(pParent, pClass = "") {
        super(pParent, pClass);
    }

    createContainer() {
        return TemplateView.createElement("div", this._class);
    }
    build(photographer) {

        this._wrapper.innerHTML =

            `<div class="wrapper_likes" tabindex="0">
        <div class="num_like"  title="Nombre total des likes du photographe est">${photographer.ranks}</div>
        <span class="hidden">likes</span>
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