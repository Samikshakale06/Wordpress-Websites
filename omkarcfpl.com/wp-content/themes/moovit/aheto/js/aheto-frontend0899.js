;(function ($, window, document, undefined) {
    $(window).on('load', function () {
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"))
        }, 200);
    });
})(jQuery, window, document);