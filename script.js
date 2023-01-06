function Main(){
    var username = document.getElementById("t1").value;
    var url = "https://api.github.com/users/"
    url += username

    if (getCookie("User") === username){
        setInfo(getCookie("User"), getCookie("Blog"), getCookie("Location"), getCookie("Bio"), getCookie("Img") )
        ErrorsHandler("Cookie");

    }
    else{
        Handler(url)
    }


}
function Handler(url){
    document.getElementById("error").innerHTML = "<br>"
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        if (data.message === 'Not Found'){
            SetDefault();
            ErrorsHandler("NotFound");
        }
        else {
            let bio = data.bio;
            if (bio == null){
                bio = "";
            }
            else{
                bio = bio.replace("\n", "<br/>");
            }
            setInfo(data.login, data.blog, data.location, bio, data.avatar_url)
            setCookies(data.login, data.blog, data.location, data.avatar_url, bio)
            WhatsFavoriteLanguage(data.repos_url)
            ErrorsHandler("New")

        }


        //console.log(data);
    }).catch(function(err) {
       ErrorsHandler("Network");
        console.log('Fetch Error :-S', err);
    });
}

function WhatsFavoriteLanguage(URL){
    fetch(URL).then(function(response) {
        return response.json();
    }).then(async function (data) {
        let length = 0
        if (data.length <= 5){
            length = data.length
        }
        else {
            length = 5;
        }

        const languages = ["", "", "", "", ""]
        for (let i = 0; i < length; i++) {
            if (data[i].language) {
                languages[i] = data[i].language
            }
        }

        const cn = [0, 0, 0, 0, 0]
        for (let i = 0; i < length; i++) {
            if (data[i].language) {
                switch (data[i].language) {
                    case languages[0]:{
                        cn[0]++
                        break;
                    }
                    case languages[1]:
                        cn[1]++
                        break;
                    case languages[2]:
                        cn[2]++
                        break;
                    case languages[3]:
                        cn[3]++
                        break;
                    case languages[4]:
                        cn[4]++
                        break;
                }
            }
        }
        let index = cn.indexOf(Math.max(...cn));
        var FL = "Favorite language : ";
        FL += languages[index];
        setLanguage(languages[index])
        document.getElementById("language").innerHTML = FL;

        for (let i = 0; i < 5; i++) {
            languages[i] = "";
        }


    }).catch(function(err) {
    });

}

function SetDefault(){
    document.getElementById("user").innerHTML= "Username"
    document.getElementById("img").src= "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
    document.getElementById("blog").innerHTML= "Blog"
    document.getElementById("loc").innerHTML= "Location"
    document.getElementById("bio").innerHTML= "Bio"
    document.getElementById("language").innerHTML="Favorite language";
    document.getElementById("error").innerHTML="<br>"
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookies(name, blog, location, img, bio){
    deleteAllCookies()
    var date = new Date();
    date.setTime(date.getTime() + (60 * 1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = "User" + "=" + name + ";" + expires + ";path=/";
    document.cookie = "Blog" + "=" + blog + ";" + expires + ";path=/";
    document.cookie = "Location" + "=" + location + ";" + expires + ";path=/";
    document.cookie = "Img" + "=" + img + ";" + expires + ";path=/";
    document.cookie = "Bio" + "=" + bio + ";" + expires + ";path=/";
}

function setLanguage(lang){
    var date = new Date();
    date.setTime(date.getTime() + (60 * 1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = "Language" + "=" + lang + ";" + expires + ";path=/";
}

function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function setInfo(name, blog, loc, bio, img){
    document.getElementById("user").innerHTML= name
    document.getElementById("img").src= img
    document.getElementById("blog").innerHTML= blog
    document.getElementById("loc").innerHTML= loc
    document.getElementById("bio").innerHTML= bio
    document.getElementById("error").innerHTML="<br>"
}

function ErrorsHandler(err){
    switch (err) {
        case "New":
            document.getElementById("error").innerHTML = "New Req"
            document.getElementById("error").style.color = "green"
            break;
        case "Cookie":
            document.getElementById("error").innerHTML = "from cookie"
            document.getElementById("error").style.color = "green"
            break;
        case "Network":
            document.getElementById("error").innerHTML = "Network Error!"
            document.getElementById("error").style.color = "red"

            break;
        case "NotFound":
            document.getElementById("error").innerHTML="User Not found!"
            document.getElementById("error").style.color = "red"
            break;
    }
}
