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
            spanclass:"starrating",
            fixed: false
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
                this.append('<span class="'+ settings.spanclass +'">'+ settings.text[settings.value] +'</span>');
			//paint
			    
            }else{
                this.append('<span class="'+ settings.spanclass +'">'+ settings.text[settings.value] +'</span>');
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
            $("span." + settings.spanclass).html(settings.text[rating-1]);
			div.find("input").val(rating);	//if there is an input in the div lets set it's value
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
	$("#stars-default").rating('create',{spanclass:"expertisetext"});
    $(".stars-default1").rating('create',{spanclass:"expertisetext",fixed:true});
    $(".stars-default2").rating('create',{spanclass:"expertisetext",fixed:true});
    $(".stars-default3").rating('create',{spanclass:"expertisetext",fixed:true});
    var currentyear = (new Date()).getFullYear();
    var bottomyear = 1989;
    for(var i  = currentyear;i > bottomyear;i--){
        var option = '<option value="' + i + '">' + i  + '</option>';
        $("select#skillyear").append(option);     
    }
});


