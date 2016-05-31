$(document).ready(function() {
    // validate register form on keyup and sumit
    $("#form-register").validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            firstname: {
                required: true
            },
            lastname: {
                required: true
            },
            username: {
                required: true,
                minlength: 1
            },
            password: {
                required: true,
                minlength: 5
            },
            repeat_password: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            },
            accept: {
                required: true
            }
        },
        messages: {
            firstname: "Please enter your firstname",
            lastname: "Please enter your lastname",
            username: {
                required: "Please enter a username",
                minlength: "Your username must consist of at least 1 character"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your username must be at least 5 characters long"
            },
            repeat_password: {
                required: "Please provide a password",
                minlength: "Your username must be at least 5 characters long",
                equalTo: "Please enter the same password as above"
            },
            accept: {
                required: "Please accept our policy"
            }
        }
    });
    // propose username by combining first- and lastname
    $("#username").focus(function() {
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        if (firstname && lastname && !this.value) {
            this.value = firstname + "." + lastname;
        }
    });
    $('#submit').click(function() {
        /*$('#form-register').submit();
        return false;*/
        var validator = $('#form-register').valid();
        console.log(validator);
        return false;
        // event.preventDefault();
    });

})