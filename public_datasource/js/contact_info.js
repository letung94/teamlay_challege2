var preview = $('#preview');
var del_avatar = $("#del_avatar");
var loadFile = function(event) {
    var reader = new FileReader();
    var avatar = event.target.files[0];
    showInValidImage(avatar);
    reader.readAsDataURL(avatar);
    reader.addEventListener("load",function(){
        preview.attr("src",reader.result);
        del_avatar.css("opacity","1");
    },false);
};

function validateImage(avatar){
    var valid = false;
    var datatype = "image/";
    var maxsize = 5242880;
    if(avatar == undefined){
        valid = true;
    }else{
        var datatypeavatar = avatar.type.substring(0, 6);
        var sizeavatar = avatar.size;
        if(datatype == datatypeavatar && maxsize >= sizeavatar){
            valid = true;
        }
    }
    return valid;
}

function showInValidImage(image,option){
    var settings = {
        datatype: "image/",
        size : 5242880,
        typebool: true,
        sizebool:true
        };
    if(option != undefined && option!=null){
        settings.datatype = option.datatype;
        setting.size = optioin.size;
    }
    var datatypeimage = image.type.substring(0, 6);
    var sizeimage = image.size;
    if(settings.datatype != datatypeimage){
        settings.typebool = false;
    }
    if(settings.size <= sizeimage){
        settings.sizebool = false;
    }
    switchImage(settings.typebool,settings.sizebool);
}
function switchImage(type,size){
    if(type && size){
        $("#contact_info-form .validimg").css('display','none');
        $("#contact_info-form .sizeimg").css('display','none');
    }
    if(!type){
        $("#contact_info-form .validimg").css('display','inline');
    }
    if(!size){
        $("#contact_info-form .sizeimg").css('display','inline');
    }
}

$('#contact_info-form #del_avatar').on('click',function(){
    preview.attr("src",contact_info.attribute.Avatar);
    del_avatar.css("opacity","0");
    $("#contact_info-form #avatar")[0].value = '';
    switchImage(true,true);
});
//================================= VALIDAZIONE FORM
$(document).ready(function() {
    $.validator.addMethod("phone", function (value, element)
    {
        return this.optional(element) || /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/.test(value);
    },
        "Please enter a valid phone."
    );
    
    $('#contact_info-form').validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            firstname: {
                required: true,
                minlength:1,
                maxlength:50
            },
            lastname: {
                required: true,
                minlength:1,
                maxlength:50
            },
            email: {
                required: true,
                maxlength:50,
                email: true
            },
            phone:{
                required: true,
                phone:true
            },
            website:{
                maxlength:100
            },
            address:{
                maxlength:250
            }
        },
        messages: {
            firstname: {
                required: "Please enter your firstname.",
                minlength:"Your username must consist of at least 1 character.",
                maxlength:"Your username must consist of less than 50 characters."
            },
            lastname: {
                required: "Please enter your lastname.",
                minlength:"Your username must consist of at least 1 character.",
                maxlength:"Your username must consist of less than 50 characters."
            },
            email: {
                required: "Please enter your email.",
                maxlength:"Your email must consist of less than 50 characters.",
                email: "Please enter a valid email address."
            },
            phone:{
                required: "Please enter your phone.",
                phone: "Please enter a valid phone address."
            },
            website:{
                maxlength:"Your website must consist of less than 100 characters."
            },
            address:{
                maxlength:"Your address must consist of less than 250 characters."
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

$('#contact_info-form #btnSaveContact_Info').click(function() {
    var validator = $('#contact_info-form').valid();
    var validimage = validateImage($("#contact_info-form input[type='file']#avatar")[0].files[0]);
    if(!validimage){
        $("#contact_info-form .validimg").css('display','inline');
    }else{
        $("#contact_info-form .validimg").css('display','none');
    }
    if(validator&validimage){
        var temp = {
            FirstName:$("#contact_info-form input[name='firstname']").val(),
            LastName:$("#contact_info-form input[name='lastname']").val(),
            Avatar: $("#contact_info-form #preview").attr('src'),
            Email:$("#contact_info-form input[name='email']").val(),
            Phone:$("#contact_info-form input[name='phone']").val(),
            Website:$("#contact_info-form input[name='website']").val(),
            Address:$("#contact_info-form input[name='address']").val(),
            CV_Id:$("#contact_info-form input[name='idcv']").val(),
        };
        var save_contact_info = new Contact_Info(temp);
        var urlpost = window.location.href + '/contact_info/save';
         $.blockUI();
        $.ajax({
            type: "POST",
            /*the url where you want to sent the userName and password to*/
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            /*json object to sent to the authentication url*/
            data: JSON.stringify(save_contact_info.attribute),
            success: function (res) {
                $.unblockUI();
                /*
                //showAnnoucement(flag, section, action)
                */
                showAnnoucement(res.flag,'contact information', 'saved');
                if(res.flag == 1){
                    contact_info = null;
                    contact_info = new Contact_Info(res.resdata.attribute);
                    $("#del_avatar").css("opacity","0");
                    $("#avatar")[0].value = '';
                }
                //console.log(res);
            },
            error: function(x,e){
                
            }
        });
    }
    
    return false;
    
});


/*
// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('preview');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    modalImg.alt = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.style.display = "none";
}


$(document).ready(function(){
   $('div.container').click(function(e){
       if(e.target.id != "preview"){
           modal.style.display =  "none"; 
       }
   });
});*/

// Get the modal
var modal = $('#myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = $('#preview');
var modalImg = $("#img01");
img.click(function(){
    modal.css("display","block");
    modalImg.attr("src",this.src);
    modalImg.attr("alt",this.alt);
});

// Get the <span> element that closes the modal
var span = $(".close");

// When the user clicks on <span> (x), close the modal
span.click(function(){
    modal.css("display","none");
});


$(document).ready(function(){
   $('div.container').click(function(e){
       if(e.target.id != "preview"){
           modal.css("display","none"); 
       }
   });
});