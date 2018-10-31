define([ 
	"modules/jquery-mozu",
  "bxslider"
 
], function( $, bxslider) { 

    //home slider
    $('#mz-home-slider .slider').bxSlider({
      auto: true,
      useCSS: false,
      speed: 1000,  
      minSlides: 1,
      maxSlides: 1,
      moveSlides: 1,
      slideMargin: 0,
      infiniteLoop: true,
      pager: true,
      hideControlOnEnd: true,
      touchEnabled: true,
      stopAutoOnClick: true,
      onSliderLoad: function() {
        $(".slider").css("visibility", "visible");
      }
    });  
	
	$(document).ready(function(){ 
		$("#newsletterEmail").keydown(function(e) {
            if (e.which === 13) {
                $("#newsletter").trigger("click");
            }
        });
		$("#newsletter").click(function(e){
			var email = $("#newsletterEmail").val();
			var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   			if(pattern.test(email)) {
   				$("#errorEmail").hide();
   				$("#newsletterEmail").val('');
   				$("#thanksMsg").show().delay(2000).fadeOut();

   			} else {
   				$("#errorEmail").show();
   			}
		});

	}); 
}); 