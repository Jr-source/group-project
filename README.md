# Group Project 1
# Movie Context Article SearchBot

## Link
* [Repo](https://github.com/Jr-source/group-project/tree/main)
* [Deployed]()

## Task
Create an application that uses two different API systems harmoniously to give a unique
experience that would be helpful, fun, or solve a real world problem for users. We 
decided on a website that allows curious movie watchers to search for a film using
a movie search database, and be given a series of articles sorted by category from
the New York Times article database, to allow the user to learn about the various stories
and articles that were written on the same day the movie was released.

## User Story
AS AN user who is curious about a film.  
I WANT to search for events related to that film's release. 
SO THAT I can learn about the history surrounding the film.

## Accectance Criteria
GIVEN I want to search for articles released the same day as a film
WHEN I enter the film into a search bar
THEN I am presented with a series of movies that match my search criteria 
WHEN I select a film to learn about
THEN I am prompted to select a category for news 
WHEN I choose a given category
THEN I am presented with a list of articles that were released on that day  
WHEN I select an article
THEN I am redirected to the New York Times page of the selected article  
WHEN I return to the same page after closing
THEN my previous input for movie searches should be available 
WHEN I select the button for previous searches
THEN a list of movies that I have previously selected is presented  
WHEN I select a previously searched film
THEN I am presented with similar results to if I had searched with the prompt and selected a movie.  

## Code Screenshots
### - Variables.

![Variables](./images/Variables.png)


### - Searches for a film using the database and given info.
![Code For Searching For Movie Titles Using The API](./images/MovieSearchCode.png)

### - Finds details about the given movie.
![Code For Using a Movie Search API For Details](./images/MovieDetailsSearchCode.png)

### - Saves the search and makes a dropdown menu.
![Dropdown Menu Code](./images/DropDownMenuCode.png)