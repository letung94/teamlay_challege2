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
    $('#education-form').validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        rules: {
            institute: {
                required: true,
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
        errorPlacement: function(error, element) {
            if (element.attr("name") == "date") {
                error.insertAfter('#education-form .input-group');
            } else {
                error.insertAfter(element);
            }
        }
    });
});

var listEdu = [];
var clickedEducation = false;

function Education(attribute) {
    this.attribute = attribute;
}

function addListEdu(index, row) {
    // create edit & button acction
    var editAction = '<button class="btn btn-warning btn-sm btnEditEdu"><span class="glyphicon glyphicon-pencil"></span></button>';
    var deleteAction = '<button class="btn btn-danger btn-sm btnDeleteEdu"><span class="glyphicon glyphicon-remove"></span></button>';
    // add value of each attribute to row 
    var rowtable = "<tr style='font-size:13px'><td>" + index + "</td><td>" + row.Institude + "</td><td>" + row.Degree + "</td><td>" + row.FromDate + ' - ' + row.ToDate + "</td><td>" + editAction + " " + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-education tbody");
}


function getEducation() {
    if (clickedEducation == true) {
        return;
    }
    var urlget = window.location.href + "/education/getall";
    $.ajax({
        type: "GET",
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            if (res.flag == 1) {
                clickedEducation = true;
                $('#list-education tbody > tr').remove();
                $.each(res.resdata, function(index, value) {
                    listEdu.push(new Education(value));
                    addListEdu(index + 1, value);
                });
            }
        },
        error: function(x, e) {

        }
    });
}

function getValueEdu() {
    //get dates and split to fromdate - todate
    var dates = $("#education-form input[name='date']").val().split(" - ");
    var fromdate = dates[0];
    var todate = dates[1];
    //set value of each attribute to education
    var education = new Education({
        "Institute": $("#education-form input[name='institute']").val(),
        "Degree": $("#education-form input[name='degree']").val(),
        "FromDate": fromdate,
        "ToDate": todate,
        "Details": $("#education-form textarea[name='detail']").val(),
    });
    return education.attribute;

}

$('#btnAddListEdu').click(function() {
    var isValid = $('#education-form').valid();
    if (isValid) {
        var addEducation = getValueEdu();
        var urlpost = window.location.href + '/education/save';
        $.ajax({
            type: "POST",
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(addEducation),
            success: function(res) {
                //update new value to table
                if (res.flag == 1) {
                    listEdu.push(new Education(res.resdata));
                    $("#list-education tbody > tr").remove();
                    $.each(listEdu, function(index, value) {
                        addListEdu(index + 1, value.attribute);
                    });
                    switchModeEdu("add");
                    $("#experience-form")[0].reset();
                }
                showAnnoucement(res.flag, 'education', 'added');
            },
            error: function(x, e) {

            }
        });
    }
});

function switchModeEdu(mode) {
    mode = mode.toLowerCase();

    if (mode == 'add') {
        $('#btnSaveEditEdu').hide();
        $('#btnCancelEditEdu').hide();
        $('#btnAddListEdu').show();
        $('.btnDeleteEdu').prop('disabled', false);
        $('.btnEditEdu').prop('disabled', false);
    } else if (mode == 'edit') {
        $('#btnSaveEditEdu').show();
        $('#btnCancelEditEdu').show();
        $('#btnAddListEdu').hide();
        $('.btnDeleteEdu').prop('disabled', true);
        $('.btnEditEdu').prop('disabled', true);
    }
}