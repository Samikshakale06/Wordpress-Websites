;(function($, window, document, undefined) {

	var $win = $(window);

	$win.on('load', function() {
		
		var ajaxRequests = [];
		
		// Add Pending Count to Tab
		$('.scheduled-tabs').find('li a div.counter').each(function(){
			var thisCounter = $(this),
				thisTabName = $(this).parent().attr('href');
				thisTabName = thisTabName.split('#');
				thisTabName = thisTabName[1];
				totalAppointments = $('#profile-'+thisTabName).find('.appt-block').length;
			
			if (totalAppointments > 0){
				thisCounter.html(totalAppointments).css({'display':'flex'});
			}
		});
		
		// User Info Click
		$('.scheduled-fea-appt-list').on('click', '.user', function(e) {

			e.preventDefault();

			var $thisLink 		= $(this),
				user_id			= $thisLink.attr('data-user-id'),
				appt_id			= $thisLink.parent().attr('data-appt-id'),
				scheduled_ajaxURL	= scheduled_fea_vars.ajax_url;

			create_scheduled_modal();
			
			$.ajax({
				url: scheduled_ajaxURL,
				type: 'post',
				data: {
					action: 'scheduled_fea_user_info_modal',
					user_id: user_id,
					appt_id: appt_id
				},
				success: function( html ) {
					
					$('.bm-window').html( html );
					
					var scheduledModal = $('.scheduled-modal');
					var bmWindow = scheduledModal.find('.bm-window');
					bmWindow.css({'visibility':'hidden'});
					scheduledModal.removeClass('bm-loading');
					resize_scheduled_modal();
					bmWindow.hide();
					
					setTimeout(function(){
						bmWindow.css({'visibility':'visible'});
						bmWindow.show();
					},50);
					
				}
			});
			
			return false;

		});
		
		// Show Additional Information
		$('.scheduled-fea-appt-list').on('click', '.scheduled-show-cf', function(e) {
		
			e.preventDefault();
			var hiddenBlock = $(this).parent().find('.cf-meta-values-hidden');
		
			if(hiddenBlock.is(':visible')){
				hiddenBlock.hide();
			} else {
				hiddenBlock.show();
			}
		
			return false;
		
		});
		
		// Approve Appointment from Appointment List
		$('.scheduled-fea-appt-list').on('click', '.appt-block .approve', function(e) {

			e.preventDefault();

			var $button 		= $(this),
				$thisParent		= $button.parents('.appt-block'),
				appt_id			= $thisParent.attr('data-appt-id'),
				scheduled_ajaxURL	= scheduled_fea_vars.ajax_url;

			confirm_appt_approve = confirm(scheduled_fea_vars.i18n_confirm_appt_approve);
			if (confirm_appt_approve == true){

				var currentApptCount = parseInt($button.parents('.scheduled-fea-appt-list').find('h4 span.count').html());
				currentApptCount = parseInt(currentApptCount - 1);
				$button.parents('.scheduled-fea-appt-list').find('h4 span.count').html(currentApptCount);
				
				if ($button.parents('#profile-fea_pending').length){
					if (currentApptCount < 1){
						$('.scheduled-tabs').find('li a[href="#fea_pending"] .counter').remove();
					} else {
						$('.scheduled-tabs').find('li a[href="#fea_pending"] .counter').html(currentApptCount);
					}
				}
				
				$('.appt-block').animate({'opacity':0.4},0);
				$button.remove();

		  		$.ajax({
					'method' : 'post',
					'url' : scheduled_ajaxURL,
					'data': {
						'action'     	: 'scheduled_fea_approve_appt',
						'appt_id'     	: appt_id
					},
					success: function(data) {
						$('.appt-block').animate({'opacity':1},150);
					}
				});

			}

			return false;

		});
		
		// Delete Appointment from Appointment List
		$('.scheduled-fea-appt-list').on('click', '.appt-block .delete', function(e) {

			e.preventDefault();

			var $button 		= $(this),
				$thisParent		= $button.parents('.appt-block'),
				appt_id			= $thisParent.attr('data-appt-id'),
				scheduled_ajaxURL	= scheduled_fea_vars.ajax_url;

			confirm_appt_delete = confirm(scheduled_fea_vars.i18n_confirm_appt_delete);
			if (confirm_appt_delete == true){

				var currentApptCount = parseInt($button.parents('.scheduled-fea-appt-list').find('h4 span.count').html());
				currentApptCount = parseInt(currentApptCount - 1);
				$button.parents('.scheduled-fea-appt-list').find('h4 span.count').html(currentApptCount);
				
				if ($button.parents('#profile-fea_pending').length){
					if (currentApptCount < 1){
						$('.scheduled-tabs').find('li a[href="#fea_pending"] .counter').remove();
					} else {
						$('.scheduled-tabs').find('li a[href="#fea_pending"] .counter').html(currentApptCount);
					}
				}
				
				$('.appt-block').animate({'opacity':0.4},0);
								
				$thisParent.slideUp('fast',function(){
					$(this).remove();
				});

				$.ajax({
					'method' : 'post',
					'url' : scheduled_ajaxURL,
					'data': {
						'action'     	: 'scheduled_fea_delete_appt',
						'appt_id'     	: appt_id
					},
					success: function(data) {
						$('.appt-block').animate({'opacity':1},150);
					}
				});

			}

			return false;

		});
		
	});
	
})(jQuery, window, document);