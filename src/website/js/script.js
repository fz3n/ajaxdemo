$(document).ready(function() {
    $("#submission").submit(function(event) {
        event.preventDefault(); //don't submit the form
        var $form =  $(this), 
            submit = $form.find('input[name="input"]').val(),
            url =    $form.attr('action');
        
        $.post(url, {input: submit},
           function(data) {
               $("#hashes").val(submit);
        ;});
    });

    window.onload = function() {
        function retrieve() {
            $.ajax({
                url: 'retrieve',
                dataType: 'text',
                success: function(data) {
                    $("#hash").val(data);
                }
            });
        }
        retrieve();

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
                    setTimeout(longPoll, 5*1000);
                }
            });
        }
        longPoll();
    }

});

