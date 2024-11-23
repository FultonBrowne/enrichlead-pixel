!(function () {
  function e(e) {
    const t =
        "https://us-central1-visitorfit.cloudfunctions.net/handlePixelData",
      n = window.location.hostname;

    let o = document.createElement("script");
    o.async = true;
    o.src = `${t}?pid=${e}`;
    document.head.appendChild(o);

    fetch(t, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: e,
        domain: n,
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        pageTitle: document.title,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("✅ Data sent successfully");
        } else {
          console.error("❌ Error in response:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("❌ Error sending data:", error);
      });

    if (location.href.includes("testvtag=true")) {
      const successMessage =
        "Congratulations!\n\nYou have successfully installed the visitor tag.\nYou can now close this tab.";
      window.alert(successMessage);
    }
  }

  let t = document.currentScript,
    n = t?.dataset?.pid;

  n
    ? e(n)
    : t
    ? (n = new URL(t.src).searchParams.get("pid")) && e(n)
    : document.addEventListener("DOMContentLoaded", function () {
        let t = document.getElementById("pixel-js")?.dataset?.pid;
        t && e(t);
      });
})();
