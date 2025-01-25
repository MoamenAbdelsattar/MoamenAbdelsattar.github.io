importScripts('localforage.min.js');

self.addEventListener('install', async (event) => {

});
addEventListener("message", async (event) => {
    if(event.data != "Created") return;
    console.log(`Message received: ${event.data}`);
    let max_time = 0;
    let ns = await fetch('/alehyaa/notifications.json?nocache=' + (new Date()).getTime());
    ns = await ns.json();
    for(let n of ns){
        max_time = Math.max(n["time"], max_time);
    }
    await localforage.setItem('lastreadnotification', String(max_time));
});
addEventListener("message", async (event) => {
    if(event.data != "Welcome") return;
    self.registration.showNotification("كل شيء جاهز!", {
        dir: "rtl",
        body: "جهازك مستعد لاستقبال الإشعارات من الموقع",
        icon: "/alehyaa/icon.png",
        data: {
            url:"https://MoamenAbdelsattar.github.io/alehyaa/read.html",
            homepage: true
        }
    })
})


function setNumStorage(prop, value){
    localStorage.setItem(prop, value);
}
function getNumStorage(prop, def){
    if(localStorage.hasOwnProperty(prop)){
        return parseFloat(localStorage.getItem(prop));
    }
    localStorage.setItem(prop, def);
    return def;
}
async function getNotifications(event){
    let ns = await fetch('/alehyaa/notifications.json?nocache=' + (new Date()).getTime());
    ns = await ns.json();
    //let last_read = getNumStorage("lastreadnotification", 0); 
    let last_read = parseFloat(await localforage.getItem('lastreadnotification'))
    let choosed_notify = null;
    for(let n of ns){
        if(last_read < n["time"]){
            choosed_notify = n;
            last_read = n["time"];
        }
    }
    if(choosed_notify){
        await localforage.setItem('lastreadnotification', String(choosed_notify["time"]));
        //let notification = new Notification(n["options"]["title"], n["options"]);
        self.registration.showNotification(choosed_notify["title"], choosed_notify["options"])
    }
}
self.addEventListener('periodicsync', async (event) => {
    event.waitUntil(getNotifications());
});
self.addEventListener("sync", async(event) => {
    if(event.tag != "Update") return;
    event.waitUntil(getNotifications());
})
// url must not contain protocol and origin
self.addEventListener(
    "notificationclick",
    function (event) {
        event.notification.close();
        //switch (event.action) {}
        if(notification.data.homepage){
            clients.openWindow(`https://MoamenAbdelsattar.github.io/alehyaa/read.html`);
            return;
        }
        clients.openWindow(`https://MoamenAbdelsattar.github.io/alehyaa/read.html?describtion=${encodeURIComponent(event.notification.body)}&path=${event.notification.data.url}`);
    },
    false,
);
