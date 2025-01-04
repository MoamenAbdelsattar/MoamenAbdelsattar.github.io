    var postIdString = document.getElementsByClassName("post-body")[0].id.replace(/\D/g,'');;
    var postId = parseInt(postIdString);
    


// this function will work cross-browser for loading scripts asynchronously
function loadScriptAsync(src) {
  return new Promise(function(resolve, reject) {
    const s = document.createElement('script');
    let r = false;
    s.type = 'text/javascript';
    s.src = src;
    s.async = true;
    s.onerror = function(err) {
      reject(err, s);
    };
    s.onload = s.onreadystatechange = function() {
      // console.log(this.readyState); // uncomment this line to see which ready states are called.
      if (!r && (!this.readyState || this.readyState == 'complete')) {
        r = true;
        resolve();
      }
    };
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(s);
  });
}



// Multiply-with-carry  algorithm:
var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function seed(i) {
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random()
{
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
}


randomPostsHTML = "<ul  id='random_label_with_thumbs'>"
function addRandomPost(json){
        if (json.feed.entry.length == 0) return;
        var entry = json.feed.entry[0];
        var posttitle = entry.title.$t;
        var posturl;
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') {
                posturl = entry.link[k].href;
                break;
            }
        }
        var thumburl;
        try {
            thumburl = entry.media$thumbnail.url;
        } catch (error) {
            s = entry.content.$t;
            a = s.indexOf("<img");
            b = s.indexOf("src=\"", a);
            c = s.indexOf("\"", b + 5);
            d = s.substr(b + 5, c - b - 5);
            if ((a != -1) && (b != -1) && (c != -1) && (d != "")) {
                thumburl = d;
            } else thumburl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBFn6rtjV1OF5VkN59366wmuskHeTtWaRyZkQxyUW4OCgp1xiV_5dJgOrAKdmb9OaaYERh_QFeKnLJOeUw7bnzSX7mLUkWIza5eQGaheEVEkaX0O9PnO-p9kdyUfeomH4f6b9g7-n67St7INpcQIbmRL8gNscVWrLxv9a4aUTg0Zv_LvrpKAErkkxA9P8/s320-rw/write-rtl-2935375_1280.png'; //TODO change nothumb image
        }
        //document.write('<li  class="clearfix">');
        randomPostsHTML += '<li  class="clearfix">';
        if (showpostthumbnails == true)
            randomPostsHTML += '<a href="' + posturl + '" target ="_top"><img loading="lazy"  class="label-thumb"  src="' + thumburl + '"/></a>';
            //document.write('<a href="' + posturl + '" target ="_top"><img loading="lazy"  class="label-thumb"  src="' + thumburl + '"/></a>');
        //document.write('<strong class="label-title"><a  href="' + posturl + '" target  ="_top">' + posttitle + '</a></strong><br>');
        randomPostsHTML += '<strong class="label-title"><a  href="' + posturl + '" target  ="_top">' + posttitle + '</a></strong><br>';
        if ("content" in entry) {
            var postcontent = entry.content.$t;
        } else
        if ("summary" in entry) {
            var postcontent = entry.summary.$t;
        } else var postcontent = "";
        var re = /<\S[^>]*>/g;
        postcontent = postcontent.replace(re, "");
        if (showpostsummary == true) {
            if (postcontent.length < numchars) {
                /*document.write('');
                document.write(postcontent);
                document.write('');*/
                randomPostsHTML += postcontent
            } else {
                //document.write('');
                postcontent = postcontent.substring(0, numchars);
                var quoteEnd = postcontent.lastIndexOf("  ");
                postcontent = postcontent.substring(0, quoteEnd);
                //document.write(postcontent + '...');
                //document.write('');
                randomPostsHTML += postcontent + "..."
            }
        }
        var towrite = '';
        var flag = 0;
        //document.write('<br>');
        randomPostsHTML += '<br>';
        if (displaymore == true) {
            if (flag == 1) towrite = towrite + ' | ';
            towrite = towrite + '<a  href="' + posturl + '" class="url" target ="_top">More  »</a>';
            flag = 1;;
        }
        /*document.write(towrite);
        document.write('</li>');*/
        randomPostsHTML += towrite;
        randomPostsHTML += '</li>';
        /*if (displayseparator == true)
            if (i != (numposts - 1))
                document.write('');*/

    /*document.write('</ul>');*/
}
function viewRandomPosts(){
    randomPostsHTML += "</ul>";
    document.getElementById("random-posts").innerHTML = randomPostsHTML;
}

const numRandomPosts = 4;
var randomPostsIndices = [];

function fillRandomIndices() {
    if(numRandomPosts >= totalPosts){
        // Fill indices with all posts
        for (var b = 0; b < totalPosts; b++) {
            randomPostsIndices[b] = b;
        }
        return;
    }
    
    // Else: select random posts
    var allIndices = [];
    for (var b = 0; b < totalPosts; b++) {
        allIndices[b] = b +1;
    }
    
    for (var b = 0; b < numRandomPosts; b++) {
        var random_index = Math.round(random() * (allIndices.length - 1));
        randomPostsIndices[b] = allIndices[random_index];
        allIndices.splice(random_index, 1); 
    }
}
window.addEventListener('load', function(){
  var now = new Date();
  var fullDaysSinceEpoch = Math.floor(now/8.64e7);
  var fullWeeksSinceEpoch = Math.floor(fullDaysSinceEpoch/7);
  seed(postId + fullWeeksSinceEpoch);
  fillRandomIndices();
  const posts_promises = [];
  for( var i = 0; i < randomPostsIndices.length; i++){
      var url = '/feeds/posts/default?alt=json-in-script&start-index=' + randomPostsIndices[i] + '&max-results=1&callback=addRandomPost';
      posts_promises[i] = loadScriptAsync(url);
  }
  Promise.all(posts_promises).then((resolveAllData) => {
        viewRandomPosts();
      });


function escapeHtml(unsafe)
{
    return unsafe
         .replaceAll(/&/g, "&amp;")
         .replaceAll(/</g, "&lt;")
         .replaceAll(/>/g, "&gt;")
         .replaceAll(/"/g, "&quot;")
         .replaceAll(/'/g, "&#039;");
 }
 
function replaceTextHTML(element, from, to) {
    for (var child = element.firstChild; child !== null; child = child.nextSibling) {
        if (child.nodeType === 3){
            let s = document.createElement("span");
            s.innerHTML = escapeHtml(child.nodeValue).replaceAll(from, to);
            child.after(s);
            child.parentNode.removeChild(child);
            child = s;
        }
        else if (child.nodeType === 1 && child.nodeName != "STYLE")
            replaceTextHTML(child, from, to);
    }
}
/*if(document.querySelector("body[data-pagetype='item'")){
 replaceTextHTML(document.querySelector("#renderTo"), /(\p{RGI_Emoji})/gmv, "<span no-dark>$1</span>")
}*/


}, { once: true });