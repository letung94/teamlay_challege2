$('#btnSubmit').prop('disabled',true);
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
var fieldvalid_max = 5;
var curr_fieldvalid = 1;
var contact_info_validate = new Contact_Info_Validate();
var preview = document.getElementById('preview');
var del_avatar = $("#del_avatar");
var loadFile = function(event) {
    var limitsize = 5*1024*1024;
    var reader = new FileReader();
    var imgfile = event.target.files[0];
    alert(imgfile.size);
    reader.readAsDataURL(imgfile);
    reader.onload = function(){
        preview.src = reader.result;
        del_avatar.css("opacity","1");
    };
};

$("input").change(function() {
    contact_info["FirstName"]=$("input[name='firstname']").val();
    contact_info["LastName"]=$("input[name='lastname']").val();
    contact_info["Avatar"]= $("#preview").attr('src');
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
});

$('#btnSubmit').click(function() {
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