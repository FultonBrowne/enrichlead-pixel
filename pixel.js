// prettier-ignore
!(function () {
  function initPixel(pid) {
    const functionUrl =
      "https://us-central1-visitorfit.cloudfunctions.net/handlePixelData";
    const domain = window.location.hostname;

    function getVisitorData() {
      return {
        pid: pid,
        domain: domain,
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        pageTitle: document.title,
      };
    }

    // Enviar datos
    fetch(functionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getVisitorData()),
    })
      .then((response) => console.log("✅ Datos enviados"))
      .catch((error) => console.error("❌ Error:", error));

    // Mostrar alerta si está en modo prueba
    if (location.href.includes("test=true")) {
      const message =
        "¡Felicitaciones!\n\nHas instalado el pixel correctamente.\nPuedes cerrar esta pestaña.";
      window.alert(message);
    }
  }

  // Obtener PID del script
  let script = document.currentScript;
  let pid = script?.dataset?.pid;

  // Intentar diferentes métodos para obtener el PID
  if (pid) {
    initPixel(pid);
  } else if (script) {
    pid = new URL(script.src).searchParams.get("pid");
    if (pid) {
      console.log("> debug: usando pid de query", pid);
      initPixel(pid);
    }
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      let backupScript = document.getElementById("pixel-js");
      let backupPid = backupScript?.dataset?.pid;
      if (backupPid) {
        console.log("> debug: usando pid de backup", backupPid);
        initPixel(backupPid);
      }
    });
  }
})();
