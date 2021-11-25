export class FactoryItem {
    constructor(data) {
        if (this.constructor === FactoryItem)
            throw "this class is abstracted"

        this._id = data.id;
        this._photographerId = data.photographerId;
        this._title = data.title;
        this._tags = data.tags;
        this._likes = data.likes;
        this._date = data.date;
        this._price = data.price;
        this._description = data.description;
        this._type = "image";

        this._before = null;
        this._after = null;
    }

    get id() { return this._id; }
    get photographerId() { return this._photographerId; }
    get title() { return this._title; }
    get tags() { return this._tags; }
    get likes() { return this._likes; }
    like() { this._likes++; }

    get date() { return this._date; }
    get price() { return this._price; }
    get description() { return this._description; }

    get type() { return this._type; }

    get before() { return this._before; }
    set before(m) { this._before = m; }

    get after() { return this._after; }
    set after(m) { this._after = m; }

    swapLikes() {
        let ls = localStorage.getItem("likes");
        if (!ls) {
            localStorage.setItem("likes", JSON.stringify([this.id]));
            this._likes++;
            return this._likes;
        }

        let likes = JSON.parse(ls);
        if (likes.includes(this.id)) {
            this._likes--;
            likes.splice(likes.indexOf(this.id), 1);
        } else {
            this._likes++;
            likes.push(this.id);
        }
        localStorage.setItem("likes", JSON.stringify(likes));
        return this._likes;
    }
}