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


/*   menu sort media**/

//animation medu sort media
let menu_sort = document.querySelector(".wrapper_sort");
menu_sort.addEventListener("click", () => {
    menu_sort.classList.toggle("wrapper_anim");
    document.querySelector(".fa-angle-down").classList.toggle("animation_arrow");
    // document.querySelector("ul.sort_media li::after").classList.toggle("underline");

});








function showTags(tags) {
    let result = "";
    for (let t of tags) { result += `<span class="tag tag_perso">#${t}</span>`; }
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


showScreen(); //func is in file functions commun


/*function draw media_content on the page of the photogrpher */

function CreatePhotographerHTML(photographer, data) {


    const photographersMap = new Map();


    for (let photograher of data.photographers) {
        photograher.media = [];
        photographersMap.set(photographer.id, photographer);
    }

    for (let media of data.media) {

        let l_photographer = photographersMap.get(photographer.id);
        if (media.photographerId == photographer.id) {
            l_photographer.media.push(media);
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
                <img src=${photographerGetPhoto(photographer)} class="portrait img" alt="">
            </div>
        
    </section>`






    //function for draw all media on the page

    function photographerGetMedia(media) {
        // console.log(media);

        let rep = "../FishEye_Photos/Sample_Photos/" + l_photographer.name.split(" ")[0].replace("-", "_");

        if (media.hasOwnProperty("video")) {
            let file = rep + "/" + media.video.replace("-", "")
            MAP_Media.set(media.video.replace("-", ""), media);
            return `<div class="video media_content"><video src="${file}"  class="video_content allmedia" controls aria="${media.title}"></video></div>`;
        } else if (media.hasOwnProperty("image")) {
            let file = rep + "/" + media.image.replace("-", "")
            MAP_Media.set(media.image.replace("-", ""), media);
            return `<div class="img media_content"><img src="${file}"  class="img_content allmedia" aria="${media.title}"></div>`;
        }


    }

    console.log(MAP_Media);



    //SHOW  TOTAL RANK OF PHOTOGRAPHER 

    let rank = [...photographersMap.values()][0].media;
    console.log(rank);
    let l_photographer = [...photographersMap.values()][0];
    console.log(l_photographer);

    function showRank() {

        let sumLikes = 0;
        for (let like of rank) {
            sumLikes = sumLikes + like.likes;
        }
        return sumLikes;
    }


    document.querySelector(".rating_price_likes").innerHTML =

        `<div class="wrapper_likes"><div class="num_like">${showRank()}</div>
     <i class="fas fa-heart"></i></div>
     <div class="price page_perso">${photographer.price}&#8364/jour</div>
     `


    /*creation media conent */

    //func for show the rank of each media 


    /*MAIN CONTENT  media default based on data*/
    rank.forEach(media => {
        console.log(media);
        document.querySelector(".wrapper_media").innerHTML +=
            `<article class="media">
             ${photographerGetMedia(media)} 
                                   
             <div class="description">
                     <div class="text__description">
                         <h3>${media.title}</h3>
                     </div>
                     <span class="likes">${+media.likes}<i class="fas fa-heart iterator"></i></span>
             </div>
        </article>`
    })


    // for increase the likes on click
    let likesAll = document.querySelectorAll(".iterator");
    for (let i = 0; i < likesAll.length; i++) {
        let like = likesAll[i];

        like.addEventListener("click", () => {
            like.parentElement.childNodes[0].textContent = +like.parentElement.childNodes[0].textContent + 1;

            document.querySelector(".num_like").textContent = +document.querySelector(".num_like").textContent + 1;
        })

    }




    /*Pages modal contact, photo one by one*/
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
        document.querySelector("body").classList.add("_lock");
        document.querySelector(".content h2 > .nom_photographer").textContent = photographer.name
    }

    //disable error warning
    formData.forEach(elem => elem.addEventListener("click", back = () => {
        elem.dataset.errorVisible = "false";
    }));

    inputIn.forEach(elem => elem.addEventListener("click", back = () => {
        elem.style.background = '#fff';
    }));


    document.querySelector('.close').addEventListener("click", () => {
        close(modalbg)
    })

    function close(elem) {
        if (elem.style.display == "block") {
            elem.style.display = "none";
            document.querySelector("body").classList.remove("_lock");
        }
    }


    submitBtn.onclick = (event) => {
        event.preventDefault();

        //(1) Le champ Prénom a un minimum de 2 caractères / n'est pas vide.
        // (2) Le champ du nom de famille a un minimum de 2 caractères / n'est pas vide.
        // (3) L'adresse électronique est valide.


        let fisrtChecked = true;
        let lastChecked = true;
        let emailChecked = true;


        inputIn.forEach(elem => {
            console.dir(elem.value)

            if (elem.id == 'firstName' && elem.value.length < elem.attributes.minlength.value) {
                elem.style.background = '#ffbbbb';
                fisrtChecked = false;
                formData[0].dataset.errorVisible = "true";

            } else if (elem.id == 'lastName' && elem.value.length < elem.attributes.minlength.value) {
                elem.style.background = '#ffbbbb';
                lastChecked = false;
                formData[1].dataset.errorVisible = "true";
            } else if (elem.id == 'email' && validateEmail(elem.value) == false) {
                elem.style.background = '#ffbbbb';
                emailChecked = false;
                formData[2].dataset.errorVisible = "true";
            }

            // if (elem.id == 'firstName' && fisrtChecked == true) {
            //     result[elem.id] += elem.value;

            // } else if (elem.id == 'lastName' && lastChecked == true) {
            //     result[elem.id] += elem.value;
            // } else if (elem.id == 'email' && emailChecked == true) {
            //     result[elem.id] += elem.value;

            // }

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
    return `<img src=${media.attributes[0].value} alt="">
    <div>${obj.title}</div>`;
}

function FactoryVideo(media) {
    let folders = media.attributes[0].value.split("/");
    let key = folders[folders.length - 1];
    let obj = MAP_Media.get(key);
    return `<video src=${media.attributes[0].value} alt="" controls>
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

//function for show big media after click on
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
    }

    document.querySelector('.bgPhoto .close').addEventListener("click", () => {
        if (wrapShowPhoto.style.display !== "none") {
            wrapShowPhoto.style.display = "none";
            document.querySelector("body").classList.remove("_lock");
        }
    })







}


let a = [1, 37, 5, 45, 80, 2];
console.log(a);
console.log(a.sort(function(a, b) {
    return a - b;
}));

a.sort();
console.log(a);