//verification email
function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

export class Modal {

    constructor(photographer) {
        this._photographer = photographer;

        /*PAGE MODAL CONTACT, photo one by one*/
        this._modalBtn = document.querySelector(".contact");
        console.log(this._modalBtn);
        this._modalbg = document.querySelector(".bground");
        this._submitBtn = document.querySelector(".btn-submit")
        this._inputIn = document.querySelectorAll('.text-control');
        this._formData = document.querySelectorAll(".formData");
        this._bgPhoto = document.querySelector(".bgPhoto");
        this._bgPhotoClose = this._bgPhoto.querySelector(".close");

        this.onCreate();
    }

    onCreate() {
        // const email = document.getElementById('email');
        this.enableEvents();
        this.closeWithKeyboard(this._modalbg, 1);
        this.showSlidePhoto();

        this.closeWithKeyboard(this._bgPhoto, 1)
    }

    enableEvents() {
        let modals = this;
        this._modalBtn.addEventListener("click", () => { modals.launchModal() });
        this._bgPhotoClose.addEventListener("click", () => { modals.close(modals._bgPhoto); })
        this.enableForm();
        this.enableModalEvents();
        this.disableErrorWarning();

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
            modals.close(modals._modalbg)
        })
    }

    // launch modal form
    launchModal() {
        this._modalbg.style.display = "block";
        this._modalbg.attributes[1].value = "false";
        this.lockWindow();
        document.getElementById("nom_photographer").textContent = this._photographer.name;
    }

    enableForm() {
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
                this.close(this._modalbg);

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

    mediaView(view, media, rep) {
        let file = rep + "/" + media.url.replace("-", "")
        let elem = view.createElement("div", "");
        elem.tabIndex = 0;
        if (media.type === "image") {
            let img = view.createElement("img", "", elem);
            img.src = file;
            img.alt = media.description;
        } else {
            let video = view.createElement("video", "", elem);
            video.src = file;
            video.alt = media.description;
            video.controls = true;
        }
        let title = view.createElement("div", "", elem);
        title.textContent = media.title;
        return elem;
    }

    listen(media, mediaView, rep) {
        let placePhoto = document.querySelector(".modal-bodyPhotoGallery");
        let mediaWrapper = mediaView.wrapper;
        let modals = this;

        mediaWrapper.addEventListener("click", function(event) {

            modals._bgPhoto.style.display = "flex";
            modals._bgPhoto.attributes[1].value = "false";
            modals.lockWindow();
            placePhoto.innerHTML = "";
            placePhoto.appendChild(modals.mediaView(mediaView, media, rep));
            event.preventDefault();
            event.stopPropagation();

            let mediaL = media;
            modals._bgPhoto.querySelector(".slideLeft").addEventListener("click", (event) => {
                mediaL = mediaL.before ? mediaL.before : mediaL;
                placePhoto.innerHTML = "";
                placePhoto.appendChild(modals.mediaView(mediaView, mediaL, rep));
                console.log("click L", mediaL.before);
                event.preventDefault();
                event.stopPropagation();
            })

            let mediaR = media;
            modals._bgPhoto.querySelector(".slideRight").addEventListener("click", (event) => {
                console.log("click R");
                mediaR = mediaR.after ? mediaR.after : mediaR;
                placePhoto.innerHTML = "";
                placePhoto.appendChild(modals.mediaView(mediaView, mediaR, rep));
                event.preventDefault();
                event.stopPropagation();
            })
        });
    }

    //function for SHOW BIG MEDIAS after click on
    showSlidePhoto() {
        /*
        let allMedia = document.querySelectorAll(".allmedia");
        let placePhoto = document.querySelector(".modal-bodyPhotoGallery");
        let wrapShowPhoto = document.querySelector(".bgPhoto");

        //=================

        for (let i = 0; i < allMedia.length; i++) {
            let i0 = (i - 1 + allMedia.length) % allMedia.length;
            let i1 = (i + 1 + allMedia.length) % allMedia.length;
            allMedia[i].before = allMedia[i0];
            allMedia[i].after = allMedia[i1];
        }

        //==================
        for (let i = 0; i < allMedia.length; i++) {
            let media = allMedia[i];

            document.body.addEventListener('keydown', function(event) {


                //events with keyboard
                if (event.key === "ArrowLeft") {
                    console.log("click L");
                    media = media.before ? media.before : media;
                    placePhoto.innerHTML = FactoryMedia(media);
                }

                if (event.key === "ArrowRight") {
                    console.log("click R");
                    media = media.after ? media.after : media;
                    placePhoto.innerHTML = FactoryMedia(media);
                }

            });
        }
            */

    }
}