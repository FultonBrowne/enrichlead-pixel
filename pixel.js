(() => {
  function t(t) {
    console.log("PID:", t);
    let o = window.location.hostname;
    let n = "true" === new URL(window.location.href).searchParams.get("test");
    fetch(
      "https://us-central1-enrichlead-27045.cloudfunctions.net/handlePixelData",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pid: t,
          domain: o,
          path: window.location.pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          pageTitle: document.title,
          test: n,
        }),
      },
    )
      .then((e) => {
        e.ok
          ? (console.log("✅ Data sent successfully", e),
            n && alert("Congratulations! Test completed successfully"))
          : console.error("❌ Error in response:", e.statusText);
      })
      .catch((e) => {
        console.error("❌ Error:", e);
      });
  }
  var e = document.currentScript,
    o = e?.dataset?.pid;
  o
    ? t(o)
    : (o = new URL(e.src).searchParams.get("pid"))
      ? (console.log("> debug: using pid from query", o), t(o))
      : document.addEventListener("DOMContentLoaded", function () {
          var e = document.getElementById("pixel-js")?.dataset?.pid;
          e && (console.log("> debug: using pid from backup", e), t(e));
        });
})();
