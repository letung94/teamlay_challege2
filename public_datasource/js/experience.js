var listExp = [];
//set attribute for class Experience
function Experience(attribute){
    this.attribute = attribute;
}
/*Add List Of Experience to Table*/ 
function addListExp(index,row){
    // create edit & button acction
    var editAction = '<button class="btn btn-warning btn-sm btnEditExp"><span class="glyphicon glyphicon-pencil"></span></button>';
    var deleteAction = '<button class="btn btn-danger btn-sm btnDeleteExp"><span class="glyphicon glyphicon-remove"></span></button>';
    // add value of each attribute to row 
    var rowtable = "<tr style='font-size:13px'><td>" + index + "</td><td>" + row.Company + "</td><td>" + row.Designation + "</td><td>" + row.FromDate + ' - ' + row.ToDate + "</td><td>" + editAction + " " + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-experience tbody");
}
/*Get Value from Input on Edit case */
function getValueExp(){
        //get dates and split to fromdate - todate
        var dates = $("#experience-form input[name='date']").val().split(" - ");
        var fromdate = dates[0];
        var todate = dates[1];
        //set value of each attribute to Experience
        var experience = new Experience(
            {
                "Company": $("#experience-form input[name='company']").val(),
                "Designation": $("#experience-form input[name='designation']").val(),
                "FromDate": fromdate,
                "ToDate": todate,
                "Details": $("#experience-form textarea[name='detail']").val(),
            }
        );
        return experience.attribute;
        
}
/*Add Button Click Event for Add List Experience */
$('#btnAddListExp').click(function() {
        //check valid on click
     var isValid = $('#experience-form').valid();
     if(isValid){
        var addedexprerience = getValueExp();
        var urlpost = window.location.href + '/experience/save';
         $.ajax({
        type: "POST",
        url: urlpost,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(addedexprerience),
        success: function (res) {
            //update new value to table
            if(res.flag==1){ 
            listExp.push(new Experience(res.resdata)); 
                $("#list-experience tbody > tr").remove();
                $.each(listExp, function(index,value ){
                    addListExp(index + 1,value.attribute);
                });
                switchModeExp("add");
            }
            showAnnoucement(res.flag, 'experience', 'added');
        },
        error: function(x,e){
            
        }
    }); 
   }      
});
/*Delete Button Click Event for Delete Value */
$('#list-experience').on('click', '.btnDeleteExp' , function(e){
    e.preventDefault();
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
                if(result) {
                    $.ajax({
                    type: "POST",        
                    url: urlpost,
                    dataType: 'json',
                    async: false,
                    contentType: 'application/json; charset=utf-8',            
                    data: JSON.stringify(deletedexperience),
                    success: function (res) {
                        if(res.flag==1){
                            //remove value from array by index and update to table
                            listExp.splice(indexCurrentExp, 1);    
                            $("#list-experience tbody > tr").remove();
                            $.each(listExp, function( index, value ){
                                addListExp(index + 1,value.attribute);
                            });
                            if(listExp.length == 0){
                                $('#list-experience tbody').append('<tr><td colspan="5" align="center"> No data available </td></tr>');
                            }
                        }
                    showAnnoucement(res.flag, 'experience', 'deleted');
                    },
                    error: function(x,e){
                        
                    }
                });               
                }else {
                   
                }
            }
        });  
});
/*Edit Button Click Event to Edit Value*/
$('#list-experience').on('click', '.btnEditExp' , function(e){
    e.preventDefault();
    $('#experience-form').validate().resetForm();
    var cells = $(this).closest("tr").children("td");
    indexCurrentExp = parseInt(cells.eq(0).text())-1;  
    $("#experience-form input[name='company']").val(cells.eq(1).text()).focus();  
    $("#experience-form input[name='designation']").val(cells.eq(2).text());
    $("#experience-form input[name='date']").val(cells.eq(3).text());
    $("#experience-form textarea[name='detail']").data('wysihtml5').editor.setValue(listExp[indexCurrentExp].attribute.Details);
    rowId = $(this).closest('td').parent()[0].sectionRowIndex;
    switchModeExp("edit");
});
$('#btnSaveEditExp').click(function() {
    var isValid = $('#experience-form').valid();
    if(isValid){      
        var savedexprerience = getValueExp();
        savedexprerience.Id = listExp[indexCurrentExp].attribute.Id;
        savedexprerience.CV_id = listExp[indexCurrentExp].attribute.CV_id;
        var urlpost = window.location.href + '/experience/update';
            $.ajax({
            type: "POST",
            //the url where you want to sent the userName and password to
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            //json object to sent to the authentication url
            data: JSON.stringify(savedexprerience),
            success: function (res) {
                if(res.flag==1){
                    listExp.splice(indexCurrentExp, 1);
                    listExp.splice(indexCurrentExp, 0, new Experience(res.resdata));
                    $("#list-experience tbody > tr").remove();
                    $.each(listExp, function( index, value ){
                        addListExp(index + 1,value.attribute);
                    });
                    switchModeExp("save"); 
                }
                showAnnoucement(res.flag, 'experience', 'edited');
            },
            error: function(x,e){
                
            }
        }); 
     }
});
$('#btnCancelEditExp').click(function() {  
    switchModeExp("cancel");
});

             
var clickedExperience = false;
function getExperience(){
    if(clickedExperience==true){
        return;
    }
    var urlget = window.location.href + "/experience/getall";
    $.ajax({
        type: "GET",
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
                if(res.flag == 1){
                    $("#list-experience tbody > tr").remove();
                    clickedExperience = true;
                    $.each(res.resdata, function( index, value ) {
                    listExp.push(new Experience(value));          
                    addListExp(index + 1,value);
                    });
     
                }
            },
        error: function(x,e){
            
        }
    });
}
/*Switch Mode for case button click */
function switchModeExp(mode){
        mode = mode.toLowerCase();
        //case button edit
        if (mode == 'edit'){
            $('#btnSaveEditExp').show();
            $('#btnAddListExp').hide();
            $('#btnCancelEditExp').show();
            $('.btnDeleteExp').prop('disabled', true);
            $('.btnEditExp').prop('disabled', true);
        //case button cancel
        }else if (mode == 'cancel'){
            $('#btnSaveEditExp').hide();
            $('#btnAddListExp').show();
            $('#btnCancelEditExp').hide();
            $('.btnDeleteExp').prop('disabled', false);
            $('.btnEditExp').prop('disabled', false);
            $("#experience-form")[0].reset();
        //case button save    
        }else if (mode == 'save'){
            $('#btnSaveEditExp').hide();
            $('#btnCancelEditExp').hide();
            $('#btnAddListExp').show(); 
            $("#experience-form")[0].reset();
        }else if (mode == 'add'){
            $("#experience-form")[0].reset();
        }
}
/*Jquery Validation for #experience-form*/
    
$(document).ready(function() {
    useWysihtml5("#experience-form textarea[name='detail']"); 
    $.validator.addMethod("isBeforeTodayExp", function(value, element) {
        var today = new Date();
        var getTodate = value.split(" - ");
        var inputDate = new Date(getTodate[1]);
        return inputDate <= today;
    }, "The ToDate should be before today.");
    $.validator.addMethod("notEqFromToDateExp", function(value, element) {
        var splitDate = value.split(" - ");
        var toDate = new Date(splitDate[1]);
        var fromDate = new Date(splitDate[0]);  
        return toDate - fromDate > 0;
    }, "The FromDate & ToDate should be different.");
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
            errorPlacement:
            function(error, element){
                if(element.attr("name") == "date"){ 
                    error.insertAfter('#experience-form .input-group');
            }else{ 
                    error.insertAfter(element); 
                }
            }          
    });
});

