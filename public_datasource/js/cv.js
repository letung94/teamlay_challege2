//var $validation_form_contact_info = $('#validation_form_contact_info');
$(function() {
    //validation
    var validate_contact_info = validateContact_Info("#validation_form_contact_info");
    var validate_exp = validateContact_Info("#validation_form_exp");
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
                var validator = $( "#validation_form_contact_info" ).validate();
                validator.resetForm();
            }else{
                //|| res.flag == -1
                if(res.flag == 0 ){
                    $('#btnSubmit').prop('disabled',true);
                }
            }
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
    var limitsize = 5242880;
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
        $('#btnSaveContact_Info').prop('disabled',false);
    }else{
        $('#btnSaveContact_Info').prop('disabled',true);
    }
});


$('#option').on('click','#del_avatar',function(){
    preview.src = "/img/default_avatar.jpg";
    del_avatar.css("opacity","0");
    $("#avatar")[0].value = '';
});

$('#btnSaveContact_Info').click(function() {
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
/*window.onclick = function(){
    modal.style.display = "none";
}*/