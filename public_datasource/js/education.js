$(document).ready(function() {
    
    $.validator.addMethod("isBeforeTodayEdu", function(value, element) {
        var today = new Date();
        var getTodate = value.split(" - ");
        var inputDate = new Date(getTodate[1]);
        return inputDate <= today;
    }, "The ToDate should be before today.");
    $.validator.addMethod("notEqFromToDateEdu", function(value, element) {
        var splitDate = value.split(" - ");
        var toDate = new Date(splitDate[1]);
        var fromDate = new Date(splitDate[0]);  
        return toDate - fromDate > 0;
    }, "The FromDate & ToDate should be different.");
    $('#education_form').validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        rules: {
            institute: {
                required: true,
                minlength: 5,
                maxlength: 100
            },
            degree: {
                required: false,
                maxlength: 100 
            },
            date: {
                required: true,
                isBeforeTodayEdu: true,
                notEqFromToDateEdu: true
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
    $(rowtable).appendTo("#list-education tbody");
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
            if(res.flag == 1){
                clickedEducation = true;
                $.each(res.resdata, function( index, value ) {
                listEducation.push(new Education(value));          
                addListEdu(index + 1 , value);
                });   
            }
             else{
                $('#list-education tbody').append('<tr><td colspan="5" align="center"> No data available </td></tr>');
              }          
            },
        error: function(x,e){
            
        }
    });
}

$('#btnAddListEdu').click(function() {
    var validator = $('#education_form').valid();

});



