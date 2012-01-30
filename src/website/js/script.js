$(document).ready(function() {
    //Returns time, HH:mm:ss
    //There should be a builtin for formatting somewhere...
    function getTime() {
        function prependZero(number) {
            if (number > 9) {
                return number;
            }
            else {
                return '0' + number;
            }
        }
        var now = new Date();
        return prependZero(now.getHours()) + ':' + 
               prependZero(now.getMinutes()) + ':' + 
               prependZero(now.getSeconds());
    }

    //lets the user submit a hash to the server
    $("#submission").submit(function(event) {
        event.preventDefault(); //don't submit the form
        var $form =  $(this), 
            submit = $form.find('input[name="input"]').val(),
            url =    $form.attr('action');
        $.post(url, {input: submit});
    }); //end submission

    //loads the new hash on a change
    function longPoll() {
        $.ajax({
            url: 'longPoll',
            cache: false,
            dataType: 'text',
            complete: longPoll,
            timeout: 30000, //timeout after 30 seconds, reconnect
            success: function(data) {
                $("#hash").prepend('(', getTime(), ') ', data, '\n');
            }
        });
    }; //end longPoll()

    longPoll();

});

