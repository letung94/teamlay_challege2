$(document).ready(function() {
    $('#education_form').validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        rules: {
            institute: {
                required: true,
                minlength: 5
            },
            degree: {
                required: false,
                maxlength: 100 
            },
            date: {
                required: true
            }
            
        },
        messages: {
            institute: {
                required: "Please enter your institute.",
                minlength:"Must be 5 characters."
            },
            degree: {
                maxlength: "Must be under 100 characters"
            },
            date: {
                    required: "Please enter your studying time for this degree "
                } 
        },
        errorPlacement:
            function(error, element){
                if(element.attr("name") == "date"){ 
                    error.insertAfter('#education_form .input-group');
            }else{ 
                    error.insertAfter(element); 
                }
            }     
    });
});

var listEducation = [];
var clickedEducation = false;
function Education(attribute){
    this.attribute = attribute;
}

function addListEdu(index,row){
    // create edit & button acction
    var editAction = '<button class="btn btn-warning btn-sm btnEditEdu"><span class="glyphicon glyphicon-pencil"></span></button>';
    var deleteAction = '<button class="btn btn-danger btn-sm btnDeleteEdu"><span class="glyphicon glyphicon-remove"></span></button>';
    // add value of each attribute to row 
    var rowtable = "<tr style='font-size:13px'><td>" + index + "</td><td>" + row.Company + "</td><td>" + row.Designation + "</td><td>" + row.FromDate + ' - ' + row.ToDate + "</td><td>" + editAction + " " + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-experience tbody");
}

function getEducation(){
    if(clickedEducation==true){
        return;
    }
    var urlget = window.location.href + "/education/getall";
    $.ajax({
        type: "GET",
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (res) {   
                clickedEducation = true;
                $.each(res.resdata, function( index, value ) {
                listEducation.push(new Education(value));          
                addListEdu(index + 1 , value);
                });              
            },
        error: function(x,e){
            
        }
    });
}

$('#btnAddListEdu').click(function() {
    var validator = $('#education_form').valid();

});



