$(document).ready(function () {
    $('#table1').dataTable();

    // Block user
    var ajax_block_user_flag = false;

    $('.btn-block').click(function () {
        var self = this;
        var id = $(this).attr('user-id');
        var param = {
            id: id
        };
        if (ajax_block_user_flag == true) {
            return false;
        }
        BootstrapDialog.confirm({
            title: 'Confirm',
            message: 'Do you want to block this user ?',
            callback: function (result) {
                if (result) {
                    ajax_block_user_flag = true;
                    $.blockUI();
                    $.post("/cv/" + id + "/disable", param, function (resp) {
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
                        if ($('table[table-name=cv-list] tbody tr td:first-child h5').length == 0) {
                            $('table[table-name=cv-list] tbody').html('<tr><td colspan=\'4\'><h3>You don\'t have any CV. Do you want to create a new one ?</h3></td></tr>');
                        }
                    }).fail(function (xhr, textStatus, err) {
                        window.location = "/error/500";
                    }).always(function (data, textStatus, xhr) {
                        ajax_block_user_flag = false;
                        $.unblockUI();
                    });
                } else {
                    console.log('Deny');
                }
            }
        });
    });

});