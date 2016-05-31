$(document).ready(function(){
    $('.btn-edit').click(function(){
        var id  = $(this).attr('cv-id');
        window.open('../cv/' + id, '_self');
    });

    $('.btn-add').click(function(){
        window.open('../cv/', '_self');
    });

    $('.btn-delete').click(function(){
        var self = this;
        var id  = $(this).attr('cv-id');
        var param = {id: id};
        $.post( "disableCV", param, function( resp ) {
            if(resp.IsSuccess){
                $(self).closest('tr').remove();
            }else{
                alert('The system is under maintenance, please try again later.');
                // Some error if delete failed.
            }
        });
    })

    $('.btn-print').click(function(){
        var id  = $(this).attr('cv-id');
        window.open('../template/template_list/' + id, '_blank');
    })
});
