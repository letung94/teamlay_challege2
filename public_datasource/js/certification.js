$(document).ready(function(){
    var self = this;

    self.listCertification = [];

    /*Get All Certification belong to this CV.*/
    self.getAllCertification = function(){
        var url = window.location.href + "/certification/getall";
        $.get(url, function(resp){
            console.log(resp);
            if(resp.code == 1){
                $.each(resp.rows, function(index, value){
                    self.listCertification.push(value);
                });
                self.renderTableBody();
            }
        });
    }

    /*Reset form - clear all content*/
    self.clearForm = function(){
        $('#certification-form')[0].reset();
    };

    /*Render list of certification*/
    self.renderTableBody = function(){
        var html = '';
        $.each(self.listCertification, function(index, value){
            html +='<tr><td>' + value.Title + '</td>' + '<td>' + value.CertificateAuthority + '</td>' + '<td>' + value.Date +
            '</td><td><button class="btn btn-warning btn-sm"><span class="glyphicon glyphicon-pencil"></span></button>' +
            '<button class="btn btn-danger btn-sm btn-delete-certificate" certification-id="' + value.Id + '"><span class="glyphicon glyphicon-remove"></span></button></td></tr>';
        })
        $('#certification_list').html(html);
    }

    /*Create new Certification*/
    $('#btnAddListCertification').click(function(){
        var isValid = $('#certification-form').valid();
        if(isValid){ /*If the form is valid*/
            entity =  {
                Title: $('#certification-form input[name=title]').val() || '',
                CertificateAuthority: $('#certification-form input[name=certificationAuthority]').val() || '',
                Details: $('#certification-form textarea[name=details]').val() || ''
            }
            var param = {entity : entity};
            var date = $('#certification-form input[name=date]').val();
            if(date && date.trim() != ''){
                entity.Date = date;
            }
            var url = window.location.href +  '/certification/add';
            $.post(url, param, function(resp){
                var code = resp.code;
                if(code == 1){ /*add new certification success*/
                    /*Show the success message*/
                    $.gritter.add({
                        title: 'Success',
                        text: 'Your new certification has been added.',
                        sticky: false,
                        time: '1500'
                    });
                    var insertedId = resp.data.insertId;
                    entity.Id = insertedId
                    self.listCertification.push(entity);
                    self.renderTableBody();
                    self.clearForm();
                }
            });
        }
    });

    /*Delete Certification - this button is dynamic so we write this way.*/
    $(document).on('click', '.btn-delete-certificate', function() {
        var confirmDelete = confirm("Are you sure you want to delete this certification? ");
        if(!confirmDelete)
            return false;
        var certificationId = $(this).attr('certification-id');
        var param = {id: certificationId};
        var url = window.location.href + "/certification/delete";
        var deletedCertification;
        $.post(url, param, function(resp){
            var code = resp.code;
            if(code == 1){ /*Delete Successful*/
                /*Get index of deleted certification*/
                var length = self.listCertification.length;
                var index;
                for(var i = 0; i < length; i++){
                    var certification = self.listCertification[i];
                    if(certification.Id == certificationId){ /*The Id in list match the deleted Id*/
                        index = i;
                        deletedCertification = certification;
                        break;
                    }
                }
                /*Remove at index*/
                self.listCertification.splice(index, 1);

                /*Call render again to refresh certification list*/
                self.renderTableBody();

                /*Show the success message*/
                $.gritter.add({
                    title: 'Success',
                    text: 'The Certification <b>' + deletedCertification.Title + '(' + deletedCertification.CertificationAuthority  + ')</b> has been deleted.',
                    sticky: false,
                    time: '1500'
                });
            }else if (code == 0){
                $.gritter.add({
                    title: 'Error',
                    text:  res.rows + '.',
                    sticky: false,
                    time: '1500'
                });
            }else if(code == -1){
                // TODO
            }
        });
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
    self.getAllCertification();
});
