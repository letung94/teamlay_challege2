$(document).ready(function(){
    $('.btn-edit').click(function(){
        var id  = $(this).attr('cv-id');
        window.open('../cv/' + id, '_self');
    });

    //Nhieu delete to use modal instead
    // $('.btn-add').click(function(){
    //     window.open('../cv/', '_self');
    // });
    $('#btn-addnewcv').click(function(){
        console.log($('#validation_form_cv'));
        $('#validation_form_cv').submit();        
    });
    
    $('.btn-delete').click(function(){
        var self = this;
        var id  = $(this).attr('cv-id');
        var param = {id: id};
        if (confirm('Did you want to remove this CV ?')) {
            $.post( "../cv/disableCV", param, function( resp ) {
                if(resp.IsSuccess){
                    $(self).closest('tr').remove();
                }else{
                    alert('The system is under maintenance, please try again later.');
                    // Some error if delete failed.
                }
            });
        } else {
            console.log('Deny');
        }
    })

    $('.btn-print').click(function(){
        var id  = $(this).attr('cv-id');
        window.open('../template/template_list/' + id, '_blank');
    })
    
    $('#btn-renamecv').click(function(){
        console.log("asdas");
        $('#validation_form_cvname').submit();
    });
});
