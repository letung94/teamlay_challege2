//the $(document).ready() function is down at the bottom
(function ( $ ) {
    $.fn.rating = function( method, options ) {
		method = method || 'create';
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
			limit: 5,
            text:["Beginner","Basic","Intermediate","Advanced","Expert"],
			value: 0,
			glyph: "glyphicon-star",
            coloroff: "gray",
			coloron: "gold",
			size: "2.0em",
			cursor: "default",
			onClick: function () {},
            endofarray: "idontmatter",
            besidetext:"besidetext",
            fixed: false,
			thisid: "#" + $(this)[0].id,
			undertext: "undertext"
        }, options );
		var style = "";
		style = style + "font-size:" + settings.size + "; ";
		style = style + "color:" + settings.coloroff + "; ";
		style = style + "cursor:" + settings.cursor + "; ";

		if (method == 'create')
		{
			//this.html('');	//junk whatever was there
			//initialize the data-rating property
			this.each(function(){
				attr = $(this).attr('data-rating');
				if (attr === undefined || attr === false) { $(this).attr('data-rating',settings.value); }
			})
			
			//bolt in the glyphs
			for (var i = 0; i < settings.limit; i++)
			{
				this.append('<span data-value="' + (i+1) + '" class="ratingicon glyphicon ' + settings.glyph + '" style="' + style + '" aria-hidden="true"></span>');
			}
            if(!settings.fixed){
                this.append('<span class="'+ settings.besidetext +'">'+ settings.text[settings.value] +'</span>');
			//paint
			    
            }else{
                this.append('<span class="'+ settings.undertext + ' '+ settings.besidetext +'">'+ settings.text[settings.value] +'</span>');
			//paint
			    
            }
			this.each(function() { paint($(this)); });

		}
		if (method == 'set')
		{
			this.attr('data-rating',options);
            alert(this.attr('data-rating'));
			this.each(function() { paint($(this)); });
		}
		if (method == 'get')
		{
			return this.attr('data-rating');
		}
		//register the click events
		this.find("span.ratingicon").click(function() {
            if(settings.fixed){
                return;
            }
			rating = $(this).attr('data-value')
			$(this).parent().attr('data-rating',rating);
			paint($(this).parent());
			settings.onClick.call( $(this).parent() );
            
		})
		function paint(div)
		{
			rating = parseInt(div.attr('data-rating'));
			/*
			//change text inner of html
			 */
            $(settings.thisid + " span." + settings.besidetext).html(settings.text[rating-1]);
			//div.find("input").val(rating);	//if there is an input in the div lets set it's value
			div.find("span.ratingicon").each(function(){	//now paint the stars
				
				var rating = parseInt($(this).parent().attr('data-rating'));
				var value = parseInt($(this).attr('data-value'));
				if (value > rating) { $(this).css('color',settings.coloroff); }
				else { $(this).css('color',settings.coloron); }
			})
		}

    };
 
}( jQuery ));

$(document).ready(function(){
	$("#stars-default").rating('create',{besidetext:"expertisetext"});
    $("#stars-default1").rating('create',{besidetext:"expertisetext",fixed:true});
    var currentyear = (new Date()).getFullYear();
    var bottomyear = 1989;
    for(var i  = currentyear;i > bottomyear;i--){
        var option = '<option value="' + i + '">' + i  + '</option>';
        $("select#skillyear").append(option);     
    }
});

var listskill = [];
//set attribute for class Experience
function Skill(attribute){
    this.attribute = attribute;
}
/*Add List Of Experience to Table*/ 
function addlistskill(index,row){
    // create edit & button acction
    var editAction = '<button class="btn btn-warning btn-sm btnEditSkill"><span class="glyphicon glyphicon-pencil"></span></button>';
    var deleteAction = '<button class="btn btn-danger btn-sm btnDeleteSkill"><span class="glyphicon glyphicon-remove"></span></button>';
    // add value of each attribute to row 
    var rowtable = "<tr style='font-size:13px'><td>" + index + "</td><td>" + row.Company + "</td><td>" + row.Designation + "</td><td>" + row.FromDate + ' - ' + row.ToDate + "</td><td>" + editAction + " " + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-skill tbody");
}
/*Get Value from Input on Edit case */
function getValueSkill(){
        //get dates and split to fromdate - todate
        var dates = $("#skill-form input[name='date']").val().split(" - ");
        var fromdate = dates[0];
        var todate = dates[1];
        //set value of each attribute to Experience
        var experience = new Experience(
            {
                "Company": $("#skill-form input[name='company']").val(),
                "Designation": $("#skill-form input[name='designation']").val(),
                "FromDate": fromdate,
                "ToDate": todate,
                "Details": $("#skill-form textarea[name='detail']").val(),
            }
        );
        return experience.attribute;
        
}
/*Add Button Click Event for Add List Experience */
$('#btnAddListExp').click(function() {
        //check valid on click
        var isValid = $('#skill-form').valid();
        var addedexprerience = getValueExp();
        var urlpost = window.location.href + '/experience/save';
        if(isValid){
         $.ajax({
        type: "POST",
        url: urlpost,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(addedexprerience),
        success: function (res) {
            //update new value to table 
            listexperience.push(new Experience(res.resdata)); 
            $("#list-experience tbody > tr").remove();
            $.each(listexperience, function(index,value ){
                addlistexp(index + 1,value.attribute);
            });
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
                             showAnnoucement(res.flag, 'experience', 'deleted');
                        }
                    },
                    error: function(x,e){
                        
                    }
                });               
                }else {
                    $("#skill-form")[0].reset();
                }
            }
        });  
});
/*Edit Button Click Event to Edit Value*/
$('#list-experience').on('click', '.btnEditExp' , function(e){
    e.preventDefault();
    var cells = $(this).closest("tr").children("td");
    indexcurrent = parseInt(cells.eq(0).text())-1;  
    $("#skill-form input[name='company']").val(cells.eq(1).text()).focus();  
    $("#skill-form input[name='designation']").val(cells.eq(2).text());
    $("#skill-form input[name='date']").val(cells.eq(3).text());
    $("#skill-form textarea[name='detail']").data('wysihtml5').editor.setValue(listexperience[indexcurrent].attribute.Details);
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
                showAnnoucement(res.flag, 'experience', 'edited');
            }
            
        },
        error: function(x,e){
            
        }
    }); 
    switchMode("save");
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
            $("#skill-form")[0].reset();
        //case button save    
        }else if (mode == 'save'){
            $('#btnSaveEditExp').hide();
            $('#btnCancelEditExp').hide();
            $('#btnAddListExp').show(); 
            $("#skill-form")[0].reset();
        }
}
/*Jquery Validation for #skill-form*/
$(document).ready(function() {
    $("#skill-form").validate({
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
                    minlength: "Your company's name  must be at least 2 characters long"
                },
                date: {
                    required: "Please enter your working time for this company "
                } 
            },
            errorPlacement:
            function(error, element){
                if(element.attr("name") == "date"){ 
                    error.insertAfter('#skill-form .input-group');
            }else{ 
                    error.insertAfter(element); 
                }
            }          
    });
});




