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
    let photograher = [...photographersMap.values()][0];

    console.log(photograher);

    rank.forEach(media => {


        document.querySelector(".wrapper_media").innerHTML +=
            `<article class="media"><a href="#" class="media ">
                ${photographerGetMedia(media)} 
                                      
                <div class="description">
                        <div class="text__description">
                            <h3>${media.title}</h3>
                        </div>
                        <span class="likes">${media.likes}<i class="fas fa-heart"></i></span>
                </div>


</a>
           </article>`
    })


    //il y a eu des erreures en nom de photos, j'ai  éliminé les tirets

    function photographerGetMedia(media) {

        let rep = "../FishEye_Photos/Sample_Photos/" + photograher.name.split(" ")[0].replace("-", "_");

        for (let content in media) {


            if (content == "video") {

                return `<div class="video media_content"><video src="${rep}/${media[content].replace("-", "")}" controls></video></div>`;


            } else if (content == "image") {

                return `<div class="img media_content"><img src="${rep}/${media[content].replace("-", "")}"></div>`;

            }
        }



    }


}