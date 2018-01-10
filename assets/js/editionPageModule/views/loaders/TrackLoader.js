
define([
    'jquery',
    'backbone',
    '../../models/fields',
    'backbone.radio',
    '../../../Translater',
    '../../editor/CheckboxEditor',
    'pillbox-editor',
    'app-config',
    './ContextLoader'
], function ($, Backbone, Fields, Radio, Translater, CheckboxEditor, PillboxEditor, AppConfig, ContextLoader) {

    var translater = Translater.getTranslater();
    var loader = ContextLoader;

    /**
    * Implement form object as a fields collection
    */
    var TrackLoader = {

        initializeLoader: function (form, URLoptions) {
            this.form = form;
            this.options = URLoptions;

            return(true);
        },

        loadFormDatas: function(){
            if (this.form.fields.unity)
            {
                this.loadUnities();
            }
            return(true);
        },

        loadUnities: function(){
            $.ajax({
                data        : "",
                type        : 'GET',
                url         : this.options.unities + "/" + window.context + "/fr",
                contentType : 'application/json',
                crossDomain : true,
                success: _.bind(function(data) {
                    var jsondata = JSON.parse(data);
                    var unityoptions = [];
                    $.each(jsondata.unities, function(index, value){
                        unityoptions.push(value);
                    });
                    this.form.fields.unity.editor.setOptions(unityoptions);
                }, this),
                error: _.bind(function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                }, this)
            });
        },

        getThisLoader : function(){
            return (this);
        }
    };

    return TrackLoader.getThisLoader();
});
