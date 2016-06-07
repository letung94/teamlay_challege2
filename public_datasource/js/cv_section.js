var dragSrcEl = null;
var licontactinfo = '<li class="active"><a href="#contact-info" data-toggle="tab"><i class="fa fa-envelope"></i> Contact Information</a></li>';
var lisummary = '<li><a href="#summary" data-toggle="tab" onclick="getSummary()"><i class="fa fa-list-ul"></i> Summary</a></li>';
var liexperience = '<li value="'+ data[2].Section_Id +'" draggable="true"><a href="#experience" data-toggle="tab" onclick="getExperience()"><i class="fa fa-users"></i> Experience <span class="glyphicon glyphicon-move  mousemove"></a></li>';
var liproject = '<li value="'+ data[3].Section_Id +'" draggable="true"><a href="#project" data-toggle="tab" id="projectSection"><i class="fa fa-briefcase"></i> Project <span class="glyphicon glyphicon-move  mousemove"></a></li>';
var liskill = '<li value="'+ data[4].Section_Id +'"  draggable="true"><a href="#skill" data-toggle="tab" onclick="getSkill()"><i class="fa fa-thumbs-up"></i> Skill <span class="glyphicon glyphicon-move  mousemove"></a></li>'
var licertification = '<li value="'+ data[5].Section_Id +'" draggable="true"><a href="#certification" id="activeCertificationSection" data-toggle="tab"><i class="fa fa-copy"></i> Certification <span class="glyphicon glyphicon-move  mousemove"></a></li>';
var lieducation = '<li value="'+ data[6].Section_Id +'" draggable="true"><a href="#education" data-toggle="tab" onclick="getEducation()"><i class="fa fa-graduation-cap"></i> Education <span class="glyphicon glyphicon-move  mousemove"></a></li>';
var listarray = [licontactinfo,lisummary,liexperience,liproject,liskill,licertification,lieducation];
for(var i = 2; i < data.length; i++){
    $(listarray[data[i].Order-1]).appendTo("#myTab3");
}

function handleDragStart(e) {
// Target (this) element is the source node.
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    //e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    return false;
}

function handleDragEnter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');        
}

function handleDragLeave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
    // this/e.target is current target element.
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }
    [].forEach.call(cols, function (col) {
            col.classList.remove('over');
        });
    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
            var existactiveclass = dragSrcEl.classList.contains("active");
            if(existactiveclass == true){
                dragSrcEl.classList.remove('active');
                this.classList.add('active');
            }
            var dragSrcElvalue = dragSrcEl.value;
            var thisvalue = this.value;
            var datasend1 = null;
            var datasend2 = null;
            var innerhtmlThis = this.innerHTML;
            var innerhtmldragSrcEl = e.dataTransfer.getData('text/html');
            for(var i = 2; i < data.length; i++){
                if(data[i].Order == dragSrcElvalue){
                    datasend1 = data[i];
                }
                if(data[i].Order == thisvalue){
                    datasend2 = data[i];
                }
            }
            datasend1.Order = thisvalue;
            datasend2.Order = dragSrcElvalue;
            dragSrcEl.innerHTML = innerhtmlThis;
            this.innerHTML = innerhtmldragSrcEl;
            var urlpost = window.location.href + '/cv_section/update';
            $.ajax({
            type: "POST",
            url: urlpost,
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({data1:datasend1,data2:datasend2}),
            success: function (res,success) {
                var flag = res.data1.error + res.data2.error;
                if(flag == 2){
                    showAnnoucement(1, 'layout', 'updated');
                }else{
                    showAnnoucement(0, 'layout', 'updated');
                    dragSrcEl.innerHTML = innerhtmldragSrcEl;
                    this.innerHTML = innerhtmlThis;
                }
            },
            error: function(x,e){
                
            }
        }); 
    }
    return false;
}

function handleDragEnd(e) {

}

var cols = document.querySelectorAll('#myTab3 li[draggable="true"]');
[].forEach.call(cols, function(col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', handleDragEnter, false)
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
});