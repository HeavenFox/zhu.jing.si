(function($, window) {
    "use strict";
    $.prototype.onceTransitionEnd = function(callback) {
        this.one('webkitTransitionEnd', callback);
        this.one('oTransitionEnd', callback);
        this.one('transitionEnd', callback);
        return this;
    };
    var turnToSection = (function() {
        var currentSectionId = -1;
        var sections = ['about', 'portfolio', 'blog', 'contact'];
        var transitionComplete = true;

        return function(sec) {
            var secId = sections.indexOf(sec);
            if ($('body').hasClass("home")) {
                $('#' + sec).addClass('current');
                var home = $('section.home');
                home.css('margin-top', -home.outerHeight());
                home.onceTransitionEnd(function () {
                    $('body').removeClass('home');
                });
            } else if (currentSectionId != secId) {
                if (!transitionComplete){return false;}
                transitionComplete = false;
                var currentSection = sections[currentSectionId];
                if (currentSectionId < secId) {
                    // Pan Right
                    $('#' + sec).addClass('current');
                    $('#' + currentSection).addClass('left')
                                           .onceTransitionEnd(function(e) {$(this).removeClass('current').removeClass('left');transitionComplete = true;});
                } else {
                    // Pan Left
                    $('#' + sec).addClass('left')
                                .addClass('current')
                                .onceTransitionEnd(function(e) {$('#' + currentSection).removeClass('current');transitionComplete = true;});
                    window.requestAnimationFrame(function(){
                        $('#' + sec).removeClass('left');
                    });

                }
            }
            currentSectionId = secId;
        };
    })();

    function turnToUrl(url) {
        var go = function(){
            window.location.href = url;
        };
        if ($('body').hasClass('home')) {
            go();
        } else {
            $('nav').add('article').addClass('fadeaway').onceTransitionEnd(go);
        }
    }


    $(function(){
        $(".home .description").each(function(id, desNode){
            $(desNode).find(".current a").click(function(){
                var prevNode = $(desNode).find(".previous");
                if (prevNode.hasClass("collapsed")) {
                    prevNode.removeClass("collapsed").css('max-height', prevNode.find(".inner").height());
                } else {
                    prevNode.addClass("collapsed").css('max-height', '');
                }
            });
        });
        $('nav ul li a').each(function(id, link) {
            $(link).click(function(e){
                var target = $(this).data('target');
                if (target[0] === '/') {
                    turnToUrl(target);
                } else {
                    turnToSection(target);
                }
                e.preventDefault();
            });
        });
    });
})(jQuery, window);
