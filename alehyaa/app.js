function removeLoading(){
    document.documentElement.classList.remove("loading");
    QD("#loading-frame").classList.add("hide");
    setTimeout(()=>{QD("#loading-frame").style.display = "none"}, 1000);
}
QD("div#update-notice").style.display = 'none';
window.addEventListener("load", () => {
    removeLoading();
    let s = new URLSearchParams(window.location.search);
    if(s.has("notrack") || window.location.host.includes("localhost")){
        setNumStorage("notrack", 1);
    }
    if(!getNumStorage("notrack", 0)){
        /*(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "pts5mrz88j");
        console.warn("collecting usage data");*/
    }
    setTimeout(()=>{
        if(deferredPrompt == null)
            QD("div#update-notice").style.display = 'block';
    }, 5000)
})
var browser = (function (agent) {
    switch (true) {
        case agent.indexOf("edge") > -1: return "edge";
        case agent.indexOf("edg/") > -1: return "edge-chromium"; // Match also / to avoid matching for the older Edge
        case agent.indexOf("opr") > -1 && !!window.opr: return "opera";
        case agent.indexOf("chrome") > -1 && !!navigator.brave: return "brave";
        case agent.indexOf("chrome") > -1 && !!window.chrome: return "chrome";
        case agent.indexOf("trident") > -1: return "ie";
        case agent.indexOf("firefox") > -1: return "firefox";
        case agent.indexOf("safari") > -1: return "safari";
        default: return "other";
    }
})(window.navigator.userAgent.toLowerCase());
const supportsInstallPrompt = 'onbeforeinstallprompt' in window;
//let supportsInstallPrompt = false;
function updateSubscribeStatus(){
    //var isChromium = !!window.chrome;
    if(browser != "chrome"){
        oneChildVisible(QD("#subscribe"), QD("#no-chrome"));
        return;
    }
    if(!supportsInstallPrompt){
        oneChildVisible(QD("#subscribe"), QD("#no-pwa"));
        return;
    }
    if(getToggledStorage("isInstalled", false)){
        if(getToggledStorage("isFullyInstalled", false)){
            oneChildVisible(QD("#subscribe"), QD("#success-frame"))
        }
        else if(Notification.permission === "granted"){
            oneChildVisible(QD("#subscribe"), QD("#success-frame"))
            setToggledStorage("isFullyInstalled", true);
        }
        else{
            oneChildVisible(QD("#subscribe"), QD("#request-notify-frame"))
        }
    } else{
            oneChildVisible(QD("#subscribe"), QD("#request-install-frame"))
    }
}

// This variable will save the event for later use.
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    setToggledStorage("isInstalled", false);
    e.preventDefault();
    deferredPrompt = e;
    QD("#subscribe-button").disabled = false;
    QD("div#update-notice").style.display = 'none';
});
QD("#subscribe-button").addEventListener("click", async ()=>{
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        console.log('User accepted the install prompt.');
        setToggledStorage("isInstalled", true);
        updateSubscribeStatus();
        let notify = await Notification.requestPermission();
        if(notify == 'granted'){
            navigator.serviceWorker.register('/alehyaa_sw.js');
            let registration = await navigator.serviceWorker.ready;
            const status = await navigator.permissions.query({
              name: 'periodic-background-sync',
            });
            if (status.state === 'granted') {
                await registration.active.postMessage("Created");
                await registration.periodicSync.register('notify', {
                    minInterval: 24 * 60 * 60 * 1000, // 1 day in ms
                });
                console.log("registered periodic sync");
                setToggledStorage("isFullyInstalled", true);
            }
            else{
                console.log("periodic sync denied");
            }
            
        }
    } else if (outcome === 'dismissed') {
        console.log('User dismissed the install prompt');
    }
    updateSubscribeStatus();
});


updateSubscribeStatus();
window.addEventListener(
  "message",
  (event) => {
    
    if (event.origin !== "https://al-ehyaa.blogspot.com") return;
    window.parent.postMessage(getToggledStorage("isFullyInstalled", false), "https://al-ehyaa.blogspot.com")
    
  },
  false,
);

window.addEventListener("load", async () => {
    if(getToggledStorage("isFullyInstalled", false)){
        let registration = await navigator.serviceWorker.ready;
        await registration.active.postMessage("Update");
    }
})
