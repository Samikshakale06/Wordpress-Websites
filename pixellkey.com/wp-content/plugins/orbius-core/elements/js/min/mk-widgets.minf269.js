(function ($) {

    'use strict';

    window.mkAddons       = {};
    mkAddons.body         = $( 'body' );
    mkAddons.html         = $( 'html' );
    mkAddons.windowWidth  = $( window ).width();
    mkAddons.windowHeight = $( window ).height();
    mkAddons.scroll       = 0;
    mkAddons.window       = $( window );
    mkAddons.widgetsList   = {};

    $( document ).ready( function () {
        mkAddons.scroll = $( window ).scrollTop();
        mkCustomCursor.init();
        mkEyeCursor.init();
        mkScrollLoad.init();
    });

    $( window ).resize(function () {
        mkAddons.windowWidth  = $( window ).width();
        mkAddons.windowHeight = $( window ).height();
    });

    $( window ).scroll( function () {
        mkAddons.scroll = $( window ).scrollTop();
    });

    $( window ).on('load', function () {
        mkScrollLoad.init();
    });

    var getElementSettings = function ( $element ) {
        var elementSettings = {},
            modelCID        = $element.data( 'model-cid' );

        if ( elementorFrontend.isEditMode() && modelCID ) {
            var settings     = elementorFrontend.config.elements.data[ modelCID ],
                settingsKeys = elementorFrontend.config.elements.keys[ settings.attributes.widgetType || settings.attributes.elType ];

            jQuery.each( settings.getActiveControls(), function( controlKey ) {
                if ( -1 !== settingsKeys.indexOf( controlKey ) ) {
                    elementSettings[ controlKey ] = settings.attributes[ controlKey ];
                }
            } );
        } else {
            elementSettings = $element.data('settings') || {};
        }

        return elementSettings;
    }

    function mkCursorSelectors($cursorHolder, dragSelectors) {
        const resetCursorSelectors =
                                '.mk--drag-cursor .swiper-button-prev,' +
                                '.mk--drag-cursor .swiper-button-next,' +
                                '.mk--drag-cursor .mk-slider-pn,' +
                                '.mk--drag-cursor a:not(.mk-pf-slider-image-link),' +
                                '.mk--drag-cursor .swiper-pagination',
        $resetCursorSelectors = $(resetCursorSelectors);

        $resetCursorSelectors.css({cursor: 'pointer'});

        $(document).on('mouseenter', resetCursorSelectors, function () {
            $cursorHolder.addClass('mk--hide');
        }).on('mouseleave', resetCursorSelectors, function () {
            $cursorHolder.removeClass('mk--hide');
        });

        $(document).on('mouseenter', dragSelectors, function () {
            $cursorHolder.addClass('mk--show');
        }).on('mouseleave', dragSelectors, function () {
            $cursorHolder.removeClass('mk--show');
        });
    }

    var mkCustomCursor = {
        cursorApended: false,
        init : function () {
            const dragSelectors = '.mk--drag-cursor';
            const $dragSelectors = $(dragSelectors);

            if ($dragSelectors.length) {

                $dragSelectors.each( function () {

                    if (false === mkCustomCursor.cursorApended) {
                        mkAddons.body.append('<div class="mk-custom-cursor mk-cursor-holder"><div class="mk-custom-cursor-inner"><svg enable-background="new 0 0 256 512" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg"><path d="m52.1 245.3 144-160c5.9-6.6 16-7.1 22.6-1.2 6.9 6.3 6.8 16.4 1.2 22.6l-134.4 149.3 134.4 149.3c5.9 6.6 5.4 16.7-1.2 22.6s-16.7 5.4-22.6-1.2l-144-160c-5.5-6.1-5.5-15.3 0-21.4z"/></svg><svg viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg"><path d="m219.898 266.719-144.01 159.99c-5.906 6.562-16.031 7.094-22.593 1.187-6.918-6.271-6.784-16.394-1.188-22.625l134.367-149.271-134.367-149.271c-5.877-6.594-5.361-16.688 1.188-22.625 6.562-5.907 16.687-5.375 22.593 1.187l144.01 159.99c5.469 6.125 5.469 15.313 0 21.438z"/></svg></div></div>');
                        mkCustomCursor.cursorApended = true;
                    }

                    const $cursorHolder = $('.mk-custom-cursor');

                    if ( $(this).hasClass('mk--drag-cursor-light-skin') ) {
                        $cursorHolder.addClass('mk-skin--light');
                    }

                    if (!mkAddons.html.hasClass('touchevents')) {

                        function handleMoveCursor(event) {
                            $cursorHolder.css({
                                top : event.clientY - 45, // half of svg height
                                left: event.clientX - 45, // half of svg width
                            });
                        }

                        document.addEventListener('pointermove', handleMoveCursor);

                        mkCursorSelectors($cursorHolder, dragSelectors);

                    }

                }); // for each

            } // end if
        },
    };

    mkAddons.body.mkCustomCursor = mkCustomCursor;

    // cursor with eye icon
    var mkEyeCursor = {
        cursorApended: false,
        init : function () {
            const dragSelectors = '.mk--eye-cursor';
            const $dragSelectors = $(dragSelectors);

            if ($dragSelectors.length) {

                $dragSelectors.each( function () {

                    if (false === mkEyeCursor.cursorApended) {
                        mkAddons.body.append( '<div class="mk-eye-cursor"><div class="mk-eye-cursor-inner"><span class="mk-eye-cursor-bg"></span><span class="mk-eye-cursor-icon"><svg height="512" viewBox="0 0 128 128" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m64 29.63c-34.76 0-62.36 31.72-63.52 33.07a2 2 0 0 0 0 2.6c1.16 1.35 28.76 33.07 63.52 33.07s62.36-31.72 63.52-33.07a2 2 0 0 0 0-2.6c-1.16-1.35-28.76-33.07-63.52-33.07zm0 64.74c-29 0-53.7-24.37-59.3-30.37 5.6-6 30.24-30.37 59.3-30.37s53.7 24.37 59.3 30.37c-5.6 6-30.24 30.37-59.3 30.37z"/><path d="m64 38.19a25.81 25.81 0 1 0 25.81 25.81 25.84 25.84 0 0 0 -25.81-25.81zm0 47.63a21.81 21.81 0 1 1 21.81-21.82 21.84 21.84 0 0 1 -21.81 21.81z"/></svg></span></div></div>' );
                        mkEyeCursor.cursorApended = true;
                    }

                    const $cursorHolder = $('.mk-eye-cursor');

                    if ( $(this).hasClass('mk--drag-cursor-light-skin') ) {
                        $cursorHolder.addClass('mk-skin--light');
                    }

                    if (!mkAddons.html.hasClass('touchevents')) {

                        let $bg = $cursorHolder.find('.mk-eye-cursor-bg'),
                            $eye = $cursorHolder.find('.mk-eye-cursor-icon'),
                            xMove = 0,
                            yMove = 0;

                        function handleMoveCursorOne( event ) {
                            xMove = (event.clientX - 60).toFixed(2);
                            yMove = (event.clientY - 60).toFixed(2);

                            gsap.to( $bg, {x: xMove, y: yMove, duration: .39, }, );
                            gsap.to( $eye, {x: xMove, y: yMove, duration: .45, }, );

                            !$cursorHolder.hasClass( 'mk--show' ) && $cursorHolder.addClass( 'mk--show' );
                        }

                        $( document ).on('pointermove', dragSelectors, handleMoveCursorOne );

                        mkCursorSelectors($cursorHolder, dragSelectors);

                    }

                }); // for each

            } // end if
        },
    };

    mkAddons.body.mkEyeCursor = mkEyeCursor;

    // on scroll loading animation class
    var mkScrollLoad = {
        init: function () {
            this.holder = $( '.mk-scroll--load:not(.mk--loaded)' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    var holder    = $( this ),
                        loadDelay = $( this ).attr( 'data-appear-delay' );

                    if ( ! loadDelay ) {
                        mkScrollLoad.viewPortStatus( holder, function () {
                            holder.addClass( 'mk--loaded' );
                        });
                    } else {
                        loadDelay = (loadDelay === 'random') ? Math.floor( Math.random() * (450 - 10) + 10 ) : loadDelay;
                        mkScrollLoad.viewPortStatus( holder, function () {
                            setTimeout( function () { holder.addClass( 'mk--loaded' ); }, loadDelay );
                        });
                    }
                });
            }
        },
        viewPortStatus: function($item, callback, onlyOnce) {
            if ( $item.length ) {
                var offset   = typeof $item.data( 'viewport-offset' ) !== 'undefined' ? $item.data( 'viewport-offset' ) : 0.15;
                var observer = new IntersectionObserver(
                    function ( entries ) {
                        if ( entries[0].isIntersecting === true ) {
                            callback.call( $item );
                            if ( onlyOnce !== false ) { observer.disconnect(); }
                        }
                    },
                    { threshold: [offset] }
                );
                observer.observe( $item[0] );
            }
        },
    };

    // Get saved content for panel or popup or store it (if first open occured)
    window.mk_prepare_popup_offcanvas_content = function(container, autoplay) {
        var wrapper = jQuery(container);
        // Store popup content to the data-param or restore it when popup open again (second time)
        // if popup contains audio or video or iframe
        if (wrapper.data('popup-content') === undefined) {
            var iframe = wrapper.find('iframe');
            if ( wrapper.find('audio').length
                || wrapper.find('video').length
                || ( iframe.length
                    && ( ( iframe.data('src') && iframe.data('src').search(/(youtu|vimeo|daily|facebook)/i) > 0 )
                        || iframe.attr('src').search(/(youtu|vimeo|daily|facebook)/i) > 0
                        )
                    )
            ) {
                wrapper.data( 'popup-content', wrapper.html() );
            }
        } else {
            wrapper.html( wrapper.data('popup-content') );
            // Remove class 'inited' to reinit elements
            wrapper.find('.inited').removeClass('inited');
        }
        // Replace src with data-src
        wrapper.find('[data-src]').each(function() {
            jQuery(this).attr( 'src', jQuery(this).data('src') );
        });

        // If popup contain essential grid
        var frame = wrapper.find('.esg-grid');
        if ( frame.length > 0 ) {
            var wrappers = [".esg-tc.eec", ".esg-lc.eec", ".esg-rc.eec", ".esg-cc.eec", ".esg-bc.eec"];
            for (var i = 0; i < wrappers.length; i++) {
                frame.find(wrappers[i]+'>'+wrappers[i]).unwrap();
            }
        }
        // Call resize actions for the new content
        mkAddons.window.trigger('resize');
    };

    // Wait element images to loaded
    var mkWaitForImages = {
        check: function ( $element, callback ) {
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
    };

    // Parallax Scrolll Item
    var mkItemParallaxEffect = {

        init: function () {

            if ( !$('.mk-parallax-scroll-item-on').length ) { return; }

            var items = $('.mk-parallax-scroll-item-on .mk-parallax-item:nth-child(2n)'), // even
                dirY = 25,
                itemsOdd = $('.mk-parallax-scroll-item-on .mk-parallax-item:nth-child(2n+1)'), // odd
                dirYOdd = 14;

            var ease = function (a, b, n) {
                return (1 - n) * a + n * b;
            }

            var inView = function (item) {
                if (window.scrollY + window.innerHeight > item.offset().top &&
                    window.scrollY < item.offset().top + item.outerHeight()) {
                    return true
                }
                return false;
            }

            var itemsInView = function (items) {
                return items.filter(function () {
                    return inView($(this))
                });
            }

            var move = function (items, dirY) {
                items.each(function () {
                    var item = $(this);
                    item.data('y', 0);
                    item.data('c', Math.random());
                });

                function loop() {

                    itemsInView(items).each(function () {
                        var item = $(this);
                        var deltaY = (item.offset().top - window.scrollY) / window.innerHeight - 1;

                        item.data('y', ease(item.data('y'), deltaY, item.data('c') * .1));
                        item.css({
                            'transform': 'translate3d(0,' + (dirY * item.data('y')).toFixed(2) + '%,0)',
                        });
                    });
                    requestAnimationFrame(loop);
                }

                requestAnimationFrame(loop);
            }

            if (itemsOdd.length && !Modernizr.touch && mkAddons.windowWidth>=1024) move(itemsOdd, dirYOdd);
            if (items.length && !Modernizr.touch && mkAddons.windowWidth>=1024) move(items, dirY);
        }
    };

    $( document ).ready( function () {
        mkItemParallaxEffect.init();
    });


    // ###########################################################
    // Custom Widgets ############################################
    // ###########################################################

    var mkScrollLoadAnim = function ($scope, $) {
        mkScrollLoad.init();
    }

    mkAddons.widgetsList.mk_title = {};
    mkAddons.widgetsList.mk_title.mkScrollLoadAnim = mkScrollLoadAnim;

    mkAddons.widgetsList.mk_section_heading = {};
    mkAddons.widgetsList.mk_section_heading.mkScrollLoadAnim = mkScrollLoadAnim;

    mkAddons.widgetsList.mk_page_titlebar = {};
    mkAddons.widgetsList.mk_page_titlebar.mkScrollLoadAnim = mkScrollLoadAnim;

    mkAddons.widgetsList.mk_dual_slider = {};
    mkAddons.widgetsList.mk_dual_slider.mkScrollLoadAnim = mkScrollLoadAnim;


    // ----------------------------------------------------------

    var mkAccordion = function ($scope, $) {
        var elementSettings     = getElementSettings( $scope ),
            $accordion_title    = $scope.find(".mk-accordion-tab-title"),
            $accordion_type     = elementSettings.accordion_type,
            $accordion_speed    = elementSettings.toggle_speed;

            // Open default actived tab
            $accordion_title.each(function(){
                if ( $(this).hasClass('mk-accordion-tab-active-default') ) {
                    $(this).addClass('mk-accordion-tab-show mk-accordion-tab-active');
                    $(this).parent().find('.mk-accordion-tab-content').slideDown($accordion_speed);
                    $(this).parent().addClass('mk-accordion-item-active');
                }
            });

            // Remove multiple click event for nested accordion
            $accordion_title.unbind("click");

            $accordion_title.click(function(e) {
                e.preventDefault();

                var $this = $(this);

                if ( $accordion_type === 'accordion' ) {
                    if ( $this.hasClass("mk-accordion-tab-show") ) {
                        $this.removeClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().parent().find(".mk-accordion-tab-title").removeClass("mk-accordion-tab-active-default");
                        $this.parent().find('.mk-accordion-tab-content').slideUp($accordion_speed);
                        $this.parent().removeClass("mk-accordion-item-active");
                    } else {
                        $this.parent().parent().find(".mk-accordion-tab-title").removeClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().parent().find(".mk-accordion-tab-title").removeClass("mk-accordion-tab-active-default");
                        $this.parent().parent().find(".mk-accordion-tab-content").slideUp($accordion_speed);
                        $this.toggleClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().find('.mk-accordion-tab-content').slideToggle($accordion_speed);
                        $this.parent().parent().find(".mk-accordion-item").removeClass("mk-accordion-item-active");
                        $this.parent().toggleClass('mk-accordion-item-active');
                    }
                } else {
                    // For acccordion type 'toggle'
                    if ( $this.hasClass("mk-accordion-tab-show") ) {
                        $this.removeClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().find('.mk-accordion-tab-content').slideUp($accordion_speed);
                        $this.parent().removeClass("mk-accordion-item-active");
                    } else {
                        $this.addClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().find('.mk-accordion-tab-content').slideDown($accordion_speed);
                        $this.parent().addClass('mk-accordion-item-active');
                    }
                }
            });
    }

    mkAddons.widgetsList.mk_accordion = {};
    mkAddons.widgetsList.mk_accordion.mkAccordion = mkAccordion;

    // ----------------------------------------------------------

    var mkContactFormSevenStyler = function ($scope, $) {

        if ( 'undefined' == typeof $scope )
            return;

        var cf7SelectFields = $scope.find('select:not([multiple])'),
            cf7Loader = $scope.find('span.ajax-loader');

        cf7SelectFields.wrap( "<span class='mk-cf7-select-custom'></span>" );

        cf7Loader.wrap( "<div class='mk-cf7-loader-active'></div>" );

        var wpcf7event = document.querySelector( '.wpcf7' );

        if( null !== wpcf7event ) {
            wpcf7event.addEventListener( 'wpcf7submit', function( event ) {
                var cf7ErrorFields = $scope.find('.wpcf7-not-valid-tip');
                cf7ErrorFields.wrap( "<span class='mk-cf7-alert'></span>" );
            }, false );
        }

    }

    mkAddons.widgetsList.mk_contact_form_styler = {};
    mkAddons.widgetsList.mk_contact_form_styler.mkContactFormSevenStyler = mkContactFormSevenStyler;

    // ----------------------------------------------------------

    var mkGoogleMap = function ($scope, $) {

            if ( 'undefined' == typeof $scope )
                return;

            var selector                = $scope.find( '.mk-google-map' ).eq(0),
                locations               = selector.data( 'locations' ),
                map_style               = ( selector.data( 'custom-style' ) != '' ) ? selector.data( 'custom-style' ) : '',
                predefined_style        = ( selector.data( 'predefined-style' ) != '' ) ? selector.data( 'predefined-style' ) : '',
                info_window_size        = ( selector.data( 'max-width' ) != '' ) ? selector.data( 'max-width' ) : '',
                m_cluster               = ( selector.data( 'cluster' ) == 'yes' ) ? true : false,
                animate                 = selector.data( 'animate' ),
                auto_center             = selector.data( 'auto-center' ),
                map_options             = selector.data( 'map_options' ),
                i                       = '',
                bounds                  = new google.maps.LatLngBounds(),
                marker_cluster          = [],
                device_size             = elementorFrontend.getCurrentDeviceMode();

            if( 'drop' == animate ) {
                var animation = google.maps.Animation.DROP;
            } else if( 'bounce' == animate ) {
                var animation = google.maps.Animation.BOUNCE;
            }

            var skins = {
                "silver" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#f5f5f5\"}]},{\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#616161\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#f5f5f5\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#bdbdbd\"}]},{\"featureType\":\"poi\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#eeeeee\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#e5e5e5\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9e9e9e\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#ffffff\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dadada\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#616161\"}]},{\"featureType\":\"road.local\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9e9e9e\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#e5e5e5\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#eeeeee\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#c9c9c9\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9e9e9e\"}]}]",

                "retro" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#ebe3cd\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#523735\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#f5f1e6\"}]},{\"featureType\":\"administrative\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#c9b2a6\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#dcd2be\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#ae9e90\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dfd2ae\"}]},{\"featureType\":\"poi\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dfd2ae\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#93817c\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#a5b076\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#447530\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#f5f1e6\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#fdfcf8\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#f8c967\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#e9bc62\"}]},{\"featureType\":\"road.highway.controlled_access\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#e98d58\"}]},{\"featureType\":\"road.highway.controlled_access\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#db8555\"}]},{\"featureType\":\"road.local\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#806b63\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dfd2ae\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#8f7d77\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#ebe3cd\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dfd2ae\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#b9d3c2\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#92998d\"}]}]",

                "dark" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#212121\"}]},{\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#212121\"}]},{\"featureType\":\"administrative\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"administrative.country\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9e9e9e\"}]},{\"featureType\":\"administrative.land_parcel\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"administrative.locality\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#bdbdbd\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#181818\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#616161\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1b1b1b\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#2c2c2c\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#8a8a8a\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#373737\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#3c3c3c\"}]},{\"featureType\":\"road.highway.controlled_access\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#4e4e4e\"}]},{\"featureType\":\"road.local\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#616161\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#000000\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#3d3d3d\"}]}]",

                "night" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#242f3e\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#746855\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#242f3e\"}]},{\"featureType\":\"administrative.locality\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#d59563\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#d59563\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#263c3f\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#6b9a76\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#38414e\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#212a37\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9ca5b3\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#746855\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#1f2835\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#f3d19c\"}]},{\"featureType\":\"transit\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#2f3948\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#d59563\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#17263c\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#515c6d\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#17263c\"}]}]",

                "aubergine" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#1d2c4d\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#8ec3b9\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1a3646\"}]},{\"featureType\":\"administrative.country\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#4b6878\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#64779e\"}]},{\"featureType\":\"administrative.province\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#4b6878\"}]},{\"featureType\":\"landscape.man_made\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#334e87\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#023e58\"}]},{\"featureType\":\"poi\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#283d6a\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#6f9ba5\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1d2c4d\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#023e58\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#3C7680\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#304a7d\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#98a5be\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1d2c4d\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#2c6675\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#255763\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#b0d5ce\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#023e58\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#98a5be\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1d2c4d\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#283d6a\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#3a4762\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#0e1626\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#4e6d70\"}]}]",

                "magnesium" : "[{\"featureType\":\"all\",\"stylers\":[{\"saturation\":0},{\"hue\":\"#e7ecf0\"}]},{\"featureType\":\"road\",\"stylers\":[{\"saturation\":-70}]},{\"featureType\":\"transit\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"water\",\"stylers\":[{\"visibility\":\"simplified\"},{\"saturation\":-60}]}]",

                "classic_blue" : "[{\"featureType\":\"all\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.country\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.country\",\"elementType\":\"labels.text\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.province\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.province\",\"elementType\":\"labels.text\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.locality\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.neighborhood\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"landscape\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#FFBB00\"},{\"saturation\":43.400000000000006},{\"lightness\":37.599999999999994},{\"gamma\":1}]},{\"featureType\":\"landscape\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"saturation\":\"-40\"},{\"lightness\":\"36\"}]},{\"featureType\":\"landscape.man_made\",\"elementType\":\"geometry\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"saturation\":\"-77\"},{\"lightness\":\"28\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#00FF6A\"},{\"saturation\":-1.0989010989011234},{\"lightness\":11.200000000000017},{\"gamma\":1}]},{\"featureType\":\"poi\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi.attraction\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"saturation\":\"-24\"},{\"lightness\":\"61\"}]},{\"featureType\":\"road\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#FFC200\"},{\"saturation\":-61.8},{\"lightness\":45.599999999999994},{\"gamma\":1}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road.highway.controlled_access\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#FF0300\"},{\"saturation\":-100},{\"lightness\":51.19999999999999},{\"gamma\":1}]},{\"featureType\":\"road.local\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#ff0300\"},{\"saturation\":-100},{\"lightness\":52},{\"gamma\":1}]},{\"featureType\":\"road.local\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"geometry\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"water\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#0078FF\"},{\"saturation\":-13.200000000000003},{\"lightness\":2.4000000000000057},{\"gamma\":1}]},{\"featureType\":\"water\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]}]",

                "aqua" : "[{\"featureType\":\"administrative\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#444444\"}]},{\"featureType\":\"landscape\",\"elementType\":\"all\",\"stylers\":[{\"color\":\"#f2f2f2\"}]},{\"featureType\":\"poi\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road\",\"elementType\":\"all\",\"stylers\":[{\"saturation\":-100},{\"lightness\":45}]},{\"featureType\":\"road.highway\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"simplified\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"water\",\"elementType\":\"all\",\"stylers\":[{\"color\":\"#46bcec\"},{\"visibility\":\"on\"}]}]",

                "earth" : "[{\"featureType\":\"landscape.man_made\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#f7f1df\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#d0e3b4\"}]},{\"featureType\":\"landscape.natural.terrain\",\"elementType\":\"geometry\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi.business\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi.medical\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#fbd3da\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#bde6ab\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#ffe15f\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#efd151\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#ffffff\"}]},{\"featureType\":\"road.local\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"black\"}]},{\"featureType\":\"transit.station.airport\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#cfb2db\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#a2daf2\"}]}]"
            };

            if( 'undefined' != typeof skins[predefined_style] ) {
                map_style = JSON.parse( skins[predefined_style] );
            }


            ( function initMap () {

                var latlng = new google.maps.LatLng( locations[0][0], locations[0][1] );

                map_options.center = latlng;
                map_options.styles = map_style;

                var map = new google.maps.Map( $scope.find( '.mk-google-map' )[0], map_options );
                var infowindow = new google.maps.InfoWindow();

                for ( i = 0; i < locations.length; i++ ) {

                    var title = locations[i][3];
                    var description = locations[i][4];
                    var icon_size = parseInt( locations[i][7] );
                    var icon_type = locations[i][5];
                    var icon = '';
                    var icon_url = locations[i][6];
                    var enable_iw = locations[i][2];
                    var click_open = locations[i][8];
                    var lat = locations[i][0];
                    var lng = locations[i][1];

                    if( 'undefined' === typeof locations[i] ) {
                        return;
                    }

                    if ( '' != lat.length && '' != lng.length ) {

                        if ( 'custom' == icon_type ) {

                            icon = {
                                url: icon_url,
                            };
                            if( ! isNaN( icon_size ) ) {

                                icon.scaledSize = new google.maps.Size( icon_size, icon_size );
                                icon.origin = new google.maps.Point( 0, 0 );
                                icon.anchor = new google.maps.Point( icon_size/2, icon_size );

                            }
                        }

                        var marker = new google.maps.Marker( {
                            position:       new google.maps.LatLng( lat, lng ),
                            map:            map,
                            title:          title,
                            icon:           icon,
                            animation:      animation
                        });

                        if( locations.length > 1 ) {

                            // Extend the bounds to include each marker's position
                            bounds.extend( marker.position );
                        }

                        marker_cluster[i] = marker;

                        if ( enable_iw && 'iw_open' == click_open ) {

                            var content_string = '<div class="mk-infowindow-content"><div class="mk-infowindow-title">' + title + '</div>';

                            if ( '' != description.length ) {
                                content_string += '<div class="mk-infowindow-description">' + description + '</div>';
                            }
                            content_string += '</div>';

                            if ( '' != info_window_size  ) {
                                var width_val = parseInt( info_window_size );
                                var infowindow = new google.maps.InfoWindow( {
                                    content: content_string,
                                    maxWidth: width_val
                                } );
                            } else {
                                var infowindow = new google.maps.InfoWindow( {
                                    content: content_string,
                                } );
                            }

                            infowindow.open( map, marker );
                        }

                        // Adding close event for info window
                        google.maps.event.addListener( map, 'click', ( function ( infowindow ) {

                            return function() {
                                infowindow.close();
                            }
                        })( infowindow ));

                        if ( enable_iw && '' != locations[i][3] ) {

                            google.maps.event.addListener( marker, 'click', ( function( marker, i ) {
                                return function() {
                                    var infowindow = new google.maps.InfoWindow();
                                    var content_string = '<div class="mk-infowindow-content"><div class="mk-infowindow-title">' + locations[i][3] + '</div>';

                                    if ( '' != locations[i][4].length ) {
                                        content_string += '<div class="mk-infowindow-description">' + locations[i][4] + '</div>';
                                    }

                                    content_string += '</div>';

                                    infowindow.setContent( content_string );

                                    if ( '' != info_window_size ) {
                                        var width_val = parseInt( info_window_size );
                                        var InfoWindowOptions = { maxWidth : width_val };
                                        infowindow.setOptions( { options:InfoWindowOptions } );
                                    }

                                    infowindow.open( map, marker );
                                }
                            })( marker, i ));
                        }
                    }
                }

                if( locations.length > 1 ) {

                    if ( 'center' == auto_center ) {

                        // Now fit the map to the newly inclusive bounds.
                        map.fitBounds( bounds );
                    }

                    // Restore the zoom level after the map is done scaling.
                    var listener = google.maps.event.addListener( map, "idle", function () {
                        map.setZoom( map_options.zoom );
                        google.maps.event.removeListener( listener );
                    });
                }

                var cluster_listener = google.maps.event.addListener( map, "idle", function () {

                    if( 0 < marker_cluster.length && m_cluster ) {

                        var markerCluster = new MarkerClusterer(
                            map,
                            marker_cluster,
                            {
                                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                            }
                        );
                    }
                    google.maps.event.removeListener( cluster_listener );
                });


            })();
        }

    mkAddons.widgetsList.mk_google_map = {};
    mkAddons.widgetsList.mk_google_map.mkGoogleMap = mkGoogleMap;

    // ----------------------------------------------------------

    var mkVideo = function ($scope, $) {

        var shalPlayVideo = {

            /* Auto Play Video */
            _play: function( selector ) {

                var iframe      = $( "<iframe/>" );
                var vurl        = selector.data( 'src' );

                if ( 0 == selector.find( 'iframe' ).length ) {

                    iframe.attr( 'src', vurl );
                    iframe.attr( 'frameborder', '0' );
                    iframe.attr( 'allowfullscreen', '1' );
                    iframe.attr( 'allow', 'autoplay;encrypted-media;' );

                    selector.html( iframe );
                }

                selector.closest( '.mk-video-container' ).find( '.mk-video-vimeo-wrap' ).hide();
            }
        }

        var video_container = $scope.find( '.mk-video-container' );
        var video_holder = $scope.find( '.mk-video-holder' );

        video_container.off( 'click' ).on( 'click', function( e ) {

            var selector = $( this ).find( '.mk-video__play' );

            shalPlayVideo._play( selector );
        });

        if( '1' == video_container.data( 'autoplay' ) || true == video_container.data( 'device' ) ) {

            shalPlayVideo._play( $scope.find( '.mk-video__play' ) );
        }

    }

    mkAddons.widgetsList.mk_video = {};
    mkAddons.widgetsList.mk_video.mkVideo = mkVideo;

    // ----------------------------------------------------------

    var mkTeam = function ($scope, $) {
        var $this = $scope.find('.mk-team'),
            $isoGrid = $this.children('.mk-team-grid'),
            $btns = $this.children('.mk-team-btns'),
            is_rtl = $this.data('rtl') ? false : true,
            layout = $this.data('layout');

        $this.imagesLoaded( function() {
            if ( 'masonry' == layout ) {
                var $grid = $isoGrid.isotope({
                    itemSelector: '.mk-team-item',
                    percentPosition: true,
                    originLeft: is_rtl,
                    masonry: {
                        columnWidth: '.mk-team-item',
                    }
                });
            } else{
                var $grid = $isoGrid.isotope({
                    itemSelector: '.mk-team-item',
                    layoutMode: 'fitRows',
                    originLeft: is_rtl
                });
            }

        });
    }

    mkAddons.widgetsList.mk_team = {};
    mkAddons.widgetsList.mk_team.mkTeam = mkTeam;

    // ----------------------------------------------------------

    var mkVideoIcon = function ($scope, $) {
        var $this = $scope.find('.mk-video-lightbox');
        $this.magnificPopup({
            disableOn: 700, // disable popup
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }

    mkAddons.widgetsList.mk_video_icon = {};
    mkAddons.widgetsList.mk_video_icon.mkVideoIcon = mkVideoIcon;

    mkAddons.widgetsList.mk_circle_text = {};
    mkAddons.widgetsList.mk_circle_text.mkVideoIcon = mkVideoIcon;

    // ----------------------------------------------------------

    var mkAwards = function ($scope, $) {
       if ($(window).width() >= 1024) {

           var thisHolder      = $scope.find( '.mk-awards' ),
           articles            = thisHolder.find('.mk-awards-item'),
           showcaseWallImages  = thisHolder.find('.mk-awards-images'),
           showcaseWallImage   = thisHolder.find('.mk-awards-image');

           $(articles.get().reverse()).each(function () {
               if ($(this).hasClass('active-item')) {
                   articles.removeClass('active-item');
                   $(this).addClass('active-item');
               }
           });

           $(showcaseWallImage.get().reverse()).each(function () {
               if ($(this).hasClass('active-item')) {
                   showcaseWallImage.removeClass('active-item');
                   $(this).addClass('active-item');
               }
           });

           articles.each(function () {
               $(this).on({
                   mouseenter: function () {
                       articles.removeClass('active-item');
                       $(this).addClass('active-item');
                       showcaseWallImage.removeClass('active-item');
                       showcaseWallImages.find('#' + $(this).data('index')).addClass('active-item');
                   },
                   mouseleave: function () {
                   }
               });
           });

       }

    }

    mkAddons.widgetsList.mk_awards = {};
    mkAddons.widgetsList.mk_awards.mkAwards = mkAwards;

    // ----------------------------------------------------------

    var mkSearch = function ($scope, $) {

        jQuery(".mk-search-icon").each(function() {
            var iconInput = jQuery(this).find('a');

            iconInput.bind('click', function () {
                var openDiv = jQuery(this).attr('data-open');
                jQuery('#'+openDiv).addClass('active');

                jQuery('body').addClass('elementor-no-overflow');
                jQuery('body').addClass('elementor-search-activate');

            });
        });

        jQuery(".mk_search_form").each(function() {
            var wrapper = jQuery(this).attr('data-open');
            var formInput = jQuery(this).find('input[name="s"]');
            var resultDiv = jQuery(this).attr('data-result');

            formInput.bind('click', function () {
                jQuery("#"+resultDiv).addClass('visible');
                jQuery("#"+resultDiv).attr('data-mousedown', 'true');
            });

            formInput.bind('focus', function () {
                jQuery("#"+resultDiv).addClass('visible');
                formInput.addClass('visible');
            });

            formInput.bind('blur', function () {
                jQuery("#"+resultDiv).removeClass('visible');
                formInput.removeClass('visible');
            });

            jQuery("#"+wrapper).bind('click', function () {
                if(!formInput.hasClass('visible')) {
                    if(jQuery("#"+resultDiv).attr('data-mousedown') != 'true') {
                        jQuery("#"+resultDiv).removeClass('visible');
                    }
                    jQuery('#'+wrapper).removeClass('active');
                    jQuery('body').removeClass('elementor-no-overflow');
                    jQuery('body').removeClass('elementor-search-activate');
                }
            });
        });

    }

    mkAddons.widgetsList.mk_search = {};
    mkAddons.widgetsList.mk_search.mkSearch = mkSearch;

    // ----------------------------------------------------------

    var mkPopup = function ($scope, $) {

        var $window             = jQuery( window ),
            $document           = jQuery( document ),
            $html               = jQuery( 'html' ),
            $body               = jQuery( 'body' ),
            $adminbar           = jQuery( '#wpadminbar' ),
            _adminbar_height    = $adminbar.length === 0 || $adminbar.css( 'display' ) == 'none' || $adminbar.css( 'position' ) == 'absolute' ? 0 : $adminbar.height();

        window.mk_get_cookie = function(name) {
            var defa = arguments[1] !== undefined ? arguments[1] : null;
            var start = document.cookie.indexOf(name + '=');
            var len = start + name.length + 1;
            if ((!start) && (name != document.cookie.substring(0, name.length))) {
                return defa;
            }
            if (start == -1) { return defa; }
            var end = document.cookie.indexOf(';', len);
            if (end == -1) { end = document.cookie.length; }
            return decodeURIComponent(document.cookie.substring(len, end));
        };

        window.mk_set_cookie = function(name, value) {

            var expires  = arguments[2] !== undefined ? arguments[2] : 24 * 60 * 60 * 1000; // 24 hours
            var path     = arguments[3] !== undefined ? arguments[3] : '/';
            var domain   = arguments[4] !== undefined ? arguments[4] : '';
            var secure   = arguments[5] !== undefined ? arguments[5] : '';
            var samesite = arguments[6] !== undefined ? arguments[6] : 'strict';    // strict | lax | none
            var today    = new Date();
            today.setTime(today.getTime());
            var expires_date = new Date(today.getTime() + (expires * 1));
            document.cookie = encodeURIComponent(name) + '='
                    + encodeURIComponent(value)
                    + (expires ? ';expires=' + expires_date.toGMTString() : '')
                    + (path    ? ';path=' + path : '')
                    + (domain  ? ';domain=' + domain : '')
                    + (secure  ? ';secure' : '')
                    + (samesite  ? ';samesite=' + samesite : '');
        };

        // popups & panels content

        var on_leaving_site = [],
            in_page_edit_mode = $body.hasClass('elementor-editor-active')
                                || $body.hasClass('wp-admin')
                                || $body.hasClass('block-editor-page');

        // Init popups and panels links
        $body.find('.mk_sections_popup:not(.inited)').each( function() {

            var $self = jQuery(this),
                id = $self.data('trigger-id'),
                esckey = $self.data('esckey'),
                show = false;
            if (!id) return;

            // add background color dark/light skin
            var $bg_skin = $self.data('skin');
            $body.addClass('popup-bg-skin-'+$bg_skin);

            // close popup with escape key
            if ( 'yes' == esckey ) {
                jQuery(document).on('keydown', function (event) {
                    if (27 === event.keyCode) {
                        mk_close_popup($self);
                    }
                });
            }

            var link = jQuery('a[href="#'+id+'"],' + ( '.mk_popup_link[data-popup-id="'+id+'"]' ) );

            if (link.length === 0) {
                $body.append('<a href="#'+id+'" class="mk_hidden"></a>');
                link = jQuery('a[href="#'+id+'"]');
            }

            if ($self.hasClass('mk_sections_show_on_page_load')) {
                show = true;
            } else if ($self.hasClass('mk_sections_show_on_page_load_once') && mk_get_cookie('mk_show_on_page_load_once_'+id) != '1') {
                mk_set_cookie('mk_show_on_page_load_once_'+id, '1');
                show = true;
            } else if ($self.hasClass('mk_sections_show_on_page_close') && mk_get_cookie('mk_show_on_page_close_'+id) != '1') {
                on_leaving_site.push({ link: link, id: id });
            }

            if (show) {
                // Display popups on the page (site) load
                if ( ! in_page_edit_mode ) {
                    setTimeout( function() {
                        link.trigger('click'); // on click -> mk_popup_link
                    }, 0);
                }
            }

            link.addClass('mk_popup_link')
                .data('popup', $self);

        }); // body.... .each

        // Display popup when user leaving site
        if ( on_leaving_site.length > 0 && ! in_page_edit_mode ) {
            var showed = false;
            $window.on( 'mousemove', function(e) {
                if ( showed ) return;
                var y = typeof e.clientY != 'undefined' ? e.clientY : 999;
                if ( y < _adminbar_height + 15 ) {
                    showed = true;
                    on_leaving_site.forEach( function(item) {
                        item.link.trigger('click');
                        mk_set_cookie('mk_show_on_page_close_'+item.id, '1');
                    });
                }
            } );
        }

        // Close popup
        window.mk_close_popup = function(panel) {
            if ( panel.hasClass('mk_sections_popup') ) {
                // $document.trigger('action.close_popup_elements', [panel]);
            }
            setTimeout( function() {
                panel.removeClass('mk_sections_popup_active');
                if (panel.prev().hasClass('mk-off-canvas-overlay')) {
                    panel.prev().removeClass('mk_sections_popup_active');
                }

                $body.removeClass('mk_sections_popup_active');

                if ( panel.data('popup-content') !== undefined ) {
                    setTimeout( function() { panel.empty(); }, 500 );
                }
            }, 0 );
        };

        // Display lightbox on click on the popup link
        $body.find( '.mk_popup_link:not(.popup_inited)' )
            .addClass('popup_inited')
            .magnificPopup({
                type: 'inline',
                focus: 'input',
                removalDelay: 0,
                tLoading: 'Loading...',
                tClose: 'Close (Esc)',
                closeBtnInside: true,
                callbacks: {
                    // Will fire when this exact popup is opened this - is Magnific Popup object
                    open: function () {
                        // Get saved content or store it (if first open occured)
                        mk_prepare_popup_offcanvas_content(this.content, true);
                    },
                    close: function () {
                        var $mfp = this;
                        // Save and remove content before closing if its contain video, audio or iframe
                        mk_close_popup($mfp.content);
                    },
                    // resize event triggers only when height is changed or layout forced
                    resize: function () {
                        var $mfp = this;
                        // mk_resize_actions(jQuery($mfp.content));
                    }
                }
            });

    };

    mkAddons.widgetsList.mk_popup = {};
    mkAddons.widgetsList.mk_popup.mkPopup = mkPopup;

    // ----------------------------------------------------------

    var mkOffCanvas = function ($scope, $) {

        var $window             = jQuery( window ),
            $document           = jQuery( document ),
            $html               = jQuery( 'html' ),
            $body               = jQuery( 'body' ),
            $adminbar           = jQuery( '#wpadminbar' ),
            _adminbar_height    = $adminbar.length === 0 || $adminbar.css( 'display' ) == 'none' || $adminbar.css( 'position' ) == 'absolute' ? 0 : $adminbar.height();

        // Off-Canvas content

        var on_leaving_site = [],
            in_page_edit_mode = $body.hasClass('elementor-editor-active')
                                || $body.hasClass('wp-admin')
                                || $body.hasClass('block-editor-page');

        // Init Off-Canvas links
        $body.find('.mk-off-canvas:not(.inited)').each( function() {

            var $self = jQuery(this),
                getOffCanvasId = $self.data('offcanvas-id'),
                esckey = $self.data('esckey'),
                show = false;
            if (!getOffCanvasId) return;

            $self.attr( 'id', getOffCanvasId ); // add ID attribute

            // close offcanvas with escape key
            if ( 'yes' == esckey ) {
                jQuery(document).on('keydown', function (event) {
                    if (27 === event.keyCode) {
                        mk_close_offcanvas($self);
                    }
                });
            }

            var link = jQuery('a[href="#'+getOffCanvasId+'"],' + ( '.mk_off_canvas_link[data-offcanvas-id="'+getOffCanvasId+'"]' ) );

            if (link.length === 0) {
                $body.append('<a href="#'+getOffCanvasId+'" class="mk_hidden"></a>');
                link = jQuery('a[href="#'+getOffCanvasId+'"]');
            }

            link.addClass('mk_off_canvas_link')
                .data('offcanvas', $self);

            $self.addClass('inited')
                 .on('click', '.mk-off-canvas-close', function(e) {
                    mk_close_offcanvas($self);
                    e.preventDefault();
                    return false;
                });

        }); // body.... .each

        // Open Off-Canvas on click on the off-canvas link
        $body.find( '.mk_off_canvas_link:not(.offcanvas_inited)' )
            .addClass('offcanvas_inited')
            .on('click', function(e) {

                console.log(jQuery(this));


                var offCanvas = jQuery(this).data('offcanvas');
                if ( ! offCanvas.hasClass( 'mk-off-canvas-active' ) ) {

                    mk_prepare_popup_offcanvas_content(offCanvas, true);
                    offCanvas.addClass('mk-off-canvas-active');
                    $document.trigger('action.opened_popup_elements', [offCanvas]);

                    if (offCanvas.prev().hasClass('mk-off-canvas-overlay')) {
                        offCanvas.prev().addClass('mk-off-canvas-active');
                    }

                    $body.addClass('mk-off-canvas-active');
                } else {
                    mk_close_offcanvas(offCanvas);
                }
                e.preventDefault();
                return false;
            });

        // Close off-canvas on click on the modal cover
        $body.find('.mk-off-canvas-overlay:not(.inited)')
            .addClass('inited')
            .on('click', function(e) {
                mk_close_offcanvas(jQuery(this).next());
                e.preventDefault();
                return false;
            });

        // Close off-canvas
        window.mk_close_offcanvas = function(offCanvas) {
            setTimeout( function() {
                offCanvas.removeClass('mk-off-canvas-active');
                if (offCanvas.prev().hasClass('mk-off-canvas-overlay')) {
                    offCanvas.prev().removeClass('mk-off-canvas-active');
                }

                $body.removeClass('mk-off-canvas-active mk-off-canvas-active_left mk-off-canvas-active_right');

                if ( offCanvas.data('off-canvas-content') !== undefined ) {
                    setTimeout( function() { offCanvas.empty(); }, 500 );
                }
            }, 0 );
        };

    };

    mkAddons.widgetsList.mk_off_canvas = {};
    mkAddons.widgetsList.mk_off_canvas.mkOffCanvas = mkOffCanvas;

    // ----------------------------------------------------------

    var mkCart = function ($scope, $) {

        var $window             = jQuery( window ),
            $body               = jQuery( 'body' ),
            $adminbar           = jQuery( '#wpadminbar' );

        // panels content
        var in_page_edit_mode = $body.hasClass('elementor-editor-active')
                                || $body.hasClass('wp-admin')
                                || $body.hasClass('block-editor-page');

        // Init panels links
        $body.find('.mk-cart-panel:not(.inited)').each( function() {

            var $self = jQuery(this),
                id = $self.data('trigger-id'),
                esckey = $self.data('esckey');

            if (!id) return;

            // close panel with escape key
            if ( 'yes' == esckey ) {
                jQuery(document).on('keydown', function (event) {
                    if (27 === event.keyCode) {
                        mk_close_cart_panel($self);
                    }
                });
            }

            var link = jQuery('a[href="#'+id+'"],.mk-cart-panel-link[data-panel-id="'+id+'"]' );

            if (link.length === 0) {
                $body.append('<a href="#'+id+'" class="mk-hidden"></a>');
                link = jQuery('a[href="#'+id+'"]');
            }

            link.addClass('mk-cart-panel-link')
                .data('panel', $self);

            $self.addClass('inited')
                 .on('click', '.mk-cart-panel-close', function(e) {
                    mk_close_cart_panel($self);
                    e.preventDefault();
                    return false;
                });

        }); // body.... .each

        // Open panel on click on the panel link
        $body.find( '.mk-cart-panel-link:not(.panel_inited)' )
            .addClass('panel_inited')
            .on('click', function(e) {

                var panel = jQuery(this).data('panel');
                if ( ! panel.hasClass( 'mk-cart-panel-active' ) ) {
                    panel.addClass('mk-cart-panel-active');
                    if (panel.prev().hasClass('mk-cart-panel-overlay')) panel.prev().addClass('mk-cart-panel-active');
                    $body.addClass('mk-cart-panel-active mk-cart-panel-active-' + panel.data('panel-position'));
                } else {
                    mk_close_cart_panel(panel);
                }
                e.preventDefault();
                return false;
            });

        // Close panel on click on the modal cover
        $body.find('.mk-cart-panel-overlay:not(.inited)')
            .addClass('inited')
            .on('click', function(e) {
                mk_close_cart_panel(jQuery(this).next());
                e.preventDefault();
                return false;
            });

        // Close panel
        window.mk_close_cart_panel = function(panel) {
            setTimeout( function() {
                panel.removeClass('mk-cart-panel-active');
                if (panel.prev().hasClass('mk-cart-panel-overlay')) {
                    panel.prev().removeClass('mk-cart-panel-active');
                }

                $body.removeClass('mk-cart-panel-active mk-cart-panel-active-left mk-cart-panel-active-right');

            }, 0 );
        };

    };

    mkAddons.widgetsList.mk_cart = {};
    mkAddons.widgetsList.mk_cart.mkCart = mkCart;

    // ----------------------------------------------------------

    var mkImage = function ($scope, $) {

        var mkImageFigureLink = $scope.find( '.mk-image figure a' ),
            cursonIcon          = mkImageFigureLink.data('cursor-icon') ? mkImageFigureLink.data('cursor-icon') : '';
        if (cursonIcon.length) {
            mkImageFigureLink.css('cursor','url(' + cursonIcon + '),auto');
        }

        if ($scope.hasClass('mk-custom-image-appear-reveal')) {
            var mkImageFigure = $scope.find( '.mk-image figure' )[0];

            if (mkImageFigure) {

                var revealColor     = $(mkImageFigure).data('reveal-color'),
                    revealDirection = $(mkImageFigure).data('reveal-direction'),
                    revealDuration  = $(mkImageFigure).data('reveal-duration'),
                    revealDelay     = $(mkImageFigure).data('reveal-delay'),
                    revealViewport  = $(mkImageFigure).data('reveal-viewport'),
                    finalViewPort   = revealViewport * -1,
                    watcher_1       = scrollMonitor.create(mkImageFigure, finalViewPort);

                var revealBlock = new RevealFx(mkImageFigure, {
                            revealSettings : {
                                bgColors: [revealColor],
                                delay: revealDelay,
                                direction:revealDirection,
                                duration: revealDuration,
                                onHalfway: function(contentEl, revealerEl) {
                                    contentEl.style.opacity = 1;
                                }
                            }
                        });

                watcher_1.enterViewport(function() {
                    revealBlock.reveal();
                    watcher_1.destroy();
                });
            }
        }

        mkScrollLoad.init();

    }

    mkAddons.widgetsList.mk_image = {};
    mkAddons.widgetsList.mk_image.mkImage = mkImage;

    // ----------------------------------------------------------

    var mkIconButton = function ($scope, $) {
        var mkIconButton = $scope.find('.mk-icon-button');

        if ( mkIconButton.length > 0 ) {
            if ( mkIconButton.hasClass( 'mk-icon-button-type--icon-boxed' ) ) {
                var $buttonIcon = mkIconButton.find( '.mk-icon-button-icon' ),
                    height      = mkIconButton.find( '.mk-icon-button-text-holder' ).outerHeight();
                $buttonIcon.css('width', height );
            }
        }
    };

    mkAddons.widgetsList.mk_icon_button = {};
    mkAddons.widgetsList.mk_icon_button.mkIconButton = mkIconButton;

    // ----------------------------------------------------------

    var mkMovingGallery = function ($scope, $) {

        let $holder = $( '.mk-moving-gallery' );

        if ( $holder.length ) {

            gsap.defaults({overwrite: "auto"});
            gsap.registerPlugin(ScrollTrigger);
            gsap.config({nullTargetWarn: false});

            $holder.each( function () {

                let $thisHolder = $( this ),
                $holder_id = $thisHolder.attr( 'id' );

                gsap.utils.toArray(this).forEach((section, index) => {
                    const galleryList = section.querySelector('#' + $holder_id + ' .mk-moving-gallery-list');
                    const [x, xEnd] = (index % 2) ? [(section.offsetWidth - galleryList.scrollWidth), 0] : [0, section.offsetWidth - galleryList.scrollWidth];
                    gsap.fromTo(galleryList, {  x  }, {
                        x: xEnd,
                        scrollTrigger: {
                            trigger: section,
                            scrub: 0.5,
                        }
                    });
                });

            });
        }
    };

    mkAddons.widgetsList.mk_moving_gallery = {};
    mkAddons.widgetsList.mk_moving_gallery.mkMovingGallery = mkMovingGallery;

    // ----------------------------------------------------------

    var mkMovingProjects = function ($scope, $) {

        var $holder = $scope.find( '.mk-moving-projects' );

        if ( $holder.length && mkAddons.windowWidth > 1024 ) {

            gsap.defaults({overwrite: "auto"});
            gsap.registerPlugin(ScrollTrigger);
            gsap.config({nullTargetWarn: false});

            $holder.each( function () {
                let $thisHolder = $( this ),
                $holder_id = $thisHolder.attr( 'id' );
                initMovingPorjectItem($thisHolder,$holder_id);
            });
        }

        function initMovingPorjectItem($holder, $holder_id) {

            gsap.registerPlugin(ScrollTrigger);

            $holder_id = '.mk-moving-projects-' + $holder_id;

            const firstRow     = document.querySelector( $holder_id + ' .mk-moving-projects-holder .mk-moving-projects-images:first-of-type'),
                  secondRow    = document.querySelector( $holder_id + ' .mk-moving-projects-holder .mk-moving-projects-images:nth-of-type(2)'),
                  projectImage = document.querySelector( $holder_id + ' .mk-moving-projects-holder .mk-moving-projects-images:first-of-type .mk-moving-projects-other-img'),
                  allImages    = document.querySelectorAll( $holder_id + ' .mk-moving-projects-holder .mk-moving-projects-images');

            let imageWidth     = projectImage.offsetWidth,
                firstRowWidth  = firstRow.getBoundingClientRect().left + imageWidth,
                secondRowRight = secondRow.getBoundingClientRect().right - imageWidth;

            const movingProjectsAnim = gsap.timeline({
                        scrollTrigger: {
                            trigger: $holder_id + ' .mk-moving-projects-holder',
                            id: 'clientPin',
                            start: 'top 20%',
                            end: 'bottom top',
                            pin: $holder_id + '.mk-moving-projects',
                            scrub: 1
                        }
                    });

              movingProjectsAnim.to(firstRow, { x: -firstRowWidth, ease: 'linear' }),
              movingProjectsAnim.to(secondRow, { x: secondRowRight, ease: 'linear' }, '<');

              // hover circle text change
              const projectInfo  = document.querySelector($holder_id + ' .mk-moving-project-info'),
                    circleBg  = projectInfo.querySelector($holder_id + ' .mk-moving-project-info-bg'),
                    iconImage = projectInfo.querySelector($holder_id + ' .stat-main-title span'),
                    imageItem = gsap.utils.toArray($holder_id + ' .mk-moving-projects-img'),
                    gsapAnim  = gsap.timeline({ repeat: -1 });

                    gsapAnim.to(iconImage, { duration: .3, scale: 1.3, delay: .5, ease: "power3.in" }),
                    gsapAnim.to(iconImage, { duration: .3, scale: 1, ease: "power3.out" }),
                    allImages.forEach((theImage => {
                            theImage.addEventListener('mouseenter', (function() { gsap.to(circleBg, { scale: 1.1, duration: 1, ease: 'elastic' }) })),
                            theImage.addEventListener('mouseleave', (function() { gsap.to(circleBg, { scale: 1,   duration: 1, ease: 'elastic' }) }))
                        })),
                    imageItem.forEach((imageElements => {

                        imageElements.addEventListener('mouseenter', (function() {
                            const number = this.dataset.projectimage,
                                  dataStat = document.querySelector('[data-stat="' + number + '"]');

                            gsapAnim.pause(),
                            gsap.to(dataStat, { yPercent: -50, opacity: 1, scale: 1, duration: .4, ease: "power4" }),
                            iconImage.classList.add('invisible') })),

                        imageElements.addEventListener('mouseleave', (function() {
                            const number = this.dataset.projectimage,
                                  dataStat = document.querySelector('[data-stat="' + number + '"]');

                            gsap.to(dataStat, { yPercent: -50, opacity: 0, scale: .5, duration: .4, ease: 'power4' }),
                            iconImage.classList.remove('invisible'),
                            gsapAnim.restart()
                        }));

                    }));
        }

    }

    mkAddons.widgetsList.mk_moving_projects = {};
    mkAddons.widgetsList.mk_moving_projects.mkMovingProjects = mkMovingProjects;

    // ----------------------------------------------------------

    var mkMediaReveal = {

        init: function () {
            let $holder = $( '.mk-reveal-image-wrapper' );

            if ( $holder.length ) {

                gsap.defaults({overwrite: "auto"});
                gsap.registerPlugin(ScrollTrigger);
                gsap.config({nullTargetWarn: false});

                $holder.each( function () {
                    let $thisHolder = $( this );
                    mkMediaReveal.initItem($thisHolder);
                });
            }
        },
        initItem: function ($holder){

            // Clipped Image
            gsap.utils.toArray($holder).forEach((revealMediaWrapper) => {

                let $holder_id = $holder.attr( 'id' );

                const revealMediaPin      = revealMediaWrapper.querySelector('#' + $holder_id + ' .mk-reveal-image-pin'),
                      revealMedia         = revealMediaWrapper.querySelector('#' + $holder_id + ' .mk-reveal-image'),
                      revealMediaContent  = revealMediaWrapper.querySelector('#' + $holder_id + ' .mk-reveal-image-content');

                gsap.set(revealMediaContent, { paddingTop: (window.innerHeight/2) + revealMediaContent.offsetHeight});

                function mkSetMediaRevealImages() {
                    gsap.set(revealMediaContent, { paddingTop:""});
                    gsap.set(revealMedia, { height: window.innerHeight, });
                    gsap.set(revealMediaContent, { paddingTop: (window.innerHeight/2) + revealMediaContent.offsetHeight});
                    gsap.set(revealMediaWrapper, { height: window.innerHeight + revealMediaContent.offsetHeight});
                }

                imagesLoaded('body', function() {
                    mkSetMediaRevealImages();
                });

                window.addEventListener('resize', mkSetMediaRevealImages);

                var revealMediaAnimation = gsap.to(revealMedia, {
                    clipPath: 'inset(0% 0% 0%)',
                    scale: 1,
                    duration: 1,
                    ease: 'Linear.easeNone'
                });

                var revealMediaScene = ScrollTrigger.create({
                    trigger: revealMediaPin,
                    start: function() {
                        const startPin = 0;
                        return "top +=" + startPin;
                      },
                    end: function() {
                        const endPin = revealMediaContent.offsetHeight;
                        return "+=" + endPin;
                    },
                    animation: revealMediaAnimation,
                    scrub: 1,
                    pin: true,
                    pinSpacing: false,
                });

            });


            // Elements Animation
            var contentVideo = gsap.utils.toArray('.mk-media-reveal-video');
            contentVideo.forEach(function(videoPlay) {
                var video = videoPlay.querySelector("video");

                var videoScene = ScrollTrigger.create({
                    trigger: videoPlay,
                    start: "top 100%",
                    end: () => `+=${videoPlay.offsetHeight + window.innerHeight*2}`,
                    onEnter: function() { video.play(); },
                    onLeave: function() { video.pause(); },
                    onEnterBack: function() { video.play(); },
                    onLeaveBack: function() { video.pause(); },
                });
            });

            // Reinit All Scrolltrigger After Page Load
            imagesLoaded('body', function() {
                setTimeout(function() {
                    ScrollTrigger.refresh()
                }, 1000);
            });

        }
    };

    mkAddons.widgetsList.mk_media_reveal = {};
    mkAddons.widgetsList.mk_media_reveal.mkMediaReveal = mkMediaReveal;

    $( document ).ready( function () {
        mkMediaReveal.init();
    });

    // ----------------------------------------------------------

    var mkMovingContent = function ($scope, $) {

        if ($("body").hasClass("elementor-editor-active") ) {
            return;
        }

        var $holder = $scope.find( '.mk-moving-content' );

        if ( $holder.length && mkAddons.windowWidth > 1024 ) {
            var holderItems = $holder.find( '.mk-moving-content-item' );

            gsap.defaults({overwrite: "auto"});
            gsap.registerPlugin(ScrollTrigger);
            gsap.config({nullTargetWarn: false});

            holderItems.each( function () {
                let $thisHolder = $( this );
                initMovingContentItem($thisHolder);
            });

            function initMovingContentItem($holder){

                gsap.to($holder,{
                    scrollTrigger: {
                        trigger: $holder,
                        scrub: 1,
                        start:"top 100%",
                        end: "top 50%",
                        toggleActions: "restart play reverse play",
                        toggleClass:"activeMedia",
                    },
                    x:'-100vw',
                    duration:3
                });

            }

        }

    }

    mkAddons.widgetsList.mk_moving_content = {};
    mkAddons.widgetsList.mk_moving_content.mkMovingContent = mkMovingContent;

    // ----------------------------------------------------------

    var mkInteractivePortfolio = {

        init: function () {

            if ($("body").hasClass("elementor-editor-active")) {
                return;
            }

            let $holder = $( '.mk-interactive-portfolio' );

            if ( $holder.length ) {

                gsap.defaults({overwrite: "auto"});
                gsap.registerPlugin(ScrollTrigger);
                gsap.config({nullTargetWarn: false});

                $holder.each( function () {
                    let $thisHolder = $( this );
                    mkInteractivePortfolio.initItem($thisHolder);
                });
            }
        },
        initItem: function ($holder){

            var $thisHolder = $holder,
                slideSpeed = 1200,
                autoplay = { disableOnInteraction: false };

                // title text split
                $($thisHolder).find('.mk-interactive-portfolio-split-text span').each(function() {
                    let splitText = new SplitText($(this), { type: "chars" });
                    var i = 1;
                    $(this).find('div').each(function() {
                        $(this).addClass('mk-ip--char');
                        $(this).get(0).style.setProperty("--mk-ip-i", i);
                        i = i + 1;
                    });
                });

            var $swiper = new Swiper($thisHolder, {
                direction:'vertical',
                effect: 'fade',
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 0,
                mousewheel: true,
                loop: true,
                speed: slideSpeed,
                preventInteractionOnTransition: true,
                disableOnInteraction: false,
                on: {
                    init: function () {
                        setTimeout( function() { $thisHolder.addClass('mk-initialized'); }, 100);
                    },
                    slideChangeTransitionStart: function() {
                        var activeSlide = $thisHolder.find('.swiper-slide-active'),
                            notActive   = $thisHolder.find('.swiper-slide:not(".swiper-slide-active")'),
                            activeIndex = activeSlide.data('swiper-slide-index'),
                            container   = $thisHolder.find('.mk-interactive-portfolio-image-one, .mk-interactive-portfolio-image-two, .mk-interactive-portfolio-image-three, .mk-interactive-portfolio-image-four');

                        activeSlide.removeClass('mk--non-active');
                        notActive.each( function () {
                            if ( $( this ).length ) {
                                $( this ).addClass('mk--non-active');
                            }
                        });

                        container.each(function () {
                            if ( $( this ).length ) {
                                if (  $( this ).data('image-index') === activeIndex ) {
                                    $( this ).addClass('mk--active');
                                } else {
                                    $( this ).removeClass('mk--active');
                                }
                            }
                        });
                    },
                }
            });

        }
    };

    mkAddons.widgetsList.mk_interactive_portfolio = {};
    mkAddons.widgetsList.mk_interactive_portfolio.mkInteractivePortfolio = mkInteractivePortfolio;

    $( document ).ready( function () {
        mkInteractivePortfolio.init();
    });

    // ----------------------------------------------------------

    var mkRevealServices = {

        init: function () {

            if ($("body").hasClass("elementor-editor-active") || mkAddons.windowWidth < 1024 ) {
                return;
            }

            let $holder = $( '.mk-reveal-services-holder' );

            if ( $holder.length ) {

                gsap.defaults({overwrite: "auto"});
                gsap.registerPlugin(ScrollTrigger);
                gsap.config({nullTargetWarn: false});

                $holder.each( function () {
                    let $thisHolder = $( this );
                    mkRevealServices.initItem($thisHolder);
                });
            }
        },
        initItem: function ($holder){

            // 0 - Boxes Move right to left
            const tlBoxMove = gsap.timeline({
                scrollTrigger:{
                    trigger:'.mk-reveal-service-one',
                    start:'top 80%',
                    end:'top 30%',
                    scrub:1
                }
            });

            tlBoxMove.to('.mk-reveal-service-one',  { x:'150vh', duration:50, delay:1, opacity:1 })
                    .to('.mk-reveal-service-two',   { x:'150vh', duration:50, delay:2, opacity:1 })
                    .to('.mk-reveal-service-three', { x:'150vh', duration:50, delay:3, opacity:1 })
                    .to('.mk-reveal-service-four',  { x:'150vh', duration:50, delay:4, opacity:1 });

        }
    };

    mkAddons.widgetsList.mk_reveal_services = {};
    mkAddons.widgetsList.mk_reveal_services.mkRevealServices = mkRevealServices;

    $( document ).ready( function () {
        mkRevealServices.init();
    });

    // ----------------------------------------------------------

     var mkInteractiveServices = function ($scope, $) {

        var thisHolder         = $scope.find( '.mk-interactive-services' ),
            articles           = thisHolder.find('.mk-itsr-item'),
            showcaseWallImages = thisHolder.find('.mk-itsr-images'),
            showcaseWallImage  = thisHolder.find('.mk-itsr-image');

        if ($(window).width() >= 1024) {

             $(articles.get().reverse()).each(function () {
                 if ($(this).hasClass('active-item')) {
                     articles.removeClass('active-item');
                     $(this).addClass('active-item');
                 }
             });

             $(showcaseWallImage.get().reverse()).each(function () {
                 if ($(this).hasClass('active-item')) {
                     showcaseWallImage.removeClass('active-item');
                     $(this).addClass('active-item');
                 }
             });

             articles.each(function () {
                 $(this).on({
                     mouseenter: function () {
                         articles.removeClass('active-item');
                         $(this).addClass('active-item');
                         showcaseWallImage.removeClass('active-item');
                         showcaseWallImages.find('#' + $(this).data('index')).addClass('active-item');
                     },
                     mouseleave: function () {
                     }
                 });
             });

        } else {
            articles.removeClass('active-item');
        }
     }

     mkAddons.widgetsList.mk_interactive_services = {};
     mkAddons.widgetsList.mk_interactive_services.mkInteractiveServices = mkInteractiveServices;

    // ----------------------------------------------------------

    var mkMovingServices = function ($scope, $) {

        var $holder = $scope.find( '.mk-moving-services' );

        if ( $holder.length ) {

            gsap.defaults({overwrite: "auto"});
            gsap.registerPlugin(ScrollTrigger);
            gsap.config({nullTargetWarn: false});

            $holder.each( function () {
                let $thisHolder = $( this );
                initMovingServicesItem($thisHolder);
            });
        }

        function initMovingServicesItem($holder) {

            gsap.registerPlugin(ScrollTrigger,SplitText);

            if (mkAddons.windowWidth > 1024) {

                let $holder_id = $holder.attr( 'id' );

              const boxes = document.querySelector('#' + $holder_id + ' .mk-moving-services-items'),
                    boxesDiv = gsap.utils.toArray('#' + $holder_id + ' .mk-moving-services-items > div'),
                    boxesLeftDistance = boxes.getBoundingClientRect().left / 2;

                let boxLeftDistance = boxesDiv[0].getBoundingClientRect().left,
                    i = 0;

                for (let x = 0; x < boxesDiv.length; x++) {
                    i += boxesDiv[x].offsetWidth; // total width of all horizontal services items
                }

                i += $($holder).data('extra-length'); //  add extra length to match background text and scroll item scroll animation

              const holderDistance = -i + (window.innerWidth - 4 * boxesLeftDistance),
                    boxAnimation = function() {
                                                const firstBoxDistance = boxesDiv[0].getBoundingClientRect().left,
                                                      distance         = firstBoxDistance - boxLeftDistance,
                                                      finalDistance    = Math.abs(Math.round(1.75 * distance) / 100),
                                                      getDistance      = Math.min(Math.max(finalDistance, 0), 1);
                                                gsap.to(boxesDiv, {
                                                    scale: 1 - getDistance / 2
                                                }), boxLeftDistance = firstBoxDistance, requestAnimationFrame(boxAnimation)
                                            };
                    boxAnimation(), gsap.to(boxesDiv, {
                                        scrollTrigger: {
                                            trigger: '.mk-moving-services',
                                            start: 'top top',
                                            end: 'bottom -=300%',
                                            toggleActions: 'play none reverse none',
                                            scrub: !0
                                        },
                                        x: holderDistance,
                                        ease: "linear"
                                    }),
                                    gsap.to('.mk-moving-services', {
                                        scrollTrigger: {
                                            trigger: '.mk-moving-services',
                                            id: 'attScroll',
                                            start: 'top top',
                                            end: 'bottom -=290%',
                                            toggleActions: 'play none reverse none',
                                            scrub: !0,
                                            pin: '.mk-moving-services'
                                        }
                                    });

                const defaultText = document.querySelector('#' + $holder_id + '.mk-moving-services span:first-of-type'),
                         animText = document.querySelector('#' + $holder_id + '.mk-moving-services span:nth-of-type(2)');

                let splitText = new SplitText(animText, { type: 'chars' }),
                    splitTextAnim = gsap.timeline({
                                                scrollTrigger: {
                                                    trigger: animText,
                                                    start: 'top 40%',
                                                    end: 'bottom -=280%',
                                                    toggleActions: 'play reverse play reverse',
                                                    scrub: .2
                                                }
                                            });
                splitTextAnim.from(splitText.chars, { y: e => 100 * e, duration: 1, ease: 'linear' }),
                splitTextAnim.to(defaultText, { webkitClipPath: 'inset(0% 0% 0% 0%)', duration:  3, ease: 'linear' }),
                splitTextAnim.to(defaultText, { webkitClipPath: 'inset(0% 100% 0% 0%)', duration: 5, ease: 'linear' }),
                splitTextAnim.to(splitText.chars, { y: e => -100 * e - 550, duration: 1, ease: "linear" });
            }

        }

    };

     var mkMovingServicesX = {

        init: function () {

            if ($("body").hasClass("elementor-editor-active") ) {
                return;
            }

            let $holder = $( '.mk-moving-services' );

            if ( $holder.length ) {

                gsap.defaults({overwrite: "auto"});
                gsap.registerPlugin(ScrollTrigger);
                gsap.config({nullTargetWarn: false});

                $holder.each( function () {
                    let $thisHolder = $( this );
                    mkMovingServices.initItem($thisHolder);
                });
            }
        },
        initItem: function ($holder) {

            gsap.registerPlugin(ScrollTrigger,SplitText);

            if (mkAddons.windowWidth > 1024) {

                let $holder_id = $holder.attr( 'id' );

              const boxes = document.querySelector('#' + $holder_id + ' .mk-moving-services-items'),
                    boxesDiv = gsap.utils.toArray('#' + $holder_id + ' .mk-moving-services-items > div'),
                    boxesLeftDistance = boxes.getBoundingClientRect().left / 2;

                let boxLeftDistance = boxesDiv[0].getBoundingClientRect().left,
                    i = 0;

                for (let x = 0; x < boxesDiv.length; x++) {
                    i += boxesDiv[x].offsetWidth; // total width of all horizontal services items
                }

                i += $($holder).data('extra-length'); //  add extra length to match background text and scroll item scroll animation

              const holderDistance = -i + (window.innerWidth - 4 * boxesLeftDistance),
                    boxAnimation = function() {
                                                const firstBoxDistance = boxesDiv[0].getBoundingClientRect().left,
                                                      distance         = firstBoxDistance - boxLeftDistance,
                                                      finalDistance    = Math.abs(Math.round(1.75 * distance) / 100),
                                                      getDistance      = Math.min(Math.max(finalDistance, 0), 1);
                                                gsap.to(boxesDiv, {
                                                    scale: 1 - getDistance / 2
                                                }), boxLeftDistance = firstBoxDistance, requestAnimationFrame(boxAnimation)
                                            };
                    boxAnimation(), gsap.to(boxesDiv, {
                                        scrollTrigger: {
                                            trigger: '.mk-moving-services',
                                            start: 'top top',
                                            end: 'bottom -=300%',
                                            toggleActions: 'play none reverse none',
                                            scrub: !0
                                        },
                                        x: holderDistance,
                                        ease: "linear"
                                    }),
                                    gsap.to('.mk-moving-services', {
                                        scrollTrigger: {
                                            trigger: '.mk-moving-services',
                                            id: 'attScroll',
                                            start: 'top top',
                                            end: 'bottom -=290%',
                                            toggleActions: 'play none reverse none',
                                            scrub: !0,
                                            pin: '.mk-moving-services'
                                        }
                                    });

                const defaultText = document.querySelector('#' + $holder_id + '.mk-moving-services span:first-of-type'),
                         animText = document.querySelector('#' + $holder_id + '.mk-moving-services span:nth-of-type(2)');

                let splitText = new SplitText(animText, { type: 'chars' }),
                    splitTextAnim = gsap.timeline({
                                                scrollTrigger: {
                                                    trigger: animText,
                                                    start: 'top 40%',
                                                    end: 'bottom -=280%',
                                                    toggleActions: 'play reverse play reverse',
                                                    scrub: .2
                                                }
                                            });
                splitTextAnim.from(splitText.chars, { y: e => 100 * e, duration: 1, ease: 'linear' }),
                splitTextAnim.to(defaultText, { webkitClipPath: 'inset(0% 0% 0% 0%)', duration:  3, ease: 'linear' }),
                splitTextAnim.to(defaultText, { webkitClipPath: 'inset(0% 100% 0% 0%)', duration: 5, ease: 'linear' }),
                splitTextAnim.to(splitText.chars, { y: e => -100 * e - 550, duration: 1, ease: "linear" });
            } else {

                // mobile
                  const e = document.querySelector('#' + $holder_id + '.mk-moving-services'),
                    stackBox = gsap.utils.toArray('#' + $holder_id + ' .mk-moving-services-items .stack'),
                    theBox = gsap.utils.toArray('#' + $holder_id + ' .mk-moving-services-items article'),
                    a = document.querySelector('#' + $holder_id + '.mk-moving-services .about-link'),
                    i = stackBox[0].offsetHeight;

                    // box bottom margin to adjust with next content section
                    var getBottomMargin = $($holder).data('box-margin') || 0;
                    e.style.marginBottom = getBottomMargin, gsap.set([stackBox, a], {
                        yPercent: 200 // distance from actual view to move bottom to top animation
                    });
                    let s = gsap.timeline({
                        scrollTrigger: {
                            trigger: e,
                            start: "top top",
                            end: () => "+=" + i * stackBox.length,
                            pin: !0,
                            scrub: !0
                        }
                    });

                    // box bottom margin to adjust with next content section
                    var getVerticalMargin = $($holder).data('vertical-margin') || 0;

                    s.to(stackBox, {
                        yPercent: (e, stackBox) => getVerticalMargin * e + 15,
                        stagger: 1,
                        duration: 1
                    }), s.to(theBox, {
                        duration: 1,
                        stagger: 1
                    }, "<");


                if (document.querySelector('#' + $holder_id + ' .mk-moving-services-heading-mobile')) {

                  gsap.utils.toArray('#' + $holder_id + ' .mk-moving-services-heading-mobile').forEach((e => {
                    let t = new SplitText(e, { type: 'chars' });

                    gsap.timeline({
                      scrollTrigger: {
                        trigger: e,
                        start: 'top 100%',
                        end: 'top center',
                        toggleActions: 'play reverse reverse none',
                        scrub: !0
                      }
                    }).from(t.chars, {
                      yPercent: 100,
                      scale: 2,
                      stagger: .1,
                      duration: 1,
                      ease: 'power2'
                    })
                  }))
                }

            }

        }
    };

    mkAddons.widgetsList.mk_moving_services = {};
    mkAddons.widgetsList.mk_moving_services.mkMovingServices = mkMovingServices;

    // ----------------------------------------------------------

    var mkAnimatedContent = function ($scope, $) {
        var $currentItem = $scope.find('.mk-animated-content.mk--animated-by-letter');
        var $words = $currentItem.find( '.mk-ac-word-holder' );

        mkScrollLoad.init();

        $words.each(
            function () {
                let $word       = $( this ).text(),
                    $split_word = '';

                for (var i = 0; i < $word.length; i++) {
                    $split_word += '<span class="mk-ac-character">' + $word.charAt( i ) + '</span>';
                }

                $( this ).html( $split_word );
            }
        );

        let $characters = $currentItem.find( '.mk-ac-character' );

        $characters.each(
            function (index) {
                let $character         = $( this ),
                    transitionModifier = $currentItem.hasClass( 'mk--appear-from-left' ) ? 20 : 40,
                    transitionDelay    = (index * transitionModifier) + 'ms';

                $character.css( 'transition-delay', transitionDelay );
            }
        );
    };

    mkAddons.widgetsList.mk_animated_content = {};
    mkAddons.widgetsList.mk_animated_content.mkAnimatedContent = mkAnimatedContent;

    // ----------------------------------------------------------

    function mkDualSliderInit() {
        var holder = $( '.mk-dual-slider-swiper-container' );

        if ( holder.length ) {
            holder.each(
                function () {

                    var $holder    = $( this ),
                        settings   = $holder.data( 'settings' ) || {},
                        pagination = $holder.siblings( '.swiper-pagination' ).length ? $holder.siblings( '.swiper-pagination' )[0] : null;

                    var swiperOptions = {
                        direction     : 'horizontal',
                        slidesPerView : 1,
                        loop          : true,
                        speed         : settings['speed'],
                        effect        : settings['effect'],
                        pagination    : { el: pagination, type: 'bullets', clickable: true }
                    };

                    // autoplay
                    if ( 'yes' === settings['autoplay'] ) {
                        swiperOptions.autoplay = { delay: settings['autoplay_speed'], disableOnInteraction: false };
                    }

                    var $swiper = new Swiper( $( this )[0], swiperOptions );
                }
            );
        }
    }

    var mkDualSlider = function ($scope, $) {
            var $holder = $scope.find('.mk-dual-slider');

            mkDualSliderInit();

            if ( $holder.length ) {
                $holder.each(function() {
                    mkDualSliderSyncSwipers( $( this ) );
                    mkDualSliderSyncInfo( $( this ) );
                });
            }

            function mkDualSliderSyncSwipers( $thisHolder ) {
                var mkLeftSwiper = $thisHolder.find( '.mk-dual-slider-left' ),
                    mkRightSwiper = $thisHolder.find( '.mk-dual-slider-right' );

                if ( mkLeftSwiper.length && mkRightSwiper.length ) {
                    var autoplay = $thisHolder.hasClass( 'mk-dual-slider-autoplay-yes' );

                    mkRightSwiper[0].swiper.autoplay.stop();
                    mkLeftSwiper[0].swiper.autoplay.stop();
                    mkRightSwiper[0].swiper.controller.control = mkLeftSwiper[0].swiper;
                    mkRightSwiper[0].swiper.controller.by      = 'slide';
                    mkRightSwiper[0].swiper.controller.inverse = true;
                    mkLeftSwiper[0].swiper.controller.control = mkRightSwiper[0].swiper;

                    if ( autoplay ) {
                        mkRightSwiper[0].swiper.autoplay.start();
                    }
                }
            }

            function mkDualSliderSyncInfo( $thisHolder ) {
                var mkLeftSwiper      = $thisHolder.find( '.mk-dual-slider-left' ),
                    contentToPopulate = $thisHolder.find( '.mk-dual-slider-content-large' ),
                    contents          = mkLeftSwiper.find( '.mk-dual-slider-item .mk-dual-slider-content' );

                mkDualSliderPopulateContent( mkLeftSwiper, contentToPopulate, contents );

                mkLeftSwiper[0].swiper.on('slideChangeTransitionStart', function () {
                        //Timeout is safe here because it does not depend on anything apart from animation duration which is fixed value
                        setTimeout(function() {
                                mkDualSliderPopulateContent( mkLeftSwiper, contentToPopulate, contents );
                            }, 300 );
                    }
                );
            }

            function mkDualSliderPopulateContent( mkLeftSwiper, contentToPopulate, contents ) {
                var activeIndex = mkLeftSwiper[0].swiper.activeIndex;

                if ( contentToPopulate.length ) {
                    contentToPopulate.html( contents.eq( activeIndex ).html() );
                }
            }

    }

    mkAddons.widgetsList.mk_dual_slider = {};
    mkAddons.widgetsList.mk_dual_slider.mkDualSlider = mkDualSlider;

    // ----------------------------------------------------------

    var mkCountdown = function ($scope, $) {
        var $this = $scope.find('.mk-countdown'),
            year  = $this.find('.mk-cd-year'),
            month = $this.find('.mk-cd-month'),
            week  = $this.find('.mk-cd-week'),
            day   = $this.find('.mk-cd-day'),
            hour  = $this.find('.mk-cd-hour'),
            min   = $this.find('.mk-cd-minute'),
            sec   = $this.find('.mk-cd-second'),
            text  = $this.data('text'),
            standardCountdown  = $this.data('standard-countdown'),
            mesg  = $this.data('message'),
            link  = $this.data('link'),
            time  = $this.data('time'),
            data_text_year    = $this.data('text-year'),
            data_text_years   = $this.data('text-years'),
            data_text_month   = $this.data('text-month'),
            data_text_months  = $this.data('text-months'),
            data_text_week    = $this.data('text-week'),
            data_text_weeks   = $this.data('text-weeks'),
            data_text_day     = $this.data('text-day'),
            data_text_days    = $this.data('text-days'),
            data_text_hour    = $this.data('text-hour'),
            data_text_hours   = $this.data('text-hours'),
            data_text_minute  = $this.data('text-minute'),
            data_text_minutes = $this.data('text-minutes'),
            data_text_second  = $this.data('text-second'),
            data_text_seconds = $this.data('text-seconds');

        $this.countdown( time ).on('update.countdown', function (e) {
            var m = e.strftime('%m'),
                w = e.strftime('%w'),
                Y = Math.floor(m / 12),
                m = m % 12,
                w = w % 4;

            function addZero(val) {
                if ( val < 10 ) {
                    return '0'+val;
                }
                return val;
            }

            if ( standardCountdown == 'yes' ) {
                day.html( e.strftime('%D') );
            } else {
                year.html( addZero(Y) );
                month.html( addZero(m) );
                week.html( '0'+w );
                day.html( e.strftime('%d') );
            }

            hour.html( e.strftime('%H') );
            min.html( e.strftime('%M') );
            sec.html( e.strftime('%S') );

            if ( text == 'yes' ) {

                if ( standardCountdown == 'yes' ) {
                    day.next().html( e.strftime('%D') < 2 ? data_text_day : data_text_days );
                } else {
                    year.next().html( Y < 2 ? data_text_year : data_text_years );
                    month.next().html( m < 2 ? data_text_month : data_text_months );
                    week.next().html( w < 2 ? data_text_week : data_text_weeks );
                    day.next().html( e.strftime('%d') < 2 ? data_text_day : data_text_days );
                }

                hour.next().html( e.strftime('%H') < 2 ? data_text_hour : data_text_hours );
                min.next().html( e.strftime('%M') < 2 ? data_text_minute : data_text_minutes );
                sec.next().html( e.strftime('%S') < 2 ? data_text_second : data_text_seconds );
            }

        }).on('finish.countdown', function (e) {
            $this.children().remove();
            if ( mesg ) {
                $this.append('<div class="mk-cd-message">'+ mesg +'</div>');
            } else if( link && elementorFrontend.isEditMode() ){
                $this.append('<h2>You can\'t redirect url from elementor edit mode!!</h2>');
            } else if (link) {
                window.location.href = link;
            } else{
                $this.append('<h2>May be you don\'t enter a valid redirect url</h2>');
            }
        });
    }

    mkAddons.widgetsList.mk_countdown = {};
    mkAddons.widgetsList.mk_countdown.mkCountdown = mkCountdown;

    // ----------------------------------------------------------

    // full screen menu
    var mkFullScreenMenu = function ($scope, $) {
        var $hamburgerIcon = $scope.find('.mk-fullscreen-menu-icon'),
            $dataID = '#' + $hamburgerIcon.attr('data-id'),
            overlayHolder = $('body').find($dataID),
            closeButton = overlayHolder.find('.mk-fs-menu-close'),
            menuHolder = overlayHolder.find('.mk-fullscreen-menu-holder'),
            subLinks = menuHolder.children().find("li");

        $hamburgerIcon.bind('click touchstart', function () {
            var openDiv = '#' + $(this).attr('data-id');
            $(openDiv).removeClass('overlay-is--close');
            $(openDiv).addClass('overlay-is--open');
            $('body').addClass('elementor-no-overflow');
        });

        closeButton.bind('click touchstart', function(e) {
            console.log('tes');
            e.stopPropagation();
            e.preventDefault();
            $(this).parent().parent().removeClass('overlay-is--open');
            $(this).parent().parent().addClass('overlay-is--close');
            $(menuHolder).find('.sub-menu').delay(0).slideUp(300);
        });

        // indicator
        if ($(subLinks).find('.sub-menu').length > 0) {
            $(subLinks).find('.sub-menu').siblings("a").addClass('menu-indicator-icon');
        }

        $(subLinks).bind('click touchstart', function(e) {
            e.stopPropagation();
            e.preventDefault();

            var $item          = $(this),
                $subMenus      = $item.children('.sub-menu'),
                $allSubMenus   = $item.find('.sub-menu'),
                indicatorMinus = 'sub-menu-indicator-minus',
                activeClass    = 'mk-fs-active';

            if ($subMenus.length > 0 ) {

                $item.parents('.mk-fullscreen-menu-holder').find('li').removeClass(activeClass);
                $item.siblings('li').removeClass(activeClass);
                $item.addClass(activeClass);

                if ($item.parents().hasClass('sub-menu')) {
                    $item.parents().addClass(activeClass);
                }

                if ($subMenus.css("display") == "none") {
                    $subMenus.slideDown(300).siblings("a").addClass(indicatorMinus);
                    $item.siblings().find('.sub-menu').slideUp(300).end().find("a").removeClass(indicatorMinus);
                    return false;
                } else {
                    $item.find('.sub-menu').delay(0).slideUp(300);
                }

                if ($allSubMenus.siblings("a").hasClass(indicatorMinus)) {
                    $allSubMenus.siblings("a").removeClass(indicatorMinus);
                }
            }
            window.location.href = $item.children("a").attr("href");
        });
    }

    mkAddons.widgetsList.mk_full_screen_menu = {};
    mkAddons.widgetsList.mk_full_screen_menu.mkFullScreenMenu = mkFullScreenMenu;

    // ----------------------------------------------------------

    var mkCounter = function ($scope, $) {
        elementorFrontend.waypoint($scope.find('.mk-counter-number'), function () {
            var $this   = $(this),
                data    = $this.data(),
                digit   = data.toValue.toString().match(/\.(.*)/);

            if (digit) {
                data.rounding = digit[1].length;
            }

            $this.numerator(data);
        });
    }

    mkAddons.widgetsList.mk_counter = {};
    mkAddons.widgetsList.mk_counter.mkCounter = mkCounter;

    // ----------------------------------------------------------

    var verticalMenu = function ($scope, $) {

        var verMenu = $scope.find('.mk-ver-menu-wrap'),
            megaMenuDiv = verMenu.find('ul.mk-sections-megamenu');

            megaMenuDiv.remove();

        // add arrow icon
        verMenu.find('li ul').parent().addClass('mk-has-sub-menu');
        // verMenu.find(".mk-has-sub-menu").prepend('<span class="mk-mini-menu-arrow"></span>');

        verMenu.find('.swm-svg-submenu-indicator').on('click', function(e) {

            e.preventDefault();

            var parentLi = $(this).parent('.menu-item');

            if (parentLi.hasClass('mk-has-sub-active-menu')) {
                parentLi.removeClass('mk-has-sub-active-menu');
            } else {
                parentLi.addClass('mk-has-sub-active-menu');
            }

            if ($(this).parent().siblings('ul').hasClass('open')) {
                $(this).parent().siblings('ul').removeClass('open').slideUp();
            } else {
                $(this).parent().siblings('ul').addClass('open').slideDown();
            }

            if ($(this).hasClass('inactive')) {
                $(this).removeClass('inactive');
            } else {
                $(this).addClass('inactive');
            }
        });

    }

    mkAddons.widgetsList.mk_vertical_menu = {};
    mkAddons.widgetsList.mk_vertical_menu.verticalMenu = verticalMenu;

    // ----------------------------------------------------------

    var mkTestimonialsSlider = function ($scope, $) {

        var testimonialsSlider   = $scope.find( '.mk-testimonials-slider-content' ).eq( 0 ),
            testimonialsSliderID = '#' + testimonialsSlider.attr( 'id' ),
            $target              = $(testimonialsSliderID).first();

        var settings = $target.data( 'settings' ) || {};

        var swiperOptions = {
            direction: 'horizontal',
            slidesPerView: 1,
            loop: 'yes' === settings['loop'],
            speed: settings['speed'],
            effect: 'slide',
            keyboard: { enabled: true, onlyInViewport: true },
            mousewheel: 'yes' === settings['mousewheel'],
            spaceBetween:50,
            on: {
                resize: function () {
                defaultswiperObj.update(); }
            }
        };

        if ( 'yes' === settings['autoplay'] ) {
            swiperOptions.autoplay = { delay: settings['autoplay_speed'] };
            if ( settings['pause_on_hover'] ) {
                $( testimonialsSliderID ).on( 'mouseenter', function() { defaultswiperObj.autoplay.stop(); });
                $( testimonialsSliderID ).on( 'mouseleave', function() { defaultswiperObj.autoplay.start(); });
            }
        }

        if ( 'yes' === settings['arrows_on'] ) {
            swiperOptions.navigation = { prevEl: settings['slider_prev'], nextEl: settings['slider_next'] };
        }
        if ( 'yes' === settings['dots'] ) {
            swiperOptions.pagination = {
                el: settings['slider_pagination'],
                type: 'bullets',
                clickable: true
            };
        }

        var defaultswiperObj = new Swiper(testimonialsSliderID, swiperOptions);
    }

    mkAddons.widgetsList.mk_testimonials_slider = {};
    mkAddons.widgetsList.mk_testimonials_slider.mkTestimonialsSlider = mkTestimonialsSlider;

    // ------------------------------------------------------------
    // Custom Sliders ---------------------------------------------
    // ------------------------------------------------------------

    function mkSwiperSlider($swiperContainer) {

        if ( ! $swiperContainer ) { $swiperContainer = '.swiper-container'; }

        var $target             = $($swiperContainer).first(),
            settings            = $target.data( 'settings' ) || {},
            thumbimage            = $target.data( 'thumbimage' ) || {},
            breakpointsSettings = {},
            breakpoints         = elementorFrontend.config.breakpoints,
            fadeVerticalSwiperBg = '';

        if ( $target.length === 0 ) { return; }

        var swiperOptions = {
            slidesPerView: settings['slides_to_show'],
            loop: 'yes' === settings['loop'],
            speed: settings['speed'],
            keyboard: { enabled: true, onlyInViewport: true },
            parallax: 'yes' === settings['parallax'],
            mousewheel: 'yes' === settings['mousewheel'],
            centeredSlides: 'yes' === settings['centered_slides'],
            on: {
                resize: function () {
                 defaultswiperObj.update(); }
            }
        };

        if ( 'yes' === settings['video'] ) {
            swiperOptions.on.init = function () {
                $('.swiper-slide-active').find('video').each(function() { $(this).get(0).play(); });
            }
            swiperOptions.on.slideChangeTransitionStart = function () {
                $('.swiper-slide-active').find('video').each(function() { $(this).get(0).play(); });
            }
            swiperOptions.on.slideChangeTransitionEnd = function () {
                $('.swiper-slide-prev').find('video').each(function() { $(this).get(0).pause(); });
                $('.swiper-slide-next').find('video').each(function() { $(this).get(0).pause(); });
            }
        }

        if ( settings['direction'] ) { swiperOptions.direction = settings['direction']; }

        // effect
        if ( settings['effect'] ) {
            swiperOptions.effect = settings['effect'];
            if ( 'fade' === settings['effect'] ) { swiperOptions.fadeEffect = { crossFade: true }; }
        }

        // autoplay
        if ( 'yes' === settings['autoplay'] ) {
            swiperOptions.autoplay = { delay: settings['autoplay_speed'] };
            if ( settings['pause_on_hover'] ) {
                $( $target ).on( 'mouseenter', function() { defaultswiperObj.autoplay.stop(); });
                $( $target ).on( 'mouseleave', function() { defaultswiperObj.autoplay.start(); });
            }
        }

        // navigation

        if ( 'yes' === settings['arrows_on'] ) {
            swiperOptions.navigation = { prevEl: settings['slider_prev'], nextEl: settings['slider_next'] };
        }

        if ( 'yes' === settings['dots'] ) {
            swiperOptions.pagination = {
                el: settings['slider_pagination'],
                type: 'bullets',
                clickable: true,
            };

            if ( $target.hasClass('mk-thumbnail-slider')) {
                swiperOptions.pagination.renderBullet = function(index, className) {

                    var thumbimageHTML = '',
                        thumbURL = thumbimage[index + 1],
                        counter = index + 1;

                    if ( counter < 10 ) {
                        counter = '0' + counter;
                    }

                    if (thumbURL) {
                        thumbimageHTML = '<div class="mk-thumbnailslider-navImage"><span class="mk-thumbnailslider-overlay">' + counter + '</span><img src="' + thumbimage[index + 1] + '" /></div>';
                    }

                    return '<div class="' + className + '">' + thumbimageHTML + '</div></div>';
                }
            }

        }

        var numberPagination = 1;
        if( numberPagination != '' && numberPagination != undefined ) {

            swiperOptions['on']['slideChange'] = function () {
                if( $( '.swiper-pagination-current' ).length > 0 ) {
                    $( '.swiper-pagination-current' ).html( pad( this.realIndex + 1, 2 ) );
                }
                if( $( '.swiper-pagination-total' ).length > 0 ) {
                    $( '.swiper-pagination-total' ).html( pad( this.slides.length - 2, 2 ) );
                }
            };
        }

        // image spacing
        if ( typeof( settings['image_spacing'] ) !== 'undefined' && settings['image_spacing']['size'] !== '' && settings['image_spacing']['size'] !== null ) {
            swiperOptions.spaceBetween = settings['image_spacing']['size']
        }

        breakpointsSettings[ breakpoints.lg ] = { slidesPerView: settings['slides_to_show'] || 1 };
        breakpointsSettings[ breakpoints.md ] = { slidesPerView: settings['slides_to_show_tablet'] || 1 };
        breakpointsSettings[ breakpoints.xs ] = { slidesPerView: settings['slides_to_show_mobile'] || 1 };

        if ( $target.hasClass('mk-carousel-slider')) {
            if ( !$target.parents().hasClass('mk-carousel-slider-st1') ) {
                breakpointsSettings[ breakpoints.md ] = { slidesPerView: 'auto' };
                breakpointsSettings[ breakpoints.xs ] = { slidesPerView: 'auto' };
            }
        }

        swiperOptions.breakpoints = breakpointsSettings;

        // Image slider
        if ( $target.hasClass('mk-preview-slider') ) {

            var breakpointsTinySettings = {};

            breakpointsTinySettings[ breakpoints.lg ] = { slidesPerView: $target.data( 'thumb-items' ) || 5 };
            breakpointsTinySettings[ breakpoints.md ] = { slidesPerView: $target.data( 'thumb-items-tablet' ) || 3 };
            breakpointsTinySettings[ breakpoints.xs ] = { slidesPerView: $target.data( 'thumb-items-mobile' ) || 2 };

            var thumbSliderOptions = {
                loop: 'yes' === settings['loop'],
                speed: settings['speed'],
                spaceBetween: $target.data( 'thumb-space' ),
                effect:$target.data( 'thumb-effect' ),
                freeMode: true,
                watchSlidesProgress: true
            }

            thumbSliderOptions.breakpoints = breakpointsTinySettings;

            var imageSliderThumbs = new Swiper($target.data( 'thumb-slider-id' ), thumbSliderOptions);

            swiperOptions.thumbs = { swiper: imageSliderThumbs };
        }

        // call
        var defaultswiperObj = new Swiper( $swiperContainer, swiperOptions );

    };

    // if adminbar - reset slider height
    var mkGetCustomSlider = function ($scope, $) {

        var customSliderHolder   = $scope.find( '.swiper-container' ).eq( 0 ),
            customSliderHolderID = '#' + customSliderHolder.attr( 'id' );

        if ( ! customSliderHolder.length ) { return; }
        mkSwiperSlider(customSliderHolderID);

        var customSliderHolderIDHeight = $(customSliderHolderID).height();

        var $windowHeight = $(window).height();

        if ( customSliderHolderIDHeight == $windowHeight && mkAddons.body.hasClass('admin-bar') ) {

            var $adminbar = jQuery( '#wpadminbar' );

            var adminbarHeight = $adminbar.length === 0 || $adminbar.css( 'display' ) == 'none' || $adminbar.css( 'position' ) == 'absolute' ? 0 : $adminbar.height();

            var customSliderHolderIDHeight = $(customSliderHolderID).height();
            var finalHeight = customSliderHolderIDHeight - adminbarHeight;

            $(customSliderHolderID).css( 'height', finalHeight );
        }

        mkAddons.body.mkCustomCursor.init();

    }

    mkAddons.widgetsList.mk_basic_slider = {};
    mkAddons.widgetsList.mk_basic_slider.mkGetCustomSlider = mkGetCustomSlider;

    mkAddons.widgetsList.mk_thumbnail_slider = {};
    mkAddons.widgetsList.mk_thumbnail_slider.mkGetCustomSlider = mkGetCustomSlider;

    mkAddons.widgetsList.mk_carousel_slider = {};
    mkAddons.widgetsList.mk_carousel_slider.mkGetCustomSlider = mkGetCustomSlider;

    mkAddons.widgetsList.mk_portfolio_slider = {};
    mkAddons.widgetsList.mk_portfolio_slider.mkGetCustomSlider = mkGetCustomSlider;

    mkAddons.widgetsList.mk_image_carousel_slider = {};
    mkAddons.widgetsList.mk_image_carousel_slider.mkGetCustomSlider = mkGetCustomSlider;

    mkAddons.widgetsList.mk_image_slider = {};
    mkAddons.widgetsList.mk_image_slider.mkGetCustomSlider = mkGetCustomSlider;

    mkAddons.widgetsList.mk_testimonials = {};
    mkAddons.widgetsList.mk_testimonials.mkGetCustomSlider = mkGetCustomSlider;

    mkAddons.widgetsList.mk_circle_slider = {};
    mkAddons.widgetsList.mk_circle_slider.mkGetCustomSlider = mkGetCustomSlider;

    // End Custom Sliders ---------------------------------------------

    // ------------------------------------------------------------
    // Post Grid --------------------------------------------------
    // ------------------------------------------------------------


    // Filter

    var mkFilter = {

        customListQuery: {},
        init: function ( settings ) {
            this.holder = $( '.mk-filter--on' );

            if ( this.holder.length ) {
                this.holder.each(
                    function () {
                        var holder      = $( this ),
                            filterItems = holder.find( '.mk-m-filter-item' );

                        // mkFilter.checkCustomListQuery( holder.data( 'options' ) );
                        mkFilter.clickEvent( holder, filterItems );
                    });
            }
        },
        clickEvent: function ( holder, filterItems ) {
            filterItems.on( 'click', function (e) {
                e.preventDefault();
                var thisItem = $( this );

                if ( ! thisItem.hasClass( 'mk--active' ) ) {
                    holder.addClass( 'mk--filter-loading' );
                    filterItems.removeClass( 'mk--active' );
                    thisItem.addClass( 'mk--active' );

                    mkFilter.setVisibility( holder, thisItem );
                }
            });
        },
        setVisibility: function ( holder, item ) {
            var filterTaxonomy  = item.data( 'taxonomy' ),
                filterValue     = item.data( 'filter' ),
                showAll         = filterValue === '*',
                options         = holder.data( 'options' ),
                taxQueryOptions = {};

            if ( ! showAll ) {
                taxQueryOptions = {
                    0: {
                        taxonomy: filterTaxonomy,
                        field: 'slug',
                        terms: filterValue,
                    },
                };
            } else {
                taxQueryOptions = mkFilter.customListQuery;
            }

            options.additional_query_args = { tax_query: taxQueryOptions };
            mkAddons.body.trigger( 'mk_trigger_load_more', [holder, 1] ); // param1 = holder, param2 = 1
        }

    };

    // Masonry Layout

    var mkMasonryLayout = {
        init: function ( settings ) {
            this.holder = $( '.mk-p-masonry-on' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                        mkMasonryLayout.createMasonry( $( this ) );
                    }
                );
            }
        },
        reInit: function ( settings ) {
            this.holder = $( '.mk-p-masonry-on' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    var masonryDiv = $( this ).find( '.mk-grid-inner' );

                    if ( typeof masonryDiv.isotope === 'function' ) {
                        masonryDiv.isotope( 'layout' );
                    }
                });
            }
        },
        createMasonry: function ( holder ) {
            var masonryDiv   = holder.find( '.mk-grid-inner' ),
                $masonryItem = masonryDiv.find( '.mk-grid-item' );

            mkAddons.mkWaitForImages.check( masonryDiv, function () {
                    if ( typeof masonryDiv.isotope === 'function' ) {
                        masonryDiv.isotope({
                                layoutMode: 'packery',
                                itemSelector: '.mk-grid-item',
                                percentPosition: true,
                                masonry: {
                                    columnWidth: '.mk-grid-masonry-sizer',
                                    gutter: '.mk-grid-masonry-gutter'
                                }
                        });

                        if ( holder.hasClass( 'mk-items--packery' ) ) {
                            var size = mkMasonryLayout.getPackeryImageSize( masonryDiv, $masonryItem );
                            mkMasonryLayout.setPackeryImageProportionSize( masonryDiv, $masonryItem, size );
                        }

                        masonryDiv.isotope( 'layout' );
                    }

                    masonryDiv.addClass( 'mk--masonry-init' );
                }
            );
        },
        getPackeryImageSize: function ( $holder, $item ) {
            var $squareItem = $holder.find( '.mk-item--square' );

            if ( $squareItem.length ) {
                var $squareItemImage      = $squareItem.find( 'img' ),
                    squareItemImageWidth  = $squareItemImage.width(),
                    squareItemImageHeight = $squareItemImage.height();

                if ( squareItemImageWidth !== squareItemImageHeight ) {
                    return squareItemImageHeight;
                } else {
                    return squareItemImageWidth;
                }
            } else {
                var size    = $holder.find( '.mk-grid-masonry-sizer' ).width(),
                    padding = parseInt( $item.css( 'paddingLeft' ), 10 );

                return (size - 2 * padding); // remove item side padding to get real item size
            }
        },
        setPackeryImageProportionSize: function ( $holder, $item, size ) {
            var padding          = parseInt( $item.css( 'paddingLeft' ), 10 ),
                $squareItem      = $holder.find( '.mk-item--square' ),
                $horizontalItem  = $holder.find( '.mk-item--horizontal' ),
                $verticalItem    = $holder.find( '.mk-item--vertical' ),
                $largeSquareItem = $holder.find( '.mk-item--large-square' ),
                isMobileScreen   = mkAddons.windowWidth <= 680;

            $item.css( 'height', size );

            if ( $horizontalItem.length ) {
                $horizontalItem.css( 'height', Math.round( size / 2 ) );
            }

            if ( $verticalItem.length ) {
                $verticalItem.css( 'height', Math.round( 2 * (size + padding) ) );
            }

            if ( ! isMobileScreen ) {

                if ( $horizontalItem.length ) {
                    $horizontalItem.css( 'height', size );
                }

                if ( $largeSquareItem.length ) {
                    $largeSquareItem.css( 'height', Math.round( 2 * (size + padding) ) );
                }
            }
        }
    };

    // Pagination

    var mkPagination = {
        init: function ( settings ) {
            this.holder = $( '.mk-pagination--on' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    var holder = $( this );
                    mkPagination.initPaginationType( holder );
                });
            }
        },
        initPaginationType: function ( holder ) {
            if ( holder.hasClass( 'mk-pagination-type--standard' ) )               { mkPagination.initStandard( holder );
            } else if ( holder.hasClass( 'mk-pagination-type--load-more' ) )       { mkPagination.initLoadMore( holder );
            } else if ( holder.hasClass( 'mk-pagination-type--infinite-scroll' ) ) { mkPagination.initInfiniteScroll( holder );
            }
        },
        initStandard: function ( holder, nextPage ) {
            var paginationItems = holder.find( '.mk-m-pagination-items' ); // pagination div 1,2,3...

            if ( paginationItems.length ) {
                var options      = holder.data( 'options' ),
                    current_page = typeof nextPage !== 'undefined' && nextPage !== '' ? parseInt( nextPage, 10 ) : 1;

                mkPagination.changeStandardState( holder, options.max_pages_num, current_page );

                paginationItems.children().each( function () {
                        var thisItem = $( this );

                        thisItem.on( 'click', function (e) {
                            e.preventDefault();
                            if ( ! thisItem.hasClass( 'mk--active' ) ) {
                                mkPagination.getNewPosts( holder, thisItem.data( 'paged' ) );
                            }
                        });
                    }
                );
            }
        },
        changeStandardState: function ( holder, maxPagesNum, nextPage ) {
            if ( holder.hasClass( 'mk-pagination-type--standard' ) ) {
                var paginationNav = holder.find( '.mk-m-pagination-items' ),
                    numericItem   = paginationNav.children( '.mk--number' ),
                    prevItem      = paginationNav.children( '.mk--prev' ),
                    nextItem      = paginationNav.children( '.mk--next' );

                mkPagination.standardPaginationVisibility( paginationNav, maxPagesNum );

                numericItem.removeClass( 'mk--active' ).eq( nextPage - 1 ).addClass( 'mk--active' );

                // show/hide next prev arrows
                prevItem.data( 'paged', nextPage - 1 );
                nextItem.data( 'paged', nextPage + 1 );

                if ( nextPage > 1 ) {
                    prevItem.show();
                    prevItem.next().removeClass( 'mk-prev--hidden' );
                } else {
                    prevItem.hide();
                    prevItem.next().addClass( 'mk-prev--hidden' );
                }

                if ( nextPage === maxPagesNum ) {
                    nextItem.hide();
                } else {
                    nextItem.show();
                }
            }
        },
        standardPaginationVisibility: function ( paginationNav, maxPagesNum ) {
            if ( maxPagesNum === 1 ) {
                paginationNav.hide();
            } else if ( maxPagesNum > 1 && ! paginationNav.is( ':visible' ) ) {
                paginationNav.show();
            }
        },
        initLoadMore: function ( holder ) {
            var loadMoreButton = holder.find( '.mk-load-more-button' );

            loadMoreButton.on('click', function (e) {
                e.preventDefault();
                mkPagination.getNewPosts( holder );
            });
        },
        initInfiniteScroll: function ( holder ) {
            var holderEndPosition = holder.outerHeight() + holder.offset().top,
                scrollPosition    = mkAddons.scroll + mkAddons.windowHeight,
                options           = holder.data( 'options' );

            if ( ! holder.hasClass( 'mk--loading' ) && scrollPosition > holderEndPosition && options.max_pages_num >= options.next_page ) {
                mkPagination.getNewPosts( holder );
            }
        },
        getNewPosts: function ( holder, nextPage ) {
            holder.addClass( 'mk--loading' );

            var itemsHolder = holder.children( '.mk-grid-inner' );
            var options      = holder.data( 'options' );

            mkPagination.setNextPageValue( options, nextPage, false );

            // paginationRestRoute = mk/v1/get-posts
            // restUrl = http://localhost/mk/wp-json/

            $.ajax({
                    type: 'GET',
                    url: mkWidgetsLocalize.restUrl + mkWidgetsLocalize.paginationRestRoute,
                    data: {
                        options: options
                    },
                    beforeSend: function ( request ) {
                        request.setRequestHeader( 'X-WP-Nonce', mkWidgetsLocalize.restNonce );
                    },
                    success: function ( response ) {

                        if ( response.status === 'success' ) {
                            // Override max page numbers options
                            if ( options.max_pages_num !== response.data.max_pages_num ) {
                                options.max_pages_num = response.data.max_pages_num;
                            }

                            mkPagination.setNextPageValue( options, nextPage, true );
                            mkPagination.changeStandardHtml( holder, options.max_pages_num, nextPage, response.data.pagination_html );

                            mkPagination.addPosts( itemsHolder, response.data.html, nextPage );
                            mkPagination.reInitMasonryPosts( holder, itemsHolder );

                            setTimeout( function () {
                                mkAddons.body.trigger( 'mk_trigger_get_new_posts', [holder, response.data, nextPage] );
                            }, 300 ); // 300ms is set in order to be after the masonry script initialize

                            mkPagination.triggerStandardScrollAnimation( holder );
                            mkPagination.loadMoreButtonVisibility( holder, options );
                        } else {
                            console.log( response.message );
                        }
                    },
                    complete: function () {
                        holder.removeClass( 'mk--loading' );
                    }
            });
        },
        setNextPageValue: function ( options, nextPage, ajaxTrigger ) {
            if ( typeof nextPage !== 'undefined' && nextPage !== '' && ! ajaxTrigger ) {
                options.next_page = nextPage;
            } else if ( ajaxTrigger ) {
                options.next_page = parseInt( options.next_page, 10 ) + 1;
            }
        },
        changeStandardHtml: function ( holder, maxPagesNum, nextPage, pagination_html ) {
            if ( holder.hasClass( 'mk-pagination-type--standard' ) ) {
                var paginationNav     = holder.find( '.mk-m-pagination' ),
                    paginationSpinner = holder.find( '.mk-m-pagination-spinner' );

                mkPagination.standardPaginationVisibility( paginationNav, maxPagesNum );

                paginationNav.remove();
                paginationSpinner.remove();

                holder.append( pagination_html );
                mkPagination.initStandard( holder, nextPage );
            }
        },
        addPosts: function ( itemsHolder, newItems, nextPage ) {
            if ( typeof nextPage !== 'undefined' && nextPage !== '' ) {
                itemsHolder.html( newItems );
            } else {
                itemsHolder.append( newItems );
            }
        },
        reInitMasonryPosts: function ( holder, itemsHolder ) {
            if ( holder.hasClass( 'mk-p-masonry-on' ) ) {
                itemsHolder.isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
                setTimeout( function () { itemsHolder.isotope( 'layout' ); }, 200 );
            }
        },
        triggerStandardScrollAnimation: function ( holder ) {
            if ( holder.hasClass( 'mk-pagination-type--standard' ) ) {
                $( 'html, body' ).animate( { scrollTop: holder.offset().top - 100 }, 500 ); // move to top after click on pagination link
            }
        },
        loadMoreButtonVisibility: function ( holder, options ) {
            if ( holder.hasClass( 'mk-pagination-type--load-more' ) ) {

                if ( options.next_page > options.max_pages_num || options.max_pages_num === 1 ) {
                    holder.find( '.mk-load-more-button' ).hide();
                } else if ( options.max_pages_num > 1 && options.next_page <= options.max_pages_num ) {
                    holder.find( '.mk-load-more-button' ).show();
                }
            }
        },
        scroll: function ( settings ) {
            this.holder = $( '.mk-pagination--on' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    var holder = $( this );
                    if ( holder.hasClass( 'mk-pagination-type--infinite-scroll' ) ) {
                        mkPagination.initInfiniteScroll( holder );
                    }
                });
            }
        },
        triggerLoadMore: function ( holder, nextPage ) {
            mkPagination.getNewPosts( holder, nextPage );
        },

    };

    // Portfolio Tooltip

    var mkInfoFollow = {
        init: function() {
            var $portfolioTooltip = $('.mk-portfolio-tooltip');
            if ($portfolioTooltip.length) {

                var getOptions = $portfolioTooltip.data( 'options' );

                mkAddons.body.append('<div class="mk-portfolio-tooptip-box mk-pf-tooltip-subtitle-'+ getOptions.subtitle_type +' mk-portfolio-tooptip-box-'+ getOptions.data_id +'"><div class="mk-portfolio-tooltip-box-wrap"><div class="mk-portfolio-tooltip-box-title"></div><div class="mk-portfolio-tooltip-box-subtitle"></div></div></div>');

                var $tooltipBox      = $('.mk-portfolio-tooptip-box'),
                    $tooltipTitle    = $tooltipBox.find('.mk-portfolio-tooltip-box-title'),
                    $tooltipSubtitle = $tooltipBox.find('.mk-portfolio-tooltip-box-subtitle');

                $portfolioTooltip.each(function() {

                    $portfolioTooltip.find('.mk-portfolio-wrap').each(function() {
                        var $this = $(this);
                        $this.on('mousemove', function(e) {
                            if (e.clientX + $tooltipBox.width() > mkAddons.windowWidth) {
                                $tooltipBox.addClass('mk-right');
                            } else {
                                $tooltipBox.removeClass('mk-right');
                            }
                            var x = e.clientX,
                                y = e.clientY;
                            TweenMax.to($tooltipBox, 0, {x: x, y: y});
                        });
                        $this.on('mouseenter', function() {

                            var $getTitle    = $(this).find('.mk-portfolio-title'),
                                $getSubTitle = $(this).find('.mk-portfolio-subtitle');

                            if ($getTitle.length)                        { $tooltipTitle.html($getTitle.clone()); }
                            if ($getSubTitle.length)                     { $tooltipSubtitle.html($getSubTitle.html()); }
                            if (!$tooltipBox.hasClass('mk-is-active')) { $tooltipBox.addClass('mk-is-active'); }

                        }).on('mouseleave', function() {
                            if ($tooltipBox.hasClass('mk-is-active')) {
                                $tooltipBox.removeClass('mk-is-active');
                            }
                        });
                    });
                });
            }
        }
    };

    // Appear Animation
    var mkGridItemLoad = {
        init: function() {
            this.holder = $( '.mk-grid--load:not(.mk-grid--loaded)' );

            function swmRandomArbitrary( min, max ) { return Math.floor( Math.random() * (max - min) + min ); }

            if ( this.holder.length ) {
                this.holder.each(
                    function () {
                        var holder      = $( this ),
                            randomNum   = swmRandomArbitrary(10, 400 ),
                            appearDelay = $( this ).attr( 'data-appear-delay' );

                        if ( ! appearDelay ) {
                            mkGridItemLoad.GridItemViewPort( holder, function () {
                                holder.addClass( 'mk-grid--loaded' );
                            });
                        } else {
                            appearDelay = (appearDelay === 'random') ? randomNum : appearDelay;
                            mkGridItemLoad.GridItemViewPort( holder, function () {
                                setTimeout( function () { holder.addClass( 'mk-grid--loaded' ); }, appearDelay );
                            });
                        }
                    });
            }
        },
        GridItemViewPort:function($element, callback, onlyOnce) {
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
        }

    };

    var mkGridParallaxEffect = {

        init: function () {
            let $holder = $( '.mk-p-grid.mk-parallax-scroll-on' );

            if ( $holder.length ) {
                $holder.each( function (i) {
                    let $thisHolder = $( this );
                    mkGridParallaxEffect.initItem($thisHolder, i);
                });
            }
        },
        initItem: function ($holder, i){
            let $articles = $holder.find('.mk-grid-item');

            $articles.each( function (i) {
                let $thisHolder = $( this ),
                    randomScrub = (1.5 + gsap.utils.random(0, .7, .15)).toFixed(2);//num beetween 1.5 and 2.2
                mkGridParallaxEffect.initParallax($thisHolder, i, randomScrub);
            });

        },
        initParallax: function ($holder, i, randomScrub){
            let $image = $holder.find('.mk-post-grid-image img'),
                maxYMove = 6,
                yScrollModifier = gsap.utils.random([1, .86, .73]),
                moveY = i % 2 === 0 ? maxYMove * yScrollModifier : - maxYMove * yScrollModifier,
                scrub = Number.parseFloat(randomScrub);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: $holder,
                    scrub: scrub,
                    start: () => { return "center bottom" },
                    end: () => { return "bottom top"; },
                    // markers: true,
                }
            });

            tl.fromTo ( $image, { yPercent: moveY, }, { yPercent: "*=-1", } )
        }
    };

    // --------------------------------------------------

    mkAddons.mkFilter             = mkFilter;
    mkAddons.mkMasonryLayout      = mkMasonryLayout;
    mkAddons.mkPagination         = mkPagination;
    mkAddons.mkWaitForImages      = mkWaitForImages;
    mkAddons.mkInfoFollow         = mkInfoFollow;
    mkAddons.mkGridItemLoad       = mkGridItemLoad;
    mkAddons.mkGridParallaxEffect = mkGridParallaxEffect;

    $(document).ready(function() {
        scroll = $( window ).scrollTop();
        mkGridItemLoad.init();
        mkPagination.init();
        mkFilter.init();
        mkMasonryLayout.init();
        mkInfoFollow.init();
        mkGridParallaxEffect.init();

        $( window ).scroll( function () {
            mkAddons.scroll = $( window ).scrollTop();
            mkAddons.mkPagination.scroll();
        });

        $( window ).resize( function () {
            mkAddons.windowWidth = $( window ).width();
            mkAddons.windowHeight = $( window ).height();
            if (!$("body").hasClass("elementor-editor-active")) {
                mkAddons.mkMasonryLayout.reInit();
            }

        });

        $( document ).on('mk_trigger_get_new_posts', function ( event, holder ) {
            if ( holder.hasClass( 'mk-filter--on' ) )   { holder.removeClass( 'mk--filter-loading' ); }
            if ( holder.hasClass( 'mk-p-masonry-on' ) ) { mkAddons.mkMasonryLayout.init(); }
            mkGridItemLoad.init();
        });

        $( document ).on('mk_trigger_load_more', function ( event, holder, nextPage ) {
            mkAddons.mkPagination.triggerLoadMore( holder, nextPage );
        });

    });

    $( document ).on('mk_trigger_get_new_posts', function ( event, holder ) {
        if ( $('.mk-portfolio-tooptip-box').length ) {
            $('.mk-portfolio-tooptip-box').remove();
        }
         mkInfoFollow.init();
         mkGridItemLoad.init();
    });


    // Initiate functions
    var mkGridItems = function () {
        var isEditMode = Boolean( elementorFrontend.isEditMode() );
        if (isEditMode) {
            mkAddons.scroll = $( window ).scrollTop();
            mkAddons.mkPagination.init();
            mkAddons.mkFilter.init();
            mkAddons.mkMasonryLayout.init();
            mkAddons.mkInfoFollow.init();
            mkAddons.mkGridItemLoad.init();
            mkAddons.mkGridParallaxEffect.init();
            mkAddons.body.mkEyeCursor.init();
        }
    }

    mkAddons.widgetsList.mk_blog_posts = {};
    mkAddons.widgetsList.mk_blog_posts.mkGridItems = mkGridItems;

    mkAddons.widgetsList.mk_portfolio_modern = {};
    mkAddons.widgetsList.mk_portfolio_modern.mkGridItems = mkGridItems;

    mkAddons.widgetsList.mk_portfolio_tooltip = {};
    mkAddons.widgetsList.mk_portfolio_tooltip.mkGridItems = mkGridItems;

    // End Post Grid ---------------------------------------------

    // ------------------------------------------------------------
    // Filterable Gallery --------------------------------------------------
    // ------------------------------------------------------------

    var mkGallery = {
        init: function () {

            var $galleryDiv = $('.mk-filterable-gallery');

            if ( $galleryDiv.length ) {
                var $isoGrid    = $galleryDiv.children('.mk-filterable-gallery-grid'),
                    $btns       = $galleryDiv.children('.mk-filterable-gallery-btns'),
                    is_rtl      = $galleryDiv.data('rtl') ? false : true,
                    layout      = $galleryDiv.data('layout');

                    $galleryDiv.imagesLoaded( function(is_rtl) {
                        if ( 'masonry' == layout ) {

                            var holder = $galleryDiv.find('.mk-gal-masonry-on');
                            if ( holder.length ) {
                                holder.each( function () {
                                    mkGallery.createMasonry( $( holder ),$btns,is_rtl );
                                });
                            }

                        } else {
                            var $grid = $isoGrid.isotope({
                                itemSelector: '.mk-filterable-gallery-item',
                                layoutMode: 'fitRows',
                                originLeft: is_rtl
                            });
                            mkAddons.mkGallery.itemsFilter($grid,$btns,is_rtl);

                        }

                    });

                mkScrollLoad.init();
                mkItemParallaxEffect.init();

            }
        },
        reInit: function () {
            var $holder = $('.mk-gal-masonry-on');
            if ( $holder.length ) {
                $holder.each( function () {
                    var masonryDiv = $( $holder ).find( '.mk-gallery-grid-inner' );

                    if ( typeof masonryDiv.isotope === 'function' ) {
                        masonryDiv.isotope( 'layout' );
                    }
                });
            }
        },
        createMasonry: function ( holder,$btns,is_rtl ) {
            var masonryDiv   = holder.find( '.mk-gallery-grid-inner' ),
                $masonryItem = masonryDiv.find( '.mk-filterable-gallery-item' );

            mkAddons.mkWaitForImages.check( masonryDiv, function () {
            // mkGallery.mkWaitForImages( masonryDiv, function () {
                    if ( typeof masonryDiv.isotope === 'function' ) {
                        var $grid = masonryDiv.isotope({
                            layoutMode: 'packery',
                            itemSelector: '.mk-filterable-gallery-item',
                            percentPosition: true,
                            // originLeft: $is_rtl,
                            masonry: {
                                columnWidth: '.mk-gallery-grid-masonry-sizer',
                                gutter: '.mk-gallery-grid-masonry-gutter'
                            }
                        });

                        if ( holder.hasClass( 'mk-items--packery' ) ) {
                            var size = mkGallery.getPackeryImageSize( masonryDiv, $masonryItem );
                            mkGallery.setPackeryImageProportionSize( masonryDiv, $masonryItem, size );
                        }

                        masonryDiv.isotope( 'layout' );
                        mkAddons.mkGallery.itemsFilter($grid,$btns,is_rtl);
                    }

                    masonryDiv.addClass( 'mk-gal--masonry-init' );
            });
        },
        getPackeryImageSize: function ( $holder, $item ) {
            var $squareItem = $holder.find( '.mk-item--square' );
            if ( $squareItem.length ) {

                var $squareItemImage      = $squareItem.find( 'img' ),
                    squareItemImageWidth  = $squareItemImage.width(),
                    squareItemImageHeight = $squareItemImage.height();

                if ( squareItemImageWidth !== squareItemImageHeight ) {
                    return squareItemImageHeight;
                } else {
                    return squareItemImageWidth;
                }
            } else {
                var size    = $holder.find( '.mk-gallery-grid-masonry-sizer' ).width(),
                    padding = parseInt( $item.css( 'paddingLeft' ), 10 );

                return (size - 2 * padding); // remove item side padding to get real item size
            }
        },
        setPackeryImageProportionSize: function ( $holder, $item, size ) {
            var padding          = parseInt( $item.css( 'paddingLeft' ), 10 ),
                $squareItem      = $holder.find( '.mk-item--square' ),
                $horizontalItem  = $holder.find( '.mk-item--horizontal' ),
                $verticalItem    = $holder.find( '.mk-item--vertical' ),
                $largeSquareItem = $holder.find( '.mk-item--large-square' ),
                isMobileScreen   = mkAddons.windowWidth <= 680;

            $item.css( 'height', size );

            if ( $horizontalItem.length ) {
                $horizontalItem.css( 'height', Math.round( size / 2 ) );
            }

            if ( $verticalItem.length ) {
                $verticalItem.css( 'height', Math.round( 2 * (size + padding) ) );
            }

            if ( ! isMobileScreen ) {

                if ( $horizontalItem.length ) {
                    $horizontalItem.css( 'height', size );
                }

                if ( $largeSquareItem.length ) {
                    $largeSquareItem.css( 'height', Math.round( 2 * (size + padding) ) );
                }
            }
        },
        itemsFilter: function( $grid, $btns, $is_rtl ) {
            $btns.on('click', 'a', function () {
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue,
                    originLeft: $is_rtl
                });

                window.swm_animation_display( $grid );
                return false;
            });

            $btns.each(function (i, btns) {
                var btns = $(btns);

                btns.on('click', '.mk-filterable-gallery-btn', function () {
                    btns.find('.is-checked').removeClass('is-checked');
                    $(this).addClass('is-checked');
                });
            });
        }
    };

    mkAddons.mkGallery = mkGallery;

    $( window ).resize(function () {
        if (!$("body").hasClass("elementor-editor-active")) {
            mkAddons.mkGallery.reInit();
        }
    });

    $( document ).ready( function () {
        mkGallery.init();
    });

    // Initiate functions
    var mkFilterableGallery = function () {
        var isEditMode = Boolean( elementorFrontend.isEditMode() );
        if (isEditMode) {
            mkAddons.scroll = $( window ).scrollTop();
            mkAddons.mkGallery.init();
        }
    }

    mkAddons.widgetsList.mk_filterable_gallery = {};
    mkAddons.widgetsList.mk_filterable_gallery.mkFilterableGallery = mkFilterableGallery;

    // ----------------------------------------------------------

    // End Filterable Gallery ---------------------------------------------


    $(window).on('elementor/frontend/init', function () {

        for ( var key in mkAddons.widgetsList ) {
            for ( var keyChild in mkAddons.widgetsList[key] ) {
                elementorFrontend.hooks.addAction('frontend/element_ready/' + key + '.default', mkAddons.widgetsList[key][keyChild]);
            }
        }

        // Link 'Edit layout'
        jQuery( '.mk_section_editor_link:not(.inited)' )
            .addClass('inited')
            .on( 'click', function(e) {
                e.stopImmediatePropagation();
                return true;
            });
        });

})(jQuery);