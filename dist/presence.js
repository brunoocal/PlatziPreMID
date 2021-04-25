const presence = new Presence({
    clientId: "834628404233240628",
}), tiempoEstimado = Math.floor(Date.now() / 1000);
let available_logos;
let categoriesEventListener = false;
let activeCategory = "";
fetch("https://api.jsonbin.io/b/6080f3c956c62a0c0e8a28a3")
    .then((res) => res.json())
    .then((data) => (available_logos = data.available_logos))
    .then(() => console.log(available_logos));
const stripPlatziProfileFlags = (url) => {
    return url.replace("https://static.platzi.com/media/flags/", "").replace(".png", "");
};
const setPresenceFromEvent = (learning_path) => {
    activeCategory = learning_path;
};
presence.on("UpdateData", async () => {
    const presenceData = {
        details: "Pagina desconocida",
        largeImageKey: "lg-dark",
    };
    const pathname = document.location.pathname;
    console.log(pathname);
    if (Boolean(pathname)) {
        if (pathname.includes("/home")) {
            const SearchInputs = document.querySelectorAll(".SearchBar input");
            const InputValues = [...SearchInputs].map((input) => input.value).filter(Boolean);
            presenceData.state = "Página de inicio";
            delete presenceData.details;
            if (InputValues.length > 0) {
                presenceData.details = "Página de inicio";
                presenceData.state = `Buscando: ${InputValues[0]}`;
            }
        }
        else if (pathname.includes("/blog/buscar")) {
            const Input = document.querySelector(".Search-input");
            const BlogPage = document.querySelector("a.Pagination-number.is-current");
            presenceData.details = "Viendo el Blog";
            if (Boolean(Input.value)) {
                presenceData.state = `Buscando: ${Input.value}`;
            }
            else if (Boolean(BlogPage)) {
                presenceData.state = `Página ${BlogPage.textContent}`;
            }
        }
        else if (pathname.startsWith("/blog/")) {
            presenceData.details = "Viendo el Blog";
            const splittedPathname = pathname.split("/").filter(Boolean);
            if (splittedPathname.length > 1) {
                const ArticleTitle = document.querySelector(".Discussion-title h1");
                const ArticleOwner = document.querySelector(".DiscussionInfo-user a");
                const ArticleOwnerPoints = document.querySelector(".DiscussionInfo span");
                const ArticleDate = document.querySelector(".DiscussionInfo-time");
                presenceData.details = `Blog: ${ArticleTitle.textContent}`;
                presenceData.state = `de ${ArticleOwner.textContent} [${ArticleOwnerPoints.textContent} pts] ${ArticleDate.textContent}`;
                presenceData.buttons = [{ label: "Ver el Artículo", url: `https://platzi.com${document.location.pathname}` }];
            }
        }
        else if (pathname.startsWith("/foro/")) {
            const Input = document.querySelector(".CustomSearchInput-search-input");
            const ForumPage = document.querySelector(".Paginator-number.is-current");
            presenceData.details = "Viendo el Foro";
            if (Boolean(Input.value)) {
                presenceData.state = `Buscando: ${Input.value}`;
            }
            else if (Boolean(ForumPage)) {
                presenceData.state = `Página: ${ForumPage.textContent}`;
            }
        }
        else if (pathname.startsWith("/precios/")) {
            presenceData.state = `Viendo los planes de compra`;
            delete presenceData.details;
        }
        else if (pathname.startsWith("/clases/notificaciones/")) {
            presenceData.details = `Viendo sus notificaciones`;
            const NotificationPage = document.querySelector(".Paginator-number.is-current");
            if (Boolean(NotificationPage)) {
                presenceData.state = `Página ${NotificationPage.textContent}`;
            }
        }
        else if (pathname.startsWith("/p/")) {
            const UserFullName = document.querySelector(".ProfileHeader-name");
            const UserPoints = document.querySelector(".ProfileScore-number.is-green");
            const UserFlag = document.querySelector("div.ProfileHeader-username > figure > img");
            const UserLink = document.querySelector(".UserUrl-link");
            const isUserProfile = [...document.querySelectorAll(".SingleTab")].filter(tab => tab.textContent === "Mi Portafolio");
            let FinalString = "";
            if (Boolean(UserFullName))
                FinalString += ` ${UserFullName.textContent} `;
            if (Boolean(UserFlag))
                FinalString += ` ${stripPlatziProfileFlags(UserFlag.getAttribute("src"))} `;
            if (Boolean(UserPoints))
                FinalString += ` [${UserPoints.textContent} pts] `;
            if (Boolean(UserLink)) {
                presenceData.buttons = [{ label: "Link personal", url: `${UserLink.href}` }];
            }
            presenceData.details = "Viendo el perfil de";
            if (isUserProfile.length > 0) {
                presenceData.details = "Viendo su perfil";
            }
            presenceData.state = FinalString;
        }
        else if (pathname == "/agenda/") {
            presenceData.state = "Viendo la Agenda";
            delete presenceData.details;
        }
        else if (pathname == "/live/") {
            presenceData.state = "Viendo Platzi Live";
            presenceData.startTimestamp = tiempoEstimado;
            delete presenceData.details;
        }
        else if (pathname.includes("/clases/") &&
            pathname.split("/").filter(Boolean).length === 2) {
            const course = document.querySelector(".CourseDetail-left-title");
            const teacher = document.querySelector(".TeacherList-full-name");
            const pathNameSplitted = pathname
                .split("/")
                .filter(Boolean);
            presenceData.details = course.textContent;
            presenceData.state = `de ${teacher.textContent}`;
            if (available_logos.includes(pathNameSplitted[1])) {
                presenceData.largeImageKey = pathNameSplitted[1].toString();
            }
            else {
                presenceData.largeImageKey = "lg-dark";
            }
        }
        else if (pathname.includes("/clases/") &&
            pathname.split("/").filter(Boolean).length > 2) {
            const classTitle = document.querySelector(".Header-class-title h2");
            const course = document.querySelector(".Header-course-info-content a h1");
            const pathNameSplitted = pathname
                .split("/")
                .filter(Boolean);
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
            if (video !== null &&
                !isNaN(video.duration) &&
                checkPause.className.includes("vjs-playing")) {
                timestamps = presence.getTimestampsfromMedia(video);
                console.log(timestamps);
                presenceData.startTimestamp = timestamps[0];
                presenceData.endTimestamp = timestamps[1];
            }
        }
        else if (pathname.includes("/cursos/")) {
            const pathNameSplitted = pathname
                .split("/")
                .filter(Boolean);
            if (pathNameSplitted.length >= 2) {
                const course = document.querySelector(".Hero-content-title");
                const teacher = document.querySelector(".Hero-teacher-name strong");
                const pathNameSplitted = pathname
                    .split("/")
                    .filter(Boolean);
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
        else if (pathname.includes("/categorias/")) {
            const pathNameSplitted = pathname
                .split("/")
                .filter(Boolean);
            if (pathNameSplitted.length >= 2) {
                const categoryTitle = document.querySelector(".HeroCoursesItem-title span");
                const learningPaths = document.querySelectorAll(".LearningPathItem");
                presenceData.state = categoryTitle.textContent;
                presenceData.details = activeCategory;
                if (activeCategory !== "") {
                    presenceData.details = activeCategory;
                }
                if (!categoriesEventListener) {
                    learningPaths.forEach((learning_path) => {
                        learning_path.addEventListener("mouseover", () => setPresenceFromEvent(learning_path.querySelector("h2").textContent));
                    });
                    categoriesEventListener = true;
                }
            }
        }
    }
    presence.setActivity(presenceData);
});
