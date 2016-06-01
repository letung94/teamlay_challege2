//var $validation_form_contact_info = $('#validation_form_contact_info');
function Contact_Info(attribute){
    this.attribute = attribute;
}
var contact_info = null;
$(function() {
    //validation
    //var validate_contact_info = validateContact_Info("#validation_form_contact_info");
    //var validate_exp = validateContact_Info("#validation_form_exp");
    var urlget = window.location.href + "/contact_info/get";
    $.ajax({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        //json object to sent to the authentication url
        success: function (res) {
            if(res.flag == 1){
                contact_info = new Contact_Info(res.resdata);
                $('#btnSubmit').prop('disabled',false);
                $("input[name='firstname']").val(contact_info.attribute.FirstName);
                $("input[name='lastname']").val(contact_info.attribute.LastName);
                //must to public file;
                $("#preview").attr('src',contact_info.attribute.Avatar);
                $("input[name='email']").val(contact_info.attribute.Email);
                $("input[name='phone']").val(contact_info.attribute.Phone);
                $("input[name='website']").val(contact_info.attribute.Website);
                $("input[name='address']").val(contact_info.attribute.Address);
                
                /*var validator = $( "#validation_form_contact_info" ).validate();
                validator.resetForm();*/
            }/*else{
                //|| res.flag == -1
                if(res.flag == 0 ){
                    $('#btnSubmit').prop('disabled',true);
                }
            }*/
        },
        error: function(x,e){
            
        }
    });
    
    
});

// function validation
function validateContact_Info(validid){
    if (jQuery().validate) {
    var removeSuccessClass = function(e) {
        $(e).closest('.form-group').removeClass('has-success');
    }
    //'#validation_form_contact_info'
    var $validation_form_contact_info = $(validid);
    $validation_form_contact_info.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else if (element.next('.chosen-container').length) {
                error.insertAfter(element.next('.chosen-container'));
            } else {
                error.insertAfter(element);
            }
        },
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",

        invalidHandler: function (event, validator) { //display error alert on form submit              
            var el = $(validator.errorList[0].element);
            if ($(el).hasClass('chosen')) {
                $(el).trigger('chosen:activate');
            } else {
                $(el).focus();
            }
        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change dony by hightlight
            $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
            setTimeout(function(){removeSuccessClass(element);}, 3000);
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
        }
    });
    return $validation_form_contact_info;
}
return null;
}

function showAnnoucement(flag){
    if(flag==1){
                    $.gritter.add({
                    title: 'Success',
                    text: 'Your contact information has been saved!',
                    sticky: false,
                    time: '1500' 
                    });
                }else{
                    if(flag==0){
                        $.gritter.add({
                        title: 'Human Error',
                        text: 'The information is wrong!',
                        sticky: false,
                        time: '1500' 
                        });
                    }else{
                        $.gritter.add({
                        title: 'Server Error',
                        text: 'The server is not working now. Sorry Opps!',
                        sticky: false,
                        time: '1500' 
                        });
                    }
                }
}
