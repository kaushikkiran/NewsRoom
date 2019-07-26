//Declare global variables to store the news JSON
var businessNews = [];
var sportsNews = [];
var techNews = [];

function extractNews(resultSet)    //function to parse the news results from API Response
{
    var newsData = [];
    var i = 0;
    var resultLen = resultSet.length;
    for (i = 0; i < resultLen; i++) 
    {
        //Declare temporary variables to store the contents of the array and object
        var tempObj = {};
        //Assign selected properties to the local object data (Title, Description and Data/Time info)
        tempObj.title = resultSet[i].title;
        tempObj.description = resultSet[i].description;
        //Split and remove the unnecessary characters from the "publishedAt" Value
        var time = resultSet[i].publishedAt.split("T")[1];
        tempObj.publishedAt = time.substring(0, time.length - 4);
        newsData.push(tempObj);
    }
    return newsData;
}

function fillListWithNews(result)         //Function to update the news content into the list
{
    var i = 0;
    var rows = $(".list-group").children();
    for (i = 0; i < 15; i++) 
    {
        //Extracting the child nodes to fill the data from the JSON
        var childElements = rows[i].children;
        childElements[0].innerHTML = result[i].publishedAt;
        childElements[1].innerHTML = result[i].title;
        childElements[2].innerHTML = result[i].description;
    }
}

function fillCategory(category)       //Function to update the news category value
{
    if(category == "business")
    {
        $("#category").text("Business News");
    }
    else if(category == "sports")
    {
        $("#category").text("Sports News");
    }
    else
    {
        $("#category").text("Technology News");
    }
}

function getNews(category)           //Display news based on selected category
{
    //Check if News data exists in the array
    fillCategory(category);
    if (category == "business" && businessNews.length != 0) 
    {
        fillListWithNews(businessNews);
        return;
    }
    else if (category == "technology" && techNews.length != 0) {
        fillListWithNews(techNews);
        return;
    }
    else if (category == "sports" && sportsNews.length != 0) {
        fillListWithNews(sportsNews);
        return;
    }
    //URL built based on category that is selected
    var url = "https://newsapi.org/v2/top-headlines?category=" + category + "&country=ie&pageSize=15&apiKey=e1d784cf4dc3487baf2f49e2f694ce3a";
    $.get(url, function (data, status) 
    {
        var resultArr = extractNews(data.articles);
        if (category == "business") 
        {
            businessNews = resultArr;
        }
        else if (category == "technology")
        {
            techNews = resultArr;
        }
        else if (category == "sports") 
        {
            sportsNews = resultArr;
        }
        fillListWithNews(resultArr, category);
    });
}

function createListView()            //Function to create the list view
{
    var i = 0;
    var newsRow = $("a[name=newsRow]");
    for (i = 0; i < 15; i++) 
    {
        //Extracting the child nodes to fill the data from the JSON
        var newElement = newsRow.clone(true);
        newElement.removeClass("d-none");
        newElement.appendTo($(".list-group"));
    }
}

$(document).ready()
{
    //URL to get Top Headlines from Ireland Region
    var url = "https://newsapi.org/v2/top-headlines?country=ie&pageSize=15&apiKey=e1d784cf4dc3487baf2f49e2f694ce3a";
    $.get(url, function (data, status) {
        var resultArr = extractNews(data.articles);
        createListView();
        fillListWithNews(resultArr);
    });
}