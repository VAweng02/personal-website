(function () {
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();

//-------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function(event) {
    var text = "Hi, I'm Vincent Weng, Welcome!";
    var speed = 75; // Speed of typing (in milliseconds)
    var typewriter = document.getElementById("typewriter");
    
    var i = 0;
    function typeWriter() {
      if (i < text.length) {
        typewriter.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    
    typeWriter();
  });