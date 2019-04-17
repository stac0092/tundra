document.addEventListener("deviceready", init);

let profileImg = "";
let profileInfo = [];
let rightSwipes = [];
let rightSwipesKey = "hitIt";


function init() {
    document.addEventListener("deviceready", ready);
    pages = document.querySelectorAll(".page");
    let favpage = document.querySelectorAll('#favBtn');
    favpage.forEach((btn) => {
        btn.addEventListener('click', favPage);
    });
    let homepage = document.querySelectorAll('#homBtn');
    homepage.forEach((btn) => {
        btn.addEventListener('click',homePage);
    });
}

//Get the Profiles
function ready() {
    let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            profileInfo = data.profiles;
            let encoded = data.imgBaseURL;
            profileImg = decodeURIComponent(encoded);
            console.log(profileImg);
        })
        .then(() => {
            cards();
        })
        .catch(err => {
            let nm = err.name; //Error Type
            let msg = err.message; //The error message
            alert(`CATCH: ${nm} ${msg}`);
        });
}

//Make the People
function cards() {
    profileInfo.forEach(item => {
    let section = document.querySelector('.first');    
    let div = document.createElement("div");
    div.setAttribute('class', 'card fixed active dot');
    div.setAttribute('data-id', item.id);
    let img = document.createElement("img");
    img.setAttribute("src", 'https:' + profileImg + item.avatar);
    console.log("src", 'https:' + profileImg + item.avatar);
    img.setAttribute("class", "round");
    img.setAttribute("alt", "Profile Picture");
    div.appendChild(img);
    let name = document.createElement("p");
    name.textContent = item.first + " " +item.last;
    div.appendChild(name);
    let distance = document.createElement("p");
    distance.textContent = item.distance;
    div.appendChild(distance);
    let gender = document.createElement("p");
    gender.textContent = item.gender;
    div.appendChild(gender);
    section.appendChild(div);
    });
    displayHomepage();
}

//Swipes
function displayHomepage(){
    let target = document.querySelector("#first > div");
    console.log(target);
    let tiny = new tinyshell(target);
    target.classList.remove("dot");
    tiny.addEventListener("swipeleft", goAway);
    tiny.addEventListener("swiperight", stay);
//     tiny.addEventListener("revealleft", removeFav);
    let card = document.querySelectorAll(".card");
    if (card.length <= 3) {
    console.log("Fetch more people")
    ready();
}
 }

 //SPA Pages
function favPage() {
    pages[0].classList.remove('active');
    pages[1].classList.add('active');
}

function homePage(){
    pages[1].classList.remove('active');
    pages[0].classList.add('active');
}
 

//Left Swipe Delete
function goAway(ev) {
    console.log("swipe left");
    let div = ev.currentTarget;
    div.classList.add("goleft");
    document.getElementById("overlay").style.display = "block";
    let p = document.getElementById("overlayP");
    p.innerHTML = "Nope!"
    setTimeout(
      function() {
        this.parentElement.removeChild(this);
        document.getElementById("overlay").style.display = "none";
        displayHomepage();
      }.bind(div),
      500
    );
  }

//Right Swipe Keep
function stay(ev){
    console.log("swipe right");
    let div = ev.currentTarget;
    div.classList.add("goRight");
    document.getElementById("overlay").style.display = "block";
    let p = document.getElementById("overlayP");
    p.innerHTML = "Match!"
    setTimeout(
        function() {
            document.getElementById("overlay").style.display = "none";
          this.parentElement.removeChild(this);
          displayHomepage();
        }.bind(div),
        500
      );
    let profileId = div.getAttribute("data-id");
    profileInfo.forEach(matches => {
        if(profileId == matches.id){
        rightSwipes.push(matches);
        }
    })
    sessionStorage.setItem(rightSwipesKey, JSON.stringify(rightSwipes));
    savedPeople();
}

//Saved People Favourites List 
function savedPeople(){
    let section = document.querySelector('.list-view');
    section.innerHTML ="";  
    let savedPeople = JSON.parse(sessionStorage.getItem(rightSwipesKey));
    savedPeople.forEach(item => {
    console.log("saved" + item.id);
    let section = document.querySelector('.list-view');  
    let div = document.createElement("li");  
    div.setAttribute('class', 'list-item');
    div.setAttribute('data-id', item.id);
    let name = document.createElement("p");
    name.setAttribute('class', 'list-text');
    name.textContent = item.first + " " +item.last;
    let img = document.createElement("img");
    img.setAttribute("src", 'https:' + profileImg + item.avatar);
    img.setAttribute("alt", "avatar");
    img.setAttribute("class", "avatar");
    let editDiv = document.createElement("div");
    editDiv.setAttribute('class', 'action-right');
    let iconEdit = document.createElement("i");
    iconEdit.setAttribute('class', 'icon clear');
    iconEdit.addEventListener('click', () => removeFav(item));
    editDiv.appendChild(iconEdit);
    div.appendChild(img);
    div.appendChild(name);
    div.appendChild(editDiv);
    section.appendChild(div);
   });

}

function removeFav(item){
    let profileId = item.id;
    let items = JSON.parse(sessionStorage.getItem(rightSwipesKey));
    for (let i =0; i< items.length; i++) {
        let card = items[i];
        if (card.id === profileId) {
            items.splice(i, 1);
            console.log("delcard");
            rightSwipes = items;
        }
    }
    sessionStorage.setItem(rightSwipesKey, JSON.stringify(rightSwipes));
    savedPeople();
}
