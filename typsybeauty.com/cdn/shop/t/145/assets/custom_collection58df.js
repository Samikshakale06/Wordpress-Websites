/** Shopify CDN: Minification failed

Line 39:0 The JSX syntax extension is not currently enabled
Line 40:5 Unexpected "%"

**/
$('.article-feed').infiniteScroll({
        path: '.pagination__item--prev',
        append: '.mainarticle',
        status: '.scroller-status',
        hideNav: '.pagination',
      });

$(".Feature-CollectionNew ul").slick({
  dots: false,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  prevArrow:
    '<div class="arrowsec prev-arrowsec"><img src="https://cdn.shopify.com/s/files/1/0587/0531/3990/files/Vector.png?v=1723102849"></div>',
  nextArrow:
    '<div class="arrowsec next-arrowsec"><img src="https://cdn.shopify.com/s/files/1/0587/0531/3990/files/Vector_1.png?v=1723102848"></div>',
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },

    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ],
});


<script>
    {% if collection.description contains 'custom-script-placeholder' %}
  <script src="{{ 'custom-collection.js' | asset_url }}"></script>
{% endif %}
</script>