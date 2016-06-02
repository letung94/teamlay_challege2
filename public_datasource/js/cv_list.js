$(document).ready(function () {
    //Nhieu change to use modal rename CV instead
    $('.btn-edit').click(function () {
        var cvid = $(this).attr('cv-id');
        var cvname = $(this).attr('cv-name');
        $('#validation_form_cvname input[name=cvname]').attr('value', cvname);
        $('#validation_form_cvname input[name=cvname]').attr('cv-id', cvid);
        $('#validation_form_cvname input[name=cvname]').val(cvname);
    });

    $('i[data-target=#rename-cv-modal]').hover(function () {
        $(this).css('cursor', 'pointer');
    });

    $('i[data-target=#rename-cv-modal]').click(function () {
        var cvid = $(this).attr('cv-id');
        var cvname = $(this).attr('cv-name');
        $('#validation_form_cvname input[name=cvname]').attr('value', cvname);
        $('#validation_form_cvname input[name=cvname]').val(cvname);
    });

    $('#btn-addnewcv').click(function () {
        $('#validation_form_cv').submit();
    });

    $('.btn-delete').click(function () {
        var self = this;
        var id = $(this).attr('cv-id');
        var cvname = $(this).attr('cv-name');
        var param = {
            id: id
        };
        if (confirm('Did you want to remove this CV ?')) {
            $.post("../cv/disableCV", param, function (resp) {
                if (resp.IsSuccess) {
                    $(self).closest('tr').remove();
                    $.gritter.add({
                        title: 'Success',
                        text: 'CV ' + cvname + ' has been successfully deleted',
                        sticky: false,
                        time: '1500'
                    });
                } else {
                    alert('The system is under maintenance, please try again later.');
                    // Some error if delete failed.
                }
            });
        } else {
            console.log('Deny');
        }
    });

    $('.btn-print').click(function () {
        var id = $(this).attr('cv-id');
        window.open('../template/template_list/' + id, '_blank');
    });

    $('#btn-renamecv').click(function () {
        var cvid = $('i[data-target=#rename-cv-modal]').attr('cv-id');
        var cvname = $('#validation_form_cvname input[name=cvname]').val();;
        var param = {
            cvname: cvname
        };
        $.post("../cv/" + cvid + "/update", param, function (resp) {
            if (resp.IsSuccess) {
                $('i[data-target=#rename-cv-modal]').attr('cv-name', resp.Name);
                $('#validation_form_cvname input[name=cvname]').attr('value', resp.Name);
                $('#validation_form_cvname input[name=cvname]').val(resp.Name);
                $('i[data-target=#rename-cv-modal]').closest("h3").children("span").html(resp.Name);
            } else {
                alert('The system is under maintenance, please try again later.');
                // Some error if delete failed.
            }
        });
    });

    var ajax_rename_flag = false;

    $('#btn-rename-cv-in-list').click(function () {
        var cvid = $('#validation_form_cvname input[name=cvname]').attr('cv-id');
        var cvname = $('#validation_form_cvname input[name=cvname]').val();;
        var param = {
            cvname: cvname
        };
        if (ajax_rename_flag == true) {
            console.log("AJAX is loading");
            return false;
        }
        ajax_rename_flag = true;
        $.post("../cv/" + cvid + "/update", param, function (resp) {
            ajax_rename_flag = false;
            if (resp.IsSuccess == 1) {
                $('#validation_form_cvname input[name=cvname]').attr('value', resp.Name);
                $('#validation_form_cvname input[name=cvname]').val(resp.Name);
                $('.cvname-link[cv-id=' + cvid + ']').html(resp.Name);
            } else {
                window.location = ("../error/500");
                // alert('The system is under maintenance, please try again later.');
                // Some error if delete failed.
            }
        });
    });
});