// Get the page from template review page and place it in #template-review
var getReview = function(templateName){
    var name = templateName || $('#default-file').text();
    $("#template-review").load('http://localhost:8080/template/templateReview/' + name );
}

$(document).ready(function(){
    // Call when complete rendering html to display the default review.
    getReview();
    var currentTemplate = '';
    // Change review when user click into template.
    $('.template').click(function(){
        currentTemplate = $(this).attr('template-name');
        getReview(currentTemplate);
    });
    // Replace template's cover do default if cover image not found.
    $("img").error(function () {
        $(this).unbind("error").attr("src", "cover/_Blank.png");
    });

    // User choose exportPDF, get options then send to download page.
    $('.exportPDF').click(function(){
        if(currentTemplate == ''){
            currentTemplate = $('#default-file').text();
        }
        var format = $('#format').val();
        var orientation = $('#orientation').val();
        var zoom = $('#zoom').val();
        var marginTop = $('#margin-top').val();
        var marginRight = $('#margin-right').val();
        var marginBottom= $('#margin-bottom').val();
        var marginLeft = $('#margin-left').val();
        window.open('http://localhost:8080/template/download/' + currentTemplate.split('.')[0] + "?format=" + format +"&orientation=" + orientation + "&zoom=" + zoom
        + '&marginTop=' + marginTop + '&marginRight=' + marginRight + '&marginBottom=' + marginBottom + '&marginLeft=' + marginLeft,'_blank');
    });
});
