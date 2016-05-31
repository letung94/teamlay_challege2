
function Experience(attribute){
    this.attribute = attribute;
}
String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

var listexperience = [];

var flag = 0;
var rowId = '';
//function add input value to list
function addlistexp(row){
    var editAction = '<button class="btn btn-primary btn-xs btnEdit"><span class="glyphicon glyphicon-pencil"></span> Edit</button>';
        var deleteAction = '<button type="button" class="btn btn-danger btn-sm btnDelete"><i class="fa fa-trash-o"> Delete</i></button>';
    var rowtable = "<tr style='font-size:13px'><td>" + row.Id + "</td><td>" + row.Company + "</td><td>" + row.Designation + "</td><td>" + row.FromDate + ' - ' + row.ToDate + "</td><td>" + row.Details + "</td><td>" + editAction + " " + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-experience tbody");
}
function getValueExp(){
        var dates = $("#validation_form_exp input[name='date']").val().split(" - ");
        var fromdate = dates[0];
        var todate = dates[1];
        var experience = new Experience(
            {
                "Company": $("#validation_form_exp input[name='company']").val(),
                "Designation": $("#validation_form_exp input[name='designation']").val(),
                "FromDate": fromdate,
                "ToDate": todate,
                "Details": $("#validation_form_exp textarea[name='detail']").val(),
            }
        );
        return experience.attribute;
        
}
$('#btnAddListExp').click(function() {
        var addedexprerience = getValueExp();
        var urlpost = window.location.href + '/experience/save';
         $.ajax({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: urlpost,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        //json object to sent to the authentication url
        data: JSON.stringify(addedexprerience),
        success: function (res) {
            listexperience.push(new Experience(res.resdata)); 
            $("#list-experience tbody > tr").remove();
            $.each(listexperience, function( index, value2 ){
                addlistexp(value2.attribute);
            });
        },
        error: function(x,e){
            
        }
    }); 
        
        
});
//function delete current row on click
$('#list-experience').on('click', '.btnDelete' , function(e){
    e.preventDefault();
    var deletedexperience = new Experience();
    var cells = $(this).closest("tr").children("td");
    idexp = parseInt(cells.eq(0).text());
    deletedexperience.Id = idexp;
    indexcurrent = $(this).closest("tr").index();
    console.log(this.rowIndex);
    urlpost = window.location.href + '/experience/delete'
     $.ajax({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: urlpost,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        //json object to sent to the authentication url
        data: JSON.stringify(deletedexperience),
        success: function (res) {
            if(res.flag==1){
                listexperience.splice(indexcurrent, 1);    
                $("#list-experience tbody > tr").remove();
                $.each(listexperience, function( index, value2 ){
                    addlistexp(value2.attribute);
                });
            }
        },
        error: function(x,e){
            
        }
    }); 
    
});
//function edit current row on click and show to input

var indexcurrent = null;
$('#list-experience').on('click', '.btnEdit' , function(e){
    e.preventDefault();
    var cells = $(this).closest("tr").children("td");
    indexcurrent = parseInt(cells.eq(0).text())-1;  
    $("#validation_form_exp input[name='company']").val(cells.eq(1).text()).focus();  
    $("#validation_form_exp input[name='designation']").val(cells.eq(2).text());
    $("#validation_form_exp input[name='date']").val(cells.eq(3).text());
    $("#validation_form_exp textarea[name='detail']").data('wysihtml5').editor.setValue(cells.eq(4).text());
    rowId = $(this).closest('td').parent()[0].sectionRowIndex;
    $('#btnAddListExp').css('display', 'none');
    $('#btnSaveExp').css('display', 'inline');
});
$('#btnSaveExp').click(function() {      
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
                $.each(listexperience, function( index, value2 ){
                    addlistexp(value2.attribute);
                });
            }
        },
        error: function(x,e){
            
        }
    }); 
    
    
    $('#btnAddListExp').css('display', 'inline');
    $('#btnSaveExp').css('display', 'none');
});

var clickedExperience = false;
function getExperience(){
    if(clickedExperience==true){
        return;
    }
    var urlget = window.location.href + "/experience/getall";
    $.ajax({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        //json object to sent to the authentication url
        success: function (res) {   
                clickedExperience = true;
                $.each(res.resdata, function( index, value ) {
                listexperience.push(new Experience(value));          
                addlistexp(value);
                });
                
            },
        error: function(x,e){
            
        }
    });
};