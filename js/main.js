var turnToSection = (function($) {
    var currentSectionId = -1;
    var sections = ['about', 'portfolio', 'blog', 'contact'];
    var transitionComplete = true;
    return function(sec) {
        var secId = sections.indexOf(sec);
        if ($('body').hasClass("home")) {
            $('#' + sec).addClass('current');
            var home = $('section.home');
            home.css('margin-top', -home.outerHeight());
            var callback = function () {
                $('body').removeClass('home');
            }
            home.one('webkitTransitionEnd', callback);
            home.one('transitionEnd', callback);
            home.one('oTransitionEnd', callback);
        } else if (currentSectionId != secId) {
            if (!transitionComplete){return false;}
            transitionComplete = false;
            var currentSection = sections[currentSectionId];
            if (currentSectionId < secId) {
                // Pan Right
                $('#' + sec).addClass('current');
                $('#' + currentSection).addClass('left').one('webkitTransitionEnd', function(e) {$(this).removeClass('current').removeClass('left');transitionComplete = true;});
            } else {
                // Pan Left
                $('#' + sec).addClass('left').addClass('current').one('webkitTransitionEnd', function(e) {$('#' + currentSection).removeClass('current');transitionComplete = true;});
                window.setTimeout(function(){
                $('#' + sec).removeClass('left');
                }, 1);

            }
        }
        currentSectionId = secId;
    };
})(jQuery);


$(function(){
	$(".home .description").each(function(id, desNode){
		$(desNode).find(".current a").click(function(){
			var prevNode = $(desNode).find(".previous");
			if (prevNode.hasClass("collapsed")) {
				prevNode.removeClass("collapsed").css('max-height', prevNode.find(".inner").height());
			} else {
				prevNode.addClass("collapsed").css('max-height', '');
			}
		})
	});
});
