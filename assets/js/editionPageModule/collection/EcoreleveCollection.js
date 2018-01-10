/**
 * Created by David on 22/12/2015.
 */

define([
    'jquery',
    'backbone',
    '../models/fields',
    'backbone.radio',
    '../../Translater',
    '../editor/CheckboxEditor',
    'pillbox-editor',
    'app-config'
], function ($, Backbone, Fields, Radio, Translater, CheckboxEditor, PillboxEditor) {

    var fieldTemplate = _.template('\
        <div class="form-group field-<%= key %>">\
            <label class="control-label" for="<%= editorId %>"><%= title %></label>\
            <div data-editor >\
                <p class="help-block" data-error></p>\
                <p class="help-block"><%= help %></p>\
            </div>\
        </div>\
    ');

    var translater = Translater.getTranslater();

    var EcoreleveExtention = {
        schemaExtention: {
            author : {
                type        : 'Hidden',
                title       : translater.getValueFromKey('form.author'),
                editorClass : 'form-control',
                template    : fieldTemplate
            },
            isgrid : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('form.isgrid')
            },
            ishiddenprotocol : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('form.ishiddenprotocol')
            },
            hideprotocolname : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('form.hideprotocolname')
            },
            defaultforfieldactivity : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('form.defaultforfieldactivity')
            }
        },

        propertiesDefaultValues : {
            author : window.user,
            isgrid : "",
            ishiddenprotocol: "",
            hideprotocolname: "",
            defaultforfieldactivity: ""
        },

        rulesList : function() {
            return({});
        },

        getExtractedDatas: function(){
            return({});
        },

        getSchemaExtention: function(options){
            return({
                author : {
                    type        : 'Hidden',
                    title       : translater.getValueFromKey('form.author'),
                    editorClass : 'form-control',
                    template    : fieldTemplate
                },
                isgrid : {
                    type        : CheckboxEditor,
                    fieldClass  : "checkBoxEditor",
                    title       : translater.getValueFromKey('form.isgrid')
                },
                ishiddenprotocol : {
                    type        : CheckboxEditor,
                    fieldClass  : "checkBoxEditor",
                    title       : translater.getValueFromKey('form.ishiddenprotocol')
                },
                hideprotocolname : {
                    type        : CheckboxEditor,
                    fieldClass  : "checkBoxEditor",
                    title       : translater.getValueFromKey('form.hideprotocolname')
                },
                defaultforfieldactivity : {
                    type        : CheckboxEditor,
                    fieldClass  : "checkBoxEditor",
                    title       : translater.getValueFromKey('form.defaultforfieldactivity')
                }
            });
        },

        initializeExtention: function () {
            return(true);
        },

        jsonExtention: function (originalForm) {
            if (originalForm)
            {
                originalForm.author = window.user;
            }
            return(this.propertiesDefaultValues);
        },

        updateAttributesExtention: function () {
            return(true);
        }
    };

    return EcoreleveExtention;
});