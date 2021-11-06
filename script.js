/* function is mobile */

function showScreen() {
    const isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    if (isMobile.any()) {
        document.body.classList.add("_touch");
    } else {
        document.body.classList.add("_pc");
    }
}

showScreen();



/* main function get Data  **/

function GetFile(file, callback) {
    let ls = localStorage.getItem("database");
    if (ls) {
        ls = JSON.parse(ls);
        console.log("from local storage");
        console.log(ls);
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
            console.log(l_photographer);
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
            clone.querySelector(".nav_header__list").innerHTML += `<li class="tag_main">#${tagUppercase}</li>`;

        }
        // parent elem in which to put the cloned elem
        document.querySelector('.nav_header_contener').appendChild(clone);

        /* Function for show photograhers**/


        // tag template with element  to clone
        const tmplPhotographer = document.querySelector('#template_photographe');

        const clonePhotographer = document.importNode(tmplPhotographer.content, true);

        function showTags(tags) {
            let result = "";
            for (let t of tags) { result += `<span class="tag">#${t}</span>`; }
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
            console.log(p);

            clonePhotographer.querySelector(".photographers").innerHTML += `<section class="photographe" id="${p.id}">
                <a href="./html_pages/phographer_page.html?photographe=${p.id}">
                    <div class="parent_img">
                        <img src=${photographerGetPhoto(p)} class="portrait img" alt="">
                    </div>
                    <h2 class="name">${p.name}</h2>
                    <div class="city country">${p.city}, ${p.country}</div>
                    <div class="tagline">${p.tagline}</div>
                    <div class="price">${p.price}&#8364/jour</div>
                    <div class="tags">${showTags(p.tags)}</div>
                </a>
            </section>`;
        });

        // parent elem in which to put the cloned elem
        document.querySelector('main').appendChild(clonePhotographer);


        /* sort photographer by tag*/

        //function for remove first symbol# to string tag and make it in lowercase
        function parseTag(t) {
            return (t.slice(1)).toLowerCase();
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
                    doc.style.display = "flex";
                }

            });
        }


        document.querySelectorAll(".tag_main").forEach((elem) => {

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


        //



    }
    // call my get-file function with the callback previously declared
GetFile("./data.json", withDataCallBack);