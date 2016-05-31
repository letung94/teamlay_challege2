$(document).ready(function() {
    $('#validation_form_education').validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            institute: {
                required: true
            }
        },
        messages: {
            institute: {
                required: "Please enter your institute."
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "accept")  {
                error.insertAfter("#accept_error-message");
            }else {
                error.insertAfter(element);
            }
        }
    });
});



