window.onscroll = function () {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
  
    document.getElementById("progressBar").value = progress;
  };
  