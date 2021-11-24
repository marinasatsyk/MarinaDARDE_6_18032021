// data function

function GetFile(file, callback) {
    let ls = localStorage.getItem("database");
    if (ls) {
        ls = JSON.parse(ls);
        callback(ls);
    } else {
        fetch(file)
            .then(response => response.json())
            .then((result) => {
                localStorage.setItem("database", JSON.stringify(result));
                callback(result);

            })
    }
}



var MAP_Media = new Map();

GetFile("../data.json", withDataCallBack);

function withDataCallBack(data) {

    const l_UrlParameters = new URLSearchParams(window.location.search);

    let l_Photographer_Id = l_UrlParameters.get("photographe");


    for (let p of data.photographers) {

        if (parseInt(p.id) === parseInt(l_Photographer_Id)) {
            CreatePhotographerHTML(p, data);
            break;
        }
    }
}








function showTags(tags) {
    let result = "";
    for (let t of tags) { result += `<span class="tag tag_perso"><span aria-hidden="true">#</span>${t}</span>`; }
    return result;
}

function photographerGetPhoto(photographer) {
    let rep = "../FishEye_Photos/Sample_Photos/" + photographer.name.split(" ")[0].replace("-", "_");
    for (let image of photographer.media) {
        if (image.image) {
            return rep + "/" + image.image;
        }
    }
    return `./FishEye_Photos/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}`;
}





/*function draw media_content on the page of the photogrpher */

function CreatePhotographerHTML(photographer, data) {

    const photographersMap = new Map();
    photographer.media = [];
    photographersMap.set(photographer.id, photographer);

    for (let media of data.media) {
        if (media.photographerId == photographer.id) {
            photographer.media.push(media);
        }
    }

    console.log(photographersMap);
    //information on the header of page 
    document.querySelector(".photographer_info").innerHTML =
        `<section class="photographe photographe_perso" id="${photographer.id}">
			<span class="wraper_info_perso">
			<h2 class="name name_perso">${photographer.name}</h2>
			
			<div class="citi_tagline_perso">
				<div class="city country page_perso">${photographer.city}, ${photographer.country}</div>
				<div class="tagline page_perso">${photographer.tagline}</div>
			</div>	

			<div class="tags tags_perso">${showTags(photographer.tags)}</div>
			</span>		
			
		
			<div class="form_modal contact">Contactez-moi</div>

			<div class="parent_img parent_img_perso">
				<img src=${photographerGetPhoto(photographer)} class="portrait img" alt="${photographer.name}">
			</div>
		
	</section>`






    //function for draw all media on the page

    function photographerGetMedia(media) {
        // console.log(media);

        let rep = "../FishEye_Photos/Sample_Photos/" + photographer.name.split(" ")[0].replace("-", "_");

        if (media.hasOwnProperty("video")) {
            let file = rep + "/" + media.video.replace("-", "")
            MAP_Media.set(media.video.replace("-", ""), media);
            return `<div class="video media_content"><video src="${file}"  class="video_content allmedia" controls alt="${media.title}"></video></div>`;
        } else if (media.hasOwnProperty("image")) {
            let file = rep + "/" + media.image.replace("-", "")
            MAP_Media.set(media.image.replace("-", ""), media);
            return `<div class="img media_content"><img src="${file}"  class="img_content allmedia" alt="${media.title}"></div>`;
        }


    }

    console.log(MAP_Media);



    //SHOW  TOTAL RANK OF PHOTOGRAPHER 

    let rank = photographer.media;
    const MapMedia = new Map();
    for (let i in rank) {
        MapMedia.set(rank[i].id, i);
    }


    //sort by likes============================================
    const Map_like = new Map();
    let ar = [];


    for (let i = 0; i < rank.length; i++) {
        Map_like.set(rank[i].likes, rank[i])
    }

    for (const [key] of Map_like) {
        ar.push(key)
    }

    ar = ar.sort(function(a, b) {
        return b - a;
    })

    Map_like.delete();

    for (let i = 0; i < ar.length; i++) {

        for (let k = 0; k < ar.length; k++) {
            if (ar[i] == rank[k].likes) {
                Map_like.set(ar[i], rank[k]);
                break
            }
        }

    }

    console.log(Map_like); // map with sorted content 

    //===============================================================



    console.log(photographer);

    function showRank() {

        let sumLikes = 0;
        for (let like of rank) {
            sumLikes = sumLikes + parseInt(like.likes);
        }
        return sumLikes;
    }


    document.querySelector(".rating_price_likes").innerHTML =

        `<div class="wrapper_likes">
			<div class="num_like">${showRank()}</div>
			<span class="hidden">likes</span>
            <i class="fas fa-heart"></i>
		</div>
		<div class="price page_perso">
                ${photographer.price}€
                <span aria-hidden="true">/</span>
                <span class="hidden">par</span>
                jour
        </div>`



    /*creation media conent */

    //func for show the rank of each media 



    function LinkLikeEvents() {
        // for increase the likes on click
        let likesAll = document.querySelectorAll(".iterator");
        for (let i = 0; i < likesAll.length; i++) {
            let like = likesAll[i];
            like.addEventListener("click", () => {
                UpdateLike(like);
            })

        }
    }

    /*MAIN CONTENT  media default based on data*/
    let ls = localStorage.getItem("likes");
    let likes = ls ? JSON.parse(ls) : [];

    function buildMedia(pRank) {

        document.querySelector(".wrapper_media").innerHTML = "";

        pRank.forEach(media => {

            console.log(media);
            let media_id = media.id;
            let l_classActive = "";
            if (likes.indexOf("" + media_id) >= 0) {
                l_classActive = " liked";
                console.log("LIKE " + media_id);
            }

            document.querySelector(".wrapper_media").innerHTML +=
                `<article class="media">
				${photographerGetMedia(media)} 
									
				<div class="description">
						<div class="text__description">
							<h3>${media.title}</h3>
						</div>
						<span class="likes">
                            ${+media.likes}
                            <span class="hidden">likes</span>
                            <i class="fas fa-heart iterator${l_classActive}" id="media_${media_id}"></i>
                        </span>
				</div>
			</article>`

        })

        LinkLikeEvents();
    }

    buildMedia(rank);

    const IncrementLike = function(LikeElement) {
        LikeElement.classList.toggle("liked");
        LikeElement.parentElement.childNodes[0].textContent = +LikeElement.parentElement.childNodes[0].textContent + 1;
        document.querySelector(".num_like").textContent = +document.querySelector(".num_like").textContent + 1;
    }

    const DecrementLike = function(LikeElement) {
        LikeElement.classList.toggle("liked");
        LikeElement.parentElement.childNodes[0].textContent = +LikeElement.parentElement.childNodes[0].textContent - 1;
        document.querySelector(".num_like").textContent = +document.querySelector(".num_like").textContent - 1;
    }

    const UpdateLike = function(LikeElement) {
        let like_id = LikeElement.id;
        let media_id = like_id.slice(6);
        let ls = localStorage.getItem("likes");
        let l_Media = rank[MapMedia.get(+media_id)];

        if (!ls) {
            localStorage.setItem("likes", JSON.stringify([+media_id]));
            IncrementLike(LikeElement);
            l_Media.likes++;
            return;
        }

        let likes = JSON.parse(ls);
        let index = likes.indexOf(+media_id);
        if (index >= 0) {
            DecrementLike(LikeElement);
            likes.splice(index, 1);
            l_Media.likes--;
        } else {
            IncrementLike(LikeElement);
            likes.push(+media_id);
            l_Media.likes++;
        }
        localStorage.setItem("likes", JSON.stringify(likes));
    }



    /*   menu sort media**/

    //animation menu sort media
    let arrow_sort = document.querySelector(".change_status_display");
    arrow_sort.addEventListener("click", (event) => {
        let menu_sort = document.querySelector(".wrapper_sort");
        menu_sort.classList.toggle("wrapper_anim");
        arrow_sort.classList.toggle("animation_arrow");
        event.preventDefault();
        event.stopPropagation();
        // document.querySelector("ul.sort_media li::after").classList.toggle("underline");
    });

    document.querySelector(".like_sort").addEventListener("click", () => {
        rank.sort(function(a, b) { return a.likes > b.likes ? -1 : 1; });
        console.log(rank);
        buildMedia(rank);
    });

    document.querySelector(".date_sort").addEventListener("click", () => {
        rank.sort(function(a, b) { return a.date > b.date ? -1 : 1; });
        console.log(rank);
        buildMedia(rank);
    });

    document.querySelector(".text_sort").addEventListener("click", () => {
        rank.sort(function(a, b) { return a.title > b.title ? 1 : -1; });
        console.log(rank);
        buildMedia(rank);
    });




    /*PAGE MODAL CONTACT, photo one by one*/
    const modalBtn = document.querySelector(".contact");
    const modalbg = document.querySelector(".bground");
    const submitBtn = document.querySelector(".btn-submit")
    const inputIn = document.querySelectorAll('.text-control');
    const formData = document.querySelectorAll(".formData");
    // const email = document.getElementById('email');
    let result = {};

    modalBtn.addEventListener("click", launchModal);
    // launch modal form

    function launchModal() {
        modalbg.style.display = "block";
        modalbg.attributes[1].value = "false";
        document.querySelector("body").classList.add("_lock");
        document.querySelector(".content h2 > .nom_photographer").textContent = photographer.name
    }

    //disable error warning
    formData.forEach(elem => elem.addEventListener("click", () => {
        elem.dataset.errorVisible = "false";
    }));
    formData.forEach(elem => elem.addEventListener("keydown", () => {

        elem.dataset.errorVisible = "false";
    }));


    inputIn.forEach(elem => elem.addEventListener("click", () => {
        elem.style.background = '#fff';
        if (elem.id == 'firstName') {
            elem.attributes[7].value = "false";
        } else if (elem.id == 'lastName') {
            elem.attributes[7].value = "false";
        } else if (elem.id == 'email') {
            elem.attributes[6].value = "false";
        }
    }));

    inputIn.forEach(elem => elem.addEventListener("keydown", () => {
        elem.style.background = '#fff';
        if (elem.id == 'firstName') {
            elem.attributes[7].value = "false";
        } else if (elem.id == 'lastName') {
            elem.attributes[7].value = "false";
        } else if (elem.id == 'email') {
            elem.attributes[6].value = "false";
        }
    }));


    //CLOSE MODAL form
    document.querySelector('.close').addEventListener("click", () => {
        close(modalbg)
    })

    closetWithKeyboard(modalbg, 1)



    submitBtn.onclick = (event) => {
        event.preventDefault();

        //(1) Le champ Prénom a un minimum de 2 caractères / n'est pas vide.
        // (2) Le champ du nom de famille a un minimum de 2 caractères / n'est pas vide.
        // (3) L'adresse électronique est valide.


        let fisrtChecked = true;
        let lastChecked = true;
        let emailChecked = true;


        inputIn.forEach(elem => {

            if (elem.id == 'firstName' && elem.value.length < elem.attributes.minlength.value) {
                elem.style.background = '#ffbbbb';
                fisrtChecked = false;
                formData[0].dataset.errorVisible = "true";
                elem.attributes[7].value = "true";

            } else if (elem.id == 'lastName' && elem.value.length < elem.attributes.minlength.value) {
                elem.style.background = '#ffbbbb';
                lastChecked = false;
                formData[1].dataset.errorVisible = "true";
                elem.attributes[7].value = "true";
            } else if (elem.id == 'email' && validateEmail(elem.value) == false) {
                elem.style.background = '#ffbbbb';
                emailChecked = false;
                formData[2].dataset.errorVisible = "true";
                elem.attributes[6].value = "true";
            }

        })

        if (fisrtChecked == true &&
            lastChecked == true &&
            emailChecked == true) {
            close(modalbg);

            result.firstName = document.getElementById("firstName").value;
            result.lastName = document.getElementById("lastName").value;
            result.email = document.getElementById("email").value;
            result.message = document.getElementById("message").value;

            console.log(result)

        }


        //verification email
        function validateEmail(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase())
        }




    }

    showSlidePhoto();
}



/*verification content modal form contact photographer */





/** FACTORY METHOD*/
function FactoryImage(media) {
    let folders = media.attributes[0].value.split("/");
    let key = folders[folders.length - 1];
    let obj = MAP_Media.get(key);
    return `<img src=${media.attributes[0].value} alt="${obj.title}">
	<div>${obj.title}</div>`;
}

function FactoryVideo(media) {
    let folders = media.attributes[0].value.split("/");
    let key = folders[folders.length - 1];
    let obj = MAP_Media.get(key);
    return `<video src=${media.attributes[0].value} alt="${obj.title}" controls>
	<div>${obj.title}</div>`;
}

function FactoryMedia(media) {
    switch (media.localName) {
        case "video":
            return FactoryVideo(media);
        default:
            return FactoryImage(media);
    }
}

//function for SHOW BIG MEDIAS after click on
function showSlidePhoto() {
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

        media.addEventListener("click", () => {
            console.log(media);

            wrapShowPhoto.style.display = "flex";
            wrapShowPhoto.attributes[1].value = "false";
            document.querySelector("body").classList.add("_lock");
            placePhoto.innerHTML = FactoryMedia(media);

            document.querySelector(".slideLeft").addEventListener("click", () => {
                console.log("click L");
                media = media.before ? media.before : media;
                placePhoto.innerHTML = FactoryMedia(media);
            })

            document.querySelector(".slideRight").addEventListener("click", () => {
                console.log("click R");
                media = media.after ? media.after : media;
                placePhoto.innerHTML = FactoryMedia(media);
            })
        })

        document.body.addEventListener('keydown', function(event) {
            console.log(event);

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

    document.querySelector('.bgPhoto .close').addEventListener("click", () => {
        close(wrapShowPhoto);
    })

    closetWithKeyboard(wrapShowPhoto, 1)

}


//GENERIC FUNCTIONS  FOR CLOSE MODAL FORMS
function close(elem) {
    if (elem.style.display !== "none") {
        elem.style.display = "none";
        document.querySelector("body").classList.remove("_lock");
    }
}
/**
 * 
 * @param {DOMElement} elemForClose 
 * @param {number} numberOfAttribute 
 */
function closetWithKeyboard(elemForClose, numberOfAttribute) {
    document.body.addEventListener('keydown', function(event) {
        console.log(event);

        //when modal page is opened && the attribute aria-hidden  == false
        if (elemForClose.attributes[numberOfAttribute].value == "false" && event.key === "Escape") {
            close(elemForClose);
            elemForClose.attributes[numberOfAttribute].value == "true";
        }
    });
}