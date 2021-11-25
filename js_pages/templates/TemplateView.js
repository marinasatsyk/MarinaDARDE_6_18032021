export class TemplateView {
    constructor(pParent, pClass = "") {
        this._class = pClass;
        this._parent = pParent;
        this._wrapper = this.createContainer();
    }

    get wrapper() { return this._wrapper; }

    createElement(pType, pClasses, pParent = null) {
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