$(document).ready(function () {

    $('#curriculumvitae-form').validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        debug: true,
        rules: {
            cvnamecreate: {
                required: true
            }
        },
        messages: {
            cvnamecreate: {
                required: "This field is required."
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            if (element.attr("name") == "accept") {
                error.insertAfter("#accept_error-message");
            } else {
                error.insertAfter(element);
            }
        }
    });

    $('#validation_form_cvname').validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        debug: true,
        rules: {
            cvname: {
                required: true,
                maxlength: 50
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            if (element.attr("name") == "accept") {
                error.insertAfter("#accept_error-message");
            } else {
                error.insertAfter(element);
            }
        }
    });

    $('.btn-add').click(function () {
        $('#curriculumvitae-form').validate().resetForm();
        $('#curriculumvitae-form input[name=cvnamecreate]').val('');
    });

    //Nhieu change to use modal rename CV instead
    $('.btn-edit').click(function () {
        $('#validation_form_cvname').validate().resetForm();
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

    var ajax_create_cv_flag = false;

    $('#btn-addnewcv').click(function () {
        var isValid = $('#curriculumvitae-form').valid();
        if (ajax_create_cv_flag == true) {
            console.log("AJAX is loading");
            return false;
        }
        if (isValid) {
            ajax_create_cv_flag = true;
            var cvname = $("input[name=cvnamecreate]").val();
            var urlpost = window.location.href;
            $.post(urlpost, {
                cvname: cvname
            }, function (resp) {
                if (resp.flag == 1) {
                    window.location = (window.location.href + '/' + resp.data.Id);
                } else {
                    window.location = "/error/500";
                }
            }).fail(function (xhr, textStatus, err) {
                window.location = "/error/500";
            }).always(function (data, textStatus, xhr) {
                ajax_create_cv_flag = false;
            });
        }
    });

    var ajax_rename_cv_flag_section = false;

    $("#btn-renamecv").click(function () {
        var valid = $('#validation_form_cvname').valid();
        if (valid) {
            var cvid = $('i[data-target=#rename-cv-modal]').attr('cv-id');
            var cvname = $('#validation_form_cvname input[name=cvname]').val();
            var param = {
                cvname: cvname
            };
            if (ajax_rename_cv_flag_section == true) {
                console.log("AJAX is loading");
                return false;
            }
            ajax_rename_cv_flag = true;
            $.post("/cv/" + cvid + "/update", param)
                .done(function (resp, textStatus, jqXHR) {
                    $('#rename-cv-modal').modal('toggle');
                    if (resp.IsSuccess == 1) {
                        // $('.btn-edit[cv-id=' + cvid + ']').attr('cv-name', resp.Name);
                        $('#validation_form_cvname input[name=cvname]').attr('value', resp.Name);
                        $('#validation_form_cvname input[name=cvname]').val(resp.Name);
                        console.log($('.box-title span').html());
                        $('.box-title span').html(resp.Name);
                        console.log(resp);
                    } else {
                        window.location = ("/error/500");
                        // alert('The system is under maintenance, please try again later.');
                        // Some error if delete failed.
                    }
                }).fail(function (xhr, textStatus, err) {
                    window.location = "/error/500";
                }).always(function (data, textStatus, xhr) {
                    ajax_rename_cv_flag_section = false;
                });
        }
    });

    var ajax_delete_cv_flag = false;

    $('.btn-delete').click(function () {
        var self = this;
        var id = $(this).attr('cv-id');
        var cvname = $(this).attr('cv-name');
        var param = {
            id: id
        };
        if (ajax_delete_cv_flag == true) {
            return false;
        }
        BootstrapDialog.confirm({
            title: 'Confirm',
            message: 'Do you want to delete this CV ?',
            callback: function (result) {
                if (result) {
                    ajax_delete_cv_flag = true;
                    $.post("/cv/disableCV", param, function (resp) {
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
                        var i = 1;
                        $('table[table-name=cv-list] tbody tr td:first-child h5').each(function () {
                            $(this).html(i++);
                        });
                    }).fail(function (xhr, textStatus, err) {
                        window.location = "/error/500";
                    }).always(function (data, textStatus, xhr) {
                        ajax_delete_cv_flag = false;
                    });
                } else {
                    console.log('Deny');
                }
            }
        });
    });

    $('.btn-print').click(function () {
        var id = $(this).attr('cv-id');
        window.open('../template/template_list/' + id, '_blank');
    });

    var ajax_rename_cv_flag = false;

    $('#btn-rename-cv-in-list').click(function () {
        var valid = $('#validation_form_cvname').valid();
        if (valid) {
            var cvid = $('#validation_form_cvname input[name=cvname]').attr('cv-id');
            var cvname = $('#validation_form_cvname input[name=cvname]').val();;
            var param = {
                cvname: cvname
            };
            if (ajax_rename_cv_flag == true) {
                console.log("AJAX is loading");
                return false;
            }
            ajax_rename_cv_flag = true;
            $.post("/cv/" + cvid + "/update", param)
                .done(function (resp, textStatus, jqXHR) {
                    $('#rename-cv-modal').modal('toggle');
                    if (resp.IsSuccess == 1) {
                        $('.btn-edit[cv-id=' + cvid + ']').attr('cv-name', resp.Name);
                        $('#validation_form_cvname input[name=cvname]').attr('value', resp.Name);
                        $('#validation_form_cvname input[name=cvname]').val(resp.Name);
                        $('.cvname-link[cv-id=' + cvid + ']').html(resp.Name);
                    } else {
                        window.location = ("/error/500");
                        // alert('The system is under maintenance, please try again later.');
                        // Some error if delete failed.
                    }
                }).fail(function (xhr, textStatus, err) {
                    window.location = "/error/500";
                }).always(function (data, textStatus, xhr) {
                    ajax_rename_cv_flag = false;
                });
        }
    });
});