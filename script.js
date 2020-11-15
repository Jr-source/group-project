//VARIABLESxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
var mainInput = $("#movieName")
var movieListEl = $("#movieList");
var searchButton = $("#searchButton");
var modalDesksEl = $("#desks");
var modalButtonsEl = $("#main-buttons");
var modalArticlesEl = $("#article-links");
var modalCloseButton = $("#close-button");
var modalMainEl = $("#main-modal");
var disclaimerEL = $("#disclaimer")
var noneButton = $("#noneButton")
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthsNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11","12"];
var oldDate
var articles = [];
var articlesN = [];
var varName = 0;
var nSignal = 0



//FUNCTIONSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



//THIS FUNCTION DISPLAYS THE SEARCH RESULT AND CALLS THE FUNCTION THAT ARRANGES THE RESULTS IN A USER FREINDLY WAY
//IT ALSO RETURNS "NO RESULTS FOUND" IF IT CAN'T FIND A MOVIE TITLE
function movieSearch(){
    //Clears the results before every search+++++
    if(movieListEl.children()){
        movieListEl.children().remove()
    }
    //Makes the API query+++++++++++++++++++++++
    var searchName = $("#movieName").val();
    var queryURL = "http://www.omdbapi.com/?apikey=347e88dd&type=movie&s=" + searchName;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    //Calls the functions that create the result and checks to see if the search returned a valid response++++++
    .then(function(response){
        if(response.Response === "True")
            response.Search.forEach(element => {
                movieList(element)
            })  
        else{
            movieNone()    
        }  
    });
}

//THIS FUNCTION CREATES THE ELEMENTS OF THE "RESULTS NOT FOUND" RESPONSE AND APPENDS THEM TO THE DOM
function movieNone(){
    var container = $("<div>");  //==========================CSS
    var titleH2 = $("<h2>")      //==========================CSS
    titleH2.text("No Results Found")
    container.append(titleH2)
    movieListEl.append(container)
}

//THIS FUNCTION CREATES THE ELEMENTS THAT RENDER THE MOVIE TITLES AND POSTERS AND APPENDS THEM TO THE DOM
function movieList(e){
    //Creates elements+++++++++++++
    var container = $("<div>");         
    var title = $("<div>");             
    var poster = $("<div>");            
    var titleH2 = $("<h2>");            
    var year = $("<h2>");               
    var posterIMG = $("<img>");         
    //Sets element attributes++++++++++++++++++++++++++++++++++CSS
    container.attr("style", "display:flex; margin-bottom:1vw;");
    posterIMG.attr("id", "poster");
    title.attr("style", "margin-right:1vw; word-wrap:break-word; width:25%");
    if(e.Poster === "N/A"){
        posterIMG.attr("src", "https://via.placeholder.com/300x447?text=No+Image+Available")    
    }
    else{
        posterIMG.attr("src", e.Poster)
    }
    posterIMG.attr("data-year", e.Year)
    posterIMG.attr("data-title", e.Title)
    //Sets text values+++++++++++++++++++++++++++
    titleH2.text(e.Title);
    year.text(e.Year);
    //Appends elements++++++++++++++++++++++++++
    title.append(titleH2);
    title.append(year);
    poster.append(posterIMG);
    container.append(title);
    container.append(poster);
    movieListEl.append(container);
}

//THIS FUNCTION QUERIES THE MOVIE API FOR THE SPECIFIC MOVIE TITLE AND YEAR OF THE POSTER THAT IS CLICKED
//IT ALSO UNHIDES THE MODAL WITH THE NEWS INFORMATION
function getMovieInfo(event){
    //Queries the movie API+++++++++++++++++++++++++++++++++++
    var movieYear = $(event.target).attr("data-year")
    var movieName = $(event.target).attr("data-title")
    var queryURL = "http://www.omdbapi.com/?apikey=347e88dd&&t=" + movieName + "&y=" + movieYear ;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        var released = response.Released;
        var splitDate = released.split(" ");
        //Reformats date from movie API to a the porper format for the NYT query++++++++++++++
        dateConverter(splitDate)
    });
    //Displays modal+++++++++++++++++++++++++++++++++++++
    modalMainEl.attr("style", "display:flex")
}

//THIS FUNCTIONCONVERTS THE DATE OBTAINED FROM THE MOVIE API QUERY TO A SUITABLE FORMAT FOR THE NYT QUERY
//IT ALSO CALLS THE FUNCTION THAT QUERIES THE NYT API
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

//THIS FUNCTION QUERIES THE NYT FOR NEWS ARTICLES PUBLISHED ON THE DATE OF THE RELEASE OF THE SELECTED MOVIE
//IT ALSO REFORMATS THE DATE FROM THE INITIAL NYT QUERY TO SOMETHING MORE SUITABLE TO SEARCH THE ARTICLES THAT ARE RETURNED
//IT ALSO CALLS THE FUNCTIONS THAT ORGANIZE AND EXTRACT THE RELEVANT DATA FROM THE NYT QUERY RESULTS BASED ON DATE AND NEWS DESK
//IT ALSO CHECKS FOR EMPTY FIELDS IN THE NEWS_DESK FIELD OF THE ARTICLES AND CALLS THE FUNCTION TO VIEW THE UNORGANIZED FIELDS
function NYTData(gdate){
    //Queries the NYT for articles from the month and year of the selected movie+++++++++++++++++++
    var newNums = ["1","2","3","4","5","6","7","8","9"]
    var queryURL = "https://api.nytimes.com/svc/archive/v1/" +gdate[2]+"/"+gdate[1]+".json?api-key=t7uEOJet36tmSbd8T0F47LNB1NcGTrAj";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(res){
        //Check for date formating conflicts and resolves the conflicts by reformating the date information++++++
        newNums.forEach(elements=>{
            if(gdate[1] === elements){
                queryToData(gdate)
                NYTDate = "/"+ oldDate[2]+"/"+oldDate[1]+"/"+oldDate[0]
            }
            else{
                NYTDate = "/"+ gdate[2]+"/"+gdate[1]+"/"+gdate[0]    
            }
        })
        var NYTDate
        var allDocs = res.response.docs
        articles = []
        //Organizes and extracts the data and checks for missing fields
        //If the data can't be organized it provides an unorganized option to view all the articles
        allDocs.forEach(element =>{
            if(element.web_url.includes(NYTDate)){
              articles.push(element)
            }
        })
        console.log(nSignal)
        articles.forEach(element=>{
            if(element.news_desk === "None"){
                nSignal = 1
            }
            else{
                nSignal = 0
            }
         })
        if (nSignal === 1){
            console.log("hi")
            noneDesk()
            nSignal = 0
        }
        else{
            console.log("lo")
            NYTDataPull()
        }
    });
}

//THIS FUNCTION REFORMATS THE DATE FROM THE NYT QUERY TO A SUITABLE FORMAT TO SEARCH THROUGH THE DATA
function queryToData(d){
    oldDate = d
    var newNums = ["1","2","3","4","5","6","7","8","9"]
    newNums.forEach(element =>{
        if (oldDate[1] === element){
            oldDate.splice(1, 1, "0"+element)
        }
    })
}
//THIS FUNCTION CALLS THE FUNCTION THAT CREATES AND APPENDS THE ELEMENTS THAT RENDER THE RELEVANT ARTICLES WHEN THEY CAN'T BE ORGANIZED
//IT ALSO CLEARS ANY PREVIOUS DATA IN THE ARTICLES WINDOW IN THE MODAL
//IT ALSO HIDES THE NEWS_DESK BUTTONS FROM THE MODAL NAVIGATION WINDOW AND SDISPLAYS THE "ARTICLE" BUTTON
//IT ALSO CREATES THE EVENT LISTENER FOR THE "ARTICLES" BUTTON INSIDE THE MODAL
function noneDesk(){
    //Clears the information in the articles window+++++++++++++++++++++++++
    modalArticlesEl.children().remove()
    //Hides the New_Desk navigation buttons and displays the option to view th eunorganized articles+++++++++++
    modalButtonsEl.attr("style", "display:none")
    disclaimerEL.attr("style", "display:flex")
    //Creates the event listener for the "Articles" button inside the modal 
    noneButton.on("click", function(event){
        articles.forEach(element=>{
        //Calls the function that creates and appends the elements to render the articles
            articleElements(element)
        })
    })
}

//THIS FUNCTION CALLS THE FUNCTION THAT CREATS AND APPENDS THE ELEMENTS THAT RENDER THE ORGANIZED ARTICLES IN THE MODAL WINDOW
//IT ALSO CLEARS ANY PREVIOUS DATA IN THE ARTICLES WINDOW IN THE MODAL
//IT ALSO HIDES THE "ARTICLES" BUTTON AND DISPLAYS THE "NEWS_DESK" BUTTONS
//IT ALSO CREATES THE EVENT LISTENER FOR THE NAVIGATION BUTTONS IN THE MODAL
function NYTDataPull(){
    //Clears the article window in the modal+++++++++++++++++++++++++++++++++++
    modalArticlesEl.children().remove()
    //Hides the "Article" button and displays the "News_Desk" buttons++++++++++++++++++
    modalButtonsEl.attr("style", "display:flex")
    disclaimerEL.attr("style", "display:none")
    //creates the event listener for the navigatioin buttons++++++++++++++++++
    modalButtonsEl.on("click", function(event){
        modalArticlesEl.children().remove()
        //Organizes the data into "News_Desks"++++++++++++++++++++++++++++++
        articles.forEach(element=>{
            if (element.news_desk.includes(event.target.innerHTML)){
                //Calls the function that creates and appends the elemets to render the articles+++++++++++
               articleElements(element)
            }
        })
    })
}

//THIS FUNCTION CREATES AND APPENDS THE ELEMENTS TO RENDER THE ARTICLES IN THE MODAL WINDOW
function articleElements(element){
    //Creates elements++++++++++++++++++++++++++++++++++++
    var varName = $("<div>")
    var a = $("<a>")
    var leadP = $("<p>")
    var idP = $("<p>")
    var link = $("<div>")
    var leadPar = $("<div>")
    var articleId = $("<div>")
    //Sets attributes++++++++++++++++++++++++++++++++++++++++++++++++++++++CSS
    a.attr("target", "_blank")
    a.attr("href", element.web_url)
    //Sets text values++++++++++++++++++++++++++++++++++++++++++
    a.text(element.headline)
    leadP.text(element.lead_paragraph)
    idP.text(element._id)
    a.text(element.headline.main)
    //Appends elements+++++++++++++++++++++++++++++++++++++++++
    link.append(a)
    leadPar.append(leadP)
    articleId.append(idP)
    varName.append(link, leadPar, articleId)
    modalArticlesEl.append(varName)
}
//EVENT LISTENERSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//THESE EVENT LISTENER TRIGGER THE MOVIE SEARCH========================
searchButton.on("click", function(event){
movieSearch()  
}) 
mainInput.on("keyup", function(event){
    if (event.keyCode === 13){
        movieSearch()  
    }
}) 

//THIS EVENT LISTENER TRIGGERS THE NYT QUERY===========================
document.addEventListener("click", function(event){
    if(event.target.id != "poster"){
        return
    }
    else{
       getMovieInfo(event)
    }
})
//THIS EVENT LISTENER TRIGGERS THE CLOSING OF THE MODAL==================
modalCloseButton.on("click", function(event){
    modalMainEl.attr("style", "display:none")
})


   
        