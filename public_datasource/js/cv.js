//var $validation_form_contact_info = $('#validation_form_contact_info');
function Contact_Info(attribute) {
    this.attribute = attribute;
}
var contact_info = null;
$(function() {
    var urlget = window.location.href + "/contact_info/get";
    $.blockUI();
    $.ajax({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        //json object to sent to the authentication url /img/default_avatar.jpg
        success: function(res) {
            $.unblockUI();
            if (res.flag == 1) {
                contact_info = new Contact_Info(res.resdata);
                $('#contact_info-form #btnSubmit').prop('disabled', false);
                $("#contact_info-form input[name='firstname']").val(contact_info.attribute.FirstName);
                $("#contact_info-form input[name='lastname']").val(contact_info.attribute.LastName);
                $("#contact_info-form #preview").attr('src', contact_info.attribute.Avatar);
                $("#contact_info-form input[name='email']").val(contact_info.attribute.Email);
                $("#contact_info-form input[name='phone']").val(contact_info.attribute.Phone);
                $("#contact_info-form input[name='website']").val(contact_info.attribute.Website);
                $("#contact_info-form input[name='address']").val(contact_info.attribute.Address);
            }
            if(res.flag == 0){
                contact_info = new Contact_Info(
                    {FirstName: "",
                    LastName: "",
                    Avatar: "/img/default_avatar.jpg",
                    Email: "",
                    Phone: "",
                    Website:"",
                    Address:"",
                    CV_Id:0
                }
                );
            }
        },
        error: function(x, e) {

        }
    });
});

function showAnnoucement(flag, section, action) {
    section = section.toLowerCase();
    action = action.toLowerCase();
    if (flag == 1) {
        $.gritter.add({
            title: 'Success',
            text: 'Your ' + section + ' has been ' + action + '!',
            sticky: false,
            time: '1500'
        });
    } else {
        if (flag == 0) {
            $.gritter.add({
                title: 'Human Error',
                text: 'The information is wrong!',
                sticky: false,
                time: '1500'
            });
        } else {
            window.location = ("../error/500");   
        }
    }
}

$('#btnPreviewCV').click(function() {
    var fullUrl = window.location.href;
    var arr = fullUrl.split('/');
    var cv_id = arr[4];
    console.log(arr);
    var url = '/template/template_list/' + cv_id + '/';
    window.open(url, '_blank');
});

function useWysihtml5(nameDetail) {
    $(nameDetail).wysihtml5({
        "font-styles": false,
        "color": false,
        "emphasis": true,
        "lists": false,
        "html": false,
        "link": false,
        "image": false,
    });
}
