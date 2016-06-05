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

function Summary(attribute) {
    this.attribute = attribute;
}
var summary = null;

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
              summary = new Summary(res.resdata);
                $("#summary-form input[name='headline']").val(summary.attribute.Headline);
                $("#summary-form textarea[name='prosummary']").data('wysihtml5').editor.setValue(summary.attribute.ProfessionalSummary);
                } 
            },
        error: function(x,e){
       
        }
    });
};


$('#btnSaveSummary').click(function() {
        var validator = $('#summary-form').valid();
        if (validator) {
            var temp = {
            Headline:$("#summary-form input[name='headline']").val(),
            ProfessionalSummary:$("#summary-form textarea[name='prosummary']").val(),
            CV_Id:$("#summary-form input[name='idcv']").val()
            }
            var save_summary = new Summary(temp);
            var urlpost = window.location.href + '/summary/save';
            $.ajax({
            type: "POST",
            //the url where you want to sent the userName and password to
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            //json object to sent to the authentication url
            data: JSON.stringify(save_summary.attribute),
            success: function (res) {
                  showAnnoucement(res.flag, 'summary', 'saved');     
            },
            error: function(x,e){
                
            }
        });      
        } 
    return false;
});
