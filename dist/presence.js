const presence = new Presence({
    clientId: "834628404233240628"
}), tiempoEstimado = Math.floor(Date.now() / 1000);
let available_logos;
fetch("https://api.jsonbin.io/b/6080f3c956c62a0c0e8a28a3")
    .then(res => res.json())
    .then(data => available_logos = data.available_logos)
    .then(() => console.log(available_logos));
presence.on("UpdateData", async () => {
    const presenceData = {
        details: "Pagina desconocida",
        largeImageKey: "lg-dark"
    };
    console.log("act");
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
    }
    else if (document.location.pathname == "/live/" || !document.location.pathname) {
        presenceData.state = "Viendo Platzi Live";
        presenceData.startTimestamp = tiempoEstimado;
        delete presenceData.details;
    }
    else if (document.location.pathname.includes("/clases/") && document.location.pathname.split("/").filter(Boolean).length === 2) {
        const course = document.querySelector(".CourseDetail-left-title");
        const teacher = document.querySelector(".TeacherList-full-name");
        const pathNameSplitted = document.location.pathname.split("/").filter(Boolean);
        presenceData.state = `de ${teacher.textContent}`;
        presenceData.details = course.textContent;
        if (available_logos.includes(pathNameSplitted[1])) {
            presenceData.largeImageKey = pathNameSplitted[1].toString();
        }
        else {
            presenceData.largeImageKey = "lg-dark";
        }
    }
    presence.setActivity(presenceData);
});
