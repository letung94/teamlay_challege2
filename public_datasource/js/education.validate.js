$(document).ready(function() {
    $('#validation_form_education').validate({
        errorClass: 'text-danger',
        focusInvalid: false,
        debug: true,
        rules: {
            institute: {
                required: true
            }
        },
        messages: {
            institute: {
                required: "Please enter your institute."
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "accept")  {
                error.insertAfter("#accept_error-message");
            }else {
                error.insertAfter(element);
            }
        }
    });
});

function Education(attribute){
    this.attribute = attribute;
    var a = 10;
}

var listeducation = [];

var flag = 0;
var rowId = '';
/*
//function add input value to list
*/
function addlistedu(row){
    var editAction = '<button class="btn btn-primary btn-xs" id="btnEdit"><span class="glyphicon glyphicon-pencil"></span> Edit</button>';
        var deleteAction = '<button type="button" class="btn btn-danger btn-sm" id="btnDelete"><i class="fa fa-trash-o"> Delete</i></button>';
    var rowtable = "<tr style='font-size:13px'><td>" + row.Company + "</td><td>" + row.Designation + "</td><td>" + row.FromDate + '-' + row.ToDate + "</td><td>" + row.Details + "</td><td>" + editAction + " " + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-experience tbody");
}


