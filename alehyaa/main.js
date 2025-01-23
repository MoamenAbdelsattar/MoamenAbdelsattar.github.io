function Q(el, selector)  {return el.querySelector(selector)}
function QA(el, selector)  {return el.querySelectorAll(selector)}
function QD(selector)  {return document.querySelector(selector)}
function QDA(selector)  {return document.querySelectorAll(selector)}
function C(tag){
    return document.createElement(tag);
}
function setToggledStorage(prop, value){
    localStorage.setItem(prop, value);
}
function getToggledStorage(prop, def = false){
    if(localStorage.hasOwnProperty(prop)){
        if(localStorage.getItem(prop) == 'true') return true;
        else return false;
    }
    return def;
}
function oneChildVisible(parent, child){
    for(let el of parent.children){
        if(el == child){
            el.style.display = "block";
        }
        else{
            el.style.display = "none";
        }
    }
}
/*window.addEventListener(
  "message",
  (event) => {
    
    if (event.origin !== "https:/moamenAbdelsattar.github.io") return;
    if(event.data){
        // user is already subscribed
        
    }
    
  },
  false,
);
async function getSubscriptionStatus(){
    let i = C("iframe");
    i.src = "https:/moamenAbdelsattar.github.io/alehyaa/subscribe.html";
    i.style.height = "0";
    documen.body.appendChild(i);
    i.onload = () => {i.contentWindow.postMessage("Is subscribed?", "https:/moamenAbdelsattar.github.io")}

}/
