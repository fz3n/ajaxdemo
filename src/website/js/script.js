$(document).ready(function() {

    //lets the user submit a hash to the server
    $("#submission").submit(function(event) {
        event.preventDefault(); //don't submit the form
        var $form =  $(this), 
            submit = $form.find('input[name="input"]').val(),
            url =    $form.attr('action');
        $.post(url, {input: submit});
    });

    //gets the hash the first time, before it changes
    function retrieve() {
        $.ajax({
            url: 'retrieve',
            dataType: 'text',
            success: function(data) {
                $("#hash").val(data);
            }
        });
    }

    //loads the hash on a change
    function longPoll() {
        $.ajax({
            url: 'longPoll',
            dataType: 'text',
            success: function(data) {
                $("#hash").val(data);
                longPoll();
            },
            error: function() {
                //if there is an error, wait 5 seconds and try again
                setTimeout(longPoll, 5 * 1000);
            }
        });
    }
    window.onload = function() {
        retrieve();
        longPoll();
    }

});

