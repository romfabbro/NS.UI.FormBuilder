/*
*   Plugin autocompTree 1.0
*   Permet l'affichage d'un autocomplete de donnée organisée en arbre
*   Dépendance :
*       - JQuery (min 1.8.*)
*       - JQuery UI (min 1.8.*)
*       - Fancytree (importé la bibliothèque jquery.fancytree-all ainsi que son css)
*/
(function ($)
{
    $.fn.autocompTree=function(parametres) {
        //On définit nos paramètres par défaut
        var defauts =
        {
            //Les webservices doivent renvoyer une chaine au format JSON contenant au moins ces information:
            /*
            *   treeElt {
            *       title : string
            *       key : int
            *       lazy : false //L'autocomplete n'étant pas du tout efficace en lazy loading
            *       //Enfin toues les information qui seront utile a son utilisation
            *       //Notamment la valeur a afficher (et ou stocké si isDisplayDifferent = false)
            *       //Eventuellement la valeur à stocké (si isDisplayDifferent = true)
            *   }
            */
            //URL des webservices
            wsUrl: 'http://' + window.location.hostname + '/Thesaurus/App_WebServices/wsTTopic.asmx',
            //Webservices pour un affichage en arborescence
            webservices: 'initTreeByIdWLanguageWithoutDeprecated',
            //si l'affichage est différent de la valeur renvoyée
            display: {
                isDisplayDifferent: true,
                //Stocke la valeur dans un input hidden d'id = _self.attr("id") + suffixeId
                suffixeId: '_value',
                //Nom des paramètres a récupéré dans les noeuds de l'arbre
                //Si isDisplayDifferent = false -> la valeur sera displayValueName
                //Affichage
                displayValueName: 'fullpathTranslated',
                //Valeur cachée
                storedValueName: 'fullpath'
            },
            //Si l'arbre utilise un langage différent
            language: {
                hasLanguage: false,
                //Préféré un majuscule en première lettre
                lng: "En"
            },
            //Si l'arbre possède déjà une valeur
            inputValue: '',
            //idServant à l'initialisation de l'arbre
            //TODO service de paramètrage dynamique ou tous les paramètres ainsi que leur valeur sont généré a la volée
            startId: '',
            //Fonction appelé a chaque fin d'éxécution
            callback: '',
            //Fonction s'éxecutant après un clique
            onItemClick: '',
            //Fonction s'éxécutant après le focus sur l'input
            onInputFocus: '',
            //Fonction s'éxécutant après la perte de focus de l'input et de l'arbre
            onInputBlur: '',
            //Fonction s'éxécutant après l'initialisation de l'objet autocompTree
            onInputInitialize:''
        }

        //Fusion des paramètres envoyer avec les params par defaut
        if (parametres) {
            var parametres = $.extend(defauts, parametres);
        };
        //Information à envoyer 
        var dataToSend = '';
        if (parametres.language.hasLanguage) {
            dataToSend = "{'id':'" + parametres.startId + "', language: '" + parametres.language.lng + "'}"
        } else {
            dataToSend = "{'id':'" + parametres.startId + "'}"
        }

        return this.each(function () {

            var _self = $(this);
            //On encapsule l'input ainsi que tous les éléments dans un div afin de les contrôlés
            _self.wrapAll('<div id="divAutoComp_' + _self.attr("id") + '">');
            var htmlInsert = '';
            //Si isDisplayDifferent = true on crée un input hidden afin de stocker la valeur 
            if (parametres.display.isDisplayDifferent) {
                htmlInsert = '<input type="hidden" id="' + _self.attr("id") + parametres.display.suffixeId + '"/>'
            }
            //Div qui sera le conteneur du treeview
            htmlInsert += '<div class="fancytreeview" id="treeView' + _self.attr('id') + '" style="display:none"></div>';
            _self.parent().append(htmlInsert);

            //Insertion de la valeur dans l'input
            _self.val(parametres.inputValue);

            //Initialisation de l'arbre
            tree = $('#treeView' + _self.attr("id")).fancytree({
                debugLevel: 0,
                extensions: ["filter"],
                autoActivate: false,
                keyboard: true,
                filter: {
                    mode: "hide"
                },
                hideExpand: {
                    isHide: false,
                    nbExpand: 0
                },
                //defini la source pour les elts parents
                source: {
                    type: "POST",
                    url: parametres.wsUrl + "/" + parametres.webservices,
                    datatype: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: dataToSend
                },
                //Permet si l'arbre et en mode filter d'afficher les enfants des termes filtrés -> submatch
                renderNode: function (event, data) {
                    var node = data.node;
                    if (data.tree.options.hideExpand.isHide) {
                        data.tree.options.hideExpand.nbExpand--;
                        var $span = $(node.span);
                        var strClass = $span[0].className;
                        strClass = strClass.replace("fancytree-hide", "fancytree-submatch");
                        $span[0].className = strClass;
                        if (data.tree.options.hideExpand.nbExpand == 0) {
                            data.tree.options.hideExpand.isHide = false;
                        }
                    }
                },
                //Servant ici a afficher les termes enfants des termes filtré
                click: function (event, data) {
                    var node = data.node,
                        tt = $.ui.fancytree.getEventTargetType(event.originalEvent);
                    //Bubbles permet de déterminer si l'evt vient d'un click souris oud'un faux clique setExpand
                    if (tt === "expander" && event.bubbles) {
                        var tree = data.tree.$div;
                        if (tree.hasClass("fancytree-ext-filter")) {
                            data.tree.options.hideExpand.isHide = true;
                            data.tree.options.hideExpand.nbExpand = node.getChildren().length;
                            node.span.className = node.span.className.replace("fancytree-node", "fancytree-node fancytree-expanded");
                        }
                    }
                },
                //evenement d'activation de l'arbre (au clique)
                activate: function (event, data) {
                    if (parametres.display.isDisplayDifferent) {
                        _self.val(data.node.data[parametres.display.displayValueName]);
                        console.log();
                        $('#' + _self.attr('id') + parametres.display.suffixeId).val(data.node.data[parametres.display.storedValueName]);
                        $("#treeView" + _self.attr("id")).css('display', 'none');
                    } else {
                        _self.val(data.node.data[parametres.display.displayValueName]);
                        $("#treeView" + _self.attr("id")).css('display', 'none');
                    }
                    if (parametres.onItemClick) {
                        try{
                            parametres.onItemClick();
                        } catch (e) {
                            throw('An error occured during onItemClick -> '+e);
                        }
                    }
                }
            });
            //Permet l'affichage du treeview au focus sur l'input
            _self.focus(function () {
                var treeContainer = $("#treeView" + _self.attr("id"));
                treeContainer.css('display', 'block').css('width', _self.outerWidth() - 2).css('border', 'solid 1px').css('position', 'absolute').css('z-index', '100');
                treeContainer.offset({ left: $(this).offset().left/*, top: $(this).position().top + $(this).outerHeight()*/ });
                if (parametres.onInputFocus) {
                    try {
                        parametres.onInputFocus();
                    } catch (e) {
                        throw ('An error occured during onInputFocus -> ' + e);
                    }
                }
            });
            //Fonction de recherche et de filtration
            _self.keyup(function (e) {
                var treeHtml = $("#treeView" + _self.attr("id"));
                var fancytree = treeHtml.fancytree("getTree");
                //Si le nombrte d'élément est < a 100 on oblige l'utilisation d'au moins trois caractère pour des raisons de performances
                if (fancytree.count() < 100 || _self.val().length >= 3) {
                   treeHtml.find('ul.fancytree-container li').css("padding", "1px 0 0 0");
                   treeHtml.fancytree("getRootNode").visit(function (node) {
                        if (node.span) {
                            var className = node.span.className;
                            if (className.indexOf('fancytree-hide') != -1) {
                                node.setExpanded(false);
                            }
                        } else {
                            node.setExpanded(false);
                        }
                    });
                    match = _self.val();
                    var n,
                        match = _self.val();

                    if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
                        resetResearch(id);
                        return;
                    }
                    n = fancytree.filterNodes(match, false);
                    while (treeHtml.find('.fancytree-submatch:not(.fancytree-expanded)').find('.fancytree-expander').length) {
                        treeHtml.find('.fancytree-submatch:not(.fancytree-expanded)').find('.fancytree-expander').click();
                    }
                    if (treeHtml.find('.fancytree-match').length < 3 && treeHtml.find('.fancytree-match').find('.fancytree-match').length)
                        treeHtml.find('.fancytree-match').find('.fancytree-expander').click()
                    treeHtml.find('ul.fancytree-container li').css("padding", "0px 0 0 0");
                }
                if (_self.val().length == 0) {
                    fancytree.clearFilter();
                    treeHtml.fancytree("getRootNode").visit(function (node) {
                        node.setExpanded(false);
                    });
                }
            });
            //Fonction qui permet d'effectuer un "blur" sur l'ensemble des éléments (input et arbre)
            $(document).delegate("body", "click", function (event) {
                if (!$(event.target).is("#" + _self.attr("id") + ",span[class^=fancytree], div[id^=treeView], ul")) {
                    var treeContainer = $("#treeView" + _self.attr("id"));
                    treeContainer.css('display', 'none');
                }
                if (parametres.onInputBlur) {
                    try {
                        parametres.onInputBlur();
                    } catch (e) {
                        throw ('An error occured during onInputBlur -> ' + e);
                    }
                }
            });

            if (parametres.display.isDisplayDifferent) {
                _self.change(function () {
                    $("#" + _self.attr('id') + parametres.display.suffixeId).val(_self.val());
                });
            }

            if (parametres.onInputInitialize) {
                try {
                    parametres.onInputInitialize();
                } catch (e) {
                    throw ('An error occured during onInputInitialize -> ' + e);
                }
            }
        });
    }
})(jQuery);