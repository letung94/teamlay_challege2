function getSummary(){
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
                $("input[name='headline']").val(res.resdata.Headline);
                $("textarea[name='prosummary']").data('wysihtml5').editor.setValue(res.resdata.ProfessionalSummary);
                },
        error: function(x,e){
       
        }
    });
};

