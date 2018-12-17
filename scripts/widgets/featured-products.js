
define([
    'modules/jquery-mozu',
    'bxslider',
    'slick'
],
    function ($, bxSlider, slick) {
           // var slider;
            var slide = {
                productCarousel: function () {

                    // var minSlides,
                    //     maxSlides,
                    //     slideWidth,
                    //     slideMargin,
                    //     pager,
                    //     controls,
                    //     windowWidth = $(window).width();
                    // if (windowWidth >= 480 || windowWidth <= 767) {
                    //     minSlides = 2;
                    //     maxSlides = 2;
                    //     slideMargin = 10;
                    //     slideWidth = 400;
                    //     pager = true;
                    //     controls = false;

                    // }
                    // if (windowWidth > 767) {
                    //     minSlides = 6;
                    //     maxSlides = 12;
                    //     slideWidth = 400;
                    //     slideMargin = 15;
                    //     pager = false;
                    //     controls = true;
                    // }
                    $(".mz-featured-products .mz-productlist-list").slick({
                        infinite: false,
                        slidesToShow: 5,
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
                    //window.slider = slider;
                }
            };
            slide.productCarousel();
            // $(window).resize(function () {
            //    // slider.destroySlider();
            //     //slide.productCarousel();
            // });
    });