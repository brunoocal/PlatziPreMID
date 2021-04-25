const presence = new Presence({
    clientId: "834628404233240628"
}), tiempoEstimado = Math.floor(Date.now() / 1000);

let available_logos;
let categoriesEventListener = false;
let activeCategory = "";
fetch("https://api.jsonbin.io/b/6080f3c956c62a0c0e8a28a3")
    .then(res => res.json())
    .then(data => available_logos = data.available_logos)
    .then(() => console.log(available_logos));

presence.on("UpdateData", async () => {
    const presenceData = {
        details: "Pagina desconocida",
        largeImageKey: "lg-dark"
 };
    if (document.location.pathname == "/home" || !document.location.pathname) {
        if(document.querySelector("#home-student > div > div.u-wrapper > div > div.Catalog > div > div.Catalog-search > div.SearchBar > input").value == ""){
        presenceData.state = "Inicio";
        delete presenceData.details;
        } else {
            presenceData.details = "Inicio";
            presenceData.state = `Buscando: ${document.querySelector("#home-student > div > div.u-wrapper > div > div.Catalog > div > div.Catalog-search > div.SearchBar > input").value}`

        }
    }
    else if (document.location.pathname.startsWith("/blog/buscar")) {
        if (document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div.LabTutorials-row > div > div.col-xs-12.col-md-5 > form > input").value == "") {
            presenceData.details = "Viendo el Blog";
            presenceData.state = `Pagina ${document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div:nth-child(4) > div > div > div > a.Pagination-number.is-current").textContent}`;
        } else if (document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div:nth-child(3) > div > div > div > a.Pagination-number.is-current") == null) {
            if (document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div:nth-child(4) > div > div > div > a.Pagination-number.is-current") == null) {
                presenceData.details = "Viendo el Blog";
                presenceData.state = `Buscando: ${document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div > div > div > form > input").value}`;
            } else {
                presenceData.details = "Viendo el Blog";
                presenceData.state = `Buscando: ${document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div.LabTutorials-row > div > div.col-xs-12.col-md-5 > form > input").value} [Pagina ${document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div:nth-child(4) > div > div > div > a.Pagination-number.is-current").textContent}]`;
            }
        } else {
            presenceData.details = "Viendo el Blog";
            presenceData.state = `Buscando: ${document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div.LabTutorials-row > div > div.col-xs-12.col-md-5 > form > input").value} [Pagina ${document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div:nth-child(3) > div > div > div > a.Pagination-number.is-current").textContent}]`;
        }
    }
    else if (document.location.pathname.startsWith("/blog/")) {
        presenceData.details = "Viendo el Blog";
        presenceData.state = `Pagina ${document.querySelector("#lab-tutorials > div.LabTutorials-contributions > div > div > div:nth-child(4) > div > div > div > a.Pagination-number.is-current").textContent}`
    }
    else if (document.location.pathname.startsWith("/foro/")) {
        if (document.querySelector("#platzi-forum > div > div.u-row-wrapper > div > div > div.ForumContent-paginator > div > div.Paginator-pages > a.Paginator-number.is-current") == null){
                presenceData.details = "Viendo el Foro"
                presenceData.state = `Buscando: ${document.querySelector("#platzi-forum > div > div.Hero > div > div.Hero-content-left > div.Hero-content-left-btn > div > div > input").value}`
        } else {
            if (document.querySelector("#platzi-forum > div > div.Hero > div > div.Hero-content-left > div.Hero-content-left-btn > div > div > input").value == ""){
                presenceData.details = "Viendo el Foro"
                presenceData.state = `Pagina ${document.querySelector("#platzi-forum > div > div.u-row-wrapper > div > div > div.ForumContent-paginator > div > div.Paginator-pages > a.Paginator-number.is-current").textContent}`
            } else {
                presenceData.details = "Viendo el Foro"
                presenceData.state = `Buscando: ${document.querySelector("#platzi-forum > div > div.Hero > div > div.Hero-content-left > div.Hero-content-left-btn > div > div > input").value} [Pagina ${document.querySelector("#platzi-forum > div > div.u-row-wrapper > div > div > div.ForumContent-paginator > div > div.Paginator-pages > a.Paginator-number.is-current").textContent}]`
            }
        }
    }
    else if (document.location.pathname.startsWith("/precios/")) {
        presenceData.state = `Viendo los planes de compra`;
        delete presenceData.details;
    }
    else if (document.location.pathname.startsWith("/clases/notificaciones/")) {
        presenceData.details = `Viendo sus notificaciones`
        presenceData.state = `Pagina ${document.querySelector("#tinkerbell > div > div.Layout > div > div.Paginator > div.Paginator-pages > div.Paginator-number.is-current").textContent}`
    }
    else if (document.location.pathname.startsWith("/p/")) {
        presenceData.details = `Viendo su perfil`
        presenceData.state = `${document.querySelector("#profilePersonal > div > div.ProfileHeader > div > div.row.center-xs.center-md.center-sm > div.ProfileHeader-info.col-xs-12.col-sm-5.col-md-6 > div.ProfileHeader-username > h1").textContent} [${document.querySelector("#profilePersonal > div > div.ProfileHeader > div > div.row.center-xs.center-md.center-sm > div.col-xs-12.col-sm-4.col-md-3.col-md-offset-1 > div > div:nth-child(1) > div:nth-child(1) > div.ProfileScore-number.is-green").textContent} Puntos]`
    }
    else if (document.location.pathname == "/agenda/" || !document.location.pathname) {
        presenceData.state = "Viendo la Agenda";
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
    else if (document.location.pathname.includes("/clases/") && document.location.pathname.split("/").filter(Boolean).length > 2) {
        const classTitle = document.querySelector(".Header-class-title h2");
        const course = document.querySelector(".Header-course-info-content a h1");
        const pathNameSplitted = document.location.pathname.split("/").filter(Boolean);
        const video = document.querySelector(".vjs-tech");
        const checkPause = document.querySelector(".VideoPlayer > div");
        let timestamps;
        presenceData.details = classTitle.textContent;
        presenceData.state = `${course.textContent}`;
        let pathArray = pathNameSplitted[1].split("-");
        pathArray.shift();
        const pathName = pathArray.join("-");
        if (available_logos.includes(pathName)) {
            presenceData.largeImageKey = pathName;
        }
        else {
            presenceData.largeImageKey = "lg-dark";
        }
        if (video !== null && !isNaN(video.duration) && checkPause.className.includes("vjs-playing")) {
            timestamps = presence.getTimestampsfromMedia(video);
            console.log(timestamps);
            presenceData.startTimestamp = timestamps[0];
            presenceData.endTimestamp = timestamps[1];
        }
    }
    else if (document.location.pathname.includes("/cursos/")) {
        const pathNameSplitted = document.location.pathname.split("/").filter(Boolean);
        if (pathNameSplitted.length >= 2) {
            const course = document.querySelector(".Hero-content-title");
            const teacher = document.querySelector(".Hero-teacher-name strong");
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
        else {
            presenceData.state = "Buscando cursos...";
            presenceData.startTimestamp = tiempoEstimado;
            delete presenceData.details;
        }
    }
    else if (document.location.pathname.includes("/categorias/")) {
        const pathNameSplitted = document.location.pathname.split("/").filter(Boolean);
        if (pathNameSplitted.length >= 2) {
            const categoryTitle = document.querySelector(".HeroCoursesItem-title span");
            const learningPaths = document.querySelectorAll(".LearningPathItem");
            presenceData.state = categoryTitle.textContent;
            const setPresenceFromEvent = (learning_path) => {
                activeCategory = learning_path;
            };
            presenceData.details = activeCategory;
            if (activeCategory !== "") {
                presenceData.details = activeCategory;
            }
            if (!categoriesEventListener) {
                learningPaths.forEach(learning_path => {
                    learning_path.addEventListener("mouseover", () => setPresenceFromEvent(learning_path.querySelector("h2").textContent));
                });
                categoriesEventListener = true;
            }
        }
    }
    presence.setActivity(presenceData);
});
