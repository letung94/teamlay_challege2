/*function Experience_Validate(){
    var self = this;
    self.attrvalidate = [
        {validate: function(company){
            this.valid = false;
            this.required = true;
            this.min = 2;
            this.max = 49;
            if(firstname !=null || firstname !== ""){
                    var length = firstname.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "Company"}];
}*/

function Experience(attribute){
    this.attribute = attribute;
    var a = 10;
}

var listexperience = [];

var flag = 0;
var rowId = '';
//function add input value to list
function addlistexp(row){
    var editAction = '<button class="btn btn-primary btn-xs" id="btnEdit"><span class="glyphicon glyphicon-pencil"></span> Edit</button>';
        var deleteAction = '<button type="button" class="btn btn-danger btn-sm" id="btnDelete"><i class="fa fa-trash-o"> Delete</i></button>';
    var rowtable = "<tr style='font-size:13px'><td>" + row.Company + "</td><td>" + row.Designation + "</td><td>" + row.FromDate + '-' + row.ToDate + "</td><td>" + row.Details + "</td><td>" + editAction + " " + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-experience tbody");
}
$('#btnAddListExp').click(function() {
        var dates = $('#date').val().split(" - ");
        var fromdate = dates[0];
        var todate = dates[1];
        var experience = new Experience(
            {
                "Company": $("#company").val(),
                "Designation": $("#designation").val(),
                "FromDate": fromdate,
                "ToDate": todate,
                "Details": $("#detail").val(),
            }
        )
        var urlpost = window.location.href + '/experience/save';
         $.ajax({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: urlpost,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        //json object to sent to the authentication url
        data: JSON.stringify(experience.attribute),
        success: function (res) {
            console.log(res);
        },
        error: function(x,e){
            
        }
    }); 
        
        
});
//function delete current row on click
$('#list-experience').on('click', '#btnDelete' , function(e){
    e.preventDefault();
    $(this).closest('tr').remove();
});
//function edit current row on click and show to input
$('#list-experience').on('click', '#btnEdit' , function(e){
    e.preventDefault();
    var cells = $(this).closest("tr").children("td");
    $('#company').val(cells.eq(0).text()).focus();  
    $('#designation').val(cells.eq(1).text());
    $('#date').val(cells.eq(2).text());
    $('#detail').data('wysihtml5').editor.setValue(cells.eq(3).text());
    rowId = $(this).closest('td').parent()[0].sectionRowIndex;
    $('#btnAddListExp').css('display', 'none');
    $('#btnSaveExp').css('display', 'inline');
});
$('#btnSaveExp').click(function() {      
    $('#list-experience tbody tr:eq(' + rowId + ') td:eq(0)').html($('#company').val());
    $('#list-experience tbody tr:eq(' + rowId + ') td:eq(1)').html($('#designation').val());
    $('#list-experience tbody tr:eq(' + rowId + ') td:eq(2)').html($('#date').val());
    $('#list-experience tbody tr:eq(' + rowId + ') td:eq(3)').html($('#detail').val());
    $('#btnAddListExp').css('display', 'inline');
    $('#btnSaveExp').css('display', 'none');
});

var clickedExperience = false;
function getAll(){
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