/* main function get Data  **/

function GetFile(file, callback) {
    /* let ls = localStorage.getItem("database");
     if (ls) {
         ls = JSON.parse(ls);
         console.log("from local storage");
         console.log(ls);
         callback(ls);
     } else {
         */
    fetch(file)
        .then(response => response.json())
        .then((result) => {
            //localStorage.setItem("database", JSON.stringify(result));
            callback(result);
        })
        // }
}

/* Hashtag function**/

/*
4 factories :
- photographers
- media generic
- media image
- media video
*/

// my non-generic function called when my json file is ready
const withDataCallBack = function(result) {

    let out = new Set; //to sort tags without repetitions
    const photographersMap = new Map();
    for (let photographer of result.photographers) {
        photographer.media = [];
        photographersMap.set(photographer.id, photographer);
        for (let tag of photographer.tags) {
            out.add(tag);
        }
    }

    for (let media of result.media) {
        let l_photographer = photographersMap.get(media.photographerId);
        l_photographer.media.push(media);
    }

    // search array map sort !


    // shows the full json
    console.log(result);
    // extract the photographers array from it
    console.log(result.photographers);
    /*
        let arr = [];
        for (let i = 0; i < result.photographers.length; i++) {

            arr.push(result.photographers[i].tags);
        }

        for (let k = 0; k < arr.length; k++) {
            for (let j = 0; j < arr[k].length; j++) {

                out.add(arr[k][j]);
            }

        }
        */

    // la balise template avec element  à cloner
    const tmpl = document.querySelector('#nav_hashtag');
    // ton élément à cloner est un "ul", les éléments "multipliés" sont les "li"
    const clone = document.importNode(tmpl.content, true);
    /*voilà la seule partie qui devrait être dans ta boucle "for"
    element à cloner dans la balise tmpl **/

    for (let key of out) {
        clone.querySelector(".nav_header__list").innerHTML += `<li>#${key}</li>`;

    }
    // elem parent dans lequel il faut mettre l'elem cloné
    document.querySelector('.nav_header_contener').appendChild(clone);

    /* Function for show photograhers**/
    let btn;

    // la balise template avec element  à cloner
    const tmplPhotographer = document.querySelector('#template_photographe');

    const clonePhotographer = document.importNode(tmplPhotographer.content, true);

    function showTags(tags) {
        let result = "";
        for (let t of tags) { result += `<span class="tag">${t}</span>`; }
        return result;
    }


    function photographerGetPhoto(p) {
        let rep = "./FishEye_Photos/Sample_Photos/" + p.name.split(" ")[0].replace("-", "_");
        for (let image of p.media) {
            if (image.image) {
                return rep + "/" + image.image;
            }
        }
        return `./FishEye_Photos/Sample_Photos/Photographers_ID_Photos/${p.portrait}`;
    }

    /*  element à cloner dans la balise tmpl **/
    photographersMap.forEach(p => {
        clonePhotographer.querySelector(".photographers").innerHTML += `<section class="photographe" id="${p.id}">
        <h2 class="name">${p.name}</h2>
        <div class="city">${p.city}</div>
        <div class="country">${p.country}</div>
        <div class="tags">${showTags(p.tags)}</div>
        <div class="tagline">${p.tagline}</div>
        <div class="price">${p.price}&#8364/jour</div>
        <div class="parent_img"><img src=${photographerGetPhoto(p)} class="portrait img" alt=""></div>
        </section>`;
    })

    // elem parent dans lequel il faut mettre l'elem cloné
    document.querySelector('main').appendChild(clonePhotographer);

}

// call my get-file function with the callback previously declared
GetFile("./data.json", withDataCallBack);