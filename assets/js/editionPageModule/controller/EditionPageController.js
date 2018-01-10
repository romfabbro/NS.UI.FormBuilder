define([
    'jquery',
    'marionette',
    '../layout/EditionPageLayout',
    '../collection/FieldCollection',
    'backbone.radio'
], function($, Marionette, EditionPageLayout, FieldCollection, Radio) {

    /**
     * EditionPageModule controller
     */
    var EditionPageController = Marionette.Controller.extend({


        /**
         * Controller constructor
         *
         * @param  {object} options Configuration variable
         */
        initialize: function(options) {
            // Kepp homepage region
            this.editionPageRegion = options.editionPageRegion;
            this.URLOptions        = options['URLOptions'] || {};

            this.setFieldCollection(null, options['URLOptions']);

            this.initFormChannel();
            this.getLinkedFieldsList();
            this.getPreConfiguratedFields();
            this.initMainChannel();
        },

        /**
         * Init main radio channel for communicate in the editionPageModule
         */
        initMainChannel : function() {
            //  The edition channel is the main channel ONLY in the editionPageModule
            this.mainChannel = Backbone.Radio.channel('edition');

            this.mainChannel.on('saveTemplate', this.saveTemplate, this);
        },

        /**
         * Get all pre configurated field
         */
        getPreConfiguratedFields : function () {

            /*
            $.getJSON(this.URLOptions.preConfiguredField, _.bind(function(fieldList) {
                this.preConfiguredFieldList = fieldList;
            }, this))
            */
        },

        /**
         * Get all avalaible linked field
         */
        getLinkedFieldsList : function() {
            $.getJSON(this.URLOptions.linkedFields, _.bind(function(linkedFieldsList) {
                this.linkedFieldsList = linkedFieldsList;
            }, this));
        },

        /**
         * Init form channel only for edition page module communication
         */
        initFormChannel : function() {
            this.formChannel = Backbone.Radio.channel('form');

            //  Event receive from widgetPanel when user want to add a field on its form
            this.formChannel.on('addElement', this.addElementToCollection, this);
            this.formChannel.on('addNewElement', this.addNewElementToCollection, this);

            //  Event receive when user wants to export its form in JSON file
            this.formChannel.on('export', this.exportFormAsFile, this);

            //  Event send from router when user import a form or edit a form from the grid
            //this.formChannel.on('formEdition', this.editForm, this);

            this.formChannel.on('import', this.import, this);

            //  Event receive from a field field (see BaseView.js) when user wants to edit field properties
            this.formChannel.on('editModel', this.modelSetting, this);

            //  Event send from settingFieldPanel when user wants to save a field as a preconfigurated field
            this.formChannel.on('saveConfiguration', this.saveConfiguration, this);

            this.formChannel.on('setFieldCollection', this.setFieldCollection, this);
        },

        /**
         * Export current form (fieldCollection) in JSON file
         *
         * @param {string} filename filename
         */
        exportFormAsFile : function(filename) {
            require(['blobjs', 'filesaver'], _.bind(function(Blob, Filesaver) {
                try {

                    var isFileSaverSupported = !!new Blob();
                    var blob = new Blob([JSON.stringify(this.fieldCollection.getJSON(), null, 2)], {
                        type: "application/json;charset=utf-8"
                    });

                    var fs = new Filesaver(blob, filename + '.json');

                    //  All is good
                    this.formChannel.trigger('exportFinished', true);
                } catch (e) {
                    //  An error occured when we try to save form as JSON file
                    this.formChannel.trigger('exportFinished', false);
                }
            }, this))
        },

        /**
         * Main controller action, display edition page layout
         */
        editionAction: function(options) {
            delete this.currentEditionPageLayout;

            // TODO Display Context
            $('#navbarContext').text($.t('navbar.context.edition') + (window.context?' - '+window.context:''));

            var editionPageLayout = new EditionPageLayout({
                fieldCollection : this.fieldCollection,
                URLOptions      : this.URLOptions
            });

            this.editionPageRegion.show( editionPageLayout );

            this.currentEditionPageLayout = editionPageLayout;
        },

        /**
         * User wants to add a field into the collection
         *
         * @param {string} elementClassName field class like TextField
         */
        addElementToCollection : function(elementClassName) {
            this.fieldCollection.addElement(elementClassName);
        },

        /**
         * User wants to add a new field into the collection
         *
         * @param {string} newElementClassName new field class like TextField
         */
        addNewElementToCollection : function(newElementClassName, attributes) {
            this.lastNewElementAdded = this.fieldCollection.addNewElement(newElementClassName, attributes, false);
        },

        modelSetting: function(modelID) {

            if (modelID == false)
                modelID = this.lastNewElementAdded;

            //  Get many information with Ajax and send it to the layout
            //  And the layout display the setting panel

            this.formChannel.trigger('initFieldSetting', {
                URLOptions             : this.URLOptions,
                linkedFieldsList       : this.linkedFieldsList,
                preConfiguredFieldList : this.preConfiguredFieldList,
                modelToEdit            : this.fieldCollection.get(modelID),
                fieldsList             : this.fieldCollection.getFieldList(modelID)

            });
        },

        /**
         * Send an event to FieldCollection
         *
         * @param  {Object} formImportedJSON imported form JSON data
         */
        import : function(formImportedJSON) {

            //
            //  If there isn't .json in the URL, the form list come from server
            //  And the server returns only form attributes, not schema to lighten AJAX weight
            //  So we get the schema now
            //

            if (this.URLOptions.forms.indexOf('.json') < 0 && formImportedJSON && formImportedJSON.id > 0) {

                $.getJSON(this.URLOptions.forms + '/' + formImportedJSON['id'], _.bind(function(data){
                    this.fieldCollection.updateWithJSON(data['form'])
                }, this));

            } else {
                this.fieldCollection.updateWithJSON(formImportedJSON)
            }
        },

        /**
         * Save field as pre configurated field
         *
         * @param fieldToSave field to save
         */
        saveConfiguration : function(fieldToSave) {
            var getBinaryWeight = function(editModeVal) {
                var toret = editModeVal;
                if (!$.isNumeric(editModeVal))
                {
                    var loop = 1;
                    toret = 0;
                    for (var index in editModeVal) {
                        if(editModeVal[index])
                            toret += loop;
                        loop *= 2;
                    };
                }
                return(toret);
            };

            var setUnexistingStuff = function(mymodel){
                var compulsoryProps = ['editorClass', 'fieldClassEdit', 'fieldClassDisplay'];

                $.each(compulsoryProps, function(index, value){
                    if (!mymodel[value])
                        mymodel[value] =  '';
                });
            };

            fieldToSave.field.editMode = getBinaryWeight(fieldToSave.field.editMode);

            setUnexistingStuff(fieldToSave.field);

            $.ajax({
                type: "POST",
                url: this.URLOptions.fieldConfigurationURL,
                contentType : 'application/json',
                data: JSON.stringify(fieldToSave),
                success: _.bind(function() {
                    this.formChannel.trigger('configurationSaved:success');
                }, this),
                dataType: 'json',
                error : _.bind(function() {
                    this.formChannel.trigger('configurationSaved:fail');
                }, this),
                fail : _.bind(function() {
                    this.formChannel.trigger('configurationSaved:fail');
                }, this)
            });
        },

        /**
         * Save the collection as a for template
         *
         * @param templateAttributes new template attributes
         */
        saveTemplate : function(templateAttributes) {
            this.fieldCollection.updateCollectionAttributes(templateAttributes);

            this.fieldCollection.saveAsTemplate();
        },

        setFieldCollection : function(context, urloptions, formName)
        {
            var formSaveUrl = null;
            if (urloptions)
                formSaveUrl = urloptions['formSaveURL'];

            if (this.fieldCollection)
                this.fieldCollection.reset();

            if (this.URLOptions['formSaveURL'])

            this.fieldCollection = new FieldCollection({}, {
                name         : formName || 'New form',
                url          : this.URLOptions['formSaveURL'] + (context != "all" ? "/" + context : "") || formSaveUrl,
                context      : context || "all",
                URLOptions   : this.URLOptions || ""
            });

            this.fieldCollection.reset();
        }
    });

    return EditionPageController;

});
