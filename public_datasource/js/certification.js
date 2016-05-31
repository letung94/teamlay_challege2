$(document).ready(function(){
    var self = this;
    self.listCertification = [];

    /*Get All Certification belong to this CV.*/
    var getAllCertification = function(){
        var url = window.location.href + "/certification/getall";
        $.get(url, function(resp){
            if(resp.code == 1){
                $.each(resp.rows, function(index, value){
                    self.listCertification.push(value);
                });
                //console.log(render)
                renderTableBody();
            }
        });
    }

    /*Render list of certification*/
    var renderTableBody = function(){
        var html = '';
        $.each(self.listCertification, function(index, value){
            html +='<tr><td>' + value.Title + '</td>' + '<td>' + value.Date + '</td>' + '<td>' + value.CertificateAuthority +
            '</td><td><button class="btn btn-warning btn-sm"><span class="glyphicon glyphicon-pencil"></span><button class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-remove"></span></button></td></tr>';
        })
        $('#certification_list').html(html);
    }

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

        /*initialize*/
        getAllCertification();
});
