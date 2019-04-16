document.addEventListener("deviceready", init);

let profileImg = "";
let profileInfo = [];
let rightSwipes = [];
let rightSwipesKey = "hitIt";

//let target = document.querySelector(".first");

function init() {
    document.addEventListener("deviceready", ready);
    pages = document.querySelectorAll(".page");
    let favpage = document.querySelectorAll('#favBtn');
    favpage.forEach((btn) => {
        btn.addEventListener('click', favPage);
    });
    let homepage = document.querySelectorAll('#homBtn');
    homepage.forEach((btn) => {
        btn.addEventListener('click', homePage);
    });
}

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

function displayHomepage(){
    let target = document.querySelector("#first > div");
    console.log(target);
    let tiny = new tinyshell(target);
    target.classList.remove("dot");
    tiny.addEventListener("swipeleft", goAway);
    tiny.addEventListener("swiperight", stay);
//     tiny.addEventListener("revealleft", removeFav);
 }

function favPage() {
    pages[0].classList.remove('active');
    pages[1].classList.add('active');
}

function homePage(){
    pages[1].classList.remove('active');
    pages[0].classList.add('active');
}


function goAway(ev) {
    console.log("swipe left");
    let div = ev.currentTarget;
    div.classList.add("goleft");
    //div.classList.remove("active");
    //div.classList.add("left");
    setTimeout(
      function() {
        //remove the div from its parent element after 0.5s
        this.parentElement.removeChild(this);
        displayHomepage();
      }.bind(div),
      500
    );
  }

function stay(ev){
    console.log("swipe right");
    let div = ev.currentTarget;
    div.classList.add("goRight");
    setTimeout(
        function() {
          //remove the div from its parent element after 0.5s
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
   // console.log(rightSwipes);
    savedPeople();
}

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
    
  
}