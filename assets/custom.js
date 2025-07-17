// Popup functionality
document.addEventListener('DOMContentLoaded', () => {
  // To show info popup
  document.querySelectorAll('.info_icon')?.forEach((element) => {
    element.addEventListener('click', (event) => {
      document.querySelectorAll('.custom_popup_wrap')?.forEach((popup) => {
        document.body.style.overflowY = 'hidden'; // Disable scroll
        popup.style.display = 'flex';
      });
      event.stopPropagation(); // Prevent event bubbling
    });
  });

  // To Close popup when clicking outside `.custom_pp_content` or clicking `.close_custom_pp`
  document.addEventListener('click', (event) => {
    document.querySelectorAll('.custom_popup_wrap')?.forEach((popup) => {
      if (
        event.target.closest('.close_custom_pp') || // Close on cross icon click
        !event.target.closest('.custom_pp_content') // Close on click outside
      ) {
        popup.style.display = 'none';
        document.body.style.overflowY = 'auto'; // Restore original overflow
      }
    });
  });
});


// FAQs accordion section script starts
    var acc = document.getElementsByClassName("landing-accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("current");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
    }

    $('.head1').click(function(){
      $(this).addClass('active').siblings('.active').removeClass('active');
      var dot = $(this).attr('data-box')
      $('.landing-acc-box').each(function(){
        var dot_para = $(this).attr('data-box');
        if(dot_para == dot){
          $(this).addClass('active').siblings('.active').removeClass('active');
        }
      })
    })
  // FAQs accordion section script ends