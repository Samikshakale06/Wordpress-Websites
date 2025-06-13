// make it a global variable so other scripts can access it
var scheduled_load_calendar_date_booking_options,
	scheduled_appt_form_options,
	scheduledNewAppointment;

;(function($, window, document, undefined) {

	var $win = $(window);

	$.fn.spin.presets.scheduled = {
	 	lines: 10, // The number of lines to draw
		length: 7, // The length of each line
		width: 5, // The line thickness
		radius: 11, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#555', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'scheduled-spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent
		left: '50%' // Left position relative to parent
	}

	$.fn.spin.presets.scheduled_top = {
	 	lines: 11, // The number of lines to draw
		length: 10, // The length of each line
		width: 6, // The line thickness
		radius: 15, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		scale: 0.5,
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#aaaaaa', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'scheduled-spinner scheduled-spinner-top', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '15px', // Top position relative to parent
		left: '50%' // Left position relative to parent
	}

	$.fn.spin.presets.scheduled_white = {
	 	lines: 13, // The number of lines to draw
		length: 11, // The length of each line
		width: 5, // The line thickness
		radius: 18, // The radius of the inner circle
		scale: 1,
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#fff', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'scheduled-spinner scheduled-white', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent
		left: '50%' // Left position relative to parent
	}

	// Adjust the calendar sizing when resizing the window
	$win.on('resize', function(){

		adjust_calendar_boxes();
		resize_scheduled_modal();

	});

	$win.on('load', function() {

		ScheduledTabs.Init();

		var ajaxRequests = [];

		// Adjust the calendar sizing on load
		adjust_calendar_boxes();

		$('.scheduled-calendar-wrap').each(function(){
			var thisCalendar = $(this);
			var calendar_month = thisCalendar.find('div.scheduled-calendar').attr('data-calendar-date');
			thisCalendar.attr('data-default',calendar_month);
			init_tooltips(thisCalendar);
		});

		$('.scheduled-list-view').each(function(){
			var thisList = $(this);
			var list_date = thisList.find('.scheduled-appt-list').attr('data-list-date');
			thisList.attr('data-default',list_date);
		});

		scheduledRemoveEmptyTRs();
		init_appt_list_date_picker();

		$('.scheduled_calendar_chooser').change(function(e){

			e.preventDefault();

			var $selector 			= $(this),
				thisIsCalendar		= $selector.parents('.scheduled-calendarSwitcher').hasClass('calendar');

			if (!thisIsCalendar){

				var thisCalendarWrap	= $selector.parents('.scheduled-calendar-shortcode-wrap').find('.scheduled-list-view'),
				thisDefaultDate			= thisCalendarWrap.attr('data-default'),
				thisIsCalendar			= $selector.parents('.scheduled-calendarSwitcher').hasClass('calendar');

				if (typeof thisDefaultDate == 'undefined'){ thisDefaultDate = false; }

				thisCalendarWrap.addClass('scheduled-loading');

				var args = {
					'action'		: 'scheduled_appointment_list_date',
					'nonce'			: scheduled_js_vars.nonce,
					'date'			: thisDefaultDate,
					'calendar_id'	: $selector.val()
				};

				$(document).trigger("scheduled-before-loading-appointment-list-booking-options");
				thisCalendarWrap.spin('scheduled_top');

				$.ajax({
					url: scheduled_js_vars.ajax_url,
					type: 'post',
					data: args,
					success: function( html ) {

						thisCalendarWrap.html( html );

						init_appt_list_date_picker();
						setTimeout(function(){
							thisCalendarWrap.removeClass('scheduled-loading');
						},1);

					}
				});

			} else {

				var thisCalendarWrap 	= $selector.parents('.scheduled-calendar-shortcode-wrap').find('.scheduled-calendar-wrap'),
				thisDefaultDate			= thisCalendarWrap.attr('data-default');
				if (typeof thisDefaultDate == 'undefined'){ thisDefaultDate = false; }

				var args = {
					'action'		: 'scheduled_calendar_month',
					'nonce'			: scheduled_js_vars.nonce,
					'gotoMonth'		: thisDefaultDate,
					'calendar_id'	: $selector.val()
				};

				savingState(true,thisCalendarWrap);

				$.ajax({
					url: scheduled_js_vars.ajax_url,
					type: 'post',
					data: args,
					success: function( html ) {

						thisCalendarWrap.html( html );

						adjust_calendar_boxes();
						scheduledRemoveEmptyTRs();
						init_tooltips(thisCalendarWrap);
					 	$(window).trigger('scheduled-load-calendar', args, $selector );

					}
				});

			}

			return false;

		});

		// Calendar Next/Prev Click
		$('body').on('click', '.scheduled-calendar-wrap .page-right, .scheduled-calendar-wrap .page-left, .scheduled-calendar-wrap .monthName a', function(e) {

			e.preventDefault();

			var $button 			= $(this),
				gotoMonth			= $button.attr('data-goto'),
				thisCalendarWrap 	= $button.parents('.scheduled-calendar-wrap'),
				thisCalendarDefault = thisCalendarWrap.attr('data-default'),
				calendar_id			= $button.parents('div.scheduled-calendar').attr('data-calendar-id');

			if (typeof thisCalendarDefault == 'undefined'){ thisCalendarDefault = false; }

			var args = {
				'action'		: 'scheduled_calendar_month',
				'nonce'			: scheduled_js_vars.nonce,
				'gotoMonth'		: gotoMonth,
				'calendar_id'	: calendar_id,
				'force_default'	: thisCalendarDefault
			};

			savingState(true,thisCalendarWrap);

			$.ajax({
				url: scheduled_js_vars.ajax_url,
				type: 'post',
				data: args,
				success: function( html ) {

					thisCalendarWrap.html( html );

					adjust_calendar_boxes();
					scheduledRemoveEmptyTRs();
					init_tooltips(thisCalendarWrap);
					$(window).trigger('scheduled-load-calendar', args, $button );

				}
			});

			return false;

		});

		// Calendar Date Click
		$('body').on('click', '.scheduled-calendar-wrap .bc-row.week .bc-col', function(e) {

			e.preventDefault();

			var $thisDate 				= $(this),
				scheduled_calendar_table 	= $thisDate.parents('div.scheduled-calendar'),
				$thisRow				= $thisDate.parent(),
				date					= $thisDate.attr('data-date'),
				calendar_id				= scheduled_calendar_table.attr('data-calendar-id'),
				colspanSetting			= $thisRow.find('.bc-col').length;

			if (!calendar_id){ calendar_id = 0; }

			if ($thisDate.hasClass('blur') || $thisDate.hasClass('scheduled') && !scheduled_js_vars.publicAppointments || $thisDate.hasClass('prev-date')){

				// Do nothing.

			} else if ($thisDate.hasClass('active')){

				$thisDate.removeClass('active');
				$('.bc-row.entryBlock').remove();

				var calendarHeight = scheduled_calendar_table.height();
				scheduled_calendar_table.parent().height(calendarHeight);

			} else {

				$('.bc-row.week .bc-col').removeClass('active');
				$thisDate.addClass('active');

				$('.bc-row.entryBlock').remove();
				$thisRow.after('<div class="bc-row entryBlock scheduled-loading"><div class="bc-col"></div></div>');
				$('.bc-row.entryBlock').find('.bc-col').spin('scheduled');

				scheduled_load_calendar_date_booking_options = {'action':'scheduled_calendar_date','nonce': scheduled_js_vars.nonce,'date':date,'calendar_id':calendar_id};
				$(document).trigger("scheduled-before-loading-calendar-booking-options");

				var calendarHeight = scheduled_calendar_table.height();
				scheduled_calendar_table.parent().height(calendarHeight);

				$.ajax({
					url: scheduled_js_vars.ajax_url,
					type: 'post',
					data: scheduled_load_calendar_date_booking_options,
					success: function( html ) {

						$('.bc-row.entryBlock').find('.bc-col').html( html );

						$('.bc-row.entryBlock').removeClass('scheduled-loading');
						$('.bc-row.entryBlock').find('.scheduled-appt-list').fadeIn(300);
						$('.bc-row.entryBlock').find('.scheduled-appt-list').addClass('shown');
						adjust_calendar_boxes();

					}
				});

			}

			return;

		});

		// Appointment List Next/Prev Date Click
		$('body').on('click', '.scheduled-list-view .scheduled-list-view-date-prev, .scheduled-list-view .scheduled-list-view-date-next', function(e) {

			e.preventDefault();

			var $thisLink 			= $(this),
				date				= $thisLink.attr('data-date'),
				thisList			= $thisLink.parents('.scheduled-list-view'),
				defaultDate			= thisList.attr('data-default'),
				calendar_id			= $thisLink.parents('.scheduled-list-view-nav').attr('data-calendar-id');

			if (typeof defaultDate == 'undefined'){ defaultDate = false; }

			if (!calendar_id){ calendar_id = 0; }

			thisList.addClass('scheduled-loading');

			var scheduled_load_list_view_date_booking_options = {
				'action'		: 'scheduled_appointment_list_date',
				'nonce'			: scheduled_js_vars.nonce,
				'date'			: date,
				'calendar_id'	: calendar_id,
				'force_default'	: defaultDate
			};

			$(document).trigger("scheduled-before-loading-appointment-list-booking-options");
			thisList.spin('scheduled_top');

			$.ajax({
				url: scheduled_js_vars.ajax_url,
				type: 'post',
				data: scheduled_load_list_view_date_booking_options,
				success: function( html ) {

					thisList.html( html );

					init_appt_list_date_picker();
					setTimeout(function(){
						thisList.removeClass('scheduled-loading');
					},1);

				}
			});

			return false;

		});

		// New Appointment Click
		scheduledNewAppointment = function(e) {
			e.preventDefault();

			var $button 		= $(this),
				title           = $button.attr('data-title'),
				timeslot		= $button.attr('data-timeslot'),
				date			= $button.attr('data-date'),
				calendar_id		= $button.attr('data-calendar-id'),
				$thisTimeslot	= $button.parents('.timeslot'),
				is_list_view	= $button.parents('.scheduled-calendar-wrap').hasClass('scheduled-list-view');

			if (typeof is_list_view != 'undefined' && is_list_view){
				var new_calendar_id	= $button.parents('.scheduled-list-view').find('.scheduled-list-view-nav').attr('data-calendar-id');
			} else {
				var new_calendar_id	= $button.parents('div.scheduled-calendar').attr('data-calendar-id');
			}
			calendar_id = new_calendar_id ? new_calendar_id : calendar_id;

			scheduled_appt_form_options = {'action':'scheduled_new_appointment_form','nonce': scheduled_js_vars.nonce,'date':date,'timeslot':timeslot,'calendar_id':calendar_id,'title':title};
			$(document).trigger("scheduled-before-loading-booking-form");

			create_scheduled_modal();
			setTimeout(function(){

				$.ajax({
					url: scheduled_js_vars.ajax_url,
					type: 'post',
					data: scheduled_appt_form_options,
					success: function( html ) {

						$('.bm-window').html( html );

						var scheduledModal = $('.scheduled-modal');
						var bmWindow = scheduledModal.find('.bm-window');
						bmWindow.css({'visibility':'hidden'});
						scheduledModal.removeClass('bm-loading');
						$(document).trigger("scheduled-on-new-app");
						resize_scheduled_modal();
						bmWindow.hide();
						$('.scheduled-modal .bm-overlay').find('.scheduled-spinner').remove();

						setTimeout(function(){
							bmWindow.css({'visibility':'visible'});
							bmWindow.show();
						},50);

					}
				});

			},100);

			return false;
		}
		$('body').on('click', '.scheduled-calendar-wrap button.new-appt', scheduledNewAppointment);

		// Profile Tabs
		var profileTabs = $('.scheduled-tabs');

		if (!profileTabs.find('li.active').length){
			profileTabs.find('li:first-child').addClass("active");
		}

		if (profileTabs.length){
			$('.scheduled-tab-content').hide();
			var activeTab = profileTabs.find('.active > a').attr('href');
			activeTab = activeTab.split('#');
			activeTab = activeTab[1];
			$('#profile-'+activeTab).show();

			profileTabs.find('li > a').on('click', function(e) {

				e.preventDefault();
				$('.scheduled-tab-content').hide();
				profileTabs.find('li').removeClass('active');

				$(this).parent().addClass('active');
				var activeTab = $(this).attr('href');
				activeTab = activeTab.split('#');
				activeTab = activeTab[1];

				$('#profile-'+activeTab).show();
				return false;

			});
		}

		// Show Additional Information
		$('body').on('click', '.scheduled-profile-appt-list .scheduled-show-cf', function(e) {

			e.preventDefault();
			var hiddenBlock = $(this).parent().find('.cf-meta-values-hidden');

			if(hiddenBlock.is(':visible')){
				hiddenBlock.hide();
				$(this).removeClass('scheduled-cf-active');
			} else {
				hiddenBlock.show();
				$(this).addClass('scheduled-cf-active');
			}

			return false;

		});

		// Check Login/Registration/Forgot Password forms before Submitting
		if ($('#loginform').length){
			$('#loginform input[type="submit"]').on('click',function(e) {
				if ($('#loginform input[name="log"]').val() && $('#loginform input[name="pwd"]').val()){
					$('#loginform .scheduled-custom-error').hide();
				} else {
					if ( $('#loginform').parents('.scheduled-form-wrap').length ){
						e.preventDefault();
						$('#loginform').parents('.scheduled-form-wrap').find('.scheduled-custom-error').fadeOut(200).fadeIn(200);
					}
				}
			});
		}

		if ($('#profile-forgot').length){
			$('#profile-forgot input[type="submit"]').on('click',function(e) {
				if ($('#profile-forgot input[name="user_login"]').val()){
					$('#profile-forgot .scheduled-custom-error').hide();
				} else {
					e.preventDefault();
					$('#profile-forgot').find('.scheduled-custom-error').fadeOut(200).fadeIn(200);
				}
			});
		}

		// Custom Upload Field
		if ($('.scheduled-upload-wrap').length){

			$('.scheduled-upload-wrap input[type=file]').on('change',function(){

				var fileName = $(this).val();
				$(this).parent().find('span').html(fileName);
				$(this).parent().addClass('hasFile');

			});

		}

		// Delete Appointment
		$('body').on('click', '.scheduled-profile-appt-list .appt-block .cancel', function(e) {

			e.preventDefault();

			var $button 		= $(this),
				$thisParent		= $button.parents('.appt-block'),
				appt_id			= $thisParent.attr('data-appt-id');

			confirm_delete = confirm(scheduled_js_vars.i18n_confirm_appt_delete);
			if (confirm_delete == true){

				var currentApptCount = parseInt($('.scheduled-profile-appt-list').find('h4').find('span.count').html());
				currentApptCount = parseInt(currentApptCount - 1);
				if (currentApptCount < 1){
					$('.scheduled-profile-appt-list').find('h4').find('span.count').html('0');
					$('.no-appts-message').slideDown('fast');
				} else {
					$('.scheduled-profile-appt-list').find('h4').find('span.count').html(currentApptCount);
				}

				$('.appt-block').animate({'opacity':0.4},0);

	  			$thisParent.slideUp('fast',function(){
					$(this).remove();
				});

				$.ajax({
					'url' 		: scheduled_js_vars.ajax_url,
					'method' 	: 'post',
					'data'		: {
						'action'     	: 'scheduled_cancel_appt',
						'nonce'			: scheduled_js_vars.nonce,
						'appt_id'     	: appt_id
					},
					success: function(data) {
						$('.appt-block').animate({'opacity':1},150);
					}
				});

			}

			return false;

		});

		$('body').on('touchstart click','.bm-overlay, .bm-window .close, .scheduled-form .cancel',function(e){
			e.preventDefault();
			close_scheduled_modal();
			return false;
		});

		$('body')
		.on('focusin', '.scheduled-form input', function() {
			if(this.title==this.value) {
				$(this).addClass('hasContent');
				this.value = '';
			}
		}).on('focusout', '.scheduled-form input', function(){
			if(this.value==='') {
				$(this).removeClass('hasContent');
				this.value = this.title;
			}
		});

		$('body').on('change','.scheduled-form input',function(){

			var condition = $(this).attr('data-condition'),
				thisVal = $(this).val();

			if (condition && $('.condition-block').length) {
				$('.condition-block.'+condition).hide();
				$('#condition-'+thisVal).fadeIn(200);
				resize_scheduled_modal();
			}

		});

		// Perform AJAX login on form submit
	    $('body').on('submit','form#ajaxlogin', function(e){
		    e.preventDefault();

	        $('form#ajaxlogin p.status').show().html('<i class="fa-solid fa-circle-notch fa-spin"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_please_wait);
	        resize_scheduled_modal();

	        var $this = $(this),
	        	date = $this.data('date'),
	        	title = $this.data('title'),
	        	timeslot = $this.data('timeslot'),
	        	calendar_id = $this.data('calendar-id');

	        $.ajax({
		        type	: 'post',
				url 	: scheduled_js_vars.ajax_url,
				data	: $('form#ajaxlogin').serialize(),
				success	: function(data) {
					if (data == 'success'){

						// close the modal box
						close_scheduled_modal();

						// reopen the modal box
						var $button = $( '<button data-title="' + title + '" data-timeslot="' + timeslot + '" data-date="' + date + '" data-calendar-id="' + calendar_id + '"></button>' );
						$button.on( 'click', window.scheduledNewAppointment );
						$button.triggerHandler( 'click' );
						$button.unbind( 'click', window.scheduledNewAppointment );
						$button.detach();

					} else {
						$('form#ajaxlogin p.status').show().html('<i class="fa-solid fa-triangle-exclamation" style="color:#E35656"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_wrong_username_pass);
						resize_scheduled_modal();
					}
	            }
	        });
	        e.preventDefault();
	    });

	    $('body').on('click','.scheduled-forgot-password',function(e){

			e.preventDefault();
			$('#ajaxlogin').hide();
			$('#ajaxforgot').show();

			resize_scheduled_modal();

	    });

	     $('body').on('click','.scheduled-forgot-goback',function(e){

			e.preventDefault();
			$('#ajaxlogin').show();
			$('#ajaxforgot').hide();

			resize_scheduled_modal();

	    });

	    // Perform AJAX login on form submit

	    $('body').on('submit','form#ajaxforgot', function(e){
		    e.preventDefault();

	        $('form#ajaxforgot p.status').show().html('<i class="fa-solid fa-circle-notch fa-spin"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_please_wait);
	        resize_scheduled_modal();

	        var $this = $(this);

	        $.ajax({
		        type	: 'post',
				url 	: scheduled_js_vars.ajax_url,
				data	: $('form#ajaxforgot').serialize(),
				success	: function(data) {
					if (data == 'success'){

						e.preventDefault();
						$('#ajaxlogin').show();
						$('#ajaxforgot').hide();

						$('form#ajaxlogin p.status').show().html('<i class="fa-solid fa-check" style="color:#56c477"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_password_reset);
						resize_scheduled_modal();

					} else {

						//console.log(data);
						$('form#ajaxforgot p.status').show().html('<i class="fa-solid fa-triangle-exclamation" style="color:#E35656"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_password_reset_error);
						resize_scheduled_modal();

					}
	            }
	        });
	        e.preventDefault();
	    });


		// Submit the "Request Appointment" Form
		$('body').on('click','.scheduled-form input#submit-request-appointment',function(e){

			$('form#newAppointmentForm p.status').show().html('<i class="fa-solid fa-circle-notch fa-spin"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_please_wait);
	        resize_scheduled_modal();

			e.preventDefault();

			var customerType        = $('#newAppointmentForm input[name=customer_type]').val(),
				customerID          = $('#newAppointmentForm input[name=user_id]').val(),
				name                = $('#newAppointmentForm input[name=scheduled_appt_name]').val(),
				surname             = $('#newAppointmentForm input[name=scheduled_appt_surname]').val(),
				surnameActive		= $('#newAppointmentForm input[name=scheduled_appt_surname]').length,
				guest_name          = $('#newAppointmentForm input[name=guest_name]').val(),
				guest_surname      	= $('#newAppointmentForm input[name=guest_surname]').val(),
				guest_surnameActive = $('#newAppointmentForm input[name=guest_surname]').length,
				guest_email			= $('#newAppointmentForm input[name=guest_email]').val(),
				guest_emailActive 	= $('#newAppointmentForm input[name=guest_email]').length,
				email               = $('#newAppointmentForm input[name=scheduled_appt_email]').val(),
				password            = $('#newAppointmentForm input[name=scheduled_appt_password]').val(),
				showRequiredError   = false,
				ajaxRequests        = [];

			$(this).parents('.scheduled-form').find('input,textarea,select').each(function(i,field){

				var required = $(this).attr('required');

				if (required && $(field).attr('type') == 'hidden'){
					var fieldParts = $(field).attr('name');
					fieldParts = fieldParts.split('---');
					fieldName = fieldParts[0];
					fieldNumber = fieldParts[1].split('___');
					fieldNumber = fieldNumber[0];

					if (fieldName == 'radio-buttons-label'){
						var radioValue = false;
						$('input:radio[name="single-radio-button---'+fieldNumber+'[]"]:checked').each(function(){
							if ($(this).val()){
								radioValue = $(this).val();
							}
						});
						if (!radioValue){
							showRequiredError = true;
						}
					} else if (fieldName == 'checkboxes-label'){
						var checkboxValue = false;
						$('input:checkbox[name="single-checkbox---'+fieldNumber+'[]"]:checked').each(function(){
							if ($(this).val()){
								checkboxValue = $(this).val();
							}
						});
						if (!checkboxValue){
							showRequiredError = true;
						}
					}

				} else if (required && $(field).attr('type') != 'hidden' && $(field).val() == ''){
		            showRequiredError = true;
		        }

		    });

		    if (showRequiredError) {
			    $('form#newAppointmentForm p.status').show().html('<i class="fa-solid fa-triangle-exclamation" style="color:#E35656"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_fill_out_required_fields);
				resize_scheduled_modal();
			    return false;
		    }

			if ( customerType == 'new' && !name || customerType == 'new' && surnameActive && !surname || customerType == 'new' && !email || customerType == 'new' && !password ) {
				$('form#newAppointmentForm p.status').show().html('<i class="fa-solid fa-triangle-exclamation" style="color:#E35656"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_appt_required_fields);
				resize_scheduled_modal();
				return false;
			}

			if ( customerType == 'guest' && !guest_name || customerType == 'guest' && guest_emailActive && !guest_email || customerType == 'guest' && guest_surnameActive && !guest_surname ){
				$('form#newAppointmentForm p.status').show().html('<i class="fa-solid fa-triangle-exclamation" style="color:#E35656"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_appt_required_fields_guest);
				resize_scheduled_modal();
				return false;
			}

			if (customerType == 'current' && customerID ||
				customerType == 'guest' && guest_name && !guest_surnameActive && !guest_emailActive ||
				customerType == 'guest' && guest_name && guest_surnameActive && guest_surname && !guest_emailActive ||
				customerType == 'guest' && guest_name && guest_emailActive && guest_email && !guest_surnameActive ||
				customerType == 'guest' && guest_name && guest_emailActive && guest_email && guest_surnameActive && guest_surname ) {

			    SubmitRequestAppointment.currentUserOrGuest();

			}

			if (customerType == 'new' && name && email && password) {
				if ( !surnameActive || surnameActive && surname ){
					SubmitRequestAppointment.newUser();
				}
			}

		});

		var SubmitRequestAppointment = {

			formSelector: '#newAppointmentForm',
			formBtnRequestSelector: '.scheduled-form input#submit-request-appointment',
			formStatusSelector: 'p.status',
			formSubmitBtnSelector: '#submit-request-appointment',

			apptContainerSelector: '.scheduled-appointment-details',

			baseFields: 	[ 'guest_name','guest_surname','guest_email','action', 'customer_type', 'user_id' ],
			apptFields: 	[ 'appoinment', 'calendar_id', 'title', 'date', 'timestamp', 'timeslot' ],
			userFields: 	[ 'scheduled_appt_name','scheduled_appt_surname','scheduled_appt_email', 'scheduled_appt_password' ],
			captchaFields: 	[ 'captcha_word', 'captcha_code' ],

			currentApptIndex: false,
			currentApptCounter: false,
			hasAnyErrors: false,

			currentUserOrGuest: function() {
				var total_appts = SubmitRequestAppointment._totalAppts();

				if ( ! total_appts ) {
					return;
				}

				SubmitRequestAppointment._showLoadingMessage();
				SubmitRequestAppointment._resetDefaultValues();

				var data = SubmitRequestAppointment._getBaseData();

				SubmitRequestAppointment.currentApptIndex = 0;
				SubmitRequestAppointment.currentApptCounter = 1;
				SubmitRequestAppointment._doRequestAppointment( data, total_appts );

			},

			// pretty much the same as SubmitRequestAppointment.currentUserOrGuest(), however, it include the user name, email and password
			newUser: function() {
				var total_appts = SubmitRequestAppointment._totalAppts();

				if ( ! total_appts ) {
					return;
				}

				SubmitRequestAppointment._showLoadingMessage();
				SubmitRequestAppointment._resetDefaultValues();

				var data = SubmitRequestAppointment._getBaseData();

				// when there are more than one appointment, we need to make the registration request first and then loop the appointments
				if ( total_appts > 1 ) {
					var data_obj_with_no_reference = null;
					data_obj_with_no_reference = $.extend( true, {}, data );
					data_obj_with_no_reference = SubmitRequestAppointment._addUserRegistrationData( data_obj_with_no_reference );
					SubmitRequestAppointment._requestUserRegistration( data_obj_with_no_reference );

					data.customer_type = 'current';
				} else {
					// add user registration fields values
					data = SubmitRequestAppointment._addUserRegistrationData( data );
				}

				SubmitRequestAppointment.currentApptIndex = 0;
				SubmitRequestAppointment._doRequestAppointment( data, total_appts );
			},

			_doRequestAppointment: function( data, total_appts ) {

				var appt_fields = SubmitRequestAppointment.apptFields;

				// for the first item only
				if ( SubmitRequestAppointment.currentApptIndex === 0 ) {
					SubmitRequestAppointment._hideCancelBtn();
					SubmitRequestAppointment._disableSubmitBtn();
					SubmitRequestAppointment.hasAnyErrors = false;
				}
				// <------end

				var data_obj_with_no_reference = $.extend( true, {}, data );

				// add the appointment fields to the data
				for (var i = 0; i < appt_fields.length; i++) {
					data_obj_with_no_reference[ appt_fields[i] ] = SubmitRequestAppointment._getFieldVal( appt_fields[i], SubmitRequestAppointment.currentApptIndex );
				}

				var calendar_id = SubmitRequestAppointment._getFieldVal( 'calendar_id', SubmitRequestAppointment.currentApptIndex );
				data_obj_with_no_reference = SubmitRequestAppointment._addCustomFieldsData( data_obj_with_no_reference, calendar_id );

				var $appt = SubmitRequestAppointment._getApptElement( SubmitRequestAppointment.currentApptIndex );

				if ( ! $appt.hasClass('skip') ) {
					$.ajax({
						type    : 'post',
						url     : scheduled_js_vars.ajax_url,
						data    : data_obj_with_no_reference,
						success	: function( response ) {

							//SubmitRequestAppointment._enableSubmitBtn();
							//SubmitRequestAppointment._showCancelBtn();

							//console.log(response);
							//return;

							SubmitRequestAppointment._requestAppointmentResponseHandler( response );
							SubmitRequestAppointment.currentApptIndex++;

							setTimeout( function() {
								if ( SubmitRequestAppointment.currentApptCounter === total_appts ) {
									// for the last item only
									if ( ! SubmitRequestAppointment.hasAnyErrors ) {
										SubmitRequestAppointment._onAfterRequestAppointment();
									} else {
										SubmitRequestAppointment._enableSubmitBtn();
										SubmitRequestAppointment._showCancelBtn();
									}
									// <------end
								} else {
									SubmitRequestAppointment.currentApptCounter++;
									SubmitRequestAppointment._doRequestAppointment( data, total_appts );
								}
							}, 100 );
						}
					});
				} else {
					SubmitRequestAppointment.currentApptIndex++;
					SubmitRequestAppointment.currentApptCounter++;
					SubmitRequestAppointment._doRequestAppointment( data, total_appts, SubmitRequestAppointment.currentApptIndex );
				}
			},

			_totalAppts: function() {
				return $(SubmitRequestAppointment.formSelector + ' input[name="appoinment[]"]').length;
			},

			_getBaseData: function() {
				var data = {},
					fields = SubmitRequestAppointment.baseFields;

				// set up the base form data
				for ( var i = 0; i < fields.length; i++ ) {
					data[ fields[i] ] = SubmitRequestAppointment._getFieldVal( fields[i] );
				}

				data['nonce'] = scheduled_js_vars.nonce;
				data['is_fe_form'] = true;
				data['total_appts'] = SubmitRequestAppointment._totalAppts();

				return data;
			},

			_getFieldVal: function( field_name, field_index ) {
				var field_name = typeof field_name === 'undefined' ? '' : field_name,
					field_index = typeof field_index === 'undefined' ? false : field_index,
					selector = SubmitRequestAppointment.formSelector + ' ';

				if ( field_index === false ) {
					selector += ' [name=' + field_name + ']';
					return $( selector ).val();
				}

				selector += ' [name="' + field_name + '[]"]';
				return $( selector ).eq( field_index ).val();
			},

			_resetDefaultValues: function() {
				 $('.scheduled-form input').each(function(){
					var thisVal = $(this).val(),
						thisDefault = $(this).attr('title');

					if ( thisDefault == thisVal ){
						$(this).val('');
					}
				});
			},

			_resetToDefaultValues: function() {
				$('.scheduled-form input').each(function(){
					var thisVal = $(this).val(),
						thisDefault = $(this).attr('title');

					if ( ! thisVal ){
						$(this).val( thisDefault );
					}
				});
			},

			_addUserRegistrationData: function( data ) {
				// populate the user data
				$.each( SubmitRequestAppointment.userFields, function( index, field_name ) {
					data[ field_name ] = SubmitRequestAppointment._getFieldVal( field_name );
				} );

				// populate captcha data if available
				$.each( SubmitRequestAppointment.captchaFields, function( index, field_name ) {
					var field_value = SubmitRequestAppointment._getFieldVal( field_name );

					if ( ! field_value ) {
						return;
					}

					data[ field_name ] = field_value;
				} );

				return data;
			},

			_addCustomFieldsData: function( data, calendar_id ) {
				var custom_fields_data = $('.cf-block [name]')
					.filter( function( index ) {
						var $this = $(this);
						return parseInt($this.data('calendar-id')) === parseInt(calendar_id) && $this.attr('name').match(/---\d+/g);
					} )
					.each( function( index ) {
						var $this = $(this),
							name = $this.attr('name'),
							value = $this.val(),
							type = $this.attr('type');

						if ( ! value ) {
							return;
						}

						if ( ! name.match(/checkbox|radio+/g) ) {
							data[ name ] = value;
							return;
						}

						if ( name.match(/radio+/g) && $this.is(':checked') ) {
							data[ name ] = value;
							return;
						}

						if ( ! name.match(/radio+/g) && typeof data[ name ] === 'undefined' || ! name.match(/radio+/g) && data[ name ].constructor !== Array ) {
							data[ name ] = [];
						}

						if ( ! $this.is(':checked') ) {
							return;
						}

						data[ name ].push( value );
					} );

				return data;
			},

			_requestUserRegistration: function( base_data, appt_index ) {
				$.ajax({
					type    : 'post',
					url     : scheduled_js_vars.ajax_url,
					data    : base_data,
					async   : false,
					success	: function( response ) {
						SubmitRequestAppointment._requestUserRegistrationResponseHandler( response );
					}
				});
			},

			_requestUserRegistrationResponseHandler: function( response ) {
				var response_parts = response.split('###'),
					data_result = response_parts[0].substr( response_parts[0].length - 5 );

				if ( data_result === 'error' ) {
					// do something on registration failure
					return;
				}

				// do something on successful registration
			},

			_requestAppointment: function( response ) {
				SubmitRequestAppointment._requestAppointmentResponseHandler( response );
			},

			_requestAppointmentResponseHandler: function( response ) {
				var response_parts = response.split('###'),
					data_result = response_parts[0].substr( response_parts[0].length - 5 );

				if ( data_result === 'error' ) {
					SubmitRequestAppointment._requestAppointmentOnError( response_parts );
					return;
				}

				SubmitRequestAppointment._requestAppointmentOnSuccess( response_parts );
			},

			_requestAppointmentOnError: function( response_parts ) {
				var $apptEl = SubmitRequestAppointment._getApptElement();

				$(document).trigger("scheduled-on-requested-appt-error",[$apptEl]);

				SubmitRequestAppointment._highlightAppt();

				SubmitRequestAppointment._setStatusMsg( response_parts[1] );

				SubmitRequestAppointment.hasAnyErrors = true;

				resize_scheduled_modal();
			},

			_requestAppointmentOnSuccess: function( response_parts ) {
				var $apptEl = SubmitRequestAppointment._getApptElement();

				$(document).trigger("scheduled-on-requested-appt-success",[$apptEl]);

				SubmitRequestAppointment._unhighlightAppt();
			},

			_onAfterRequestAppointment: function() {
				var redirectObj = { redirect : false };
				var redirect = $(document).trigger("scheduled-on-requested-appointment",[redirectObj]);

				if ( redirectObj.redirect ) {
					return;
				}

				if ( scheduled_js_vars.profilePage ) {
					window.location = scheduled_js_vars.profilePage;
					return;
				}

				SubmitRequestAppointment._reloadApptsList();
				SubmitRequestAppointment._reloadCalendarTable();
			},

			_setStatusMsg: function( msg ) {
				var form_status_selector = SubmitRequestAppointment.formSelector + ' ' + SubmitRequestAppointment.formStatusSelector;
				$( form_status_selector ).show().html( '<i class="fa-solid fa-triangle-exclamation" style="color:#E35656"></i>&nbsp;&nbsp;&nbsp;' + msg );
			},

			_getApptElement: function( appt_index ) {
				var appt_index = typeof appt_index === 'undefined' ? SubmitRequestAppointment.currentApptIndex : appt_index,
					appt_cnt_selector = SubmitRequestAppointment.formSelector + ' ' + SubmitRequestAppointment.apptContainerSelector;

				return $( appt_cnt_selector ).eq( appt_index );
			},

			_highlightAppt: function( msg ) {
				var $apptEl = SubmitRequestAppointment._getApptElement();

				if ( ! $apptEl.length ) {
					return;
				}

				$apptEl.addClass('has-error');
			},

			_unhighlightAppt: function( msg ) {
				var $apptEl = SubmitRequestAppointment._getApptElement();

				if ( ! $apptEl.length ) {
					return;
				}

				$apptEl.removeClass('has-error').addClass('skip');
			},

			_enableSubmitBtn: function() {
				var btn_selector = SubmitRequestAppointment.formSelector + ' ' + SubmitRequestAppointment.formSubmitBtnSelector;
				$( btn_selector ).attr( 'disabled', false );
			},

			_disableSubmitBtn: function() {
				var btn_selector = SubmitRequestAppointment.formSelector + ' ' + SubmitRequestAppointment.formSubmitBtnSelector;
				$( btn_selector ).attr( 'disabled', true );
			},

			_showCancelBtn: function() {
				$( SubmitRequestAppointment.formSelector ).find('button.cancel').show();
			},

			_hideCancelBtn: function() {
				$( SubmitRequestAppointment.formSelector ).find('button.cancel').hide();
			},

			_showLoadingMessage: function() {
				$('form#newAppointmentForm p.status').show().html('<i class="fa-solid fa-circle-notch fa-spin"></i>&nbsp;&nbsp;&nbsp;' + scheduled_js_vars.i18n_please_wait);
			},

			_reloadApptsList: function() {
				if ( ! $('.scheduled-appt-list').length ){
					return;
				}

				$('.scheduled-appt-list').each( function() {
					var $thisApptList  = $(this),
						date          = $thisApptList.attr('data-list-date'),
						thisList      = $thisApptList.parents('.scheduled-list-view'),
						defaultDate   = thisList.attr('data-default'),
						calendar_id   = parseInt($thisApptList.find('.scheduled-list-view-nav').attr('data-calendar-id')) || 0;

					defaultDate = typeof defaultDate === 'undefined' ? false : defaultDate;
					calendar_id = calendar_id ? calendar_id : 0;

					thisList.addClass('scheduled-loading');

					var scheduled_load_list_view_date_booking_options = {
						'action'		: 'scheduled_appointment_list_date',
						'nonce'			: scheduled_js_vars.nonce,
						'date'			: date,
						'calendar_id'	: calendar_id,
						'force_default'	: defaultDate
					};

					$(document).trigger("scheduled-before-loading-appointment-list-booking-options");
					thisList.spin('scheduled_top');

					$.ajax({
						url: scheduled_js_vars.ajax_url,
						type: 'post',
						data: scheduled_load_list_view_date_booking_options,
						success: function( html ) {
							thisList.html( html );

							close_scheduled_modal();
							init_appt_list_date_picker();
							setTimeout(function(){
								thisList.removeClass('scheduled-loading');
							},1);
						}
					});
				});
			},

			_reloadCalendarTable: function() {
				if ( ! $('.bc-col.active').length ) {
					return;
				}

				var $activeTD = $('.bc-col.active'),
					activeDate = $activeTD.attr('data-date'),
					calendar_id = parseInt( $activeTD.parents('table').data('calendar-id') ) || 0;

				scheduled_load_calendar_date_booking_options = { 'action':'scheduled_calendar_date','nonce': scheduled_js_vars.nonce,'date':activeDate, 'calendar_id':calendar_id };
				$(document).trigger("scheduled-before-loading-calendar-booking-options");

				$.ajax({
					url: scheduled_js_vars.ajax_url,
					type: 'post',
					data: scheduled_load_calendar_date_booking_options,
					success: function( html ) {

						$('.bc-row.entryBlock').find('.bc-col').html( html );

						close_scheduled_modal();
						$('.bc-row.entryBlock').removeClass('scheduled-loading');
						$('.bc-row.entryBlock').find('.scheduled-appt-list').hide().fadeIn(300);
						$('.bc-row.entryBlock').find('.scheduled-appt-list').addClass('shown');
						adjust_calendar_boxes();
					}
				});
			}
		}
	});

	function scheduledRemoveEmptyTRs(){
		$('div.scheduled-calendar').find('.bc-row.week').each(function(){
			if ($(this).children().length == 0){
				$(this).remove();
			}
		});
	}

	// Saving state updater
	function savingState(show,limit_to){

		show = typeof show !== 'undefined' ? show : true;
		limit_to = typeof limit_to !== 'undefined' ? limit_to : false;

		if (limit_to){

			var $savingStateDIV = limit_to.find('li.active .savingState, .topSavingState.savingState, .calendarSavingState');
			var $stuffToHide = limit_to.find('.monthName');
			var $stuffToTransparent = limit_to.find('div.scheduled-calendar .bc-body');

		} else {

			var $savingStateDIV = $('li.active .savingState, .topSavingState.savingState, .calendarSavingState');
			var $stuffToHide = $('.monthName');
			var $stuffToTransparent = $('div.scheduled-calendar .bc-body');

		}

		if (show){
			$savingStateDIV.fadeIn(200);
			$stuffToHide.hide();
			$stuffToTransparent.animate({'opacity':0.2},100);
		} else {
			$savingStateDIV.hide();
			$stuffToHide.show();
			$stuffToTransparent.animate({'opacity':1},0);
		}

	}

	$(document).ajaxStop(function() {
		savingState(false);
	});

	function init_appt_list_date_picker(){

		$('.scheduled_list_date_picker').each(function(){
			var thisDatePicker = $(this);
			var minDateVal = thisDatePicker.parents('.scheduled-appt-list').attr('data-min-date');
			var maxDateVal = thisDatePicker.parents('.scheduled-appt-list').attr('data-max-date');
			if (typeof minDateVal == 'undefined'){ var minDateVal = thisDatePicker.attr('data-min-date'); }

			thisDatePicker.datepicker({
		        dateFormat: 'yy-mm-dd',
		        minDate: minDateVal,
		        maxDate: maxDateVal,
		        showAnim: false,
		        beforeShow: function(input, inst) {
					$('#ui-datepicker-div').removeClass();
					$('#ui-datepicker-div').addClass('scheduled_custom_date_picker');
			    },
			    onClose: function(dateText){
					$('.scheduled_list_date_picker_trigger').removeClass('scheduled-dp-active');
			    },
			    onSelect: function(dateText){

				   	var thisInput 			= $(this),
						date				= dateText,
						thisList			= thisInput.parents('.scheduled-list-view'),
						defaultDate			= thisList.attr('data-default'),
						calendar_id			= thisInput.parents('.scheduled-list-view-nav').attr('data-calendar-id');

					if (typeof defaultDate == 'undefined'){ defaultDate = false; }

					if (!calendar_id){ calendar_id = 0; }
					thisList.addClass('scheduled-loading');

					var scheduled_load_list_view_date_booking_options = {
						'action'		: 'scheduled_appointment_list_date',
						'nonce'			: scheduled_js_vars.nonce,
						'date'			: date,
						'calendar_id'	: calendar_id,
						'force_default'	: defaultDate
					};

					$(document).trigger("scheduled-before-loading-appointment-list-booking-options");
					thisList.spin('scheduled_top');

					$.ajax({
						url: scheduled_js_vars.ajax_url,
						type: 'post',
						data: scheduled_load_list_view_date_booking_options,
						success: function( html ) {

							thisList.html( html );

							init_appt_list_date_picker();
							setTimeout(function(){
								thisList.removeClass('scheduled-loading');
							},1);

						}
					});

					return false;
			    }
		    });

		});

		$('body').on('click','.scheduled_list_date_picker_trigger',function(e){
			e.preventDefault();
			if (!$(this).hasClass('scheduled-dp-active')){
				$(this).addClass('scheduled-dp-active');
				$(this).parents('.scheduled-appt-list').find('.scheduled_list_date_picker').datepicker('show');
			}

	    });

	}

	var ScheduledTabs = {
		bookingModalSelector: '.scheduled-modal',
		tabSelector: '.scheduled-tabs',
		tabNavSelector: '.scheduled-tabs-nav span',
		tabCntSelector: '.scheduled-tabs-cnt',

		Init: function() {
			$(document).on( 'click', this.tabNavSelector, this.tabsNav );
		},

		tabsNav: function( event ) {
			event.preventDefault();

			ScheduledTabs.switchToTab( $(this) );
			ScheduledTabs.maybeResizeBookingModal();
		},

		switchToTab: function( tab_nav_item ) {
			var $nav_item = tab_nav_item,
				tab_cnt_class = '.' + $nav_item.data('tab-cnt'),
				$tabs_container = $nav_item.parents( ScheduledTabs.tabSelector );

			$nav_item
				.addClass( 'active' )
				.siblings()
				.removeClass( 'active' )

			$tabs_container
				.find( ScheduledTabs.tabCntSelector + ' ' + tab_cnt_class )
				.addClass( 'active' )
				.siblings()
				.removeClass( 'active' );
		},

		maybeResizeBookingModal: function() {
			if ( ! $(ScheduledTabs.bookingModalSelector).length ) {
				return;
			}

			resize_scheduled_modal();
		}
	}

})(jQuery, window, document);

// Create Scheduled Modal
function create_scheduled_modal(){
	var windowHeight = jQuery(window).height();
	var windowWidth = jQuery(window).width();
	if (windowWidth > 720){
		var maxModalHeight = windowHeight - 295;
	} else {
		var maxModalHeight = windowHeight;
	}

	jQuery('body input, body textarea, body select').blur();
	jQuery('body').addClass('scheduled-noScroll');
	jQuery('<div class="scheduled-modal bm-loading"><div class="bm-overlay"></div><div class="bm-window"><div style="height:100px"></div></div></div>').appendTo('body');
	jQuery('.scheduled-modal .bm-overlay').spin('scheduled_white');
	jQuery('.scheduled-modal .bm-window').css({'max-height':maxModalHeight+'px'});
}

var previousRealModalHeight = 100;

function resize_scheduled_modal(){

	var windowHeight = jQuery(window).height();
	var windowWidth = jQuery(window).width();

	var common43 = 43;

	if (jQuery('.scheduled-modal .bm-window .scheduled-scrollable').length){
		var realModalHeight = jQuery('.scheduled-modal .bm-window .scheduled-scrollable')[0].scrollHeight;

		if (realModalHeight < 100){
			realModalHeight = previousRealModalHeight;
		} else {
			previousRealModalHeight = realModalHeight;
		}

	} else {
		var realModalHeight = 0;
	}
	var minimumWindowHeight = realModalHeight + common43 + common43;
	var modalScrollableHeight = realModalHeight - common43;
	var maxModalHeight;
	var maxFormHeight;

	if (windowHeight < minimumWindowHeight){
		modalScrollableHeight = windowHeight - common43 - common43;
	} else {
		modalScrollableHeight = realModalHeight;
	}

	if (windowWidth > 720){
		maxModalHeight = modalScrollableHeight - 25;
		maxFormHeight = maxModalHeight - 15;
		var modalNegMargin = (maxModalHeight + 78) / 2;
	} else {
		maxModalHeight = windowHeight - common43;
		maxFormHeight = maxModalHeight - 60;
		var modalNegMargin = (maxModalHeight) / 2;
	}

	jQuery('.scheduled-modal').css({'margin-top':'-'+modalNegMargin+'px'});
	jQuery('.scheduled-modal .bm-window').css({'max-height':maxModalHeight+'px'});
	jQuery('.scheduled-modal .bm-window .scheduled-scrollable').css({'max-height':maxFormHeight+'px'});

}

function close_scheduled_modal(){
	var modal = jQuery('.scheduled-modal');
	modal.fadeOut(200);
	modal.addClass('bm-closing');
	jQuery('body').removeClass('scheduled-noScroll');
	setTimeout(function(){
		modal.remove();
	},300);
}

function init_tooltips(container){
	jQuery('.tooltipster').tooltipster({
		theme: 		'tooltipster-light',
		animation:	'grow',
		speed:		200,
		delay: 		50,
		offsetY:	-15
	});
}

// Function to adjust calendar sizing
function adjust_calendar_boxes(){
	jQuery('div.scheduled-calendar').each(function(){

		var windowWidth = jQuery(window).width();
		var smallCalendar = jQuery(this).parents('.scheduled-calendar-wrap').hasClass('small');
		var boxesWidth = jQuery(this).find('.bc-body .bc-row.week .bc-col').width();
		var calendarHeight = jQuery(this).height();
		boxesHeight = boxesWidth * 1;
		jQuery(this).find('.bc-body .bc-row.week .bc-col').height(boxesHeight);
		jQuery(this).find('.bc-body .bc-row.week .bc-col .date').css('line-height',boxesHeight+'px');
		jQuery(this).find('.bc-body .bc-row.week .bc-col .date .number').css('line-height',boxesHeight+'px');
		if (smallCalendar || windowWidth < 720){
			jQuery(this).find('.bc-body .bc-row.week .bc-col .date .number').css('line-height',boxesHeight+'px');
		} else {
			jQuery(this).find('.bc-body .bc-row.week .bc-col .date .number').css('line-height','');
		}

		var calendarHeight = jQuery(this).height();
		jQuery(this).parent().height(calendarHeight);

	});
}
