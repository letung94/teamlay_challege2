$(document).ready(function(){
    var self = this;
    self.listProject = [];
    var today = new Date();
    $('#date_project').val(today.getFullYear() + "/" + (today.getMonth() - 1) + "/" + today.getDate()); 
    /*Get All Project belong to this CV.*/
    self.getAllProject = function(){
        
        var url = window.location.href + "/project/getall";
        $.get(url, function(resp){
            console.log(resp);
            if(resp.code == 1){
                $.each(resp.rows, function(index, value){
                    self.listProject.push(value);
                });
                //console.log(render)\
                self.renderTableBodyProject();
            }
        });
    }

    /*Render list of project*/
    self.renderTableBodyProject = function(){
        var html = '';
        
        $.each(self.listProject, function(index, value){
            html +=`<tr><td id="project_${value.Id}">` + value.Title + '</td>' + '<td>' + value.Url + '</td>' + '<td>' + value.Date + '<td>' + value.Details + '</td>' + 
            '</td><td><button class="btn btn-warning btn-sm"><span class="glyphicon glyphicon-pencil"></span></button>' +
            '<button class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-remove"></span></button></td></tr>' + 
            `<input type="hidden" id=project-${value.Id} value="${value.Id}">`;
        })
        $('#project_table').html(html);
    }

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
            var date = $('#validation_form_project input[name=project_date]').val();
            if(date && date.trim() != ''){
                entity.Date = date;
            }
            var url = window.location.href +  '/project/add';
            $.post(url, param, function(resp){
                var code = resp.code;
                var insertedId = resp.data.insertId;
                entity.Id = insertedId;
                self.listProject.push(entity);
                self.renderTableBodyProject();
            });
            
        }
    });
    
    $('#btnSaveProject').click(function(){
        var isValid = $('#validation_form_project').valid();
        if(isValid){ /*If the form is valid*/
            entity =  {
                Id: $('#validation_form_project input[name=project_title]').val() || '',
                Title: $('#validation_form_project input[name=project_title]').val() || '',
                Url: $('#validation_form_project input[name=project_url]').val() || '',
                Details: $('#validation_form_project textarea[name=project_details]').val() || ''
            }
            var param = {entity : entity};
            var date = $('#validation_form_project input[name=project_date]').val();
            if(date && date.trim() != ''){
                entity.Date = date;
            }
            var url = window.location.href +  '/project/update';
            $.post(url, param, function(resp){
                var code = resp.code;
                var insertedId = resp.data.insertId;
                entity.Id = insertedId;
                //self.listProject.push(entity);
                self.renderTableBodyProject();
            });
            
        }
    });    

    /*Jquery Validation for #validation_form_project*/
    /*Custom jquery validation, input date must be before today.*/
    $.validator.addMethod("isBeforeToday", function(value, element) {
        if(!value || value.trim() == '')
            return true;
        var today = new Date();
        var inputDate = new Date(value);
        return inputDate <= today;
    }, "The date should be before today.");

    $("#validation_form_project").validate({
        errorClass: 'text-danger',
        focusInvalid: true,
        rules: {
            title: {
                required: true,
                maxlength: 100
            },
            Url: {
                maxlength: 100
            },
            project_date:{
                isBeforeToday: true
            }
        },
    });

        /*initialize*/
        self.getAllProject();
});
