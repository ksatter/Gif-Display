// create array of topics
var topics = ["Zoe", "Wash", "Mal"];

// create button for each topic
function createButtons(){
    // empty button dic=v
    $("#buttons").empty();
    // for each item in topic array
    for (var i = 0; i < topics.length; i++) {
        var currentTopic = topics[i];
        // create button
        var newTopic = $("<button>", {class: "btn btn-primary topic"});
        newTopic.attr('data-query', currentTopic);
        newTopic.attr('id', 'button-'+ i);
        newTopic.text(currentTopic);
        $("#buttons").append(newTopic);
    }
}

//convert string to title case. Tried writing this myself, but kept running in to roadblocks
/*
* To Title Case 2.1 – http://individed.com/code/to-title-case/
* Copyright © 2008–2013 David Gouch. Licensed under the MIT License.
*/
String.prototype.toTitleCase = function(){
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
        if (index > 0 && index + match.length !== title.length &&
            match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
            (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
            title.charAt(index - 1).search(/[^\s-]/) < 0) {
            return match.toLowerCase();
        }

        if (match.substr(1).search(/[A-Z]|\../) > -1) {
            return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};
//query giphy API for results and display still images
function getGifs(data) {
    var topic = data;
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=firefly+" +
        topic + "&api_key=8290122d62df4b59927f29b3184cca8f";
    // get results from giphy
    $.ajax({
        url: queryURL,
        method: "GET"
        // when results received
    }).done(function(response){
        var results = response.data;
        console.log(results);
        // empty results Div
        $("#results").empty();
        // write 10 responses to page (I chose to do this rather than limit the results so that there would be a little bit                 of variety)
        var used = [];
        for (var i = 0; i < 10;) {
            var random = Math.floor(Math.random() * 25);
            if (used.indexOf(random) < 0) {
                used.push(random);
                i++;
                //create card for image
                var newCard = $("<div>", {class: "card"});
                //create image
                var newImage = $("<img>", {class: "card-img-top img-fluid gif"});
                newImage.attr('src', results[random].images.original_still.url);
                newImage.attr('data-still', results[random].images.original_still.url);
                newImage.attr('data-animate', results[random].images.original.url);
                newImage.attr('data-state', 'still');
                newImage.attr('alt', topic);
                newImage.attr("id", "image-" + topic + i);
                //create ovelay
                var newOverlay = $("<div>", {class: "overlay"});
                newOverlay.attr("id", topic + i);
                var newIcon = $("<span>", {class: "glyphicon glyphicon-play"});
                newIcon.attr("id", "icon-" + topic + i);
                newOverlay.append(newIcon);
                // create caption
                var newBlock = $("<div>", {class: 'card-block'});
                var newCaption = $("<p>", {class: "card-text"});
                newCaption.text("Rating: " + results[random].rating);
                // append image
                newCard.append(newImage);
                newCard.append(newOverlay);
                newBlock.append(newCaption);
                newCard.append(newBlock);
                $("#results").append(newCard)
            }
        }
    });
}
$(document).ready(function() {

    createButtons();
    getGifs("ship");
    // when button is pushed,
    $(document).on("click", ".topic", function() {
        //create query url
        getGifs($(this).attr('data-query'));
    });
    //play and pause gifs
    $(document).on("click", ".overlay", function() {
        console.log($(this).attr("id"));
        var image = $("#image-" + $(this).attr("id"));
        var icon = $("#icon-" + $(this).attr("id"));
        var state = $(image).attr("data-state");
        console.log(image)
        // plsy
        if (state === "still"){
            $(image).attr("src", $(image).attr("data-animate"));
            $(image).attr("data-state", "animate");
            $(icon).attr("class", "glyphicon glyphicon-stop")
        }
        // pause
        else if (state === "animate"){
            $(image).attr("src", $(image).attr("data-still"));
            $(image).attr("data-state", "still");
            $(icon).attr("class", "glyphicon glyphicon-play")
        }
    });
    //add topic to list from search bar
    $(document).on("click", "#new-topic", function() {
        event.preventDefault();
        // retrieve input from text field
        var newTopic = $(".form-control").val().toTitleCase();
            console.log(newTopic);
        // verify that there is a search term and it is not already in topics
        if (newTopic && topics.indexOf(newTopic) < 0) {
            //add search to topics
            topics.push(newTopic);
            // re-write buttons
            createButtons();
            // display results for search term
            $("#buttons button:last-child").click();
        }
        // if search term already in topics list, display results
        else if (topics.indexOf(newTopic) >= 0) {
            $("#button-" + topics.indexOf(newTopic)).click();
        }
        //empty search input
        $(".form-control").val("")
    });
    //enable searching by hitting enter key
    $(document).on("keyup", "#form-input", function () {
        // if enter key hit
        if (event.which === 13) {
            //run search
            $("#new-topic").click();
        }
    });
});