import { TemplateView } from "./TemplateView.js";

//verification email
function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

export class Modal {

    constructor(photographer) {
        this._photographer = photographer;

        /*PAGE MODAL CONTACT*/
        this._modalBtn = document.querySelector(".contact");
        this._modalBg = document.querySelector(".bground");
        this._modalClose = this._modalBg.querySelector(".close");
        this._submitBtn = this._modalBg.querySelector(".btn-submit")
        this._inputIn = this._modalBg.querySelectorAll('.text-control');
        this._formData = this._modalBg.querySelectorAll(".formData");

        /*PAGE MODAL SLIDESHOW*/
        this._bgPhoto = document.querySelector(".bgPhoto");
        this._bgPhotoClose = this._bgPhoto.querySelector(".close");
        this._bgLeft = this._bgPhoto.querySelector(".slideLeft");
        this._bgRight = this._bgPhoto.querySelector(".slideRight");
        this._placePhoto = this._bgPhoto.querySelector(".modal-bodyPhotoGallery");
        this._curMedia = null;
        this._mediaDir = "";

        this.onCreate();
    }

    onCreate() {
        // const email = document.getElementById('email');
        this.enableEvents();
        this.closeWithKeyboard(this._modalBg, 1);
        this.closeWithKeyboard(this._bgPhoto, 1);
    }

    enableEvents() {
        let modals = this;
        this._modalBtn.addEventListener("click", () => { modals.launchForm() });
        this._modalBtn.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                modals.launchForm()
            }
        });
        this._modalClose.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                modals.close(this._modalBg);
            }
        });

        this._bgPhotoClose.addEventListener("click", () => { modals.close(modals._bgPhoto); })
        this.enableFormEvents();
        this.enableModalEvents();
        this.disableErrorWarning();
        this.enableSlideArrows();

    }

    //GENERIC FUNCTIONS  FOR CLOSE MODAL FORMS
    close(elem) {
        if (elem.style.display !== "none") {
            elem.style.display = "none";
            this.unlockWindow();
        }
    }

    closeWithKeyboard(elemForClose, numberOfAttribute) {
        let modals = this;
        document.body.addEventListener('keydown', function(event) {
            //when modal page is opened && the attribute aria-hidden  == false
            if (elemForClose.attributes[numberOfAttribute].value == "false" && event.key === "Escape") {
                modals.close(elemForClose);
                elemForClose.attributes[numberOfAttribute].value == "true";
            }
        });
    }


    //CLOSE MODAL form
    enableModalEvents() {
        let modals = this;
        document.querySelector('.bground .close').addEventListener("click", () => {
            modals.close(modals._modalBg)
        })
    }

    // launch modal form
    launchForm() {
        this.lockWindow();
        console.log(document.activeElement);
        document.activeElement.blur();

        this._modalBg.style.display = "block";
        this._modalBg.attributes[1].value = "false";
        document.getElementById("nom_photographer").textContent = this._photographer.name;
        let elem = this._modalBg.querySelector(".content");
        console.log(elem);
        elem.tabIndex = 0;
        if (elem.focus) {
            elem.focus();
        } else if (elem.setActive) {
            elem.setActive();
        }
        console.log(document.activeElement);
    }

    enableFormEvents() {
        this._inputIn.forEach(elem => elem.addEventListener("click", () => {
            elem.style.background = '#fff';
            if (elem.id == 'firstName') {
                elem.attributes[7].value = "false";
            } else if (elem.id == 'lastName') {
                elem.attributes[7].value = "false";
            } else if (elem.id == 'email') {
                elem.attributes[6].value = "false";
            }
        }));

        this._inputIn.forEach(elem => elem.addEventListener("keydown", () => {
            elem.style.background = '#fff';
            if (elem.id == 'firstName') {
                elem.attributes[7].value = "false";
            } else if (elem.id == 'lastName') {
                elem.attributes[7].value = "false";
            } else if (elem.id == 'email') {
                elem.attributes[6].value = "false";
            }
        }));

        this._submitBtn.onclick = (event) => {

            event.preventDefault();

            //(1) Le champ Prénom a un minimum de 2 caractères / n'est pas vide.
            // (2) Le champ du nom de famille a un minimum de 2 caractères / n'est pas vide.
            // (3) L'adresse électronique est valide.

            let firstChecked = true;
            let lastChecked = true;
            let emailChecked = true;


            this._inputIn.forEach(elem => {

                if (elem.id == 'firstName' && elem.value.length < elem.attributes.minlength.value) {
                    elem.style.background = '#ffbbbb';
                    firstChecked = false;
                    this._formData[0].dataset.errorVisible = "true";
                    elem.attributes[7].value = "true";

                } else if (elem.id == 'lastName' && elem.value.length < elem.attributes.minlength.value) {
                    elem.style.background = '#ffbbbb';
                    lastChecked = false;
                    this._formData[1].dataset.errorVisible = "true";
                    elem.attributes[7].value = "true";
                } else if (elem.id == 'email' && validateEmail(elem.value) == false) {
                    elem.style.background = '#ffbbbb';
                    emailChecked = false;
                    this._formData[2].dataset.errorVisible = "true";
                    elem.attributes[6].value = "true";
                }

            })

            if (firstChecked == true &&
                lastChecked == true &&
                emailChecked == true) {
                this.close(this._modalBg);

                let result = {
                    firstName: document.getElementById("firstName").value,
                    lastName: document.getElementById("lastName").value,
                    email: document.getElementById("email").value,
                    message: document.getElementById("message").value
                };
                console.log(result)

            }
        }
    }

    disableErrorWarning() {
        //disable error warning
        this._formData.forEach(elem => {
            elem.onclick = elem.onkeydown = function() { elem.dataset.errorVisible = "false"; }
        });
    }

    lockWindow() {
        document.querySelector("body").classList.add("_lock");
    }

    unlockWindow() {
        document.querySelector("body").classList.remove("_lock");
    }



    // slide show big photos

    set mediaDir(dir) {
        this._mediaDir = dir;
    }

    get mediaDir() {
        return this._mediaDir;
    }

    set curMedia(m) {
        this._curMedia = m;
        this._placePhoto.innerHTML = "";
        this._placePhoto.appendChild(this.mediaView(this._curMedia));
        let modals = this;
        this._placePhoto.querySelector("div").onkeydown =
            function(event) {
                //if (modals._bgPhoto.style.display == "flex") {
                if (event.key === "ArrowLeft") {
                    modals.curMedia = modals.curMedia.before;
                    modals.focusMedia()
                } else if (event.key === "ArrowRight") {
                    modals.curMedia = modals.curMedia.after;
                    modals.focusMedia()
                }
                //}
            }
    }

    get curMedia() {
        return this._curMedia;
    }


    mediaView(media) {
        console.log(media);
        let rep = this.mediaDir;
        let file = rep + "/" + media.url.replace("-", "")
        console.log(file);
        let elem = TemplateView.createElement("div", "");
        elem.tabIndex = 0;
        // console.log(media);
        if (media.type === "image") {
            let img = TemplateView.createElement("img", "", elem);
            img.src = file;
            img.alt = media.description;
        } else {
            let video = TemplateView.createElement("video", "", elem);
            video.src = file;
            video.title = media.description;
            video.controls = true;
        }
        let title = TemplateView.createElement("div", "", elem);
        title.textContent = media.title;
        return elem;
    }

    enableSlideArrows() {
        let modals = this;

        this._bgLeft.addEventListener("click", () => {
            modals.curMedia = modals.curMedia.before;
        })

        this._bgRight.addEventListener("click", () => {
            modals.curMedia = modals.curMedia.after;
        })

        this._bgLeft.onkeydown =
            this._bgRight.onkeydown =
            function(event) {
                //if (modals._bgPhoto.style.display == "flex") {
                if (event.key === "ArrowLeft") {
                    modals.curMedia = modals.curMedia.before;
                    modals.focusMedia()
                } else if (event.key === "ArrowRight") {
                    modals.curMedia = modals.curMedia.after;
                    modals.focusMedia()
                }
                //}
            }
    }

    focusMedia() {
        this._placePhoto.querySelector("div").tabIndex = 0;
        this._placePhoto.querySelector("div").focus();
    }

    listen(media, mediaView, rep) {
        let modals = this;
        mediaView.mediaElement.addEventListener("click", function() {
            modals.mediaDir = rep;
            modals._bgPhoto.style.display = "flex";
            modals._bgPhoto.attributes[1].value = "false";
            modals.lockWindow();
            modals.curMedia = media;
            modals.focusMedia();
        });
        mediaView.mediaElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                modals.mediaDir = rep;
                modals._bgPhoto.style.display = "flex";
                modals._bgPhoto.attributes[1].value = "false";
                modals.lockWindow();
                modals.curMedia = media;
                modals.focusMedia();
            }
        })

    }


}