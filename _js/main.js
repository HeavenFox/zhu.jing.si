if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}

(function($, window) {
    "use strict";
    /**
     * @const
     */
    var sections = ['home', 'about', 'portfolio', 'blog', 'contact'];

    var currentSectionId = 0;
    var transitionComplete = true;

    $.prototype.onceTransitionEnd = function(callback) {
        this.one('webkitTransitionEnd', callback);
        this.one('oTransitionEnd', callback);
        this.one('transitionEnd', callback);
        return this;
    };

    function pushUrl(sec) {
        window.history.pushState(null, "", sec === "home" ? "/" : ("/" + sec + "/"));
    }

    function turnToSection(sec, animated) {
        var secId = sections.indexOf(sec);
        var home = $('section.home');
        if (sec == 'home') {
            if (!$('body').hasClass('home')) {
                $('body').addClass('home');
                window.requestAnimationFrame(function() {
                    home.css('margin-top', '');
                });
            }
        } else if ($('body').hasClass("home")) {
            $('#' + sec).addClass('current');
            if (animated) {
                home.css('margin-top', -home.outerHeight());
                home.onceTransitionEnd(function () {
                    $('body').removeClass('home');
                });
            } else {
                $('body').removeClass('home');
            }
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

        return true;
    }

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

    function linkPreviousExperience() {
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
    }

    function linkSections() {
        $('nav ul li a').each(function(id, link) {
            $(link).click(function(e){
                e.preventDefault();
                var target = $(this).data('target');
                if (target[0] === '/' || target.startsWith('http')) {
                    turnToUrl(target);
                } else {
                    if (turnToSection(target, true)) {
                        pushUrl(target);
                    }
                }
            });
        });
    }

    function sectionIdFromUrl() {
        var section = 0;
        var path = window.location.pathname;
        // Lookup current section
        sections.some(function(val, index) {
            if (path.indexOf(val) === 1) {
                section = index;
                return true;
            }
        });
        return section;
    }

    function initFirstSection() {
        currentSectionId = sectionIdFromUrl();

        if (currentSectionId === 0) {
            // In case the page is pre-scrolled, e.g. after a refresh
            $(window).scrollTop(0);
        } else {
            turnToSection(sections[currentSectionId], false);
        }

    }


    $(function(){
        linkPreviousExperience();
        linkSections();
    });

    initFirstSection();

    window.onpopstate = function() {
        var newSection = sectionIdFromUrl();
        if (newSection !== currentSectionId) {
            turnToSection(sections[newSection], true);
        }
    };

    $('body').mousewheel(function(event) {
        var target;
        if (currentSectionId === 0 && event.deltaY < -25) {
            target = sections[1];
        } else if (currentSectionId > 0 && event.deltaY > 50 && $(window).scrollTop() < 0) {
            console.log("cool");
            target = sections[0];
            window.requestAnimationFrame(function(){
                $(window).scrollTop(0);
            });
        } else {
            return;
        }
        turnToSection(target, true);
        pushUrl(target);
    });
})(jQuery, window);
