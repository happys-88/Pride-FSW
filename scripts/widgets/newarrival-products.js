
define([
    'modules/jquery-mozu',
    'slick'
],
    function ($, slick) {
        var slide = {
            productCarousel: function () {
                 $('.new-arrival-product-container').show();
                $(".new-arrival-product-container .mz-productlist-list").slick({
                    infinite: false,
                    slidesToShow: 6,
                    prevArrow: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    nextArrow: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
                    responsive: [{
                        breakpoint: 1024,
                        settings: {
                            arrows: true,
                            slidesToShow: 5
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            arrows: true,
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: true,
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 460,
                        settings: {
                            arrows: true,
                            slidesToShow: 2
                        }
                    }

                    ]
                });
            }
        };
        slide.productCarousel();
    });