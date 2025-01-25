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


const supportsInstallPrompt = 'onbeforeinstallprompt' in window;
//let supportsInstallPrompt = false;
function updateSubscribeStatus(){
    var isChromium = !!window.chrome;
    if(!supportsInstallPrompt){
        oneChildVisible(QD("#subscribe"), QD("#no-pwa"));
        return;
    }
    if(window.matchMedia("(display-mode: standalone)").matches){
        setToggledStorage("isInstalled", true);
    }
    if(getToggledStorage("isInstalled", false)){
        oneChildVisible(QD("#subscribe"), QD("#success-frame"))
    } else{
            if(!isChromium){
                QD("#no-chrome").innerHTML = `
                        <h3>متصفحك لا يدعم تطبيقات الويب التقدمية</h3>
                <div>إذا كنت تريد مني إرسال إشعارات لك عندما أنشر فصلا أو مقالا جديدا، يرجى زيارتي من متصفح Google Chrome أو Chromium.
                
                <a target="_blank" href="https://al-ehyaa.blogspot.com/2025/01/notifications.html#only-chrome">
                    لماذا؟
                </a>
                </div>
                `
                oneChildVisible(QD("#subscribe"), QD("#no-chrome"));
                return;
            }
            oneChildVisible(QD("#subscribe"), QD("#request-install-frame"))
    }
}
async function registerPeriodicSync(){
    let registration = await navigator.serviceWorker.ready;
    const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
    });
    if (status.state === 'granted') {
        await registration.active.postMessage("Welcome");
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
    let notify = await Notification.requestPermission();
    if(notify == 'granted'){
        navigator.serviceWorker.register('/alehyaa_sw.js');
        let registration = await navigator.serviceWorker.ready;
        await registration.active.postMessage("Created");
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt.');

        } else if (outcome === 'dismissed') {
            console.log('User dismissed the install prompt');
        }   
    }

    updateSubscribeStatus();
});
addEventListener("appinstalled", async (event) => {
    setToggledStorage("isInstalled", true);
    await registerPeriodicSync();
    updateSubscribeStatus();
});


updateSubscribeStatus();
window.addEventListener(
  "message",
  (event) => {
    
    if (event.origin !== "https://al-ehyaa.blogspot.com") return;
    window.parent.postMessage(getToggledStorage("isInstalled", false), "https://al-ehyaa.blogspot.com")
    
  },
  false,
);

window.addEventListener("load", async () => {
    if(getToggledStorage("isInstalled", false)){
        let registration = await navigator.serviceWorker.ready;
        let tags = await registration.sync.getTags();
        if(tags.includes("Update")) return;
        try {
            await registration.sync.register("Update");
        } catch {
            console.log("Background Sync could not be registered!");
        }
    }
})
