(function ($) {

    'use strict';

    $.fn.mkParallax = function () {
        return this.each( function() {
            var $this = $(this),
                textShrinkClass  = 'mk-plx-textShrink',
                textStretchClass = 'mk-plx-textStretch',
                fadeInClass      = 'mk-plx-fadeIn',
                fadeOutClass     = 'mk-plx-fadeOut',
                zoomInClass      = 'mk-plx-zoomIn',
                zoomOutClass     = 'mk-plx-zoomOut',
                rotateXClass     = 'mk-plx-rotateX',
                rotateYClass     = 'mk-plx-rotateY',
                rotateZClass     = 'mk-plx-rotateZ',
                moveTopClass     = 'mk-plx-moveTop',
                moveBottomClass  = 'mk-plx-moveBottom',
                moveLeftClass    = 'mk-plx-moveLeft',
                moveRightClass   = 'mk-plx-moveRight',

                ltrSpacing       = parseFloat( $this.css( 'letterSpacing' ).replace(/px|em|rem/, '') ),
                defaultLtrSpacing = 30,
                shrinkSize       = ltrSpacing ? ltrSpacing : defaultLtrSpacing,
                curShrinkSize    = shrinkSize,
                stretchSize      = ltrSpacing ? ltrSpacing : 0,
                curStretchSize   = 30,

                opacity          = parseFloat( $this.css( 'opacity' ) ),
                defaultOpacity   = opacity ? opacity : 0,
                curOpacityIn     = defaultOpacity,
                curOpacityOut    = opacity ? opacity : 1,

                zoomScale        = parseFloat( $this.data( 'zoom' ) ),
                zoomScale        = zoomScale ? zoomScale : 3,
                curZoomIn        = zoomScale,
                curZoomOut       = zoomScale,

                rotateSize       = parseFloat( $this.data( 'rotate' ) ),
                rotateSize       = rotateSize ? rotateSize : 180,
                curRotateX       = rotateSize,
                curRotateY       = rotateSize,
                curRotateZ       = rotateSize,

                moveSize         = parseFloat( $this.data( 'move' ) ),
                moveSize         = moveSize ? moveSize : 500,
                curMoveTop       = moveSize,
                curMoveBottom    = moveSize,
                curMoveLeft      = moveSize,
                curMoveRight     = moveSize,

                elHeight         = $this.outerHeight(),
                elTop            = $this.offset().top,
                elArea           = elHeight + elTop,
                winHeight        = $( window ).outerHeight(),
                winHeight        = winHeight + 60,
                winTop           = window.pageYOffset - 30;

            function currentPercent(curSize, pos) {
                return (curSize / 100) * pos;
            }

            $( window ).on( 'load', function() {
                var loadTransform = '';

                if ( elTop > (winTop + winHeight) ) {
                    curMoveTop      = 0;
                    curMoveBottom   = 0;
                    curMoveRight    = 0;
                    curMoveLeft     = 0;
                    curZoomIn       = 1;
                    curStretchSize  = 0;
                } else if ( winTop > elArea ) {
                    curMoveTop      = moveSize;
                    curMoveBottom   = moveSize;
                    curMoveRight    = moveSize;
                    curMoveLeft     = moveSize;
                    curZoomOut      = 1;
                    curOpacityOut   = 0;
                    curOpacityIn    = 1;
                    curShrinkSize   = 0;
                } else if ( (winTop + winHeight) > elTop && elArea > winTop ) {
                    var pos         = ( (elTop - winTop) / winHeight ) * 100;
                    var negPos      = 100 - pos;

                        curMoveTop  = currentPercent( moveSize, negPos );
                        curMoveRight= currentPercent( moveSize, negPos );
                        curMoveLeft = currentPercent( moveSize, negPos );
                        curMoveBottom= currentPercent( moveSize, negPos );

                        curRotateZ  = currentPercent( rotateSize, pos );
                        curRotateY  = currentPercent( rotateSize, pos );
                        curRotateX  = currentPercent( rotateSize, pos );

                        curZoomOut  = currentPercent( zoomScale, pos );
                        curZoomOut  = (curZoomOut < 1) ? 1 : curZoomOut;
                        curZoomIn   = currentPercent( zoomScale, negPos );
                        curZoomIn   = (curZoomIn > zoomScale) ? zoomScale : curZoomIn;

                        curOpacityOut = currentPercent( 1, pos );
                        curOpacityOut = (curOpacityOut < 0) ? 0 : curOpacityOut;
                        curOpacityIn = currentPercent( 1, negPos );

                        curShrinkSize = currentPercent( shrinkSize, pos );
                        curShrinkSize = (curShrinkSize < 0) ? 0 : curShrinkSize;
                        curStretchSize = currentPercent( defaultLtrSpacing, negPos );
                }

                if ( $this.hasClass( moveTopClass ) ) {
                    loadTransform += 'translateY(-' + curMoveTop + 'px) ';
                } else if ( $this.hasClass( moveRightClass ) ) {
                    loadTransform += 'translateX(' + curMoveRight + 'px) ';
                } else if ( $this.hasClass( moveLeftClass ) ) {
                    loadTransform += 'translateX(-' + curMoveLeft + 'px) ';
                } else if ( $this.hasClass( moveBottomClass ) ) {
                    loadTransform += 'translateY(' + curMoveBottom + 'px) ';
                }

                if ( $this.hasClass( rotateZClass ) ) {
                    loadTransform += 'rotateZ(' + curRotateZ + 'deg) ';
                } else if ( $this.hasClass( rotateYClass ) ) {
                    loadTransform += 'rotateY(' + curRotateY + 'deg) ';
                } else if ( $this.hasClass( rotateXClass ) ) {
                    loadTransform += 'rotateX(' + curRotateX + 'deg) ';
                }

                if ( $this.hasClass( zoomInClass ) ) {
                    loadTransform += 'scale(' + curZoomIn + ') ';
                } else if ( $this.hasClass( zoomOutClass ) ) {
                    loadTransform += 'scale(' + curZoomOut + ') ';
                }


                if ( loadTransform ) {
                    $this.css({
                        transform: loadTransform,
                    });
                }

                if ( $this.hasClass( fadeInClass ) ) {
                    $this.css({
                        opacity: curOpacityIn,
                    });
                } else if ( $this.hasClass( fadeOutClass ) ) {
                    $this.css({
                        opacity: curOpacityOut,
                    });
                }

                if ( $this.hasClass( textShrinkClass ) ) {
                    $this.css({
                        letterSpacing: curShrinkSize + 'px',
                    });
                } else if ( $this.hasClass( textStretchClass ) ) {
                    $this.css({
                        letterSpacing: curStretchSize + 'px',
                    });
                }
            });

            $( window ).on( 'scroll', function() {
                var newWinTop = window.pageYOffset - 30;
                var scrollTransform  = '';

                if ( (newWinTop + winHeight) > elTop && elArea > newWinTop ) {
                    var pos         = ( (elTop - newWinTop) / winHeight ) * 100;
                    var negPos = 100 - pos;

                        curMoveTop  = currentPercent( moveSize, negPos );
                        curMoveRight= currentPercent( moveSize, negPos );
                        curMoveLeft = currentPercent( moveSize, negPos );
                        curMoveBottom= currentPercent( moveSize, negPos );
                        curRotateZ  = currentPercent( rotateSize, pos );
                        curRotateY  = currentPercent( rotateSize, pos );
                        curRotateX  = currentPercent( rotateSize, pos );
                        curZoomOut  = currentPercent( zoomScale, pos );
                        curZoomIn   = currentPercent( zoomScale, negPos );
                        curOpacityOut = currentPercent( 1, pos );
                        curOpacityIn = currentPercent( 1, negPos );
                        curShrinkSize = currentPercent( shrinkSize, pos );
                        curStretchSize = currentPercent( defaultLtrSpacing, negPos );

                    if ( $this.hasClass( moveTopClass ) && curMoveTop > 0 ) {
                        scrollTransform += 'translateY(-' + curMoveTop + 'px) ';
                    } else if ( $this.hasClass( moveRightClass ) && curMoveRight > 0 ) {
                        scrollTransform += 'translateX(' + curMoveRight + 'px) ';
                    } else if ( $this.hasClass( moveLeftClass ) && curMoveLeft > 0 ) {
                        scrollTransform += 'translateX(-' + curMoveLeft + 'px) ';
                    } else if ( $this.hasClass( moveBottomClass ) && curMoveBottom > 0 ) {
                        scrollTransform += 'translateY(' + curMoveBottom + 'px) ';
                    }

                    if ( $this.hasClass( rotateZClass ) && curRotateZ >= 0 ) {
                        scrollTransform += 'rotateZ(' + curRotateZ + 'deg) ';
                    } else if ( $this.hasClass( rotateYClass ) && curRotateY >= 0 ) {
                        scrollTransform += 'rotateY(' + curRotateY + 'deg) ';
                    } else if ( $this.hasClass( rotateXClass ) && curRotateX >= 0 ) {
                        scrollTransform += 'rotateX(' + curRotateX + 'deg) ';
                    }

                    if ( $this.hasClass( zoomInClass ) && curZoomIn <= zoomScale ) {
                        scrollTransform += 'scale(' + curZoomIn + ') ';
                    } else if ( $this.hasClass( zoomOutClass ) && curZoomOut <= zoomScale ) {
                        scrollTransform += 'scale(' + curZoomOut + ') ';
                    }

                    if ( scrollTransform ) {
                        $this.css({
                            transform: scrollTransform,
                        });
                    }

                    if ( $this.hasClass( fadeInClass ) && curOpacityIn <= 1 && curOpacityIn >= 0 ) {
                        $this.css({
                            opacity: curOpacityIn,
                        });
                    } else if ( $this.hasClass( fadeOutClass ) && curOpacityOut <= 1 && curOpacityOut >= 0 ) {
                        $this.css({
                            opacity: curOpacityOut,
                        });
                    }

                    if ( $this.hasClass( textShrinkClass ) && curShrinkSize >= 0 ) {
                        $this.css({
                            letterSpacing: curShrinkSize + 'px',
                        });
                    } else if ( $this.hasClass( textStretchClass ) && curStretchSize >= stretchSize ) {
                        $this.css({
                            letterSpacing: curStretchSize + 'px',
                        });
                    }
                }
            });
        });
    }

    function mkParallaxAnimationExt($scope) {
        function callMousemove(e, elem) {
            var $this = $(elem);
            var target = $this.find('.mk-parallax-item');
            var relX = e.pageX - $this.offset().left;
            var relY = e.pageY - $this.offset().top;

            target.each(function(index, el) {
                var $el = $(this);
                var movement = $el.data('velocity');

                TweenMax.to($el, 1, {
                    x: (relX - $this.width() / 2) / $this.width() * movement,
                    y: (relY - $this.height() / 2) / $this.height() * movement,
                    ease: Power2.easeOut
                });
            });
        }

        var mkTimeout;
        var $section = $($scope);
        var $sectionID = $section.data('id');

        if ( $section.hasClass('mk-parallax-yes') ) {
            var mkParallaxWrapperSelector = '.mk-parallax-wrap-'+ $sectionID;
            var mkParallaxWrapSelector = '.mk-parallax-wrap.mk-parallax-wrap-'+ $sectionID;
            var $mkParallaxWrapDetach = $section.siblings( mkParallaxWrapperSelector ).detach();
            $section.prepend($mkParallaxWrapDetach);

            var $parallax = $( mkParallaxWrapperSelector ).find('.mk-parallax');
            $parallax.mkParallax();

            $(mkParallaxWrapSelector).on('mousemove', function (e) {
                if ( mkTimeout ) {
                    clearTimeout(mkTimeout);
                }
                mkTimeout = setTimeout(callMousemove(e, this), 100);
            });
        }

    }

    function mkScrollAnimationExt($scope) {

        var widgetExt    = mkElemFrontendObject(elementorFrontend,$scope),
            breakpoints  = elementorFrontend.config.breakpoints;

        if(typeof widgetExt != 'undefined') {

            //Begin scroll animation
            if(typeof widgetExt.mk_ext_is_scrollme != 'undefined' && widgetExt.mk_ext_is_scrollme == 'true') {
                var scrollArgs = {};
                if(typeof widgetExt.mk_ext_scrollme_scalex.size != 'undefined' && widgetExt.mk_ext_scrollme_scalex.size != 1)         { scrollArgs['scaleX']  = widgetExt.mk_ext_scrollme_scalex.size; }
                if(typeof widgetExt.mk_ext_scrollme_scaley.size != 'undefined' && widgetExt.mk_ext_scrollme_scaley.size != 1)         { scrollArgs['scaleY']  = widgetExt.mk_ext_scrollme_scaley.size; }
                if(typeof widgetExt.mk_ext_scrollme_scalez.size != 'undefined' && widgetExt.mk_ext_scrollme_scalez.size != 1)         { scrollArgs['scaleZ']  = widgetExt.mk_ext_scrollme_scalez.size; }
                if(typeof widgetExt.mk_ext_scrollme_rotatex.size != 'undefined' && widgetExt.mk_ext_scrollme_rotatex.size != 0)       { scrollArgs['rotateX'] = widgetExt.mk_ext_scrollme_rotatex.size; }
                if(typeof widgetExt.mk_ext_scrollme_rotatey.size != 'undefined' && widgetExt.mk_ext_scrollme_rotatey.size != 0)       { scrollArgs['rotateY'] = widgetExt.mk_ext_scrollme_rotatey.size; }
                if(typeof widgetExt.mk_ext_scrollme_rotatez.size != 'undefined' && widgetExt.mk_ext_scrollme_rotatez.size != 0)       { scrollArgs['rotateY'] = widgetExt.mk_ext_scrollme_rotatez.size; }
                if(typeof widgetExt.mk_ext_scrollme_translatex.size != 'undefined' && widgetExt.mk_ext_scrollme_translatex.size != 0) { scrollArgs['x']       = widgetExt.mk_ext_scrollme_translatex.size; }
                if(typeof widgetExt.mk_ext_scrollme_translatey.size != 'undefined' && widgetExt.mk_ext_scrollme_translatey.size != 0) { scrollArgs['y']       = widgetExt.mk_ext_scrollme_translatey.size; }
                if(typeof widgetExt.mk_ext_scrollme_translatez.size != 'undefined' && widgetExt.mk_ext_scrollme_translatez.size != 0) { scrollArgs['z']       = widgetExt.mk_ext_scrollme_translatez.size; }
                if(typeof widgetExt.mk_ext_scrollme_smoothness.size != 'undefined')                                                     { scrollArgs['smoothness'] = widgetExt.mk_ext_scrollme_smoothness.size; }

                $scope.attr('data-parallax', JSON.stringify(scrollArgs));

                if(typeof widgetExt.mk_ext_scrollme_disable != 'undefined') {
                    if(widgetExt.mk_ext_scrollme_disable == 'mobile') {
                        if(parseInt(jQuery(window).width()) < breakpoints.sm) { $scope.addClass('noanimation'); }
                    }

                    if(widgetExt.mk_ext_scrollme_disable == 'tablet') {
                        if(parseInt(jQuery(window).width()) < breakpoints.md ) { $scope.addClass('noanimation'); }
                    }

                    jQuery(window).resize(function() {
                        if(widgetExt.mk_ext_scrollme_disable == 'mobile') {
                            if(isMobileDevice() || parseInt(jQuery(window).width()) < breakpoints.sm) {
                                $scope.addClass('noanimation');
                            } else {
                                $scope.removeClass('noanimation');
                            }
                        }

                        if(widgetExt.mk_ext_scrollme_disable == 'tablet') {
                            if(parseInt(jQuery(window).width()) < breakpoints.md) {
                                $scope.addClass('noanimation');
                            } else {
                                $scope.removeClass('noanimation');
                            }
                        }
                    });
                }

            }

        }
    }

    function mkInfiniteAnimationExt($scope) {
        var widgetExt = mkElemFrontendObject(elementorFrontend,$scope);

        if(typeof widgetExt != 'undefined') {

            //Begin infinite animation
            if(typeof widgetExt.mk_ext_is_infinite != 'undefined' && widgetExt.mk_ext_is_infinite == 'true') {
                var animationClass = '',
                    keyframeName = '',
                    animationCSS = '',
                    alternateAnim = ' alternate';

                if(typeof widgetExt.mk_ext_infinite_animation != 'undefined') {
                    animationClass = widgetExt.mk_ext_infinite_animation;
                    switch(animationClass) {
                        case 'if_swing1': keyframeName = 'swing';                     break;
                        case 'if_swing2': keyframeName = 'swing2';                    break;
                        case 'if_wave':   keyframeName = 'wave';   alternateAnim =''; break;
                        case 'if_tilt':   keyframeName = 'tilt';                      break;
                        case 'if_bounce': keyframeName = 'bounce';                    break;
                        case 'if_scale':  keyframeName = 'scale';                     break;
                        case 'if_spin':   keyframeName = 'spin';                      break;
                        case 'if_spin2':  keyframeName = 'spin';   alternateAnim =''; break;
                    }

                    animationCSS+= keyframeName+' ';
                }
                //alert(widgetExt.mk_ext_infinite_duration);
                if(typeof widgetExt.mk_ext_infinite_duration != 'undefined') {
                    animationCSS+= widgetExt.mk_ext_infinite_duration+'s ';
                }

                animationCSS+= 'infinite' + alternateAnim + ' ';

                if(typeof widgetExt.mk_ext_infinite_easing != 'undefined') {
                    animationCSS+= 'cubic-bezier('+widgetExt.mk_ext_infinite_easing+')';
                }
                //alert(animationCSS);
                $scope.css({'animation' : animationCSS});
                $scope.addClass(animationClass);
            }
            //End infinite animation

        }
    }

    function mkStickySectionExt($scope) {
        if (!$('body').hasClass('elementor-editor-active')) {

            var widgetExt = mkElemFrontendObject(elementorFrontend,$scope);

            if(typeof widgetExt != 'undefined') {

                if(typeof widgetExt.mk_ext_is_sticky != 'undefined' && widgetExt.mk_ext_is_sticky == 'true') {

                    var stickyElement = $scope;
                    var topSpacing = 50;
                    if(typeof widgetExt.mk_ext_sticky_top_spacing != 'undefined') {
                        topSpacing = parseInt(widgetExt.mk_ext_sticky_top_spacing.size);
                    }

                    var hideStickyResolution = 768;
                    if(typeof widgetExt.mk_ext_hide_sticky_resolution != 'undefined') {
                        hideStickyResolution = parseInt(widgetExt.mk_ext_hide_sticky_resolution.size);
                    }

                    stickyElement.theiaStickySidebar({
                        'additionalMarginTop': topSpacing,
                        'minWidth': hideStickyResolution
                    });

                }
            }
        }
    }

    function mkClipAnimationExt($scope) {
        var $section = $($scope);
        var $sectionID = $section.data('id');

        if ( $section.hasClass('mk-clips-animation-yes') ) {
            var mkClipsWrapSelector = '.mk-clips-anim-wrap-'+ $sectionID;
            var $mkClipsWrapDetach = $section.siblings( mkClipsWrapSelector ).detach();
            $section.prepend($mkClipsWrapDetach);

            var $clips = $( mkClipsWrapSelector ).find('.mk-clips-anim');
            $clips.each(function(index, el) {
                var $this = $(this);
                var data = $this.data('clips-anim');

                anime({
                    targets: this,
                    translateX: data.moveX,
                    translateY: data.moveY,
                    scaleX: data.zoomX,
                    scaleY: data.zoomY,
                    skewX: data.skewX,
                    skewY: data.skewY,
                    rotateX: data.rotateX,
                    rotateY: data.rotateY,
                    rotateZ: data.rotateZ,
                    opacity: data.fade,
                    easing: data.easing,
                    loop: true,
                    duration: data.duration,
                    delay: data.delay,
                    direction: 'alternate',
                });
            });
        }
    }

    function mkParallaxCalc($holder) {

        $holder.speed           = (Math.random() * .2 + 1.06).toFixed(2); //if 1 no effect will be applied, use values between -1 and 2
        $holder.speedNormalized = ($holder.speed - 1).toFixed(2);

        $holder.$imgInner.css( {
            'top': - Math.abs( $holder.speedNormalized  * 100 ) + '%',
            'height': 100 +  Math.abs( $holder.speedNormalized * 100 ) + '%'
        } );

        var wH = $holder.$imgHolder.height(),
            wW = $holder.$imgHolder.width(),
            heightDiff = $holder.$img.height() - wH,
            widthDiff = $holder.$img.width() - wW;

        if ( widthDiff < 0 && widthDiff <= heightDiff  ) {
            $holder.$img.css({ 'width': '100%', 'height': 'auto' } );
        }

        if ( heightDiff < 0 && heightDiff <= widthDiff ) {
            $holder.$img.css({ 'height': '100%', 'width': 'auto', 'max-width': 'unset', } );
        }
    }

    function mkParallaxBasic($scope) {

        var $body         = $( 'body' ),
            $html         = $( 'html' );

        let $holder = $scope.find('.mk-parallax-basic-wrap');

        var isSupported = ! $html.hasClass( 'mk--touch' ) && ! $body.hasClass( 'swm-browser--edge' ) && ! $body.hasClass( 'swm-browser--ms-explorer' );

        if ( $holder.length && isSupported ) {

            $holder.container  = $holder.find( '.mk-parallax-basic-wrap' );
            $holder.$imgInner  = $holder.find( '.mk-parallax-basic-inner' );
            $holder.$imgHolder = $holder.find( '.mk-parallax-basic-img-holder' );
            $holder.$img       = $holder.find( 'img.mk-parallax-basic-img' );

            swmTheme.swmWaitForImages( $holder, function () {

                $holder.$imgInner.animate( { opacity: 1 }, 1000 );
                mkParallaxCalc($holder);

                $holder.each( function (i) {

                    if ( $holder.speedNormalized == 0 ) return;

                    var maxY = Math.round($holder.outerHeight() * $holder.speedNormalized - 10),//10 arbitrary num to avoid glitches
                        duration = Math.random() * .5 + .3;
                        duration = .7;

                    gsap.registerPlugin(ScrollTrigger);

                    if ( $(window).width() >= 1024 ) {
                        const tl = gsap.timeline({
                            defaults: {duration: 1},
                            scrollTrigger: {
                                trigger: $holder,
                                scrub: true,
                                start: () => { return "top bottom"},
                                end: () => { return "bottom top"; },
                                onUpdate: (self) => {
                                    if (i === 0 || 5 > 4){
                                        gsap.to ( $holder.$imgHolder, {
                                                y : maxY * self.progress.toFixed(2),
                                                duration: duration,
                                        })
                                    }
                                }
                            }
                        });
                    }

                });

            });

            $( window ).on('resize', function () {
                mkParallaxCalc($holder);
            });

        }

    }

    function mkParallaxBasicExt($scope) {

        var $section = $($scope);
        var $sectionID = $section.data('id');

        // move code inside elementor section/container div
        if ( $section.hasClass('mk-parallax-basic-yes') ) {
            var mkParallaxBasicSelector = '.mk-parallax-basic-wrap-'+ $sectionID;
            var mkParallaxWrapSelector = '.mk-parallax-basic-wrap.mk-parallax-basic-wrap-'+ $sectionID;
            var $mkParallaxWrapDetach = $section.siblings( mkParallaxBasicSelector ).detach();
            $section.prepend($mkParallaxWrapDetach);
            var $parallax = $( mkParallaxBasicSelector ).find('.mk-parallax');
            mkParallaxBasic($scope)
        }

    }


    $( window ).on('elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/section', mkParallaxAnimationExt );
        elementorFrontend.hooks.addAction('frontend/element_ready/container', mkParallaxAnimationExt );
        elementorFrontend.hooks.addAction('frontend/element_ready/global', mkScrollAnimationExt);
        elementorFrontend.hooks.addAction('frontend/element_ready/global', mkInfiniteAnimationExt);
        elementorFrontend.hooks.addAction('frontend/element_ready/global', mkStickySectionExt);
        elementorFrontend.hooks.addAction('frontend/element_ready/section', mkClipAnimationExt );
        elementorFrontend.hooks.addAction('frontend/element_ready/container', mkClipAnimationExt );
        elementorFrontend.hooks.addAction('frontend/element_ready/section', mkParallaxBasicExt );
        elementorFrontend.hooks.addAction('frontend/element_ready/container', mkParallaxBasicExt );
    });

    var $animationElements = $(".mk-colors-anim-yes");
    $animationElements.each(function(index, el) {
        var $elem  = $(el);
        var data   = $elem.data('mk-anim-colors');
        var length = data.colors.length;
        var colors = data.colors.toString();

        if ( 'hor-moving' == data.type ) {
            $elem.css({
                'background-color' : data.colors[0], // For browsers that do not support gradients
                'background-image' : 'linear-gradient('+ data.angle +'deg,'+ colors +')',
                'background-size' : length +'00% 100%',
            });
        } else if ( 'ver-moving' == data.type ) {
            $elem.css({
                'background-color' : data.colors[0], // For browsers that do not support gradients
                'background-image' : 'linear-gradient('+ data.angle +'deg,'+ colors +')',
                'background-size' : '100%'+ length +'00%',
            });
        }
    });

})(jQuery);