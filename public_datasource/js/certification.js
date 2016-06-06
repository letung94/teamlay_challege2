$(document).ready(function(){
    var self = this;

    self.firstTime = true;
    self.listCertification = [];

    $('#activeCertificationSection').click(function(){
        if(self.firstTime){
            self.getAllCertification();
        }
    });

    /*Get All Certification belong to this CV.*/
    self.getAllCertification = function(){
        /*Only allow to call once*/
        $.blockUI();
        var url = window.location.href + "/certification/getall";
        $.get(url, function(resp){
            self.firstTime = false;
            $.unblockUI();
            if(resp.flag == 1){
                $.each(resp.rows, function(index, value){
                    /*Change from server's date to readable YYYY/MM/DD*/
                    if(value.Date){
                        var  d = moment(value.Date);
                        value.Date = d.format('YYYY/MM/DD');
                    }

                    /*Do this again to prevent list showing null or undefined*/
                    var entity= {
                        Id: value.Id,
                        Title: value.Title,
                        CertificateAuthority: value.CertificateAuthority || '',
                        Date: value.Date || '',
                        Details: value.Details,
                        CV_Id: value.CV_Id || ''
                    }

                    /*Push to list and render*/
                    self.listCertification.push(entity);
                    self.renderTableBody();
                });
            } else if (resp.flag == 0){
                /*Call render to render "no data..." string*/
                self.renderTableBody();
            } else { /*flag == -1*/
                showAnnoucement(-1, '', '');
            }
        });
    }

    /*Reset form - clear all content*/
    self.clearForm = function(){
        $('#certification-form')[0].reset();
    };

    /*Render list of certification*/
    self.renderTableBody = function(){
        if(self.listCertification.length == 0){
            $('#list-certification tbody').html('<tr><td colspan="5" align="center"> No data available </td></tr>');
        }else{
            var html = '';
            $.each(self.listCertification, function(index, value){
                html +='<tr><td>' + value.Title + '</td>' + '<td>' + value.CertificateAuthority + '</td>' + '<td>' + value.Date  +
                '</td><td><button class="btn btn-warning btn-sm btn-edit-certification" certification-id="' + value.Id + '"><span class="glyphicon glyphicon-pencil"></span></button>' +
                '<button class="btn btn-danger btn-sm btn-delete-certification" certification-id="' + value.Id + '"><span class="glyphicon glyphicon-remove"></span></button></td></tr>';
            })
            $('#certification_list').html(html);
        }
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
            $.blockUI();
            $.post(url, param, function(resp){
                $.unblockUI();
                var flag = resp.flag;
                if(flag == 1){ /*add new certification success*/
                    /*Show the success message*/
                    $.gritter.add({
                        title: 'Success',
                        text: 'Your new certification has been added.',
                        sticky: false,
                        time: '1500'
                    });
                    var insertedId = resp.data.insertId;
                    entity.Id = insertedId
                    if(!entity.Date) /*To prevent show undefined in grid*/
                    entity.Date = '';
                    self.listCertification.push(entity);
                    self.renderTableBody();
                    self.clearForm();
                }else if(flag == 0){
                    showAnnoucement(0,'','');
                }else { /*flag == -1*/
                    showAnnoucement(-1, '', '');
                }
            });
        }
    });

    /*Delete Certification - this button is dynamic so we write this way.*/
    $(document).on('click', '.btn-delete-certification', function() {
        var that = this;

        BootstrapDialog.confirm({
            title: 'Confirm',
            message: 'Are you sure you want to delete this Certification?',
            callback: function(result) {
                if(result) {
                    var certificationId = $(that).attr('certification-id');
                    var param = {id: certificationId};
                    var url = window.location.href + "/certification/delete";
                    var deletedCertification;
                    $.blockUI();
                    $.post(url, param, function(resp){
                        $.unblockUI();
                        var flag = resp.flag;
                        if(flag == 1){ /*Delete Successful*/
                            /*Get index of deleted certification*/
                            var index = self.getIndexOfListCertificationById(certificationId);
                            deletedCertification = self.listCertification[index];

                            /*Remove at index*/
                            self.listCertification.splice(index, 1);

                            /*Call render again to refresh certification list*/
                            self.renderTableBody();

                            /*Show the success message*/
                            $.gritter.add({
                                title: 'Success',
                                text: 'The Certification <b>' + deletedCertification.Title + '(' + deletedCertification.CertificateAuthority  + ')</b> has been deleted.',
                                sticky: false,
                                time: '1500'
                            });
                        }else if (flag == 0){
                            showAnnoucement(0,'','');
                        }else if(flag == -1){
                            showAnnoucement(-1,'','');
                        }
                    });
                }
            }
        });
    });

    /*Bind data to form to edit when user click edit button.*/
    $(document).on('click', '.btn-edit-certification', function() {
        $("label.text-danger").hide(); /*Hide Error when user add before edit*/
        var id = $(this).attr('certification-id');
        var editingCertification;
        $.each(self.listCertification, function(index, certification){
            if(certification.Id == id){
                editingCertification = certification;
                return false;
            }
        });
        $('#certification-form input[name=id]').val(editingCertification.Id);
        $('#certification-form input[name=title]').val(editingCertification.Title);
        $('#certification-form input[name=certificationAuthority]').val(editingCertification.CertificateAuthority);
        $('#certification-form input[name=date]').val(editingCertification.Date);
        $('#certification-form textarea[name=details]').data("wysihtml5").editor.setValue(editingCertification.Details);

        $('#certification-form input[name=title]').focus();

        self.switchMode('edit');
    });

    /*Check and send edit request to server*/
    $('#btnSaveCertification').click(function(){
        var isValid = $('#certification-form').valid();
        if(isValid){ /*If the form is valid*/
            entity =  {
                id: $('#certification-form input[name=id]').val() || '',
                Title: $('#certification-form input[name=title]').val() || '',
                CertificateAuthority: $('#certification-form input[name=certificationAuthority]').val() || '',
                Details: $('#certification-form textarea[name=details]').val() || ''
            }
            var param = {entity : entity};
            var date = $('#certification-form input[name=date]').val();
            if(date && date.trim() != ''){
                entity.Date = date;
            }
            var url = window.location.href +  '/certification/edit';
            $.blockUI();
            $.post(url, param, function(resp){
                $.unblockUI();
                var flag = resp.flag;
                if(flag == 1){ /*add new certification success*/
                    /*Find and change certification value at index*/
                    var index = self.getIndexOfListCertificationById(entity.id);
                    var certification = self.listCertification[index];
                    certification.Title = entity.Title;
                    certification.CertificateAuthority = entity.CertificateAuthority || '';
                    certification.Details = entity.Details || '';
                    certification.Date = entity.Date || '';

                    /*Render the grid again*/
                    self.renderTableBody();

                    /*Switch back to add mode and clear data*/
                    self.switchMode('add');
                    self.clearForm();

                    /*Show the success message*/
                    $.gritter.add({
                        title: 'Success',
                        text: 'Your new certification has been updated.',
                        sticky: false,
                        time: '1500'
                    });
                }else if (flag == 0){
                    showAnnoucement(0, '', '');
                }else{ /*flag == -1*/
                    showAnnoucement(-1, '', '');
                }
            });
        }
    });

    /*Return index of object that match id in self.listCertification*/
    self.getIndexOfListCertificationById = function(id){
        var length = self.listCertification.length;
        var index = -1;
        for (var i = 0; i < length; i++) {
            var certification =  self.listCertification[i];
            if(certification.Id == id){
                index = i;
                break;
            }
        }
        return index;
    }

    /*When user is editting certification and want to cancel instead of save*/
    $('#btnCancelEdit').click(function(){
        self.switchMode('add');
        self.clearForm();
    });
    /*Switch mode Add or delete*/
    self.switchMode = function(mode){
        mode = mode.toLowerCase();
        if(mode == 'add'){
            $('#btnSaveCertification').hide();
            $('#btnCancelEdit').hide();
            $('#btnAddListCertification').show();
            $('.btn-delete-certification').prop('disabled', false);
            $('.btn-edit-certification').prop('disabled', false);
            btnAddListCertification
        }else if (mode == 'edit'){
            $('#btnSaveCertification').show();
            $('#btnCancelEdit').show();
            $('#btnAddListCertification').hide();
            $('.btn-delete-certification').prop('disabled', true);
            $('.btn-edit-certification').prop('disabled', true);
        }
    };

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
                required: true,
                isBeforeToday: true
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "date")  {
                error.insertAfter("#date-error-message");
            }else {
                error.insertAfter(element);
            }
        }
    });

    /*Initialize*/
    useWysihtml5("#certification-form textarea[name='details']");
});
