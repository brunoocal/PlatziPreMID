const presence = new Presence({
    clientId: "834118889734012969"
  }), 
  tiempoEstimado = Math.floor(Date.now() / 1000);
    
  
presence.on("UpdateData", async () => {
    const presenceData: PresenceData = {
        details: "Pagina desconocida",
        largeImageKey: "lg"
    };
    
    if (document.location.pathname == "/home" || !document.location.pathname) {
        presenceData.state = "Inicio";
        presenceData.startTimestamp = tiempoEstimado;
        delete presenceData.details;
    }
    else if (document.location.pathname.startsWith("/blog/")) {
        presenceData.state = "Viendo el Blog";
        presenceData.startTimestamp = tiempoEstimado;
        delete presenceData.details;
    }
    else if (document.location.pathname.startsWith("/foro/")) {
        presenceData.state = "Viendo el Foro";
        presenceData.startTimestamp = tiempoEstimado;
        delete presenceData.details;
    }
    else if (document.location.pathname == "/agenda/" || !document.location.pathname) {
        presenceData.state = "Viendo la Agenda";
        presenceData.startTimestamp = tiempoEstimado;
        delete presenceData.details;
    }  else if (document.location.pathname == "/live/" || !document.location.pathname) {
        presenceData.state = "Viendo Platzi Live";
        presenceData.startTimestamp = tiempoEstimado;
        delete presenceData.details;
    }
  
    presence.setActivity(presenceData);
  });
  