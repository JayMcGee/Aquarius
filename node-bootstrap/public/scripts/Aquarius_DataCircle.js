////////////////////////////////////////////////////////////////////////////////
/**
 * Aquarius_DataCircle
 * 
 * @brief:  Generates a visual representation of the data 
 *          Based on jqueryKnobs from Anthony Terrien
 *          http://anthonyterrien.com/knob/
 * 
 * @author : Modifications by Jean-Pascal McGee
 * @date : 20 MAR 2015
 * @version : 1.0.0 
*/
$(function() {
    function circle(){
    	var knobWidthHeight,
        windowObj;
        // store reference to div obj
        windowObj = $('.circleStatsItemBox');
        // if the window is higher than it is wider
        if(windowObj.height() > windowObj.width()){
                // use 75% width
            knobWidthHeight = Math.round(windowObj.width()*0.75);
        } else {
            // else if the window is wider than it is higher
            // use 75% height
            knobWidthHeight = Math.round(windowObj.height()*0.75);
        }
        // change the data-width and data-height attributes of the input to either 75%
        // of the width or 75% of the height
        $('.whiteCircle').attr('data-width',knobWidthHeight).attr('data-height',knobWidthHeight);
    
        $(".whiteCircle").knob({
        	  draw : function () {
        	  		$(".whiteCircle").css("font-size","25px");
        	  		$("#condCircle").css("font-size","20px");
                    // "tron" case
                    if(this.$.data('skin') == 'tron') {
                        this.cursorExt = 0.3;
                        var a = this.arc(this.cv)  // Arc
                            , pa                   // Previous arc
                            , r = 1;
                        this.g.lineWidth = this.lineWidth;
                        if (this.o.displayPrevious) {
                            pa = this.arc(this.v);
                            this.g.beginPath();
                            this.g.strokeStyle = this.pColor;
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                            this.g.stroke();
                        }
                        this.g.beginPath();
                        this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                        this.g.stroke();
                        this.g.lineWidth = 2;
                        this.g.beginPath();
                        this.g.strokeStyle = this.o.fgColor;
                        this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                        this.g.stroke();
                        return false;
                    }
                }
        });
    	//var width = document.getElementById('tempCircle').offsetWidth;
        $('.whiteCircle').trigger(
            'configure',
            {
            	//"width" : width,
            	"thickness" : 0.15,
                "fgColor":"#EEF8F2",
                "inputColor" :"#EEF8F2",
            }
        );
    
    }
    
    window.circle=circle;
});


