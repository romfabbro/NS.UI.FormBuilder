define([
    'jquery',
    'underscore',
    'backbone',
    'editionPageModule/views/fieldViews/BaseView',
    'text!editionPageModule/templates/fields/PositionFieldView.html',
    'text!editionPageModule/templates/fields/readonly/PositionFieldView.html',
    'backbone.radio',
    'app-config'
], function($, _, Backbone, BaseView, viewTemplate, viewTemplateRO, Radio, AppConfig) {

    var PositionFieldView = BaseView.extend({

        events: function() {
            return _.extend( {}, BaseView.prototype.events, {

            });
        },

        initialize : function(options, readonly) {
            var opt = options;
            opt.template = viewTemplate;
            if (readonly)
                opt.template = viewTemplateRO;
            BaseView.prototype.initialize.apply(this, [opt]);

            this.initGlobalChannel();
            this.initConfigChannel();

            this.rendered = false;
            this.savedDefaultNode = undefined;
            this.savedFullpath = undefined;
        },

        initGlobalChannel : function() {
            this.globalChannel = Backbone.Radio.channel('global');

            this.globalChannel.on('nodeSelected' + this.model.get('id'), this.updateTreeView, this);
            this.globalChannel.on('nodeReset' + this.model.get('id'), this.resetTreeView, this);
            this.globalChannel.on('resetSavedValues', this.resetSavedValues, this);
        },

        initConfigChannel : function() {
            this.configChannel = Backbone.Radio.channel('config');

            this.configChannel.on('get:startID', _.bind(this.displayTreeView, this));
        },

        displayTreeView : function(startID) {
            var that = this;
            var item = $('#position' + that.model.get('id'));
            if (startID == "")
            {
                startID = AppConfig.config.startID.position[window.context];
                if (!startID)
                    startID = AppConfig.config.startID.position.default;
            }

            var callbackWSCallHttp = function(data, urlws){
                if (that.savedDefaultNode == startID)
                {
                    item.attr("placeholder", that.savedFullpath);
                    that.model.set('defaultNode', that.savedDefaultNode);
                    that.model.set('positionPath', that.savedFullpath);
                }

                item.autocompTree({
                    wsUrl: urlws,
                    source: data['children'],
                    startId: startID,
                    inputValue: item.val(),
                    display: {
                        isDisplayDifferent: true
                    },
                    WsParams: {
                        ProfMin: item.attr('profmin') ? item.attr('profmin') : null,
                        ProfMax: item.attr('profmax') ? item.attr('profmax') : null,
                        ForLeafs: item.attr('forleafs') ? item.attr('forleafs') : null,
                        NotDisplayOutOfMax: item.attr('notdisplayoutofmax') ? item.attr('notdisplayoutofmax') : null
                    }
                });
            };

            var callbackWSCallOther = function(data, urlws){
                if (that.savedDefaultNode == startID)
                {
                    item.attr("placeholder", that.savedFullpath);
                    that.model.set('defaultNode', that.savedDefaultNode);
                    that.model.set('positionPath', that.savedFullpath);
                }

                item.autocompTree({
                    wsUrl: urlws,
                    source: data['d'],
                    startId: startID,
                    inputValue: item.val(),
                    display: {
                        isDisplayDifferent: true
                    },
                    WsParams: {
                        ProfMin: item.attr('profmin') ? item.attr('profmin') : null,
                        ProfMax: item.attr('profmax') ? item.attr('profmax') : null,
                        ForLeafs: item.attr('forleafs') ? item.attr('forleafs') : null,
                        NotDisplayOutOfMax: item.attr('notdisplayoutofmax') ? item.attr('notdisplayoutofmax') : null
                    }
                });
            };

            require(['jquery-ui', 'autocompTree'], _.bind(function() {

                var urlws = that.model.get('webServiceURL');

                if (urlws.substring(0, 5) == 'http:') {
                    if (window.trees[urlws]) {
                        callbackWSCallHttp(window.trees[urlws], urlws);
                    }
                    else {
                        if (startID == "")
                        {
                            startID = AppConfig.config.startID.position[window.context];
                            if (!startID)
                                startID = AppConfig.config.startID.position.default;
                        }
                        $.ajax({
                            data: JSON.stringify({StartNodeID: startID, lng: "fr"}),
                            type: 'POST',
                            url: urlws,
                            contentType: 'application/json',
                            crossDomain: true,
                            success: _.bind(function (data) {
                                callbackWSCallHttp(data, urlws);
                            }, this)
                        });
                    }
                }
                else {
                    if (window.trees[urlws]) {
                        callbackWSCallOther(window.trees[urlws], urlws);
                    }
                    else {
                        $.getJSON(that.model.get('webServiceURL'), _.bind(function (data) {
                            callbackWSCallOther(data, urlws);
                        }, this)).error(function (a, b, c) {
                            alert("can't load ressources !");
                        });
                    }
                }
            }), this);
        },

        updateTreeView : function(data) {
            var that = this;
            var item = $('#position' + that.model.get('id'));

            var startID = "";
            var nodeFullpath = "";
            var children = null;

            if (data['node'])
            {
                startID = data['node']['key'] ;
                nodeFullpath = data['node']['data']['fullpath'];
                children = data['node']['children'];
            }
            else
            {
                startID = data['key'] ;
                nodeFullpath = data['fullpath'];
                children = data['children'];
            }

            var reloadFieldInList = function(){
                if (children !== null) {
                    item.autocompTree('getTree').reload({
                        children : children
                    });
                    item.attr("placeholder", nodeFullpath);
                }
            };

            if (!that.savedDefaultNode)
            {
                that.resetSavedValues();
            }

            this.model.set('defaultNode', startID);
            this.model.set('positionPath', nodeFullpath);

            reloadFieldInList();

            $('input[name="defaultNode"]').val(startID);
            $('input[name="defaultNode"]').attr("value", startID);
            $('input[name="positionPath"]').val(nodeFullpath);
        },

        resetTreeView : function()
        {
            var that = this;
            this.displayTreeView(that.savedDefaultNode);
        },

        resetSavedValues : function()
        {
            this.savedDefaultNode = this.model.get('defaultNode');
            this.savedFullpath = this.model.get('positionPath');
        },

        render : function() {
            if (!this.rendered) {
                BaseView.prototype.render.apply(this, arguments);
                this.rendered = true;
                this.displayTreeView(this.model.get("defaultNode"));
            }
            else
            {
                $('#dropField'+this.model.get('id')+' .field-label').text(this.model.get('labelFr'));
            }
        }

    });

	return PositionFieldView;

});