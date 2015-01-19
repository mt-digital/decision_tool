/**
 * The code to append each new county to our list of counties
 */
$(function() {
    // add a new county from text box to the list
    var firstClick = true
    $('#Add').click(function () {
                console.log( "yo" );
                var county = $("#county").val();
                console.log( county );
                if (firstClick) {
                    if (county == "")
                        county = "Latah"

                    $("#counties").text(county);
                    firstClick = false 
                } else {
                    $("#counties").append(", " + county);
                }
            }
        );
    $('#county').keydown( function(e){
        if (e.keyCode == 13) {
           $('#Add').click();
           $(this).select();
        }
    });

    
    $('#Run').click( function() {
            alert("Soon this will run your awesome decision tool on the counties you selected:\n" + $('#counties').text());
        }
    );      
}

);
