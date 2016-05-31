$(document).ready(function(){
    $('#btnAddListCertification').click(function(){
        var isValid = $('#certification-form').valid();
        if(isValid){ /*If the form is valid*/
            var param = {
                entity: {
                    Title: $('#certification-form input[name=title]').val() || '',
                    CertificateAuthority: $('#certification-form input[name=certificationAuthority]').val() || '',
                    Details: $('#certification-form textarea[name=details]').val() || ''
                }
            };
            var date = $('#certification-form input[name=date]').val();
            if(date && date.trim() != ''){
                param.entity.Date = date;
            }
            var url = window.location.href +  '/certification/add';
            $.post(url, param, function(resp){
                var code = resp.code;
                var insertedId = resp.data.insertId;
            });
        }
    });

    /*Jquery Validation for #certification-form*/
    /*Custom jquery validation, input date must be before today.*/
    $.validator.addMethod("isBeforeToday", function(value, element) {
        if(!value || value.trim() == '')
            return true;
        var today = new Date();
        var inputDate = new Date(value);
        return inputDate <= today;
    }, "The date should be before today.");

    $("#certification-form").validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        rules: {
            title: {
                required: true,
                maxlength: 100
            },
            CertificationAuthority: {
                maxlength: 100
            },
            date:{
                isBeforeToday: true
            }
        },
    });
});
