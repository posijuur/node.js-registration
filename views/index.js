;(function ($) {

	$('.glyphicon.glyphicon-remove').on('click', function(event) {
		event.preventDefault();
		var target = event.target;
		var taskItem = $(target).parent();
		$(taskItem).find('.input-delete').attr("checked", "checked");
		$(taskItem).find('.btn.btn-info').trigger('click');
		event.stopImmediatePropagation();
	});

	$('.glyphicon.glyphicon-pencil').on('click', function(event) {
		event.preventDefault();
		var target = event.target;
		var taskItem = $(target).parent();
		$(taskItem).find('.glyphicon.glyphicon-remove').hide();
		$(taskItem).find('.input-change').attr("checked", "checked");
		$(taskItem).find('.wrap-input').show('slow');
		$(taskItem).find('.input-text').trigger('focus');
		event.stopImmediatePropagation();
	});
})(jQuery);