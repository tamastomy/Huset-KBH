function getAllEvents() {
    fetch("http://coffeandcoal.dk/huset-kbh/wp-json/wp/v2/events?_embed")
        .then(res => res.json())
        .then(showEvents);
}

function getEventsByCategory(id) {
    fetch("http://coffeandcoal.dk/huset-kbh/wp-json/wp/v2/events?_embed&categories=" + id)
        .then(res => res.json())
        .then(showEvents);
}



function getSingleEventById(MyId) {
    fetch("http://coffeandcoal.dk/huset-kbh/wp-json/wp/v2/events/" + MyId + "/?_embed")
        .then(res => res.json())
        .then(showSingleEvent);
}

function getEventsByTag() {
    fetch("http://coffeandcoal.dk/huset-kbh/wp-json/wp/v2/categories")
        .then(res => res.json())
        .then(showTagMenu);
}



//SINGLE Event PAGE TEMPLATE
function showSingleEvent(json) {
    document.querySelector(' .preview-columns h1').textContent = json.title.rendered;
    document.querySelector(' .preview-event img').setAttribute("src", json._embedded["wp:featuredmedia"][0].media_details.sizes.large.source_url);
    document.querySelector('.description').innerHTML = json.content.rendered;
    document.querySelector('.genre').textContent = json.acf.category;
    document.querySelector('.infocolumn01 h6').textContent = json.acf.date + ' at ' + json.acf.time;
    document.querySelector('.infocolumn02 h3').textContent = json.acf.price + "kr";
    document.querySelector('.socialwrapp .social-icon.facebook').setAttribute('href', json.acf.facebook_event);
    document.querySelector('.location').textContent = json.acf.place;

    if (json.acf.presale === false) {
        document.querySelector('.available').textContent = 'PRESALE UNAVAILABLE';
    } else {}



}
//ALL Events PAGE TEMPLATE
function showEvents(data) {
    let list = document.querySelector('#list');
    let template = document.querySelector('#eventtemplate').content;

    data.forEach(function (theEvent) {

        let clone = template.cloneNode(true);

        if (theEvent.acf.presale === true) {
            let presale = clone.querySelector('.available');
            presale.textContent = 'PRESALE UNAVAILABLE';
        } else {}

        let title = clone.querySelector('.event .title');
        title.textContent = theEvent.title.rendered;

        let place = clone.querySelector('.event .location');
        place.textContent = theEvent.acf.place;
        /*
        let content = clone.querySelector('.content');
        content.innerHTML = theEvent.content.rendered;
        */
        let price = clone.querySelector('.event .price');
        price.textContent = theEvent.acf.price + 'kr';

        let date = clone.querySelector('.event .date');
        date.innerHTML = theEvent.acf.date + ' at ' + theEvent.acf.time;

        let genre = clone.querySelector('.event .home-infowrapp .home-category');
        genre.textContent = theEvent.acf.genre;

        /*let facebook = clone.querySelector('.event div.eventwrapp div.infowrapp div.socialiconwrapp a.social-icon.facebook');
        facebook.setAttribute('href',theEvent.acf.facebookevent);*/


        let img = clone.querySelector('.event .link img');
        img.setAttribute("src", theEvent._embedded["wp:featuredmedia"][0].media_details.sizes.large.source_url);

        let link = clone.querySelector(".event .link");
        link.setAttribute("href", "single.html?id=" + theEvent.id);

        list.appendChild(clone);
    })

}

function getMenu() {

    fetch("http://coffeandcoal.dk/huset-kbh/wp-json/wp/v2/categories")
        .then(e => e.json())
        .then(showMenu)
}

function showMenu(categories) {
    console.log(categories);
    let lt = document.querySelector("header nav#cbp-spmenu-s1 #linkTemplate").content;


    categories.forEach(function (categoryname) {
        if (window.location.href === "http://coffeandcoal.dk/webapp/index.html?categoryid=" + categoryname.id + '#' || window.location.href === "http://coffeandcoal.dk/webapp/index.html?categoryid=" + categoryname.id) {
            document.querySelector('.genre-title').textContent = categoryname.name;

        } else {};
    });

    categories.forEach(function (category) {
            console.log(categories);
            if (category.count == 0 || category.parent != 0) {

            } else {

                let clone = lt.cloneNode(true);
                let parent = document.querySelector('nav.cbp-spmenu #menulist');
                clone.querySelector('a').textContent = category.name;

                clone.querySelector('a').setAttribute('href', "index.html?categoryid=" + category.id);
                parent.appendChild(clone);

            };

        }


    );
}

function showTagMenu(categories) {



    let st = document.querySelector('.submenu .subnav .subnavigation .subcategory #subcatTemplate').content;
    let subcategory = document.querySelector('section.submenu');
    let i = 0;


    categories.forEach(function (category) {
        if (window.location.href === "http://coffeandcoal.dk/webapp/index.html?categoryid=" + category.parent + '#' || window.location.href === "http://coffeandcoal.dk/webapp/index.html?categoryid=" + category.parent) {

            subcategory.classList.toggle('hide');
            let stclone = st.cloneNode(true);
            let stparent = document.querySelector('.submenu .subnav .subnavigation .subcategory');
            stclone.querySelector('a').textContent = category.name;
            stclone.querySelector('a').setAttribute('href', 'index.html?categoryid=' + category.id);
            stparent.appendChild(stclone);
        } else {

        }
    })
}

/*Submenu*/
$('.submenu a#toggle').click(function () {

    $('.submenu .subnavigation').slideToggle(200, function (start) {


    });

});
/*Burger menu button*/
$('a.menuicon').click(function () {

    $(this).toggleClass('active');
    return false;
});
/**/


let searchParams = new URLSearchParams(window.location.search);
let id = searchParams.get("id");
let categoryid = searchParams.get('categoryid');

getEventsByTag();
getMenu();
if (id) {
    getSingleEventById(id);
}
if (categoryid) {
    getEventsByCategory(categoryid);
} else {
    getAllEvents();
}
