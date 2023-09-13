const { AOS } = require("./aos");

//TYPED
var typed = new Typed('.type', {
       strings: [' ','Je suis Gabin Vianney BADJOGOUNME  étudiant à l\'institut de formation et de recherche en informatique, spécialité génie logiel . Je suis junior en développement full-stack web et mobile(Flutter)'],
       smartBackspace: false, // Default value
        typedSpeed:1000,
       backSpeed:0,
       backDelay:1000,
       startDelay:1000,
       loop:true,


      });

      // NAV_CONTAINER
      let lastScrollTop=0;
      nav_container = document.getElementsByClassName('.nav_container');
       
      window.addEventListener('scroll',function(){
       const ScrollTop = this.window.pageXOffset||
       this.document.documentElement.scrollTop;

       if(ScrollTop>lastScrollTop){
        nav_container.style.top="-50px";
       }
       else{
         nav_container.style.top="0";
       }
       lastScrollTop=ScrollTop;
      });


      //COUNTER LIVE

      let counter = 0;
  

      $(window).scroll(function(){


         const top = $('.counter').offset().top -
         window.innerHeight;

         if(counter == 0 && $(window).scrollTop()>top)
        {
           $('.counter_value').each(function(){
        let $this = $(this),
           countTo=$this.attr('data-count');
           $({
             countNum: $this.text(),
           }).animate({
            countNum: countTo
          
           },
           {
            duration:10000,
            easing:'swing',
            stop:function(){
              $this.text(Math.floor(this.countNum));
            },
            complete:function(){
             $this.text(this.countNum);
            }
          });
           
           });
           counter=1;
          }
         
          });


            // AOS

              Aos.init();