$(document).ready(function() {
    $("#skill-form").validate({
            errorClass: 'text-danger',
            focusInvalid: true,
            rules: {
                name: {
                    required: true,
                    maxlength: 50
                }     
            },
            messages: {
                name: {
                    required: "Please enter your skill",
                    maxlength: "Your skill's name  must be less than 50 characters long"
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
			thisid: $(this).selector,
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
			//this.attr('data-rating',options);
            this.attr('data-rating',options.value);
            //alert(this.attr('data-rating'));
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
			div.find("input[name='expertise']").val(rating);	//if there is an input in the div lets set it's value
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
        $("#skill-form select[name='lastyearused']").append(option);     
    }
});
var indexcurrentskill = null;
var listskill = [];
//set attribute for class Skill
function Skill(attribute){
    this.attribute = attribute;
}
/*Add List Of Skill to Table*/ 
function addlistskill(index,row){
    // create edit & button acction
    var editAction = '<button class="btn btn-warning btn-sm btnEditSkill"><span class="glyphicon glyphicon-pencil"></span></button>';
    var deleteAction = '<button class="btn btn-danger btn-sm btnDeleteSkill"><span class="glyphicon glyphicon-remove"></span></button>';
    // add value of each attribute to row 
                      
    var rowname =  '<img  src="/img/default_avatar.jpg" class="default_avatar" /> <div class="form-group row">' + row.Name + '</div>';
    var indexpertise = 'stars-default' + index;
    var rowexpertise = '<div id="' + indexpertise + '" data-rating="' + row.Expertise + '"></div>';
    var rowtable = "<tr style='font-size:13px'><td>" + index + "</td><td>" + rowname + "</td><td>" + rowexpertise + "</td><td>" + row.Experience + "</td><td>" + row.LastYearUsed + "</td><td>" + editAction  + deleteAction + "</td></tr>";
    $(rowtable).appendTo("#list-skill tbody");
    var idstarrating = "#" + indexpertise;
    $(idstarrating).rating('create',{besidetext:"expertisetext",fixed:true});
    
}
/*Get Value from Input on Edit case */
function getValueSkill(){
        //set value of each attribute to Skill
        var skill = new Skill(
            {
                "Name": $("#skill-form input[name='name']").val(),
                "Expertise": $("#skill-form input[name='expertise']").val(),
                "Experience": $("#skill-form select[name='experience']").val(),
                "LastYearUsed": $("#skill-form select[name='lastyearused']").val()
            }
        );
        return skill.attribute;
        
}
/*Add Button Click Event for Add List Skill */
$('#btnAddListSkill').click(function() {
        /*
        //check valid on click
        */
        var isValid = $('#skill-form').valid();
        if(isValid){
            var addedskill = getValueSkill();
            var urlpost = window.location.href + '/skill/save';
            $.blockUI();
            $.ajax({
            type: "POST",
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(addedskill),
            success: function (res) {
                $.unblockUI();
                /*
                //update new value to table
                */
                if(res.flag==1){ 
                    listskill.push(new Skill(res.resdata)); 
                    $("#list-skill tbody > tr").remove();
                    $.each(listskill, function(index,value ){
                        addlistskill(index + 1,value.attribute);
                    });
                    switchModeSkill("add");
                    $("#skill-form")[0].reset();
                }
                showAnnoucement(res.flag, 'skill', 'added');
            },
            error: function(x,e){
                
            }
        }); 
   }      
});


/*Delete Button Click Event for Delete Value */
$('#list-skill').on('click', '.btnDeleteSkill' , function(e){
    e.preventDefault();
    var deletedskill = new Skill();
    indexcurrentskill = $(this).closest("tr").index();
    deletedskill.Id = listskill[indexcurrentskill].attribute.Id;
    var urlpost = window.location.href + '/skill/delete';
    /*
    //show popup confirm on click delete button
    */
    BootstrapDialog.confirm({
            title: 'Confirm',
            message: 'Are you sure?',
            callback: function(result) {
                if(result) {
                    $.blockUI();
                    $.ajax({
                    type: "POST",        
                    url: urlpost,
                    dataType: 'json',
                    async: false,
                    contentType: 'application/json; charset=utf-8',            
                    data: JSON.stringify(deletedskill),
                    success: function (res) {
                        $.unblockUI();
                        if(res.flag==1){
                            /*
                            //remove value from array by index and update to table
                            */
                            listskill.splice(indexcurrentskill, 1);    
                            $("#list-skill tbody > tr").remove();
                            $.each(listskill, function( index, value ){
                                addlistskill(index + 1,value.attribute);
                            });
                             showAnnoucement(res.flag, 'skill', 'deleted');
                             if(listskill.length == 0){
                                $('#list-skill tbody').append('<tr><td colspan="6" align="center"> No data available </td></tr>');
                            }
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
$('#list-skill').on('click', '.btnEditSkill' , function(e){
    e.preventDefault();
    var cells = $(this).closest("tr").children("td");
    indexcurrentskill = parseInt(cells.eq(0).text())-1;
    var edittingskill = listskill[indexcurrentskill].attribute;  
    $("#skill-form input[name='name']").val(edittingskill.Name).focus();  
    $("#stars-default").rating('set',{value: parseInt(edittingskill.Expertise),besidetext:"expertisetext"});
    $("#skill-form select[name='experience']").val(edittingskill.Experience);
    $("#skill-form select[name='lastyearused']").val(edittingskill.LastYearUsed);
    switchModeSkill("edit");
    $('#skill-form').validate().resetForm();
  
});
/*
//Save edittingskill 
 */
$('#btnSaveEditSkill').click(function() {
    var isValid = $('#skill-form').valid();
    if(isValid){
        var savedskill = getValueSkill();
        savedskill.Id = listskill[indexcurrentskill].attribute.Id;
        savedskill.CV_Id = listskill[indexcurrentskill].attribute.CV_Id;
        var urlpost = window.location.href + '/skill/update';
        $.blockUI();
            $.ajax({
            type: "POST",
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(savedskill),
            success: function (res) {
                $.unblockUI();
                if(res.flag==1){
                    listskill.splice(indexcurrentskill, 1);
                    listskill.splice(indexcurrentskill, 0, new Skill(res.resdata));
                    $("#list-skill tbody > tr").remove();
                    $.each(listskill, function( index, value ){
                        addlistskill(index + 1,value.attribute);
                    });
                    switchModeSkill("add");
                    $("#skill-form")[0].reset();
                }
                showAnnoucement(res.flag, 'skill', 'edited');
            },
            error: function(x,e){
                
            }
        }); 
        
    }      
    
});
$('#btnCancelEditSkill').click(function() {  
    switchModeSkill("add");
    $("#skill-form")[0].reset();
});

var clickedskill = false;
function getSkill(){
    if(clickedskill==true){
        return;
    }
    var urlget = window.location.href + "/skill/getall";
    $.blockUI();
    $.ajax({
        type: "GET",
        url: urlget,
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (res) {  
            $.unblockUI(); 
            if(res.flag == 1){
                $("#list-skill tbody > tr").remove();
                clickedskill = true;
                $.each(res.resdata, function( index, value ) {
                listskill.push(new Skill(value));          
                addlistskill(index + 1,value);
                }); 
            }               
            },
        error: function(x,e){
            
        }
    });
}
/*Switch mode Add or delete*/
function switchModeSkill(mode){
    mode = mode.toLowerCase();
    if(mode == 'add'){
        $('#btnSaveEditSkill').hide();
        $('#btnCancelEditSkill').hide();
        $('#btnAddListSkill').show();
        $('.btnDeleteSkill').prop('disabled', false);
        $('.btnEditSkill').prop('disabled', false);
        $("#stars-default").rating('set',{value: 1,besidetext:"expertisetext"});
    }else if (mode == 'edit'){
        $('#btnSaveEditSkill').show();
        $('#btnCancelEditSkill').show();
        $('#btnAddListSkill').hide();
        $('.btnDeleteSkill').prop('disabled', true);
        $('.btnEditSkill').prop('disabled', true);
    }
    
}



