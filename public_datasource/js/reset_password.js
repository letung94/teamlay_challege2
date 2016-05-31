$(document).ready(function() {
    // validate register form on keyup and sumit
    $("#form-reset-password").validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            password: {
                required: true,
                minlength: 5
            },
            repeat_password: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            }
        },
        messages: {
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            repeat_password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long",
                equalTo: "Please enter the same password as above"
            }
        },
    });
    $('#submit').click(function() {
        /*$('#form-register').submit();
        return false;*/
        var validator = $('#form-reset-password').valid();
        console.log(validator);
        return false;
        // event.preventDefault();
    });

})