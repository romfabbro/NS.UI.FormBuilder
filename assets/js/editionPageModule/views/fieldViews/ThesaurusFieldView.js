define([
    'jquery',
    'lodash',
    'backbone',
    'tools',
    'editionPageModule/views/fieldViews/BaseView'
], function($, _, Backbone, tools, BaseView) {
    return BaseView.extend({
        events: _.extend(BaseView.prototype.events, {
            "change input[name='webServiceURL']": "urlChanged"
        }),

        urlChanged: function(e) {
            // preload new(?) url
            tools.loadTree(e.target.value);

            // tell user to reload form
            tools.swal("info", "editGrid.urlChanged", "editGrid.urlChangedMessage");
        },

        initialize : function(options) {
            // set aside url for autocompTree fields by key, will be used by editor
            var wsURL;
            if (options.model) {
                wsURL = options.model.get("webServiceURL");
            }
            if (wsURL) {
                // this is hacky behavior, two things would be better:
                //   * embed wsURL into autocomptree editor in some way, which would make more sense
                //   * or at least embed wsUrl into defaultNode schema's options, and not directly in model
                options.model.defaultNode = wsURL;
                // pre-load url
                tools.loadTree(wsURL);
            }

            BaseView.prototype.initialize.apply(this, [options]);
        }
    });
});
