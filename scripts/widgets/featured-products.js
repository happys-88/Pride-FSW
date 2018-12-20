
define([
    'modules/jquery-mozu',
    'slick'
],
    function ($, slick) {
        var slide = {
            productCarousel: function () { 
                $('.mz-featured-products').show();
                $(".mz-featured-products .mz-productlist-list").slick({
                    infinite: false,
                    slidesToShow: 5,
                    dots: true,
                    prevArrow: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    nextArrow: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
                    responsive: [{
                        breakpoint: 1024,
                        settings: {
                            arrows: true,
                            slidesToShow: 5,
                            dots: false
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            arrows: true,
                            slidesToShow: 4,
                            dots: false
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                            slidesToShow: 3,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 460,
                        settings: {
                            arrows: false,
                            slidesToShow: 2,
                            dots: true
                        }
                    }

                    ]
                });
            }
        };
        slide.productCarousel();
    });