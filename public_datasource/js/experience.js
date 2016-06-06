var listExp = [];
//set attribute for class Experience
function Experience(attribute) {
    this.attribute = attribute;
}
/*Add List Of Experience to Table*/
function addListExp(index, row) {
    // create edit & button acction
    var editAction = '<button class="btn btn-warning btn-sm btnEditExp"><span class="glyphicon glyphicon-pencil"></span></button>';
    var deleteAction = '<button class="btn btn-danger btn-sm btnDeleteExp"><span class="glyphicon glyphicon-remove"></span></button>';
    // add value of each attribute to row 
    var rowtable = "<tr style='font-size:13px'><td>" + index + "</td><td>" + row.Company + "</td><td>" + row.Designation + "</td><td>" + row.FromDate + ' - ' + row.ToDate + "</td><td>" + editAction + " " + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-experience tbody");
}
/*Get Value from Input on Edit case */
function getValueExp() {
    //get dates and split to fromdate - todate
    var dates = $("#experience-form input[name='date']").val().split(" - ");
    var fromdate = dates[0];
    var todate = dates[1];
    //set value of each attribute to Experience
    var experience = new Experience({
        "Company": $("#experience-form input[name='company']").val(),
        "Designation": $("#experience-form input[name='designation']").val(),
        "FromDate": fromdate,
        "ToDate": todate,
        "Details": $("#experience-form textarea[name='detail']").val(),
    });
    return experience.attribute;

}
/*Add Button Click Event for Add List Experience */
$('#btnAddListExp').click(function() {
    //check valid on click
    var isValid = $('#experience-form').valid();
    if (isValid) {
        var addedexprerience = getValueExp();
        var urlpost = window.location.href + '/experience/save';
        $.blockUI();
        $.ajax({
            type: "POST",
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(addedexprerience),
            success: function(res) {
                $.unblockUI();
                //update new value to table
                if (res.flag == 1) {
                    listExp.push(new Experience(res.resdata));
                    $("#list-experience tbody > tr").remove();
                    $.each(listExp, function(index, value) {
                        addListExp(index + 1, value.attribute);
                    });
                    switchModeExp("add");
                   
                }
                 $("#experience-form")[0].reset();
                 $("#experience-form textarea[name='detail']").data('wysihtml5').editor.setValue('');
                showAnnoucement(res.flag, 'experience', 'added');
            },
            error: function(x, e) {

            }
        });
    }
});
/*Delete Button Click Event for Delete Value */
$('#list-experience').on('click', '.btnDeleteExp', function(e) {
    var deletedexperience = new Experience();
    //get current index on row click
    indexCurrentExp = $(this).closest("tr").index();
    deletedexperience.Id = listExp[indexCurrentExp].attribute.Id;
    var urlpost = window.location.href + '/experience/delete'
        //show popup confirm on click delete button
    BootstrapDialog.confirm({
        title: 'Confirm',
        message: 'Are you sure?',
        callback: function(result) {
            if (result) {
                $.blockUI();
                $.ajax({
                    type: "POST",
                    url: urlpost,
                    dataType: 'json',
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(deletedexperience),
                    success: function(res) {
                        $.unblockUI();
                        if (res.flag == 1) {
                            //remove value from array by index and update to table
                            listExp.splice(indexCurrentExp, 1);
                            $("#list-experience tbody > tr").remove();
                            $.each(listExp, function(index, value) {
                                addListExp(index + 1, value.attribute);
                            });
                            if (listExp.length == 0) {
                                $('#list-experience tbody').append('<tr><td colspan="5" align="center"> No data available </td></tr>');
                            }
                        }
                        showAnnoucement(res.flag, 'experience', 'deleted');
                    },
                    error: function(x, e) {

                    }
                });
            } else {

            }
        }
    });
});
/*Edit Button Click Event to Edit Value*/
$('#list-experience').on('click', '.btnEditExp', function(e) {
    $('#experience-form').validate().resetForm();
    var cells = $(this).closest("tr").children("td");
    //get current index on click
    indexCurrentExp = parseInt(cells.eq(0).text()) - 1;
    //get value from cells and push to input
    $("#experience-form input[name='company']").val(cells.eq(1).text()).focus();
    $("#experience-form input[name='designation']").val(cells.eq(2).text());
    $("#experience-form input[name='date']").val(cells.eq(3).text());
    $("#experience-form textarea[name='detail']").data('wysihtml5').editor.setValue(listExp[indexCurrentExp].attribute.Details);
    switchModeExp("edit");
    $('#experience-form').validate().resetForm();
});
/*Save Button Click Event to Save Value After Edit*/
$('#btnSaveEditExp').click(function() {
    var isValid = $('#experience-form').valid();
    if (isValid) {
        var savedexprerience = getValueExp();
        savedexprerience.Id = listExp[indexCurrentExp].attribute.Id;
        savedexprerience.CV_Id = listExp[indexCurrentExp].attribute.CV_Id;
        var urlpost = window.location.href + '/experience/update';
        $.blockUI();
        $.ajax({
            type: "POST",
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(savedexprerience),
            success: function(res) {
                $.unblockUI();
                if (res.flag == 1) {
                    listExp.splice(indexCurrentExp, 1);
                    listExp.splice(indexCurrentExp, 0, new Experience(res.resdata));
                    $("#list-experience tbody > tr").remove();
                    $.each(listExp, function(index, value) {
                        addListExp(index + 1, value.attribute);
                    });
                    switchModeExp("add");                
                }
                $("#experience-form")[0].reset();
                $("#experience-form textarea[name='detail']").data('wysihtml5').editor.setValue('');
                showAnnoucement(res.flag, 'experience', 'edited');
            },
            error: function(x, e) {

            }
        });
    }
});

$('#btnCancelEditExp').click(function() {
    switchModeExp("add");
    $("#experience-form")[0].reset();
});
var clickedExperience = false;
/*Get Experience On Section Click*/
function getExperience() {
    if (clickedExperience == true) {
        return;
    }
    var urlget = window.location.href + "/experience/getall";
    $.blockUI();
    $.ajax({
        type: "GET",
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function(res) {
            $.unblockUI();
            if (res.flag == 1) {
                clickedExperience = true;
                $('#list-experience tbody > tr').remove();
                $.each(res.resdata, function(index, value) {
                    listExp.push(new Experience(value));
                    addListExp(index + 1, value);
                });

            }

        },
        error: function(x, e) {

        }
    });
}
/*Switch Mode for case button click */
function switchModeExp(mode) {
    mode = mode.toLowerCase();

    if (mode == 'add') {
        $('#btnSaveEditExp').hide();
        $('#btnCancelEditExp').hide();
        $('#btnAddListExp').show();
        $('.btnDeleteExp').prop('disabled', false);
        $('.btnEditExp').prop('disabled', false);
    } else if (mode == 'edit') {
        $('#btnSaveEditExp').show();
        $('#btnCancelEditExp').show();
        $('#btnAddListExp').hide();
        $('.btnDeleteExp').prop('disabled', true);
        $('.btnEditExp').prop('disabled', true);
    }
}
/*Jquery Validation for #experience-form*/

$(document).ready(function() {
    /*Set Wysihtml5 for textarea*/
    useWysihtml5("#experience-form textarea[name='detail']");
    /*Check ToDate Before Today */
    $.validator.addMethod("isBeforeTodayExp", function(value, element) {
        var today = new Date();
        var getTodate = value.split(" - ");
        var inputDate = new Date(getTodate[1]);
        return inputDate <= today;
    }, "The ToDate should be before today.");
    /*Check From & ToDate is different */
    $.validator.addMethod("notEqFromToDateExp", function(value, element) {
        var splitDate = value.split(" - ");
        var toDate = new Date(splitDate[1]);
        var fromDate = new Date(splitDate[0]);
        return toDate - fromDate > 0;
    }, "The FromDate & ToDate should be different.");
    /*Add validate for each field */
    $("#experience-form").validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        rules: {
            company: {
                required: true,
                minlength: 2,
                maxlength: 100
            },
            designation: {
                maxlength: 50
            },
            date: {
                required: true,
                isBeforeTodayExp: true,
                notEqFromToDateExp: true
            },
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "date") {
                error.insertAfter('#experience-form .input-group');
            } else {
                error.insertAfter(element);
            }
        }
    });
});