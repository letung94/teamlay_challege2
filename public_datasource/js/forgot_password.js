$(document).ready(function() {
    // validate register form on keyup and sumit
    $("#form-forgot-password").validate({
        errorClass: 'text-danger',
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {

        }

    });
    $('#submit').click(function() {
        var validator = $('#form-forgot-password').valid();
        if (validator) {
            console.log(validator);
            console.log('forgot password !');
            $('#form-forgot-password').submit();
        } else {
            return false;
        }
    });

})