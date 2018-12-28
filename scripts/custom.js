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
        $(document).on('click', '.mz-mobile-tabs li', function () {
          console.log("active");
          $(this).addClass("active");
          $(this).find(".active").prev().addClass("active");
        });
    	// Back To 
	  	function scrollToTop(){
        	$("body, html").animate({ 
	            scrollTop: 0
	        }, 600); 
        }
	  	$(window).scroll(function() {    
		    var scroll = $(window).scrollTop();
		    if (scroll >= 200) {
		    	$("#back-to-top").fadeIn();
		    } else{
		    	$("#back-to-top").fadeOut(); 
		    }
		});
		$("#back-to-top").click(function(){
	        scrollToTop(); 
		});

	}); 


  $("#resetPassword").blur(function() {
      var newPassword = $('#resetPassword').val();
      var regularExpression  = /^[a-zA-Z0-9!@#$%^&*]{8}$/;
      if(!regularExpression.test(newPassword)) {
        $('.mz-reset-password-val').css("display","block");
          $('.mz-reset-password-val').text('Minimum length should 8 and alphanumeric');
       }else {
        $('.mz-reset-password-val').text('');
       }
      
  });
}); 