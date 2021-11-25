export class FactoryPhotographer {

    constructor(data) {
        this._name = data.name;
        this._id = data.id;
        this._city = data.city;
        this._country = data.country;
        this._tags = data.tags;
        this._tagline = data.tagline;
        this._price = data.price;
        this._portrait = data.portrait;

        this._media = [];
    }

    get name() { return this._name; }
    get id() { return this._id; }
    get city() { return this._city; }
    get country() { return this._country; }
    get tags() { return this._tags; }
    get tagline() { return this._tagline; }
    get price() { return this._price; }
    get portrait() { return this._portrait; }

    get media() { return this._media.slice(0); }
    set media(arr) { this._media = arr; }

    // function for get first photo from all photo of photograper
    get firstImage() {
        let rep = "./FishEye_Photos/Sample_Photos/" + this._name.split(" ")[0].replace("-", "_");
        return rep + "/" + this._media.filter(i => i.type === "image")[0].url;
    }

    addMedia(media) {
        if (this._media.filter(m => m.id === media.id).length > 0) return
        this._media.push(media);
    }

    get ranks() {
        let r = 0;
        this._media.map(m => r += +m.likes);
        return r;
    }
}