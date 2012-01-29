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
    }; //end retrieve()

    //loads the new hash on a change
    function longPoll() {
        $.ajax({
            url: 'longPoll',
            dataType: 'text',
            complete: longPoll,
            timeout: 30000,
            success: function(data) {
                $("#hash").val(data);
            },
            error: retrieve
        });
    }; //end longPoll()

    retrieve();
    longPoll();

});

