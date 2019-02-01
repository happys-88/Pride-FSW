
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
                    arrows: false, 
                    prevArrow: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    nextArrow: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
                    responsive: [{
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 5 
                        }
                    },
                    {
                        breakpoint: 992, 
                        settings: {
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: true,
                            slidesToShow: 3, 
                            dots: false 
                        }
                    },
                    {
                        breakpoint: 460,
                        settings: {
                            arrows: true,
                            slidesToShow: 2,
                            dots: false
                        }
                    }

                    ]
                });
            }
        };
        slide.productCarousel(); 
    });