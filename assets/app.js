$(document).ready(function() {
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
            newTopic.text(currentTopic);
            $("#buttons").append(newTopic);
        }
    }
    // when button is pushed, query giphy API for results and display still images
    $(document).on("click", ".topic", function() {
        //create query url
        var topic = $(this).attr('data-query');
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=firefly+" +
            topic + "&api_key=8290122d62df4b59927f29b3184cca8f";
        // get results from giphy
        $.ajax({
            url: queryURL,
            method: "GET"
        // when results received
        }).done(function(response){
            var results = response.data;
            // empty results Div
            $("#results").empty();
            // write 10 responses to page (I chose to do this rather than limit the results so that there would be a little bit                 of variety)
            var used = [];
            for (var i = 0; i < 10;) {
                var random = Math.floor(Math.random() * 25);
                if (used.indexOf(random) < 0) {
                    used.push(random);
                    i++;
                    console.log(random);
                    //create card for image
                    var newCard = $("<div>", {class: "card"});
                    //create image
                    var newImage = $("<img>", {class: "card-img-top img-fluid gif"});
                    newImage.attr('src', results[random].images.fixed_width_still.url);
                    newImage.attr('data-still', results[random].images.fixed_width_still.url);
                    newImage.attr('data-animate', results[random].images.fixed_width.url);
                    newImage.attr('data-state', 'still');
                    newImage.attr('alt', topic);
                    // create caption
                    var newBlock = $("<div>", {class: 'card-block'});
                    var newCaption = $("<p>", {class: "card-text"});
                    newCaption.text("Rating: " + results[random].rating);
                    // append image
                    newCard.append(newImage);
                    newBlock.append(newCaption);
                    newCard.append(newBlock);
                    $("#results").append(newCard)
                }
            }
        });
    });
    //play and pause gifs
    $(document).on("click", ".gif", function() {
        var state = $(this).attr("data-state");
        // plsy
        if (state === "still"){
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        }
        // pause
        else if (state === "animate"){
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });
    //add topic to list
    $(document).on("click", "#new-topic", function() {
        // retrieve input from text field
        var newTopic = $('#form-input').val();
        // clear text field
        $('#form-input').val("");

        topics.push(newTopic);
        createButtons()
        //check that input is valid
    });
    $(document).on("keyup", "#form-input",function () {
        if (event.which === 13) {
            $("#new-topic").click();
            $("#buttons button:last-child").click()
        }
    });


    createButtons();
    console.log(topics)
})