var listexperience = [];
//set attribute for class Experience
function Experience(attribute){
    this.attribute = attribute;
}
/*Add List Of Experience to Table*/ 
function addlistexp(index,row){
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
            listexperience.push(new Experience(res.resdata)); 
                $("#list-experience tbody > tr").remove();
                $.each(listexperience, function(index,value ){
                    addlistexp(index + 1,value.attribute);
                });
                switchMode("add");
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
    var cells = $(this).closest("tr").children("td");
    indexcurrent = $(this).closest("tr").index();
    deletedexperience.Id = listexperience[indexcurrent].attribute.Id;
    urlpost = window.location.href + '/experience/delete'
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
                            listexperience.splice(indexcurrent, 1);    
                            $("#list-experience tbody > tr").remove();
                            $.each(listexperience, function( index, value ){
                                addlistexp(index + 1,value.attribute);
                            });
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
    var cells = $(this).closest("tr").children("td");
    indexcurrent = parseInt(cells.eq(0).text())-1;  
    $("#experience-form input[name='company']").val(cells.eq(1).text()).focus();  
    $("#experience-form input[name='designation']").val(cells.eq(2).text());
    $("#experience-form input[name='date']").val(cells.eq(3).text());
    $("#experience-form textarea[name='detail']").data('wysihtml5').editor.setValue(listexperience[indexcurrent].attribute.Details);
    rowId = $(this).closest('td').parent()[0].sectionRowIndex;
    switchMode("edit");
});
$('#btnSaveEditExp').click(function() {      
    var savedexprerience = getValueExp();
    savedexprerience.Id = listexperience[indexcurrent].attribute.Id;
    savedexprerience.CV_id = listexperience[indexcurrent].attribute.CV_id;
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
                listexperience.splice(indexcurrent, 1);
                listexperience.splice(indexcurrent, 0, new Experience(res.resdata));
                $("#list-experience tbody > tr").remove();
                $.each(listexperience, function( index, value ){
                    addlistexp(index + 1,value.attribute);
                });
                switchMode("save"); 
            }
             showAnnoucement(res.flag, 'experience', 'edited');
        },
        error: function(x,e){
            
        }
    }); 
    
});
$('#btnCancelEditExp').click(function() {  
    switchMode("cancel");
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
                clickedExperience = true;
                $.each(res.resdata, function( index, value ) {
                listexperience.push(new Experience(value));          
                addlistexp(index + 1,value);
                });              
            },
        error: function(x,e){
            
        }
    });
}
/*Switch Mode for case button click */
function switchMode(mode){
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
    $("#experience-form").validate({
            errorClass: 'text-danger',
            focusInvalid: true,
            rules: {
                company: {
                    required: true,
                    minlength: 2,
                    maxlength: 100
                },
                date: {
                    required: true
                },        
            },
            messages: {
                company: {
                    required: "Please enter a company's name",
                    minlength: "Your company's name  must be at least 2 characters long",
                    maxlength: "Your company's name must be under 100 characters"
                },
                date: {
                    required: "Please enter your working time for this company "
                } 
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

