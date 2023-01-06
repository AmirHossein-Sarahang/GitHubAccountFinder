/*
Our main function is called from Html
 */
function Main(){
    var username = document.getElementById("t1").value;
    var url = "https://api.github.com/users/"
    url += username

    if (getCookie("User") === username){ //Read from cookies and set in html with getCookie and set Info and then call error handler for print from cookie
        setInfo(getCookie("User"), getCookie("Blog"), getCookie("Location"), getCookie("Bio"), getCookie("Img") )
        ErrorsHandler("Cookie");

    }
    else{//set information without cookies in handler function
        Handler(url)
    }


}
//fetch data and convert to json
function Handler(url){
    document.getElementById("error").innerHTML = "<br>"
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {//if user field in data is Not found set info to default and print not found by error handler
        if (data.message === 'Not Found'){
            SetDefault();
            ErrorsHandler("NotFound");
        }
        else {
            //if user exists then :
            let bio = data.bio;
            if (bio == null){
                bio = "";
            }
            else{
                bio = bio.replace("\n", "<br/>");
                //set bio in bio and replace \n to br for new line
            }
            //then set info and cookies and then call  WhatsFavoriteLanguage for check repos and find FavoriteLanguage
            setInfo(data.login, data.blog, data.location, bio, data.avatar_url)
            setCookies(data.login, data.blog, data.location, data.avatar_url, bio)
            WhatsFavoriteLanguage(data.repos_url)
            ErrorsHandler("New") // for print new request

        }


    }).catch(function(err) {
        //network error
       ErrorsHandler("Network");
        console.log('Fetch Error :-S', err);
    });
}
/*
to find FavoriteLanguage we have to data s length
and then we check length value in if because we need just 5 no more!
 */
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
        // then we make 2 arrays : languages = copy of first 5 language and cn for counters
        const languages = ["", "", "", "", ""]
        for (let i = 0; i < length; i++) {
            if (data[i].language) {
                languages[i] = data[i].language
                //copy first 5 language
            }
        }

        const cn = [0, 0, 0, 0, 0]
        // Checking the number of each and adding the appropriate counter :
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
        //then we find max value in counters and pass it to languages as index :
        let index = cn.indexOf(Math.max(...cn));
        var FL = "Favorite language : ";
        FL += languages[index];
        setLanguage(languages[index])
        document.getElementById("language").innerHTML = FL; //set inner html

        for (let i = 0; i < 5; i++) {
            languages[i] = ""; //reset languages array
        }


    }).catch(function(err) {
    });

}
// just sets information to Default values
function SetDefault(){
    document.getElementById("user").innerHTML= "Username"
    document.getElementById("img").src= "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
    document.getElementById("blog").innerHTML= "Blog"
    document.getElementById("loc").innerHTML= "Location"
    document.getElementById("bio").innerHTML= "Bio"
    document.getElementById("language").innerHTML="Favorite language";
    document.getElementById("error").innerHTML="<br>"
}
// find special cookie bu name and getting help from the split function To separate fields
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
// set cookies with expires time (60000ms = 60s) and convert it to string and then set cookies
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
// set Language cookie like others with 60s expire time
function setLanguage(lang){
    var date = new Date();
    date.setTime(date.getTime() + (60 * 1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = "Language" + "=" + lang + ";" + expires + ";path=/";
}
//delete All Cookie for reset everything to Default about cookies
function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
// set all fields in html to their new quantity
function setInfo(name, blog, loc, bio, img){
    document.getElementById("user").innerHTML= name
    document.getElementById("img").src= img
    document.getElementById("blog").innerHTML= blog
    document.getElementById("loc").innerHTML= loc
    document.getElementById("bio").innerHTML= bio
    document.getElementById("error").innerHTML="<br>"
}
// error handler use switch case to set inner html to special error
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
