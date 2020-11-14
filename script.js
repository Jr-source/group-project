//VARIABLESxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
var mainInput = $("#movieName")
var movieListEl = $(".movieList");
var searchButton = $("#searchButton");
var modalDesksEl = $("#desks");
var modalButtonsEl = $("#main-buttons");
var modalArticlesEl = $("#article-links");
var modalCloseButton = $("#close-button");
var modalMainEl = $("#main-modal");
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthsNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11","12"];
var oldDate
var articles = [];
var varName = 0;


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
    if(movieListEl.children()){
        movieListEl.children().remove()
    }
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
    var titleH2 = $("<h2>");
    var year = $("<h2>");
    var posterIMG = $("<img>");
    container.attr("style", "display:flex; margin-bottom:1vw;");
    posterIMG.attr("id", "poster");
    title.attr("style", "margin-right:1vw; word-wrap:break-word; width:25%");
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
    movieListEl.append(container);
    
}

function getMovieInfo(event){
    modalMainEl.attr("style", "display:flex")
    var movieName = $("#movieName").val();
    var movieYear = event.target.parentElement.previousElementSibling.children[1].innerHTML;
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

}

function NYTData(gdate){
    // console.log(gdate[0]);
    // console.log(gdate[1]);
    // console.log(gdate[2]);
    var newNums = ["1","2","3","4","5","6","7","8","9"]
    var queryURL = "https://api.nytimes.com/svc/archive/v1/" +gdate[2]+"/"+gdate[1]+".json?api-key=t7uEOJet36tmSbd8T0F47LNB1NcGTrAj";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(res){
        
        newNums.forEach(elements=>{
            if(gdate[1] === elements){
                queryToData(gdate)
            }
        })
        var allDocs = res.response.docs
        var NYTDate = "/"+ oldDate[2]+"/"+oldDate[1]+"/"+oldDate[0]
        articles = []
        allDocs.forEach(element =>{
            if(element.web_url.includes(NYTDate)){
              articles.push(element)
                // console.log(element)
                // console.log(element.web_url)
                // console.log(element.news_desk)
            }
        })
        NYTDataPull()
    });
}

function queryToData(d){
    oldDate = d
    var newNums = ["1","2","3","4","5","6","7","8","9"]
    newNums.forEach(element =>{
        if (oldDate[1] === element){
            oldDate.splice(1, 1, "0"+element)
        }
    })
}

function NYTDataPull(){
    modalButtonsEl.on("click", function(event){
    var newsDesk = []    
            articles.forEach(element=>{
                if (element.news_desk.includes(event.target.innerHTML)){
                    newsDesk.push()
                    varName++
                    var varName = $("<div>")
                    var a = $("<a>")
                    // var headP = $("<p>")
                    var leadP = $("<p>")
                    var idP = $("<p>")
                    var link = $("<div>")
                    // var headline = $("<div>")
                    var leadPar = $("<div>")
                    var articleId = $("<div>")
                    a.attr("href", element.web_url)
                    a.text(element.headline)
                    leadP.text(element.lead_paragraph)
                    idP.text(element._id)
                    a.text(element.headline.main)
                    link.append(a)
                    leadPar.append(leadP)
                    articleId.append(idP)
                    varName.append(link, leadPar, articleId)
                    modalArticlesEl.append(varName)
                }
                else{
                    return
                }
            console.log(event.target.innerHTML)
            console.log(event.target.id)

            console.log(element.news_desk)
            })
        
    })

    modalCloseButton.on("click", function(event){
        modalMainEl.attr("style", "display:none")
    })
}

//EVENT LISTENERSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

searchButton.on("click", function(event){
movieSearch()  
}) 
mainInput.on("keyup", function(event){
    if (event.keyCode === 13){
        movieSearch()  
    }
}) 



document.addEventListener("click", function(event){
    if(event.target.id != "poster"){
        return
    }
    else{
       getMovieInfo(event)
    }
})




// var tes = ["03", "1" , "1980"]
// var newNums = ["1","2","3","4","5","6","7","8","9"]
// newNums.forEach(elements =>{
//     if (tes[1] === elements){
//         tes.splice(1,1, "0"+elements)
//         console.log(tes)
//     }
// })
// console.log($(".inputMovie").children()[1]

    // var nation = $("<div>")
    // var foreign = $("<div>")
    // var metro = $("<div>")
    // var financial = $("<div>")
    // var sports = $("<div>")
    // var science = $("<div>")
    // var weekend = $("<div>")
    // var art =$("<div>")
    // var culture = $("<div>")
    // var book = $("<div>")
    // var society = $("<div>")
    // var style = $("<div>")
    // var weekIn = $("<div>")
    // var travel = $("<div>")
    // var home = $("<div>")


        // var elementNames = ["container", "title", "poster", "titleH2", "year", "posterIMG"]
    // var elementList = ["<div>", "<div>", "<div>", "<h2>", "<h2>", "<img>"]
    // elementNames.forEach(element=>{
    //     var i = elementNames.indexOf(element)
    //     var element = $(elementList[i])
    // })


    // function NYTDataElements(){
        //     var desks = ["nation", "foreign", "metro", "financial", "sports", "science", "weekend", "art", "culture", "book", "society", " style", 
        //                 "weekIn", "travel", "home"]
        //     var pic = $("<div>")
        //     var picIMG = 
        //     modalDesks.append(pic)
        //     desks.forEach(element=>{
        //         var i = desks.indexOf(element)
        //         var element = $("<div>")
        //         element.text(desks[i])
        //         modalDesks.append(element)
        //     });
        // }
        