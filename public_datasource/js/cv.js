$(function() {
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
                $('#btnSubmit').prop('disabled',false);
                $("input[name='firstname']").val(res.resdata.FirstName);
                $("input[name='lastname']").val(res.resdata.LastName);
                //must to public file;
                $("#preview").attr('src',res.resdata.Avatar);
                $("input[name='email']").val(res.resdata.Email);
                $("input[name='phone']").val(res.resdata.Phone);
                $("input[name='website']").val(res.resdata.Website);
                $("input[name='address']").val(res.resdata.Address);
                //$("#validation-form").validate().form();
                var a = 10;
            }else{
                if(res.flag == 0 || res.flag == -1){
                    $('#btnSubmit').prop('disabled',true);
                }
            }
        },
        error: function(x,e){
            
        }
    });
});

var contact_info = {
        "FirstName":"",
        "LastName":"",
        "Avatar":"",
        "Email":"",
        "Phone":"",
        "Website":"",
        "Address":"",
        "CV_Id": 0
}
var contact_info_validate = new Contact_Info_Validate();
var preview = document.getElementById('preview');
var del_avatar = $("#del_avatar");
var loadFile = function(event) {
    var limitsize = 3*1024*1024;
    var reader = new FileReader();
    var imgfile = event.target.files[0];
    if(limitsize < imgfile.size){
        $("span.filesize").css('display','inline');
    }else{
        $("span.filesize").css('display','none');
        reader.readAsDataURL(imgfile);
        reader.addEventListener("load",function(){
            preview.src = reader.result;
            del_avatar.css("opacity","1");
        },false);
    }
};

$("input").change(function() {
    contact_info["FirstName"]=$("input[name='firstname']").val();
    contact_info["LastName"]=$("input[name='lastname']").val();
    contact_info["Avatar"]= $("input[type='file']#avatar")[0].files[0];
    contact_info["Email"]=$("input[name='email']").val();
    contact_info["Phone"]=$("input[name='phone']").val();
    contact_info["Website"]=$("input[name='website']").val();
    contact_info["Address"]=$("input[name='address']").val();
    contact_info["CV_Id"]=$("input[name='idcv']").val();
    
    var valid = true;
    var attr_length = contact_info_validate.attrvalidate.length; 
    for(var i = 0; i < attr_length; i++){
        if(contact_info_validate.attrvalidate[i].validate != null){
            valid  &= contact_info_validate.attrvalidate[i].validate(contact_info[contact_info_validate.attrvalidate[i].attrname]);
        }
    }
    if(valid){
        $('#btnSubmit').prop('disabled',false);
    }else{
        $('#btnSubmit').prop('disabled',true);
    }
});


$('#option').on('click','#del_avatar',function(){
    preview.src = "/img/default_avatar.jpg";
    del_avatar.css("opacity","0");
    $("#avatar")[0].value = '';
});

$('#btnSubmit').click(function() {
    contact_info["FirstName"]=$("input[name='firstname']").val();
    contact_info["LastName"]=$("input[name='lastname']").val();
    contact_info["Avatar"]= $("#preview").attr('src');
    contact_info["Email"]=$("input[name='email']").val();
    contact_info["Phone"]=$("input[name='phone']").val();
    contact_info["Website"]=$("input[name='website']").val();
    contact_info["Address"]=$("input[name='address']").val();
    contact_info["CV_Id"]=$("input[name='idcv']").val();
    var urlpost = window.location.href + '/contact_info/save';
    $.ajax({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: urlpost,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        //json object to sent to the authentication url
        data: JSON.stringify(contact_info),
        success: function (res) {
            console.log(res);
        },
        error: function(x,e){
            
        }
    });
});