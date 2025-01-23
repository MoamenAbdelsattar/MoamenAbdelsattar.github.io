function Q(el, selector)  {return el.querySelector(selector)}
function QA(el, selector)  {return el.querySelectorAll(selector)}
function QD(selector)  {return document.querySelector(selector)}
function QDA(selector)  {return document.querySelectorAll(selector)}
function SQ(el, selector){var r = Q(el, selector); if(r) return r; return {innerText:'', innerHTML:''}}
function SDQ(selector){var r = QD(selector); if(r) return r; return {innerText:'', innerHTML:''}}
function G(el, attr) {return el.getAttribute(attr)}
function SG(el, attr){
    if(el.hasAttribute(attr))
        return el.getAttribute(attr);
    else
        return "";
}
function S(el, attr, val){return el.setAttribute(attr, val)}
function D(el, attr) {return el.removeAttribute(attr)}
function W(wrapper, wrapped){
    wrapped.after(wrapper);
    wrapper.appendChild(wrapped);
}
function C(tag){
    return document.createElement(tag);
}
function CS(html, selector = ":first-child"){
    const temp = document.createElement('template');
    temp.innerHTML = html;
    return temp.content.querySelector(selector);
    /*const range = document.createRange();
    const newContent = range.createContextualFragment(html);
    return newContent.querySelector(selector);*/
}

function R(el){
    el.parentElement.removeChild(el);
}
function RA(els){
    for(let el of els){
        R(el)
    }
}

async function fileExists(filepath){
     let res = await fetch(filepath,
          { method: "HEAD" }
     );
     return res.status == 200;
}

// https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/
async function getFile(filepath, cache = "no-store"){
    let i = 0;
    let file_name = filepath.split('/').pop();
    while(true){
        if(await fileExists(filepath)){
            let source = await fetch(filepath, {cache: "no-cache"});
            return await source.text();
        }
        if(i < getFilePaths.length){
            filepath = new URL(file_name, getFilePaths[i]).href;
            i++;
            continue;
        }
        break;
    }
    return "";
}

// from https://gist.github.com/jonathantneal/7935589
function AC (selectorUntrimmed) {
	var selector = selectorUntrimmed.replace(/^\s+|\s+$/),
	root = document.createDocumentFragment(),
	nest = [root, createElement.call(this, 'div')];

	for (var frag = root, node = frag.appendChild(nest[1]), index = 1, first = true, match; selector && (match = selector.match(REGEX));) {
		// tag
		if (match[1]) {
			frag.replaceChild(node = createElement.call(this, match[1]), frag.lastChild);

			if (first) nest[index] = node;
		}
		// id
		if (match[2]) node.id = match[2];
		// class
		if (match[3]) node.className += (node.className ? ' ' : '') + match[3];
		// attribute
		if (match[4]) node.setAttribute(match[4], match[7] || '');
		// nesting
		if (match[9] !== undefined) {
			index = match[9].length;

			frag = nest[index];
			node = nest[++index] = frag.appendChild(createElement.call(this, 'div'));
		}
		// child 
		if (match[10]) {
			frag = node;
			node = frag.appendChild(createElement.call(this, 'div'));

			first = false;
		}
		// text
		if (match[11]) {
			frag.replaceChild(node = document.createTextNode(match[12]), frag.lastChild);

			if (first) nest[index] = node;
		}

		selector = selector.slice(match[0].length);
	}

	return root.childNodes.length === 1 ? root.lastChild : root;
};

// AC(); // generates <div />

// AC('li'); // generates <li />

// AC('#foo'); // generates <div id="foo" />
// AC('.bar'); // generates <div class="bar" />
// AC('.alpha.omega'); // generates <div class="alpha omega" />

// AC('[tabindex]'); // generates <div tabindex />
// AC('[title="Hello"]'); // generates <div title="Hello" />

// AC('p.this#thing.also[data-amen].that'); // generates <p id="thing" class="this also that" data-amen />

// AC('[data-value="<.it=\"#works[well]\">"]'); // generates <div data-value="&lt;.it=&quot;#works[well]&quot;&gt;" />
// AC('span.field\n\tlabel "To: "\n\t\tinput'); // generates <span class="field"><label>To: <input></label></span>

function replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent.replace(pattern, replacement);
                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement);
        }
    }
}
function replaceInTextWithHTML(element, pattern, replacement){
    const range = document.createRange();
    let i = 0;
    while(i < element.childNodes.length){
        let node = element.childNodes[i];
    //for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInTextWithHTML(node, pattern, replacement);
                i = i + 1;
                break;
            case Node.TEXT_NODE:
                //node.textContent = node.textContent.replace(pattern, replacement);    
                let newContent = node.textContent.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replace(pattern, replacement);
                newContent = range.createContextualFragment(newContent);
                i = i + newContent.childNodes.length;
                node.before(newContent);
                node.parentNode.removeChild(node);
                break;
            case Node.DOCUMENT_NODE:
                replaceInTextWithHTML(node, pattern, replacement);
            default:
                i = i + 1;
        }
    //}
        //i = i + 1;
    }
}

function toggleClass(el, cls){
    if(el.classList.contains(cls)){
        el.classList.remove(cls);
        return;
    }
    el.classList.add(cls);
}
function toggleClassCond(el, cls, cond){
    if(el.classList.contains(cls)){
        if(!cond)
            el.classList.remove(cls);
        return;
    }
    else {
        if(cond)
            el.classList.add(cls);
    }
}
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
function toggleStorage(prop, def){
    if(localStorage.hasOwnProperty(prop)){
        if(localStorage.getItem(prop) == 'true') {
            localStorage.setItem(prop, false);
            return false;
        }
        else if(localStorage.getItem(prop) == 'false'){
            localStorage.setItem(prop, true);
            return true;
        }
    }
    localStorage.setItem(prop, !def);
    return !def;
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
function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
function toggleDisplay(el, visible){
    if(visible){
        el.style.display = "block";
    }
    else{
        el.style.display = "none";
    }
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
function loadScript(src){
    let s = C("script");
    s.src = src;
    document.head.appendChild(s);
}
