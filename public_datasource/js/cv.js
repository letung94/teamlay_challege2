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
                $('#contact_info-form #btnSubmit').prop('disabled',false);
                $("#contact_info-form input[name='firstname']").val(contact_info.attribute.FirstName);
                $("#contact_info-form input[name='lastname']").val(contact_info.attribute.LastName);
                //must to public file;
                $("#contact_info-form #preview").attr('src',contact_info.attribute.Avatar);
                $("#contact_info-form input[name='email']").val(contact_info.attribute.Email);
                $("#contact_info-form input[name='phone']").val(contact_info.attribute.Phone);
                $("#contact_info-form input[name='website']").val(contact_info.attribute.Website);
                $("#contact_info-form input[name='address']").val(contact_info.attribute.Address);
                
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

function showAnnoucement(flag, section, action){
    section = section.toLowerCase();
    action = action.toLowerCase();
    if(flag==1){
        $.gritter.add({
        title: 'Success',
        text: 'Your ' + section + ' has been ' + action + '!',
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
