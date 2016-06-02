$(document).ready(function() {
    $('#validation_form_education').validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            "institute": {
                required: true,
                minlength:5
            }
        },
        messages: {
            institute: {
                required: "Please enter your institute.",
                minlength:"Must be 5 characters."
            }
        },
        errorElement: "div",
        errorPlacement: function(error, element) {
            console.log("test");
            if (element.attr("name") == "accept")  {
                error.insertAfter("#accept_error-message");
            }else {
                error.insertAfter(element);
            }
        }
    });
});

$('#btnAddListEdu').click(function() {
    var validator = $('#validation_form_education').valid();
    console.log(validator);
    // if(validator){
    //     contact_info["FirstName"]=$("input[name='firstname']").val();
    //     contact_info["LastName"]=$("input[name='lastname']").val();
    //     contact_info["Avatar"]= $("#preview").attr('src');
    //     contact_info["Email"]=$("input[name='email']").val();
    //     contact_info["Phone"]=$("input[name='phone']").val();
    //     contact_info["Website"]=$("input[name='website']").val();
    //     contact_info["Address"]=$("input[name='address']").val();
    //     contact_info["CV_Id"]=$("input[name='idcv']").val();
    //     var urlpost = window.location.href + '/contact_info/save';
    //     $.ajax({
    //         type: "POST",
    //         /*the url where you want to sent the userName and password to*/
    //         url: urlpost,
    //         dataType: 'json',
    //         async: false,
    //         contentType: 'application/json; charset=utf-8',
    //         /*json object to sent to the authentication url*/
    //         data: JSON.stringify(contact_info),
    //         success: function (res) {
    //             console.log(res);
    //         },
    //         error: function(x,e){
                
    //         }
    //     });
    // }
    
    // return false;
    
});



