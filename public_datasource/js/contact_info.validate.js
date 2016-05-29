function Contact_Info_Validate(){
    var self = this;
    self.attrvalidate = [
        {validate: function(firstname){
            this.valid = false;
            this.required = true;
            this.min = 5;
            this.max = 49;
            if(firstname !=null || firstname !== ""){
                    var length = firstname.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "FirstName"},
        {validate: function(lastname){
            this.valid = false;
            this.required = true;
            this.min = 5;
            this.max = 49;
            if(lastname !=null || lastname !== ""){
                    var length = lastname.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "LastName"},
        {validate: function(avatar){
            
            this.valid = false;
            this.required = false;
            this.datatype = "data:image";
            this.maxsize = 5242880;
            var default_link = "/img/default_avatar.jpg";
            if(avatar == default_link || avatar == "" || avatar == null){
                avatar = default_link;
                this.valid = true;
            }else{
                var datatype_input = avatar.substring(0, 10);
                if(this.datatype == datatype_input){
                    var data = avatar.replace(/^data:image\/\w+;base64,/, '');
                  var decodedData = window.atob(data);
                    if(this.maxsize >= decodedData.length){
                        this.valid = true;
                    }
                }
            }
            return this.valid;
        }, attrname: "Avatar"},
        {validate: function(email){
            this.valid = false;
            this.required = true;
            this.regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/;
            if(email !=null || email !== ""){
                    this.valid = this.regex.test(email);
                }
            return this.valid;
        }, attrname: "Email"},
        {validate: function(phone){
            this.valid = false;
            this.require = true;
            this.regex = /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/;
            if(phone !=null || phone !== ""){
                this.valid = this.regex.test(phone);
            }
            return this.valid;
        }, attrname: "Phone"},
        {validate: null,attrname: "Website"},
        {validate: null,attrname: "Address"},
        {validate: null,attrname: "CV_Id"}];
}