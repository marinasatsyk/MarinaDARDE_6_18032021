/* function is mobile is in doc functions commun */






/* main function get Data  **/

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

/* Hashtag function**/

/*
4 factories :
- photographers
- media generic
- media image
- media video
*/
//for make sort of the photographers by tags
var Tags_Active = [];

// my non-generic function called when my json file is ready
const withDataCallBack = function(result) {

        let tagsSet = new Set; //to sort tags without repetitions

        const photographersMap = new Map();
        /*to create new object with medias sorted by phtographer's ID  **/

        for (let photographer of result.photographers) {
            photographer.media = []; /* insert field that contain each photographer's medias   **/

            photographersMap.set(photographer.id, photographer);

            for (let tag of photographer.tags) {
                tagsSet.add(tag);
            }

        }


        for (let media of result.media) {
            let l_photographer = photographersMap.get(media.photographerId);

            l_photographer.media.push(media); /* sort medias and insert to media field**/
        }

        // search array map sort !




        // the tag template with element  to clone
        const tmpl = document.querySelector('#nav_hashtag');

        const clone = document.importNode(tmpl.content, true);
        /* element to clone in the tag tmpl **/

        //function for make the first letter of string uppercase
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
        for (let key of tagsSet) {
            let tagUppercase = key.capitalize();
            clone.querySelector(".nav_header__list").innerHTML +=
                `<li class="tag_main" tabindex="0">
                <span aria-hidden="true">#</span>
                 <span class="tag_main_T">${tagUppercase}</span>
                </li>`;

        }

        // <span aria-hidden="true">#</span>

        // parent elem in which to put the cloned elem
        document.querySelector('.nav_header_contener').appendChild(clone);

        /* Function for show photograhers**/


        // tag template with element  to clone
        const tmplPhotographer = document.querySelector('#template_photographe');

        const clonePhotographer = document.importNode(tmplPhotographer.content, true);

        function showTags(tags) {
            let result = "";
            for (let t of tags) { result += `<span class="tag" ><span aria-hidden="true">#</span>${t}</span>`; }
            return result;
        }

        /*function for get first photo from all photo of photograper */
        function photographerGetPhoto(p) {
            let rep = "./FishEye_Photos/Sample_Photos/" + p.name.split(" ")[0].replace("-", "_");
            for (let image of p.media) {
                if (image.image) {
                    return rep + "/" + image.image;
                }
            }
            // return `./FishEye_Photos/Sample_Photos/Photographers_ID_Photos/${p.portrait}`;
        }

        /*  element to clone in the tmpl tag **/
        photographersMap.forEach(p => {

            clonePhotographer.querySelector(".photographers").innerHTML +=
                `<section class="photographe" id="${p.id}" aria-label="${p.name}">
                    <a href="./html_pages/phographer_page.html?photographe=${p.id}" id="lien_photographer">
                        <div class="parent_img">
                            <img src=${photographerGetPhoto(p)} class="portrait img" alt="">
                        </div>
                        <h2 class="name">${p.name}</h2>
                        <span class="hidden">lien vers la page de photographe</span>
                    </a>  
                        
                    <div class="text_for_phographer" aria-labelledby="${p.id}" tabindex="0">
                        <div class="city country">${p.city}, ${p.country}</div>
                        <div class="tagline">${p.tagline}</div>
                        <div class="price">
                            ${p.price}???
                            <span aria-hidden="true">/</span>
                            <span class="hidden">par</span>
                            jour
                        </div>
                        <div class="tags">${showTags(p.tags)}</div>
                    </div>

                </section>`;
        });

        // parent elem in which to put the cloned elem
        document.querySelector('main').appendChild(clonePhotographer);


        /* sort photographer by tag*/

        //function for remove first symbol# to string tag and make it in lowercase
        function parseTag(t) {
            return (t.trim()).toLowerCase();
        }


        function updateTags() {
            photographersMap.forEach(p => {
                let doc = document.getElementById(p.id);
                let found = false;

                for (let tag of Tags_Active) {
                    found = false;

                    for (let ptag of p.tags) {

                        if (ptag === tag) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        doc.style.display = "none";
                        break;
                    }
                }

                if (found || Tags_Active.length === 0) {

                    doc.style.display = "inline-block";
                }

            });
        }


        document.querySelectorAll(".tag_main_T").forEach((elem) => {
            elem.addEventListener("click", () => {
                elem.classList.toggle("tag_activ");

                if (elem.classList.contains("tag_activ")) {
                    Tags_Active.push(parseTag(elem.textContent))
                } else {
                    let i = Tags_Active.indexOf(parseTag(elem.textContent));
                    if (i >= 0) {
                        Tags_Active.splice(i, 1);
                    }
                }
                updateTags();
            })
        })
    }
    // call my get-file function with the callback previously declared
GetFile("./data.json", withDataCallBack);