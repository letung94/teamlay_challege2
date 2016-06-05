$(document).ready(function() {
    // validate register form on keyup and sumit
    $("#form-change-password").validate({
        errorClass: 'text-danger',
        rules: {
            old_pass: {
                required: true,
                minlength: 6
            },
            new_pass: {
                required: true,
                minlength: 6
            },
            repeat_password: {
                required: true,
                equalTo: "#new_pass"
            }
        },
        messages: {
            old_pass: {
                required: "Please provide your old password",
                minlength: "Your password must be at least 6 characters long"
            },
            new_pass: {
                required: "Please provide your new password",
                minlength: "Your password must be at least 6 characters long"
            },
            repeat_password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long",
                equalTo: "Please enter the same password as above"
            }
        },
    });
    $('#submit').click(function() {
        var validator = $('#form-change-password').valid();
        if (validator) {
            $('#form-change-password').submit();
        } else {
            return false;
        }
    });
})