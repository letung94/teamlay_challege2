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
                clickedSummary = true; 
                $("input[name='headline']").val(res.resdata.Headline);
                $("textarea[name='prosummary']").data('wysihtml5').editor.setValue(res.resdata.ProfessionalSummary);
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
        summary["Headline"]=$("#validation_form_summary input[name='headline']").val();
        summary["ProfessionalSummary"]=$("#validation_form_summary textarea[name='prosummary']").val();
        summary["CV_Id"]=$("#validation_form_summary input[name='idcv']").val();
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
                console.log(res);
            },
            error: function(x,e){
                
            }
        });
    $.gritter.add({
        title: 'Successfull!',
        text: 'Your summary has been saved.',
        sticky: false,
        time: '1500',
    });
    return false;
});
