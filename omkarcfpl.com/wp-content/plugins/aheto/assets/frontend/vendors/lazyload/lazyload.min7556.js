jQuery(function (t) {
    (t.fn.ahetolazy = function (e, a) {
        var o,
            n = t(window),
            i = e || 0,
            r = window.devicePixelRatio > 1 ? "data-lazy-src-retina" : "data-lazy-src",
            l = this;

        function s() {
            var e = l.filter(function () {
                var e = t(this),
                    a = n.scrollTop(),
                    o = a + n.height(),
                    r = e.offset().top;
                return r + e.height() >= a - i && r <= o + i;
            });
            (o = e.trigger("ahetolazy")), (l = l.not(o));
        }

        return (
            this.one("ahetolazy", function () {
                var e = this.getAttribute(r);
                (e = e || this.getAttribute("data-lazy-src")) &&
                (this.setAttribute("src", e),
                t(this).hasClass("js-bg") &&
                (t(this)
                    .parent()
                    .css("background-image", "url(" + e + ")"),
                    t(this).hide())),
                "function" == typeof a && a.call(this);
            }),
                n.on("load.ahetolazy scroll.ahetolazy resize.ahetolazy lookup.ahetolazy", s),
                s(),
                this
        );
    }),
        t("img[data-lazy-src]").ahetolazy(),
        t(window).on("elementor/frontend/init", function () {
            window.location.href.indexOf("elementor-preview") > -1 &&
            elementorFrontend.hooks.addAction("frontend/element_ready/widget", function () {
                t("body").addClass("aheto-lazyload"), t("img[data-lazy-src]").ahetolazy();
            });
        });
}),
    (function (t) {
        "use strict";
        t(() => {
            t("body").addClass("aheto-lazyload");
        });
    })(jQuery);
