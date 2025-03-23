document.addEventListener("DOMContentLoaded", function() {
    let tempMessage = document.getElementById("temp-message");
    let loader = document.getElementById("loader");
    
    setTimeout(() => {
        loader.style.display = "none";
        tempMessage.style.display = "block";
        setTimeout(() => {
            tempMessage.style.display = "none";
        }, 1000);
    }, 1000);
});