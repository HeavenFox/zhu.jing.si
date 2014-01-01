function turnToSection(sec) {
	if ($('body').hasClass("home")) {
		var home = $('section.home');
		home.css('margin-top', -home.outerHeight());
		var callback = function () {
			$('body').removeClass('home');
		}
		home.one('webkitTransitionEnd', callback);
		home.one('transitionEnd', callback);
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
		})
	});
});