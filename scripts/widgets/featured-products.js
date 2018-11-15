// require([
//     'modules/jquery-mozu',
//     'bxslider'
// ],
// function ($, bxSlider) { 
//     $(document).ready(function(){
//         var eachSlide = $(".mz-featured-products .mz-productlist-list").find(".mz-productlist-item"), 
//             minSlides,
//             slideWidth, 
//             windowWidth = $( window ).width();  
//         if(windowWidth <= 767){
//             minSlides = 2;
//             slideWidth = 150;  
//         }else{
//             if(windowWidth >=768 && windowWidth <=1024 ){
//                 minSlides = 4;
//                 slideWidth = 170; 
//             }
//             else{
//                 minSlides = 6;
//                 slideWidth = 275;     
//             } 
            
//         }
        
//         if ((minSlides == 2 && eachSlide.length > 2) || (minSlides >=4  && eachSlide.length > 6)) {  
//             $(".mz-featured-products .mz-productlist-list").bxSlider({
//                 auto: false,
//                 speed: 600,  
//                 minSlides: minSlides, 
//                 maxSlides: 12, 
//                 slideWidth: slideWidth,  
//                 moveSlides: 1,
//                 slideMargin: 0,
//                 infiniteLoop: false,
//                 controls: false,
//                 pager: true,
//                 touchEnabled: true,
//                 onSliderLoad: function() {
//                     $(".slider").css("visibility", "visible"); 
//                 }
//             });       
//         }
       
//     });
// });
define([
    'modules/jquery-mozu',
    'bxslider'
],
    function ($, bxSlider, lazyload) {
            var slider;
            var slide = {
                productCarousel: function () {

                    var minSlides,
                        maxSlides,
                        slideWidth,
                        slideMargin,
                        pager,
                        controls,
                        windowWidth = $(window).width();
                    if (windowWidth >= 480 || windowWidth <= 767) {
                        minSlides = 2;
                        maxSlides = 2;
                        slideMargin = 10;
                        slideWidth = 400;
                        pager = true;
                        controls = false;

                    }
                    if (windowWidth > 767) {
                        minSlides = 6;
                        maxSlides = 12;
                        slideWidth = 400;
                        slideMargin = 15;
                        pager = false;
                        controls = true;
                    }
                    slider = $(".mz-featured-products .mz-productlist-list").bxSlider({
                        auto: false,
                        speed: 600,
                        minSlides: minSlides,
                        maxSlides: 12,
                        slideWidth: slideWidth,
                        moveSlides: 1,
                        slideMargin: 0,
                        controls: false,
                        pager: true,
                        infiniteLoop: false,
                        touchEnabled: true,
                        stopAutoOnClick: true,
                        onSliderLoad: function () {
                            $(".slider").css("visibility", "visible");
                        }
                    });
                    window.slider = slider;
                }
            };
            slide.productCarousel();
            $(window).resize(function () {
                slider.destroySlider();
                slide.productCarousel();
            });
    });