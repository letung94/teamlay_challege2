var preview = document.getElementById('preview');
var del_avatar = $("#del_avatar");
var loadFile = function(event) {
    var limitsize = 5*1024*1024;
    var reader = new FileReader();
    var imgfile = event.target.files[0];
    reader.readAsDataURL(imgfile);
    reader.onload = function(){
        preview.src = reader.result;
        del_avatar.css("opacity","1");
    };
    
    
};
$('#option').on('click','#del_avatar',function(){
    preview.src = "/img/default_avatar.jpg";
    del_avatar.css("opacity","0");
});
$('#btnSubmit').click(function() {
    /*`Id` INT(11) NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(50) NULL DEFAULT NULL,
    `LastName` VARCHAR(50) NULL DEFAULT NULL,
    `Avatar` VARCHAR(255) NULL DEFAULT NULL,
    `Email` VARCHAR(50) NULL DEFAULT NULL,
    `Phone` VARCHAR(13) NULL DEFAULT NULL,
    `Website` VARCHAR(100) NULL DEFAULT NULL,
    `Address` VARCHAR(255) NULL DEFAULT NULL,
    `CV_Id` INT(11) NOT NULL*/
    var contact_info = {
        "FirstName":$("input[name='firstname']").val(),
        "LastName":$("input[name='lastname']").val(),
        "Avatar":$("#preview").attr('src'),
        "Email":$("input[name='email']").val(),
        "Phone":$("input[name='phone']").val(),
        "Website":$("input[name='website']").val(),
        "Address":$("input[name='address']").val(),
        "CV_Id": $("input[name='idcv']").val()
    }
    var urlpost = '/cv/'+contact_info.CV_Id + '/contact_info/save';
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