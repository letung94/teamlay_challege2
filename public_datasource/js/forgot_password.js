$(document).ready(function() {
    // validate register form on keyup and sumit
    $("#form-forgot-password").validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {}

    });
    $('#submit').click(function() {
        /*$('#form-register').submit();
        return false;*/
        var validator = $('#form-forgot-password').valid();
        console.log(validator);
        return false;
        // event.preventDefault();
    });

})