({

    paths: {
        backbone              : "../../libs/backbone/backbone",
        blobjs                : "../../libs/blobjs/Blob",
        bootstrap             : "../../libs/bootstrap/dist/js/bootstrap",
        fancytree             : "../../libs/fancytree/dist/jquery.fancytree-all.min",
        filesaver             : "../../libs/filesaver/FileSaver",
        i18n                  : "../../libs/i18n/i18next",
        jquery                : "../../libs/jquery/dist/jquery",
        'jquery-ui'           : "../../libs/jquery-ui/jquery-ui",
        underscore            : "../../libs/underscore/underscore",
        "NS.UI.Navbar"        : "../../libs/NS.UI.Navbar/navbar",
        "NS.UI.NavbarTheme"   : "../../libs/NS.UI.Navbar/themes/navbar.bootstrap3",
        "NS.UI.Notification"  : "../../libs/NS.UI.Notification/notification",
        requirejs             : "../../libs/requirejs/require",
        "backbone-forms"      : "../../libs/backbone-forms/distribution.amd/backbone-forms.min",
        modalAdapter          : "../../libs/bootstrapAdapter/src/backbone.bootstrap-modal",
        "backbone-forms-list" : "../../libs/backbone-forms/distribution.amd/editors/list.min",
        bootstrapTemplate     : "../../libs/backbone-forms/distribution/templates/bootstrap3",
        bootstrapAdapter      : "../../libs/bootstrapAdapter/index",
        nanoscroller          : "../../libs/nanoscroller/dist/javascripts/jquery.nanoscroller",
        typeahead             : "../../libs/typeahead/bootstrap3-typeahead",
        "backbone.radio"      : "../../libs/backbone.radio/build/backbone.radio",
        fuelux                : "../../libs/fuelux/dist/js/fuelux",
        'difflib'             : '../../libs/jsdifflib/difflib',
        'diffview'            : '../../libs/jsdifflib/diffview',
        'twig'             : '../../libs/twig.js/twig.min'
    },

   shim: {
        blobjs                : { exports : 'blobjs' },
        filesaver             : { exports : 'filesaver' },
        difflib               : { exports : 'difflib' },
        diffview              : { exports : 'diffview'},
        jquery                : { exports: "$"},
        underscore            : { exports: "_"},
        backbone              : { exports: "Backbone", deps: ["underscore", "jquery"] },
        "backbone.radio"      : { deps: ["backbone"], exports: "Backbone"},
        "jquery-ui"           : { exports: "$", deps: ["jquery"] },
        fancytree             : { deps: ["jquery-ui"], exports: "$" },
        i18n                  : { exports: "$", deps: ["jquery"] },
        "NS.UI.Navbar"        : { exports: "$", deps: ["jquery", "backbone", "bootstrap"] },
        "NS.UI.NavbarTheme"   : { deps: ["NS.UI.Navbar"], exports: "NS"},
        "NS.UI.Notification"  : { exports: "$", deps: ["jquery", "backbone", "bootstrap"] },
        bootstrap             : { exports: "$", deps: ["jquery"] },
        typeahead             : { exports: "$", deps: ["jquery", "bootstrap"] },
        nanoscroller          : { exports: "$", deps: ["jquery"] }
    },

    optimize: 'uglify2',

    uglify2: {
      output: {
        beautify: true,
      },
      beautify: {
        semicolons: false
      }
    },

    baseUrl                 : '../assets/js/',
    mainConfigFile          : '../assets/js/config.js',
    name                    : 'formbuilder',
    out                     : 'formbuilder.min.js',
    output : {
        beautify: true
    },
    preserveLicenseComments : false,
    removeCombined: true,

    include : [
        'views/fieldViews/TextFieldView',
        'views/fieldViews/AutocompleteFieldView',
        'views/fieldViews/BaseView',
        'views/fieldViews/CheckBoxFieldView',
        'views/fieldViews/DateFieldView',
        'views/fieldViews/FileFieldView',
        'views/fieldViews/HiddenFieldView',
        'views/fieldViews/HorizontalLineFieldView',
        'views/fieldViews/LongTextFieldView',
        'views/fieldViews/NumericFieldView',
        'views/fieldViews/PatternFieldView',
        'views/fieldViews/RadioFieldView',
        'views/fieldViews/SelectFieldView',
        'views/fieldViews/SubFormFieldView',
        'views/fieldViews/TreeViewFieldView',
        'views/modals/exportProtocol',
        'views/modals/importProtocol',
        'views/modals/saveProtocol',
        'views/fieldViews/ThesaurusFieldView',
        'views/fieldViews/AutocompleteTreeViewFieldView'
    ]

})