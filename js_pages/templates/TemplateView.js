export class TemplateView {
    constructor(pParent, pClass = "") {
        this._class = pClass;
        this._parent = pParent;
        this._wrapper = this.createContainer();
    }

    get wrapper() { return this._wrapper; }

    static createElement(pType, pClasses, pParent = null) {
        let e = document.createElement(pType);

        if (pClasses) {
            if (typeof pClasses === "string") {
                let lClasses = pClasses.split(" ");
                lClasses.map(c => e.classList.add(c));
            }
        }

        if (pParent) pParent.appendChild(e);
        return e;
    }

    render(pParam) {
        this.build(pParam);
        if (this._parent && this._wrapper) {
            this._parent.appendChild(this._wrapper)
        }
        return this._wrapper;
    }
}


class AnimalFactory {
    constructor(pStyle, pName) {
        if (pStyle == "dog") {
            return new Chien(pName);
        } else if (pStyle == "cat") {
            return new Chat(pName);
        }
    }
}

class Animal {
    constructor(pName) {
        this.name = pName;
    }

    crit() {
        this._crit();
    }

    court() {
        console.log(`${this.name} court`);
    }
}

class Chien extends Animal {
    constructor(pName) {
        super(pName);
    }

    _crit() {
        console.log("wouf !");
    }
}

class Chat extends Animal {
    constructor(pName) {
        super(pName);
    }

    _crit() {
        console.log("Miaou !");
    }
}

let romeo = new AnimalFactory("dog", "Romeo");
let nana = new AnimalFactory("cat", "Nana");
romeo.crit();
nana.crit();