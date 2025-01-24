function removeLoading(){
    document.documentElement.classList.remove("loading");
    QD("#loading-frame").classList.add("hide");
    setTimeout(()=>{QD("#loading-frame").style.display = "none"}, 1000);
}
window.addEventListener("load", () => {
    //removeLoading();
    /*if(s.has("notrack") || window.location.host.includes("localhost")){
        setNumStorage("notrack", 1);
    }
    if(!getNumStorage("notrack", 0)){
    }*/
});
setTimeout(()=>{removeLoading()}, 3000);
let s = new URLSearchParams(window.location.search);
function loadScript(url, completeCallback) {
   var script = document.createElement('script'), done = false,
       head = document.getElementsByTagName("head")[0];
   script.src = url;
   script.onload = script.onreadystatechange = function(){
     if ( !done && (!this.readyState ||
          this.readyState == "loaded" || this.readyState == "complete") ) {
       done = true;
	   if(typeof(completeCallback) == 'function')
           completeCallback();

      // IE memory leak
      script.onload = script.onreadystatechange = null;
      //head.removeChild( script );
    }
  };
  head.appendChild(script);
}
function loadPost(data){
    if (data.feed.entry) {
        if (data.feed.entry.length > 0) {
            var title = data.feed.entry[0].title.$t;
        }
	    if(data.feed.entry[0].media$thumbnail){
	        var thumb = data.feed.entry[0].media$thumbnail.url;
	    }
      }
    if (title) {
        QD("#title").innerText = title;
    }
    if (thumb) {
        QD("#thumbnail img").src = thumb;
    }
    QD("#describtion").innerText = s.get("describtion");
    removeLoading();
}
function loadDefault(){
    QD("#title").innerText = "مشروع الإحياء";
    QD("#thumbnail img").src = "/alehyaa/icon.png";
    QD("#describtion").innerText = "استمتع بقراءة مقالات تعليمية هادفة في مختلف المجالات";
    QD("#read-button").innerText = "افتح المدونة";
    removeLoading();
}
if(s.has("path")){
    loadScript(`https://al-ehyaa.blogspot.com/feeds/posts/summary?alt=json-in-script&max-results=1&redirect=false&path=${s.get("path")}&callback=loadPost`);
    QD("#read-button").innerText = "اقرأ المقال";
} else{
    loadDefault();
}
QD("#read-button").addEventListener("click", ()=>{
    if(s.has("path")){
        window.location.href = `https://al-ehyaa.blogspot.com/${s.get("path")}?utm_source=alehyaaapp&utm_medium=notification&utm_campaign=notification`;
    }
    else{
        window.location.href = `https://al-ehyaa.blogspot.com/?utm_source=alehyaaapp&utm_medium=notification&utm_campaign=appclick`;
    }
})
window.addEventListener("load", async () => {
    if(getToggledStorage("isFullyInstalled", false)){
        let registration = await navigator.serviceWorker.ready;
        await registration.active.postMessage("Update");
    }
})

