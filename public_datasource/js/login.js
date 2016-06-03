$(document).ready(function() {
    // validate register form on keyup and sumit
    $("#form-login").validate({
        errorClass: 'text-danger',
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            },
        },
        messages: {
            username: {
                required: "Please enter your username"
            },
            password: {
                required: "Please enter your password"
            }
        }
    });
    $('#submit').click(function() {
        var validator = $('#form-login').valid();
        if (validator) {
            console.log(validator);
            console.log('login !');
            $('#form-login').submit();
        } else {
            return false;
        }
    });

})