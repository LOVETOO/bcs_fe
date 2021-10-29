$(function(){
	var timer=null;
	var oImg=$('.slider ul li');
	var oDot=$('.slider ol li');
	var index=0;
	timer=setInterval(autoplay,3000);
	function autoplay(){
		index++;
		if(index>1){
			index=0;
		}
		oImg.eq(index).animate({
			'opacity':0

		},2000).siblings('li').animate({

			'opacity':1
		}, 2000);

		//ol--li
		oDot.eq(index).addClass('current').siblings('li').removeClass('current');
		
	}
})