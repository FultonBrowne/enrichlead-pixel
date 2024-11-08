(function () {
  const script = document.getElementById("pixel-js");
  const pid = script.getAttribute("data-pid");
  const domain = window.location.hostname;

  function getVisitorData() {
    return {
      pid: pid,
      domain: domain,
      path: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString(),
      pageTitle: document.title,
      utmSource: new URLSearchParams(window.location.search).get("utm_source"),
      utmMedium: new URLSearchParams(window.location.search).get("utm_medium"),
      utmCampaign: new URLSearchParams(window.location.search).get(
        "utm_campaign"
      ),
    };
  }

  function trackVisit() {
    const data = getVisitorData();

    // Usando Firebase Functions SDK
    const functionUrl =
      "https://us-central1-visitorfit.cloudfunctions.net/handlePixelData";

    fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data, // Envolvemos los datos en un objeto 'data' como espera Cloud Functions
      }),
    }).catch((error) => {
      console.error("Error sending tracking data:", error);
    });
  }

  // Track initial page load
  if (document.readyState === "complete") {
    trackVisit();
  } else {
    window.addEventListener("load", trackVisit);
  }

  // Track navigation changes (SPA)
  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackVisit();
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
  });

  // Track page exit
  window.addEventListener("beforeunload", () => {
    const data = {
      ...getVisitorData(),
      event: "page_exit",
      timeSpent: (new Date() - performance.timing.navigationStart) / 1000,
    };
    navigator.sendBeacon(functionUrl, JSON.stringify({ data: data }));
  });
})();
