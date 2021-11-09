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
/* for burger menu**/
document.querySelector(".sort_media_arrow").addEventListener("click", () => {
    document.querySelectorAll(".change_status_display").forEach((element) => element.classList.toggle("display_none"));
    document.querySelectorAll(".underline_off").forEach((element) => element.classList.toggle("underline"));

});

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




    function showRank() {
        let rank = [...photographersMap.values()][0].media;
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

    //func for define a type of media content


    let rank = [...photographersMap.values()][0].media;
    let l_photographer = [...photographersMap.values()][0];

    console.log(l_photographer);

    rank.forEach(media => {


        document.querySelector(".wrapper_media").innerHTML +=
            `<article class="media">
                ${photographerGetMedia(media)} 
                                      
                <div class="description">
                        <div class="text__description">
                            <h3>${media.title}</h3>
                        </div>
                        <span class="likes">${media.likes}<i class="fas fa-heart"></i></span>
                </div>



           </article>`
    })

    //il y a eu des erreures en nom de photos, j'ai  éliminé les tirets

    function photographerGetMedia(media) {
        console.log(media);

        let rep = "../FishEye_Photos/Sample_Photos/" + l_photographer.name.split(" ")[0].replace("-", "_");

        if (media.hasOwnProperty("video")) {
            let file = rep + "/" + media.video.replace("-", "")
            MAP_Media.set(media.video.replace("-", ""), media);
            return `<div class="video media_content"><video src="${file}"  class="video_content allmedia" controls></video></div>`;
        } else if (media.hasOwnProperty("image")) {
            let file = rep + "/" + media.image.replace("-", "")
            MAP_Media.set(media.image.replace("-", ""), media);
            return `<div class="img media_content"><img src="${file}"  class="img_content allmedia"></div>`;
        }

        /*
         if (content == "video") {

             return `<div class="video media_content"><video src="${rep}/${media[content].replace("-", "")}"  class="video_content allmedia" controls></video></div>`;


         } else if (content == "image") {

             return `<div class="img media_content"><img src="${rep}/${media[content].replace("-", "")}"  class="img_content allmedia"></div>`;

         }
         */
    }



    /*Page modal*/
    const modalBtn = document.querySelector(".contact");
    const modalbg = document.querySelector(".bground");

    // launch modal event
    modalBtn.addEventListener("click", launchModal);
    // launch modal form
    function launchModal() {
        modalbg.style.display = "block";
        document.querySelector("body").classList.add("_lock");
        document.querySelector(".content h2 > .nom_photographer").textContent = photograher.name
    }

    document.querySelector('.close').addEventListener("click", () => {
        close(modalbg)
    })

    function close(elem) {
        if (elem.style.display == "block") {
            elem.style.display = "none";
            document.querySelector("body").classList.remove("_lock");
        }
    }
    showSlidePhoto();
}

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
    console.log(allMedia);
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