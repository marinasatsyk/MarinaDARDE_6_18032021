/* hashtag**/


/* Ici la fonction pour faire quelque chose avec des données**/

//     function myFunction() {

//     }
//     console.log(data.a);


function myFunc(idElem, dataElem, elemPlace, dataParam, elemParent) {
    const tmpl = document.querySelector(`#${idElem}`);

    for (let key of `${data}.${dataElem}`) {

        const clone = document.importNode(tmpl.content, true);
        clone.querySelector(`"${elemPlace}"`).textContent = `${key}.${dataParam}`;
        document.getElementById(`"${elemParent}"`).appendChild(clone);
    }
}


document.querySelector(".")

let b = new Promise((res, rej) => {
    fetch("./data.json")
        .then(response => {
            res(response.json());

        })

})

b.then(data => {
    return data;
})


Promise.all([b]).then(value => {
    console.log(value);
    console.log(value[0].photographers);
    console.log(value[0].media);



})