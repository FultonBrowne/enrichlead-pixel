!(function () {
  function trackVisitor() {
    const visitorData = {
      timestamp: new Date().toISOString(),
      page: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    };

    fetch("https://app.enrichlead.com/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visitorData),
      credentials: "include",
    }).catch((error) => console.error("Error:", error));
  }

  if (document.readyState === "complete") {
    trackVisitor();
  } else {
    document.addEventListener("DOMContentLoaded", trackVisitor);
  }
})();
