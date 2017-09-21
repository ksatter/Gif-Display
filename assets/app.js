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
            topic + "&api_key=8290122d62df4b59927f29b3184cca8f&limit=10";
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
            // write each response to page
            for (var i = 0; i < results.length; i++) {
                //create figure for image
                var newColumn = $("<div>", {class: "col-xs-4 gif-holder"});
                var newFigure = $("<figure>", {class: 'figure'});
                //create image
                var newImage = $("<img>", {class: "figure-img img-fluid gif"});

                newImage.attr('src', results[i].images.fixed_width_still.url);
                newImage.attr('data-still', results[i].images.fixed_width_still.url);
                newImage.attr('data-animate', results[i].images.fixed_width_small.url);
                newImage.attr('data-state', 'still');
                newImage.attr('alt', topic);
                // create caption
                var newCaption = $("<figcaption>", {class: "figure-caption"});
                newCaption.text("Rating: " + results[i].rating );
                // append image
                newColumn.append(newFigure);
                newFigure.append(newImage);
                newFigure.append(newCaption);
                $("#results").append(newColumn)
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