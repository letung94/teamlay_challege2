$(document).ready(function() {
    useWysihtml5("#summary-form textarea[name='prosummary']");
    $('#summary-form').validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            headline: {
                maxlength:50
            }
        },
        messages: {
            headline: {
            maxlength: "Headline of your summary must consist of less than 50 characters"
        }
    }
    })
})
/*Get summary of CV */
var clickedSummary = false;
function getSummary(){
    if(clickedSummary==true){
        return;
    }
    var urlget = window.location.href + "/summary/get";
    $.ajax({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        //json object to sent to the authentication url
        success: function (res) {  
            if(res.flag==1){
              clickedSummary = true; 
                $("#summary-form input[name='headline']").val(res.resdata.Headline);
                $("#summary-form textarea[name='prosummary']").data('wysihtml5').editor.setValue(res.resdata.ProfessionalSummary);
                } 
            },
        error: function(x,e){
       
        }
    });
};

var summary = {
        "Headline":"",
        "ProfessionalSummary":"",
        "CV_Id": 0
}
       
$('#btnSaveSummary').click(function() {
        var validator = $('#validation_form_summary').valid();
        if(validator){
        summary["Headline"]=$("#summary-form input[name='headline']").val();
        summary["ProfessionalSummary"]=$("#summary-form textarea[name='prosummary']").val();
        summary["CV_Id"]=$("#summary-form input[name='idcv']").val();
        var urlpost = window.location.href + '/summary/save';
        $.ajax({
            type: "POST",
            //the url where you want to sent the userName and password to
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            //json object to sent to the authentication url
            data: JSON.stringify(summary),
            success: function (res) {
                 /*
                //showAnnoucement(flag, section, action)
                */
                showAnnoucement(res.flag, 'summary', 'saved'); 
            },
            error: function(x,e){
                
            }
        });
        }
    return false;
});
