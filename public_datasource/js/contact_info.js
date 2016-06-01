var preview = document.getElementById('preview');
var del_avatar = $("#del_avatar");
var loadFile = function(event) {
    var limitsize = 5242880;
    var reader = new FileReader();
    var avatar = event.target.files[0];
    var validimage = validateImage(avatar);
    if(!validimage){
        $(".validimg").css('display','inline');
    }else{
        $(".validimg").css('display','none');
    }
    if(limitsize < avatar.size){
        $(".sizeimg").css('display','inline');
    }else{
        $(".sizeimg").css('display','none');
        reader.readAsDataURL(avatar);
        reader.addEventListener("load",function(){
            preview.src = reader.result;
            del_avatar.css("opacity","1");
        },false);
    }
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

$('#option').on('click','#del_avatar',function(){
    preview.src = contact_info.attribute.Avatar;
    del_avatar.css("opacity","0");
    $("#avatar")[0].value = '';
});

//================================= VALIDAZIONE FORM
$(document).ready(function() {
    $.validator.addMethod('avatarimg',function(value,element){
           return true;
    },"loi loi");
    
    $('#validation_form_contact_info').validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            firstname: {
                required: true,
                minlength:1,
                maxlength:49
            },
            lastname: {
                required: true,
                minlength:1,
                maxlength:49
            },
            email: {
                required: true,
                email: true
            },
            phone:{
                required: true,
                phone:true
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
                email: "Please enter a valid email address."
            },
            phone:{
                required: "Please enter your phone.",
                phone: "Please enter a valid phone address."
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

$('#btnSaveContact_Info').click(function() {
    var validator = $('#validation_form_contact_info').valid();
    var validimage = validateImage($("input[type='file']#avatar")[0].files[0]);
    if(!validimage){
        $(".validimg").css('display','inline');
    }else{
        $(".validimg").css('display','none');
    }
    if(validator&validimage){
        var temp = {
            FirstName:$("input[name='firstname']").val(),
            LastName:$("input[name='lastname']").val(),
            Avatar: $("#preview").attr('src'),
            Email:$("input[name='email']").val(),
            Phone:$("input[name='phone']").val(),
            Website:$("input[name='website']").val(),
            Address:$("input[name='address']").val(),
            CV_Id:$("input[name='idcv']").val(),
        };
        var save_contact_info = new Contact_Info(temp);
        var urlpost = window.location.href + '/contact_info/save';
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
                showAnnoucement(res.flag);
                contact_info = null;
                contact_info = new Contact_Info(res.resdata.attribute);
                $("#del_avatar").css("opacity","0");
                $("#avatar")[0].value = '';
                //console.log(res);
            },
            error: function(x,e){
                
            }
        });
    }
    
    return false;
    
});



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
});