$(document).ready(function() {
    $('#show-term-and-condition').click(function(){
        BootstrapDialog.show({
            title: 'Terms of Service',
            message: $('#term-and-condition').html() || ''
        });
    })

    $.validator.addMethod("regex", function(value, element, regexpr) {
        var patt = new RegExp(regexpr);
        return patt.test(value);
    }, "Wrong Regular Expression.");
    // validate register form on keyup and sumit
    $("#form-register").validate({
        errorClass: 'text-danger',
        rules: {
            firstname: {
                regex: '^[a-zA-Z ]{1,500}$',
                minlength:1,
                maxlength:50,
                required: true,
            },
            lastname: {
                regex: '^[a-zA-Z ]{1,500}$',
                minlength:1,
                maxlength:50,
                required: true
            },
            username: {
                regex: '^[_.a-zA-Z1-9]{1,500}$',
                required: true,
                minlength: 6
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
            firstname: {
                required: "Please enter your firstname",
                minlength:"Your firstname must consist of at least 1 character.",
                maxlength:"Your firstname must consist of less than 50 characters.",
                regex: 'Alphabet only'
            },
            lastname: {
                required: "Please enter your lastname",
                minlength:"Your lastname must consist of at least 1 character.",
                maxlength:"Your lastname must consist of less than 50 characters.",
                regex: 'Alphabet only'
            },
            username: {
                required: "Please enter a username",
                minlength: "Your username must consist of at least 6 character",
                regex: 'Username can only contain letter number "." and "_".'
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
            accept: "Please accept our policy"
        },
        errorPlacement: function(error, element) {
            // console.log(error);
            if (element.attr("name") == "accept") {
                error.insertAfter("#accept_error-message");
            } else {
                error.insertAfter(element);
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
        var validator = $('#form-register').valid();
        if (validator) {
            console.log(validator);
            console.log('register !');
            $('#form-register').submit();
        } else {
            return false;
        }
    });

})
