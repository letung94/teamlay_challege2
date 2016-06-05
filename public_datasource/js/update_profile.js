$(document).ready(function() {
    // validate register form on keyup and sumit
    $("#form-update-profile").validate({
        errorClass: 'text-danger',
        rules: {
            firstname: {
                required: true,
                minlength: 1,
                maxlength: 50
            },
            lastname: {
                required: true,
                minlength: 1,
                maxlength: 50
            }
        },
        messages: {
            firtname: {
                required: "Please provide your first name",
                minlength: "Your first name must be between 1 and 50 characters in length",
                maxlength: "Your first name must be between 1 and 50 characters in length"
            },
            lastname: {
                required: "Please provide your last name",
                minlength: "Your last name must be between 1 and 50 characters in length",
                maxlength: "Your last name must be between 1 and 50 characters in length"
            }
        },
    });
    $('#submit').click(function() {
        var validator = $('#form-update-profile').valid();
        if (validator) {
            $('#form-update-profile').submit();
        } else {
            return false;
        }
    });
})