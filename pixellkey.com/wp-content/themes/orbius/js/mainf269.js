(function($){

    'use strict';

    window.swmTheme       = {};
    swmTheme.body         = $( 'body' );
    swmTheme.scroll       = 0;
    swmTheme.adminbar = $( '#wpadminbar' );
    swmTheme.wpAdminBarHeight =  swmTheme.adminbar.length === 0 || swmTheme.adminbar.css( 'display' ) == 'none' || swmTheme.adminbar.css( 'position' ) == 'absolute' ? 0 : swmTheme.adminbar.height();

    swmTheme.windowWidth  = $( window ).width();
    swmTheme.windowHeight = $( window ).height();

    var SwmThemeSettings = {

        init: function() {
            this._swmBrowserDetection();
            $(".fitVids").fitVids();
            this._goTopScroll();
            this._smoothScroll();
            this._listWidgets();
            this._stickySidebar();
            this._magnificPopup();
            this._main_Navigation();
            this._dropDownMenu();
            this._swmStickyFooter();
            this._stickyHeader();
            this._readingProgressBar();
            this._ItemLoad();

            swmTheme.swmWaitForImages = this._swmWaitForImages;
        },

        _swmWaitForImages: function($element, callback) {
            if ( $element.length ) {
                var images = $element.find( 'img' );

                if ( images.length ) {
                    var counter = 0;

                    for ( var index = 0; index < images.length; index++ ) {
                        var img = images[index];

                        if ( img.complete ) {
                            counter++;
                            if ( counter === images.length ) { callback.call( $element ); }
                        } else {
                            var image = new Image();

                            image.addEventListener( 'load', function () {
                                counter++;
                                if ( counter === images.length ) {
                                    callback.call( $element );
                                    return false;
                                }
                            }, false );
                            image.src = img.src;
                        }
                    }
                } else {
                    callback.call( $element );
                }
            }
        },

        _ItemLoad: function() {
                this.holder = $( '.swm-scroll-load:not(.swm--loaded)' );

                function swmRandomArbitrary( min, max ) { return Math.floor( Math.random() * (max - min) + min ); }

                if ( this.holder.length ) {
                    this.holder.each(
                        function () {
                            var holder      = $( this ),
                                randomNum   = swmRandomArbitrary(10, 400 ),
                                appearDelay = $( this ).attr( 'data-appear-delay' );

                            if ( ! appearDelay ) {
                                SwmThemeSettings._ItemViewPort( holder, function () {
                                    holder.addClass( 'swm--loaded' );
                                });
                            } else {
                                appearDelay = (appearDelay === 'random') ? randomNum : appearDelay;
                                SwmThemeSettings._ItemViewPort( holder, function () {
                                    setTimeout( function () { holder.addClass( 'swm--loaded' ); }, appearDelay );
                                });
                            }
                        });
                }
        },

        _swmBrowserDetection: function() {

            function swmCheckBrowser(name) {
                var isBrowser = false;

                switch (name) {
                    case 'chrome':
                        isBrowser = /Chrome/.test( navigator.userAgent ) && /Google Inc/.test( navigator.vendor );
                        break;
                    case 'safari':
                        isBrowser = /Safari/.test( navigator.userAgent ) && /Apple Computer/.test( navigator.vendor );
                        break;
                    case 'firefox':
                        isBrowser = navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1;
                        break;
                    case 'ie':
                        isBrowser = window.navigator.userAgent.indexOf( 'MSIE ' ) > 0 || ! ! navigator.userAgent.match( /Trident.*rv\:11\./ );
                        break;
                    case 'edge':
                        isBrowser = /Edge\/\d./i.test( navigator.userAgent );
                        break;
                }

                return isBrowser;
            }
            var browsers = ['chrome', 'safari', 'firefox', 'ie', 'edge'];

            $.each( browsers, function ( key, value ) {
                if ( swmCheckBrowser( value ) && typeof swmTheme.body !== 'undefined' ) {
                    if ( value === 'ie' ) {
                        value = 'ms-explorer';
                    }

                    swmTheme.body.addClass( 'swm-browser--' + value );
                }
            });

        },

        _ItemViewPort: function($element, callback, onlyOnce) {

            if ( $element.length ) {
                var offset   = typeof $element.data( 'viewport-offset' ) !== 'undefined' ? $element.data( 'viewport-offset' ) : 0.15; // When item is 15% in the viewport
                var observer = new IntersectionObserver(
                    function ( entries ) {
                        // isIntersecting is true when element and viewport are overlapping
                        // isIntersecting is false when element and viewport don't overlap
                        if ( entries[0].isIntersecting === true ) {
                            callback.call( $element );
                            if ( onlyOnce !== false ) { observer.disconnect(); }  // Stop watching the element when it's initialize
                        }
                    },
                    { threshold: [offset] }
                );
                observer.observe( $element[0] );
            }
        },

        _stickyHeaderDisplay: function(element, spacer) {

            if ( $(element).length > 0 )  {

                var themeHeader      = $('#swm-header'),
                    getHeaderHeight  = parseInt(themeHeader.innerHeight(), 10),
                    getHeaderElement = themeHeader.find('.elementor > .elementor-element'),
                    stickyHeader     = $(element),
                    windowTopScroll  = $(window).scrollTop(),
                    stickySpacer     = $(spacer),
                    getHeaderHeight  = ( getHeaderHeight === 0 ) ? parseInt(getHeaderElement.innerHeight(), 10) : getHeaderHeight;
                    // fix for header position absolute property

                if ( windowTopScroll > getHeaderHeight ){
                    if ( ! (stickyHeader.hasClass('sticky-on'))) {
                        stickyHeader
                            .addClass('sticky-on')
                            .css('top',(getHeaderHeight * -1))
                            .animate({'top': swmTheme.wpAdminBarHeight },300);
                        if ( stickySpacer ) { stickySpacer.css({'height':getHeaderHeight+'px' }); }
                    }

                } else {
                    if (stickyHeader.hasClass('sticky-on')) {
                        stickyHeader
                            .removeClass('sticky-on')
                            .css('top', 0);
                        if ( stickySpacer ) { stickySpacer.css({'height': 0 }); }
                    }
                }

            }
        },

        _stickyHeader: function() {
            if ( swmTheme.body.hasClass('swm-hide-sticky-header-mobile')) {
                if ( swmTheme.windowWidth <= 1024 ) {
                    return;
                }
            }
            SwmThemeSettings._stickyHeaderDisplay('.swm-sticky-scoll-down');
        },

        _swmStickyFooter: function() {

            var swmStickyFooterOn = swmJSOptions.swmStickyFooterOn;

            if(swmStickyFooterOn == 'on') {
                var bumpIt = function() {
                    if( swmTheme.windowWidth > 1024) {
                        jQuery('#content').css('margin-bottom', parseInt(jQuery('#footer').height()));
                    } else {
                        jQuery('#content').css('margin-bottom', 0);
                    }
                },
                didResize = false;

                setInterval(function() { bumpIt(); }, 250);

                jQuery(window).resize(function() { didResize = true; });
                setInterval(function() {
                  if(didResize) {
                    didResize = false;
                    bumpIt();
                  }
                }, 250);
            }

        },

        _goTopScroll: function() {

            if ($(".swm-btt-btn").length) {
                var offset = 50;
                var duration = 550;
                jQuery(window).on('scroll', function() {
                    if (jQuery(this).scrollTop() > offset) {
                        jQuery('.swm-btt-btn').addClass('active-progress');
                    } else {
                        jQuery('.swm-btt-btn').removeClass('active-progress');
                    }
                });
                jQuery('.swm-btt-btn').on('click', function(event) {
                    event.preventDefault();
                    jQuery('html, body').animate({
                        scrollTop: 0
                    }, duration);
                    return false;
                })
            }

        },

        _smoothScroll: function() {
            $('a.smooth-scroll').on('click',function() {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                    if (target.length) {
                        $('html, body').animate({
                        scrollTop: target.offset().top - 140
                    }, 1000);
                    return false;
                    }
                }

            });
        },

        _listWidgets: function() {
            $(".sidebar,.sidebar .theiaStickySidebar,.footer .swm-f-widget").children(".widget_meta,.widget_categories,.widget_pages,.widget_archive,.widget_recent_comments,.widget_recent_entries,.widget_nav_menu,.widget_product_categories,.widget_layered_nav_filters,.archives-link,.widget_rss,.widget_rating_filter,.woocommerce-widget-layered-nav,.widget_mk_useful_links_wid").addClass("swm-list-widgets");
        },

        _stickySidebar: function() {
            var $showStickySidebar = $('#sidebar.swm-sticky-sidebar');
            if( $showStickySidebar.length > 0 ) {
                $showStickySidebar.theiaStickySidebar({
                    additionalMarginTop: 100
                });
            }
        },

        _magnificPopup: function() {

            $('.swm-popup-img').magnificPopup({
                type: 'image'
            });

            $('.swm-popup-gallery').magnificPopup({
                type: 'image',
                gallery:{
                    enabled:true,
                    tCounter:''
                },
                zoom: {
                    enabled: true,
                    duration: 300,
                    easing: 'ease-in-out'
                }
            });

            $('.popup-youtube, .popup-vimeo, .popup-gmaps,.swm-popup-video').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });

            $('.swm-popup-video-autoplay').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false,
                iframe: {
                        markup: '<div class="mfp-iframe-scaler">' +
                            '<div class="mfp-close"></div>' +
                            '<iframe class="mfp-iframe" frameborder="0" allow="autoplay"></iframe>' +
                            '</div>',
                        patterns: {
                            youtube: {
                                index: 'youtube.com/',
                                id: 'v=',
                                src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                            }
                        }
                    }
            });

            $('.swm-popup-gallery-alt').magnificPopup(
                {
                    delegate: 'a',
                    type: 'image',
                    tLoading: 'Loading image #%curr%...',
                    mainClass: 'mfp-img-mobile',
                    gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0,1]
                },
                image: {
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                    titleSrc: function(item) {
                        return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
                    }
                }
            });

        },

        _main_Navigation: function() {

            // if admin bar, give top margin
            var swm_wpAdminBar = $('#wpadminbar');

            // clone primary many to mobile menu
            if ( !$('#swm-mobi-nav > ul').length && $('ul.swm-primary-nav').length ) {
                $("ul.swm-primary-nav").eq(0).clone().appendTo("#swm-mobi-nav");
                $("#swm-mobi-nav ul.mk-sections-megamenu").remove();
                $('#swm-mobi-nav > ul').removeClass('mk-nav-menu swm-primary-nav');
            }

            SwmThemeSettings._mobileMenu();
        },
        /* mobile dropdown menu */

        _mobileMenu: function() {

            var mobileMenuBox = $('.swm-mobi-nav-wrap'),
                closeIcon = $('.swm-mobi-nav-close'),
                overlaySection = $('#swm-mobi-nav-overlay-bg');

            // close icon
            closeIcon.on('click', function(){
                $(mobileMenuBox).removeClass('open');
                overlaySection.removeClass('m_toggle');
            });

            // overlay
            overlaySection.on('click', function(){
                $(mobileMenuBox).removeClass('open');
                overlaySection.removeClass('m_toggle');
            });

            // add arrow icon
            mobileMenuBox.find('li ul').parent().addClass('swm-has-sub-menu');
            mobileMenuBox.find(".swm-has-sub-menu").prepend('<span class="swm-mini-menu-arrow"></span>');

            mobileMenuBox.find('.swm-mini-menu-arrow').on('click', function() {
                if ($(this).siblings('ul').hasClass('open')) {
                    $(this).siblings('ul').removeClass('open').slideUp();
                } else {
                    $(this).siblings('ul').addClass('open').slideDown();
                }

                if ($(this).hasClass('inactive')) {
                    $(this).removeClass('inactive');
                } else {
                    $(this).addClass('inactive');
                }
            });

            // click event to open dropdown menu

            $('.swm-mobi-nav-icon').on('click', function() {

                var dd_menu = $('.swm-mobi-nav-wrap'),
                    overlaySection = $('#swm-mobi-nav-overlay-bg');

                $('.swm-mobi-nav-close').addClass('btn-show');
                (dd_menu.hasClass('open')) ? dd_menu.removeClass('open') : dd_menu.addClass('open');
                (overlaySection.hasClass('m_toggle')) ? overlaySection.removeClass('m_toggle') : overlaySection.addClass('m_toggle');

            });

        },

        _dropDownMenu: function() {

            $('.swm-primary-nav > li').hover(
                function() {
                    var dropDownCssTransformValue = 0,
                        $dropDowns = $('ul', this);
                        $dropDowns.removeClass('invert');

                    if ($('>ul', this).css('transform')) {
                        dropDownCssTransformValue = parseInt($('>ul', this).css('transform').split(',')[5]);
                    }
                    if (isNaN(dropDownCssTransformValue)) {
                        dropDownCssTransformValue = 0;
                    }

                    $dropDowns.each(function() {

                        var $dropDown   = $(this),
                            itemOffset  = $dropDown.offset();

                        if(itemOffset.left - $('#swm-page').offset().left + $dropDown.outerWidth() > $('#swm-page').width()) {
                            $dropDown.addClass('invert');
                        }

                    });
                },
            );

        },

        _readingProgressBar: function() {

            readingProgressBarFill();
            window.onscroll = function() {readingProgressBarFill()};

            function readingProgressBarFill() {
                if(document.querySelector('.swm-mybar')) {
                    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    var scrolled = (winScroll / height) * 100;
                    document.querySelector("#swm-mybar").style.width = scrolled + "%";
                }
            }

            if( $('#wpadminbar').length && $('.swm-reading-progress-bar-container').length ) {
                if ( 0 === $('.swm-reading-progress-bar-container').position().top ) {
                    $('.swm-reading-progress-bar-container').css('top', ' 32px');
                }
            }
        }

    };  // SwmThemeSettings

    var swmStickyHeaderScrollUp = {
        verticalScroll: 0,
        init: function () {

            if ( swmTheme.body.hasClass('swm-hide-sticky-header-mobile')) {
                if ( swmTheme.windowWidth <= 1024 ) {
                    return;
                }
            }

            var themeHeader = $('#swm-header'),
                getHeaderElement = themeHeader.find('.elementor > .elementor-element'),
                getHeaderHeight = parseInt(themeHeader.innerHeight(), 10);

                // fix for header position absolute property
                getHeaderHeight = ( getHeaderHeight === 0 ) ? parseInt(getHeaderElement.innerHeight(), 10) : getHeaderHeight;

            var displayAmount = getHeaderHeight + swmTheme.wpAdminBarHeight;
            swmStickyHeaderScrollUp.verticalScroll = $( document ).scrollTop();

            // Set sticky visibility
            swmStickyHeaderScrollUp.setVisibility( displayAmount );

            $( window ).scroll( function () {
                swmStickyHeaderScrollUp.setVisibility( displayAmount );
            });
        },
        setVisibility: function ( displayAmount ) {
            var isStickyHidden = swmTheme.scroll < displayAmount;

            if ( $( '#swm-sticky-header' ).hasClass( 'swm-sticky-scoll-up' ) ) {
                var currentTopScroll = $( document ).scrollTop();

                isStickyHidden = (currentTopScroll > swmStickyHeaderScrollUp.verticalScroll && currentTopScroll > displayAmount) || (currentTopScroll < displayAmount);

                swmStickyHeaderScrollUp.verticalScroll = $( document ).scrollTop();
            }

            if ( isStickyHidden ) {
                swmTheme.body.removeClass( 'swmShowStickyHeader' );
            } else {
                swmTheme.body.addClass( 'swmShowStickyHeader' );
            }

        }
    }; // swmStickyHeaderScrollUp


    $(document).ready(function() {

        swmTheme.scroll = $( window ).scrollTop();

        SwmThemeSettings.init();

        swmStickyHeaderScrollUp.init();

        setTimeout(function(){
            swmScaleAnimation();
        }, 500);

    });

    $(window).scroll(function(){
        swmTheme.scroll = $( window ).scrollTop();
        SwmThemeSettings._stickyHeader();
    });

    window.swmScaleAnimation = function() {
        $('.swm-scale-animation, .swm-scale-animation-s, .swm-scale-animation-m, .swm-scale-animation-l').each(function(){
            var section = $(this);
            if(section.hasClass('swm-loaded')) return false;
            section.addClass('swm-loaded');
            var top = section.offset().top;
            var height = section.outerHeight();
            var bottom = section.offset().top + height;
            var scale_val = 2;
            var offset = 600;
            var translate_val = height / 3;
            if(section.hasClass('swm-scale-animation-s')) {
                scale_val = 1.1;
                if(translate_val>300) translate_val = 300;
                offset = 200;
            }
            if(section.hasClass('swm-scale-animation-m')) {
                scale_val = 1.2;
                offset = 200;
            }
            if(section.hasClass('swm-scale-animation')) {
                scale_val = 1.6;
                offset = 400;
            }
            section.css({
                'z-index' : '99999999',
                'transform-style': 'preserve-3d',
            });
            let start = top - offset ;
            var range = 600;
            if(height<500) range = height;
            var rect = this.getBoundingClientRect();
            var that = this;
            var range_start = $(window).height();
            var range_end = $(window).height()/2;
            var range_total = range_start - range_end;

            if(rect.top <= range_start && rect.top >= range_end){
                var per = (rect.top - range_end) / range_total;
                var scale = (scale_val - 1)  * per;
                scale++;
                var translate = translate_val  * per;

                section.css({'transform' : 'scale('+scale+') translateY('+translate+'px)'});
            }else if (rect.top > range_start) {
                // Before
                section.css({'transform' : 'scale('+scale_val+') translateY('+translate_val+'px)'});
            }else{
                // After
                section.css({'transform' : 'scale(1) translateY(0px)'});
            }
            document.addEventListener('scroll', (e) => {
                rect = that.getBoundingClientRect();
                if(rect.top <= range_start && rect.top >= range_end){
                    var per = (rect.top - range_end) / range_total;
                    var scale = (scale_val - 1)  * per;
                    scale++;
                    var translate = translate_val  * per;

                    section.css({'transform' : 'scale('+scale+') translateY('+translate+'px)'});
                }else if (rect.top > range_start) {
                    // Before
                    section.css({'transform' : 'scale('+scale_val+') translateY('+translate_val+'px)'});
                }else{
                    // After
                    section.css({'transform' : 'scale(1) translateY(0px)'});
                }
            }, {
                passive: true
            });
        });
    };

    /* Window load functions =================== */

    var $window = $(window);

    $(window).on('load',(function () {

        if ( $('.swm-site-loader').length ){
            $(".swm-site-loader").fadeOut();
        }

        $window.resize(function () {
            swmTheme.windowWidth  = $( window ).width();
            swmTheme.windowHeight = $( window ).height();
        });

        $('iframe').css('max-width','100%').css('width','100%');

    }));

})(jQuery);