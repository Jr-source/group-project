//VARIABLESxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
var movieListEl = $(".movieList");
var searchButton = $("#searchButton");
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthsNum = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11","12"];

//FUNCTIONSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function getNews(){
    var queryURL = "http://www.omdbapi.com/?apikey=347e88dd&s=" + movieName;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        });
}

function movieSearch(){
    var searchName = $("#movieName").val();
    var queryURL = "http://www.omdbapi.com/?apikey=347e88dd&type=movie&s=" + searchName;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        response.Search.forEach(element => {
        movieList(element)        
    });
    })
    
}

function movieList(e){
    var container = $("<div>");
    var title = $("<div>");
    var poster = $("<div>");
    var link = $("<a>");
    var titleH2 = $("<h2>");
    var year = $("<h2>");
    var posterIMG = $("<img>");
    link.attr("id", "ga");
    container.attr("style", "display:flex; margin-bottom:1vw;");
    posterIMG.attr("id", "poster");
    title.attr("style", "margin-right:1vw; word-wrap:break-word; width:25%");
    link.attr("href", "#");
    if(e.Poster === "N/A"){
        posterIMG.attr("src", "https://via.placeholder.com/300x447?text=No+Image+Available")    
    }
    else{
        posterIMG.attr("src", e.Poster)
    }
    titleH2.text(e.Title);
    year.text(e.Year);
    title.append(titleH2);
    title.append(year);
    poster.append(posterIMG);
    container.append(title);
    container.append(poster);
    link.append(container);
    movieListEl.append(link);
    
}

function getMovieInfo(event){
    var movieName = $("#movieName").val();
    var movieYear = event.target.parentElement.parentElement.children[0].children[1].innerHTML;
    var queryURL = "http://www.omdbapi.com/?apikey=347e88dd&&t=" + movieName + "&y=" + movieYear ;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        var released = response.Released;
        var splitDate = released.split(" ");
        dateConverter(splitDate)
        
    });
}

function dateConverter(date){
    months.forEach(element =>{
        var i = months.indexOf(element)
        var n = monthsNum[i]
        if(date[1] === months[i]){
            date.splice(1, 1, n)
        }
        
        
    })
    NYTData(date)
    // console.log(date)
}

function NYTData(gdate){
    console.log(gdate[1]);
    console.log(gdate[2]);
    var queryURL = "https://api.nytimes.com/svc/archive/v1/" +gdate[2]+"/"+gdate[1]+".json?api-key=t7uEOJet36tmSbd8T0F47LNB1NcGTrAj";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        console.log(response)
    });
}

searchButton.on("click", function(event){
   movieSearch()
})
document.addEventListener("click", function(event){
    if(event.target.id != "poster"){
        return
    }
    else{
       getMovieInfo(event)
    }
})
// console.log($(".inputMovie").children()[1]
