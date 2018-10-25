define([ 
	"modules/jquery-mozu"
 
], function( $) {   
	
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