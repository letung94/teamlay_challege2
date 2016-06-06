$(document).ready(function(){
    useWysihtml5("#validation_form_project textarea[name=project_details]");
    var self = this;
    self.listProject = [];
    var today = new Date();
    self.compareMilli = function(a,b){
        return new Date(b.ToDate) - new Date(a.ToDate);       
    }
    /*Get All Project belong to this CV.*/
    self.getAllProject = function(){        
        var url = window.location.href + "/project/getall";
        $.get(url, function(resp){
            console.log(resp);
            if(resp.code == 1){
                $.each(resp.rows, function(index, value){
                    if(value.ToDate){
                        var  d = moment(value.ToDate);
                        value.ToDate = d.format('YYYY/MM/DD');
                    }
                    if (value.FromDate){
                        var f = moment(value.FromDate);
                        value.FromDate = f.format('YYYY/MM/DD');
                    }
                    var entity = {
                        Id: value.Id,
                        Title: value.Title,
                        Url: value.Url || '',
                        FromDate: value.FromDate,
                        ToDate: value.ToDate,
                        Details: value.Details || '',
                        CV_Id: value.CV_Id || ''
                    }
                    self.listProject.push(entity);
                });
                //console.log(render)\
                
                self.renderTableBodyProject();
            }
        });
    }

    /*Render list of project*/
    self.renderTableBodyProject = function(){
        self.listProject.sort(self.compareMilli);
        var html = '';
        
        if (self.listProject.length == 0){
            html+= '<td colspan="6" align="center"> No data available </td>';
        }
        $.each(self.listProject, function(index, value){
            html +=`<tr style="font-size:13px"><td>` + value.Title + '</td>' + '<td>' + value.Url + '</td>' + '<td>' + value.FromDate + " - " + value.ToDate + '</td>' +
            '<td><button class="btn btn-warning btn-sm btn-edit-project" project_id= "' + value.Id + '"><span class="glyphicon glyphicon-pencil"></span></button> ' +
            '<button class="btn btn-danger btn-sm btn-delete-project" project_id= "' + value.Id + '"><span class="glyphicon glyphicon-remove"></span></button></td></tr>';
        })
        $('#project_table').html(html);
    }


    $(document).on('click', '.btn-delete-project', function(e) {
        e.preventDefault();
        var projectId = $(this).attr('project_id');
        var param = {id: projectId};
        var url = window.location.href + "/project/delete";
        var deletedProject;        
        BootstrapDialog.confirm({
            title: 'Confirm',
            message: 'Are you sure you want to delete this project?',
            callback: function(result){
                if(result){
                    $.blockUI();
                    $.post(url, param, function(resp){
                        $.unblockUI();
                        var code = resp.code;
                        if(code == 1){ /*Delete Successful*/
                            /*Get index of deleted project*/
                            var index = self.getIndexOfListProjectById(projectId);
                            deletedProject = self.listProject[index];

                            /*Remove at index*/
                            self.listProject.splice(index, 1);

                            /*Call render again to refresh project list*/
                            self.renderTableBodyProject();

                            /*Show the success message*/
                            $.gritter.add({
                                title: 'Success',
                                text: 'The Project <b>' + deletedProject.Title + '</b> has been deleted.',
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
                }
            }
        });


    });

    /*Bind data to form to edit when user click edit button.*/
    $(document).on('click', '.btn-edit-project', function() {
        $("label.text-danger").hide(); /*Hide Error when user add before edit*/
        var id = $(this).attr('project_id');
        var editingProject;
        $.each(self.listProject, function(index, project){
            if(project.Id == id){
                editingProject = project;
                return false;
            }
        });
        $('#validation_form_project input[name=id]').val(editingProject.Id);
        $('#validation_form_project input[name=project_title]').val(editingProject.Title);
        $('#validation_form_project input[name=project_url]').val(editingProject.Url);
        $('#validation_form_project input[name=project_date]').val(editingProject.FromDate + ' - ' + editingProject.ToDate);
        $('#validation_form_project textarea[name=project_details]').data("wysihtml5").editor.setValue(editingProject.Details);
        self.switchModeProject('edit');
    });


    /*Create new Project*/
    $('#btnAddListProject').click(function(){
        var isValid = $('#validation_form_project').valid();
        if(isValid){ /*If the form is valid*/
            entity =  {
                Title: $('#validation_form_project input[name=project_title]').val() || '',
                Url: $('#validation_form_project input[name=project_url]').val() || '',
                Details: $('#validation_form_project textarea[name=project_details]').val() || ''
            }
            var param = {entity : entity};
            // var date = $('#validation_form_project input[name=project_date]').val();
            var dates = $("#validation_form_project input[name='project_date']").val().split(" - ");
            var fromdate = dates[0];
            var todate = dates[1];
            entity.FromDate = fromdate;
            entity.ToDate = todate;
            // if(date && date.trim() != ''){
            //     entity.Date = date;
            // }
            var url = window.location.href +  '/project/add';
            $.blockUI();
            $.post(url, param, function(resp){
                $.unblockUI();
                var code = resp.code;
                if (code == 1){
                    $.gritter.add({
                        title: 'Success',
                        text: 'Project has been added.',
                        sticky: false,
                        time: '1500'
                    });
                }
                var insertedId = resp.data.insertId;
                entity.Id = insertedId;
                 if(!entity.Date)
                    entity.Date = '';
                self.listProject.push(entity);
                self.clearFormProject();
                self.renderTableBodyProject();
            });

        }
    });


    /*Reset form - clear all content*/
    self.clearFormProject = function(){
        $('#validation_form_project')[0].reset();
    };

    $('#btnCancelEditProject').click(function(){
        self.switchModeProject('add');
        self.clearFormProject();
    });
    /*Switch mode Add or delete*/
    self.switchModeProject = function(mode){
        mode = mode.toLowerCase();
        if(mode == 'add'){
            $('#btnSaveProject').hide();
            $('#btnCancelEditProject').hide();
            $('#btnAddListProject').show();
            $('.btn-delete-project').prop('disabled', false);
            $('.btn-edit-project').prop('disabled', false);
        }else if (mode == 'edit'){

            $('#btnSaveProject').show();
            $('#btnCancelEditProject').show();
            $('#btnAddListProject').hide();

            $('.btn-delete-project').prop('disabled', true);
            $('.btn-edit-project').prop('disabled', true);
        }

    };

     /*Check and send edit request to server*/
    $('#btnSaveProject').click(function(){
        var isValid = $('#validation_form_project').valid();
        if(isValid){ /*If the form is valid*/
            var dates = $("#validation_form_project input[name='project_date']").val().split(" - ");
            var fromdate = dates[0];
            var todate = dates[1];
            entity =  {
                id: $('#validation_form_project input[name=id]').val() || '',
                Title: $('#validation_form_project input[name=project_title]').val() || '',
                Url: $('#validation_form_project input[name=project_url]').val() || '',
                FromDate: fromdate,
                ToDate: todate,
                Details: $('#validation_form_project textarea[name=project_details]').val() || ''
            }
            var param = {entity : entity};
            var date = $('#validation_form_project input[name=date]').val();
            if(date && date.trim() != ''){
                entity.Date = date;
            }
            var url = window.location.href +  '/project/update';
            $.blockUI();

            $.post(url, param, function(resp){
                $.unblockUI();
                var code = resp.code;
                if(code == 1){ /*add new project success*/
                    /*Find and change project value at index*/
                    var index = self.getIndexOfListProjectById(entity.id);
                    var project = self.listProject[index];
                    project.Title = entity.Title;
                    project.Url = entity.Url || '';
                    project.Details = entity.Details || '';
                    project.FromDate = entity.FromDate || '';
                    project.ToDate = entity.ToDate || '';

                    /*Render the grid again*/
                    self.renderTableBodyProject();

                    /*Switch back to add mode and clear data*/
                    self.switchModeProject('add');
                    self.clearFormProject();

                    /*Show the success message*/
                    $.gritter.add({
                        title: 'Success',
                        text: 'Your project has been updated.',
                        sticky: false,
                        time: '1500'
                    });
                }else if (code == 0){

                }else{ /*code == -1*/

                }
            });
        }
    });

     self.getIndexOfListProjectById = function(id){
        var length = self.listProject.length;
        var index = -1;
        for (var i = 0; i < length; i++) {
            var project =  self.listProject[i];
            if(project.Id == id){
                index = i;
                break;
            }
        }
        return index;
    }

    /*Jquery Validation for #validation_form_project*/
    /*Custom jquery validation, input date must be before today.*/
    $.validator.addMethod("isBeforeTodayExp", function(value, element) {
        var today = new Date();
        var getTodate = value.split(" - ");
        var inputDate = new Date(getTodate[1]);
        return inputDate <= today;
    }, "The To Date should be in the past.");
    $.validator.addMethod("notEqFromToDate", function(value, element) {
        var splitDate = value.split(" - ");
        var toDate = new Date(splitDate[1]);
        var fromDate = new Date(splitDate[0]);
        return toDate - fromDate > 0;
    }, "The From Date & To Date should be different.");


    $("#validation_form_project").validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        rules: {
            project_title: {
                required: true,
                maxlength: 100
            },
            project_url: {
                maxlength: 100
            },
            project_date:{
                required: true,
                isBeforeTodayExp: true,
                notEqFromToDate: true
                //isBeforeToday: true
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "project_date")  {
                error.insertAfter("#project-date-error-message");
            }else {
                error.insertAfter(element);
            }
        }
    });

        /*initialize*/
        self.getAllProject();
});
