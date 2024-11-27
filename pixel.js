// prettier-ignore
(()=>{ 
  function t(t){ 
    console.log("PID:", t);
    
    let n="https://us-central1-visitorfit.cloudfunctions.net/handlePixelData", 
        o=window.location.hostname;
    
    var e = document.createElement("script");
    e.async = true;
    e.src = n + "?pid=" + t;
    document.head.appendChild(e);

    fetch("https://api.ipdata.co?api-key=33c71249f49c4fc76a917075a622ab36f32162febc931448cd214d04")
      .then(response => response.json())
      .then(ipData => {
        fetch(n, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            pid: t,
            domain: o,
            path: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: (new Date()).toISOString(),
            pageTitle: document.title,
            ipData: ipData
          })
        }).then(response => {
          if (response.ok) {
            console.log("✅ Data sent successfully");
          } else {
            console.error("❌ Error in response:", response.statusText);
          }
        }).catch(error => {
          console.error("❌ Error:", error);
        });
      }).catch(error => {
        console.error("❌ Error fetching IP data:", error);
      });
  }


  var e = document.currentScript;
  var n = e?.dataset?.pid;


  if (n) {
    t(n);
  } else {
    n = new URL(e.src).searchParams.get("pid");
    if (n) {
      console.log("> debug: using pid from query", n);
      t(n);
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        var e = document.getElementById("pixel-js")?.dataset?.pid;
        if (e) {
          console.log("> debug: using pid from backup", e);
          t(e);
        }
      });
    }
  }
})();
