$(document).ready(function() {
    // validate register form on keyup and sumit
    $("#form-login").validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            username: {
                required: true,
                minlength: 1
            },
            password: {
                required: true,
                minlength: 5
            },
        },
        messages: {
            username: {
                required: "Please enter your username",
                minlength: "Your username must consist of at least 1 character"
            },
            password: {
                required: "Please enter your password",
                minlength: "Your password must be at least 5 characters long"
            }
        },
    });
    $('#submit').click(function() {
        /*$('#form-register').submit();
        return false;*/
        var validator = $('#form-login').valid();
        console.log(validator);
        return false;
        // event.preventDefault();
    });

})