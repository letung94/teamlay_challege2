/*--------------------*/

function db(host, user, pass, dbname, mysqlmodel) {
    var self = this;
    this.host = host;
    this.user = user;
    this.pass = pass;
    this.dbname = dbname;
    this.mysqlmodel = mysqlmodel;
    this.MyAppModel = this.mysqlmodel.createConnection({
        host: this.host,
        user: this.user,
        password: this.pass,
        database: this.dbname,
    });
    this.User = this.MyAppModel.extend({
        tableName: 'user'
    });
    this.CV = this.MyAppModel.extend({
        tableName: 'curriculum_vitae'
    });
    this.contact_info = this.MyAppModel.extend({
        tableName: 'contact_info'
    });
    this.Certification = this.MyAppModel.extend({
        tableName: 'certification'
    });
    this.Summary = this.MyAppModel.extend({
        tableName: 'summary'
    });
    this.Skill = this.MyAppModel.extend({
        tableName: 'skill'
    });
    this.Education = this.MyAppModel.extend({
        tableName: 'education'
    });
    this.Experience = this.MyAppModel.extend({
        tableName: 'experience'
    });
    this.Project = this.MyAppModel.extend({
        tableName: 'project'
    });
    this.Section = this.MyAppModel.extend({
        tableName: 'section' 
    });
    this.CV_Section = this.MyAppModel.extend({
        tableName: 'cv_section' 
    });
};



module.exports = db;