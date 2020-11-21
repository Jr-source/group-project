//VARIABLESxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
var mainInput = $("#movieName")
var movieListEl = $("#movieList");
var searchButton = $("#searchButton");
var modalDesksEl = $("#desks");
var modalButtonsEl = $("#main-buttons");
var modalArticlesEl = $("#article-links");
var modalCloseButton = $("#close-button");
var modalMainEl = $("#main-modal");
var disclaimerEL = $("#disclaimer");
var noneButton = $("#noneButton");
var saveBox = $("#saveBox");
var pSearchesButton = $("#dropbttn") 
var dropmenu = $("#dropmenu")
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthsNum = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11","12"];
var oldDate
var articles = [];
var articlesN = [];
var nSignal = 0
var doubleSignal = 0
var varName = 0
var pSearches = []



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
    // Sets element attributes++++++++++++++++++++++++++++++++++CSS
    container.attr("class", ".containerTitle;");
    titleH2.attr("style", "text-align: center" )
    year.attr("style", "text-align: center")
    // posterIMG.attr("src", "https://via.placeholder.com/300x447?text=No+Image+Available")    
    posterIMG.attr("id", "poster");
    posterIMG.attr("class", "posterImage;")
    // poster.attr("style", "width: 10vw; height: 10vh;")
    if(e.Poster === "N/A"){
        posterIMG.attr("src", "https://via.placeholder.com/300x447?text=No+Image+Available")    
    }
    else{
        posterIMG.attr("src",e. Poster)
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
//IT ALSO CALLES THE FUNCTIONI THAT SAVES AND RETRIEVES PAST SEARCHES
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
    saveSearch(movieName, movieYear)
}

//THIS FUNCTION  SAVES AND RETRIEVES PAST SEARCHES AND ADDS THEM TO A DROPDOWN MENU IN THE MAIN WINDOW
//IT ALSO STORES THE INFORAMTION IN LOCAL STORAGE
//IT ALSO CREATES AND APPENDS THE ELEMENTS TO DISPLAY THE INFORMATION
function saveSearch(movie, year){
    
    doubleSignal = 0
    var info = {title:movie, year:year}
    //Checks to see if there is any information in local storage and if there is it retrieves it ++++++++++++++++
    if (localStorage.getItem("pastSearches")){
        pSearches = JSON.parse(localStorage.getItem("pastSearches"))
    }
    //Checks the array of saved movies to see if the new movie being searched i salready saved and if it is, then it sets a variable as a 
    //signal to prevent it from being added to the svaed movies array+++++++++++++++++++++++
    pSearches.forEach(em=>{
        if(em.title === movie && em.year === year){
            doubleSignal = 1
        }
    })
    //Checks if the incoming movie has valid data or if the movie is already saved and prevents it from being saved to the array++++++
    if(info.title === 1 && info.year === 2|| doubleSignal === 1){}
    else{
        pSearches.push(info)   
    }
    //Saves the "past searches" aray into local storage+++++++++++++
    localStorage.setItem("pastSearches", JSON.stringify(pSearches))
    //Clears the menu to prevent repeted lists++++++++++++++++
    dropmenu.children().remove()
    //Creates the elements that render the list of past searches++++++++++++++
    pSearches.forEach(element=>{
        
        var savelist = $("<p>") 
        savelist.attr("class", "saves")
        savelist.attr("data-year", element.year)
        savelist.attr("data-title", element.title)
        savelist.append(element.title + " " + element.year)
        dropmenu.append(savelist) 
    })
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
    // var queryURL = "https://api.nytimes.com/svc/archive/v1/" +gdate[2]+"/"+gdate[1]+".json?api-key=t7uEOJet36tmSbd8T0F47LNB1NcGTrAj";
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date="+gdate[2]+gdate[1]+gdate[0]+"&end_date="+gdate[2]+gdate[1]+gdate[0]+"&api-key=t7uEOJet36tmSbd8T0F47LNB1NcGTrAj";
    
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(res){
        
        var NYTDate
        NYTDate = "/"+ gdate[2]+"/"+gdate[1]+"/"+gdate[0]
        var allDocs = res.response.docs
        articles = []
        //Organizes and extracts the data and checks for missing fields
        //If the data can't be organized it provides an unorganized option to view all the articles
        allDocs.forEach(element =>{
            if(element.web_url.includes(NYTDate)){
              articles.push(element)
            }
        })
        articles.forEach(element=>{
            if(element.news_desk === "None"){
                nSignal = 1
            }
            else{
                nSignal = 0
            }
         })
        if (nSignal === 1){
            noneDesk()
            nSignal = 0
        }
        else{
            NYTDataPull()
        }
    });
}

//THIS FUNCTION CALLS THE FUNCTION THAT CREATES AND APPENDS THE ELEMENTS THAT RENDER THE RELEVANT ARTICLES WHEN THEY CAN'T BE ORGANIZED
//IT ALSO CLEARS ANY PREVIOUS DATA IN THE ARTICLES WINDOW IN THE MODAL
//IT ALSO HIDES THE NEWS_DESK BUTTONS FROM THE MODAL NAVIGATION WINDOW AND SDISPLAYS THE "ARTICLE" BUTTON
//IT ALSO CREATES THE EVENT LISTENER FOR THE "ARTICLES" BUTTON INSIDE THE MODAL
function noneDesk(){
    //Clears the information in the articles window+++++++++++++++++++++++++
    modalArticlesEl.children().remove()
    //Hides the New_Desk navigation buttons and displays the option to view the unorganized articles+++++++++++
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
        console.log(event.target.id)
        console.log(articles)
        modalArticlesEl.children().remove()
        //Organizes the data into "News_Desks"++++++++++++++++++++++++++++++
        articles.forEach(element=>{
            if (element.news_desk.includes(event.target.id)){
                //Calls the function that creates and appends the elemets to render the articles+++++++++++
               articleElements(element)
            }
        })
    })
}

//THIS FUNCTION CREATES AND APPENDS THE ELEMENTS TO RENDER THE ARTICLES IN THE MODAL WINDOW
function articleElements(element){
    //Creates elements++++++++++++++++++++++++++++++++++++
    varName++
    var cont = $("<div>")
    var a = $("<a>")
    var leadP = $("<p>")
    var idP = $("<p>")
    var link = $("<div>")
    var leadPar = $("<div>")
    var articleId = $("<div>")
    //Sets attributes++++++++++++++++++++++++++++++++++++++++++++++++++++++CSS
    cont.attr("class", "box")
    a.attr("draggable", "true")
    a.attr("ondragstart", "drag(event)")
    a.attr("id", "article"+ varName)
    a.attr("target", "_blank")
    a.attr("href", element.web_url)
  
    a.attr("style", "margin: 0px;");
    link.attr("style", "margin: 0px;");

    a.attr("class", "article-style drop-title has-background-dark")
    idP.attr("class", "article-style has-background-primary")
    idP.attr("style", "word-wrap: break-word")
    leadP.attr("class", "article-style has-background-warning")
    // leadP.attr("class", "button is-warning")

    //Sets text values++++++++++++++++++++++++++++++++++++++++++
    a.text(element.headline)
    leadP.text(element.lead_paragraph)
    
    idP.text(element._id)
    a.text(element.headline.main)
    //Appends elements+++++++++++++++++++++++++++++++++++++++++
    link.append(a)
    leadPar.append(leadP)
    articleId.append(idP)
    cont.append(link, leadPar, articleId)
    modalArticlesEl.append(cont)
}

//DRAG AND DROP====================================================
function allowDrop(ev){
    ev.preventDefault();
}

function drag(ev){
    // cNum = 1
    $(ev.target).attr("style", "margin: 0px;")
    ev.dataTransfer.setData("text", ev.target.id)
    var clone =$(ev.target).clone()
    var  parentDiv = $(ev.target).parent();
    clone.text($(ev.target).text())
    clone.attr("draggable", "true")
    clone.attr("ondragstart", "drag(event)")
    clone.attr("id", "clone" + ev.target.id)
    // cNum++
    clone.attr("style", "display:none;");
    parentDiv.append(clone);
}

function dragDel(ev){
    ev.dataTransfer.setData("text", ev.target.id)
    
    modalMainEl.attr("ondrop", "dropDel(event)")
    modalMainEl.attr("ondragover", "allowDrop(event)")
    
}

function dropDel(ev){
    var data = ev.dataTransfer.getData("text");
    var del = $("#"+data)
    console.log(del)
    // modalMainEl.attr("ondrop", "dropDel(event)")
    del.parent().remove()
    modalMainEl.attr("ondrop", "")
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var cloneDisplay = $("#clone"+data)
    cloneDisplay.attr("style", "display:flex;")
    var spacer = $("<div>");
    // var texts = ev.target.appendChild(document.getElementById(data));
    var texts = $("#"+data)
    texts.attr("ondragstart", "dragDel(event)")
    spacer.attr("style", "margin: 0px;");
    // saveBox.children().forEach(element=>{
    //     console.log(element)
    // })
    console.log(texts)
    
    // console.log($("#"+data))
    spacer.append(texts);
    console.log($(spacer))
    saveBox.append(spacer);
    // console.log(cloneDisplay.text())
    // console.log(cloneDisplay.attr("id"))
    // console.log(cloneDisplay.attr("href"))
}

function saveFavLinks(c){
    var vName = arr + c.attr("id")
    var vName = []
    var linkInfo = {text: c.text(), id: c.attr("id"), href: c.attr("href")}
    // vName.forEach(element=>{
    //     if (element.id === c.attr("id"))
    // })
    vName.push(linkInfo)




}

//EVENT LISTENERSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//THESE EVENT LISTENER TRIGGERS THE MOVIE SEARCH========================
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
//THIS EVENT LISTENER UN-HIDES THE "PAST SEARCHES" LIST AND CALLS THE FUNCTION TO RENDER THE LIST
pSearchesButton.on("click", function(event){
    dropmenu.attr("style", "display:flex" );
    saveSearch(1, 2)
})

//THIS EVENT LISTENER CLOSES THE "PAST SEARCHES" LIST WHENEVER THE MOUSE CURSOR IS MOVED AWAY FROM THE LIST OF SEARCHES OR 
//THE "PAST SEARCHES"BUTTON
window.onmouseover = function(event){
    if(event.target.id === "dropbttn" || event.target.tagName === "P"){
        return
    }
    else{
    dropmenu.attr("style", "display:none")
    }
}

//THIS EVENT LISTENER CALLS THE FUNCTION THAT DISPLAYS THE MODAL AND QUERIES THE NYT API WHENEVER ONE OF THE ITEMS IN THE 
//"PAST SEARCH" LIST IS CLICKED
document.addEventListener("click", function(event){
    if (event.target.className === "saves"){
        getMovieInfo(event)
    }
    else{
        return
    }
})



//197Check for date formating conflicts and resolves the conflicts by reformating the date information++++++
        // newNums.forEach(elements=>{
            // if(gdate[1] === elements){
            //     queryToData(gdate)
            //     NYTDate = "/"+ oldDate[2]+"/"+oldDate[1]+"/"+oldDate[0]
            // }
            // else{
                    
            // }
        // })
        

//228THIS FUNCTION REFORMATS THE DATE FROM THE NYT QUERY TO A SUITABLE FORMAT TO SEARCH THROUGH THE DATA
// function queryToData(d){
//     oldDate = d
//     var newNums = ["1","2","3","4","5","6","7","8","9"]
//     newNums.forEach(element =>{
//         if (oldDate[1] === element){
//             oldDate.splice(1, 1, "0"+element)
//         }
//     })
// }
