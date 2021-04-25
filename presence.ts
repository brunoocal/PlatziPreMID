
const presence = new Presence({
    clientId: "834628404233240628",

}), tiempoEstimado = Math.floor(Date.now() / 1000);


let available_logos: any;
let categoriesEventListener: Boolean = false;
let activeCategory: string = "";

fetch("https://api.jsonbin.io/b/6080f3c956c62a0c0e8a28a3")
    .then((res) => res.json())
    .then((data) => (available_logos = data.available_logos))
    .then(() => console.log(available_logos));

const stripPlatziProfileFlags = (url: string) => {
    return url.replace("https://static.platzi.com/media/flags/", "").replace(".png", "");
}

const setPresenceFromEvent = (learning_path: string) => {
    activeCategory = learning_path;
};

presence.on("UpdateData", async () => {
    const presenceData: PresenceData = {
        details: "Pagina desconocida",
        largeImageKey: "lg-dark",
    };


    const pathname = document.location.pathname;

    if (Boolean(pathname)) {
        if (pathname.includes("/home")) {

            const SearchInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(".SearchBar input");

            const InputValues = [...SearchInputs].map((input) => input.value).filter(Boolean);

            presenceData.state = "Página de inicio";
            delete presenceData.details;

            if (InputValues.length > 0) {
                let rp = InputValues[0].replace(/[ ]/gi, "")

                if (rp == ""){
                    presenceData.state = "Página de inicio";
                    delete presenceData.details;
                } else {
                    presenceData.details = "Página de inicio";
                    presenceData.state = `Buscando: ${InputValues[0]}`;
                }
            }

        }
        else if (pathname.includes("/blog/buscar")) {

            const Input: HTMLInputElement = document.querySelector(".Search-input");
            const BlogPage: HTMLElement = document.querySelector("a.Pagination-number.is-current");

            presenceData.details = "Viendo el Blog";

            if (Boolean(Input.value)) {
                let rp = Input.value.replace(/[ ]/gi, "");

                if (rp == ""){
                    if (Boolean(BlogPage)) {
                        presenceData.state = `Página ${BlogPage.textContent}`;
                    } else {
                        presenceData.state = "Viendo el Blog";
                        delete presenceData.details;
                    }
                } else {
                    if (Boolean(BlogPage)) {
                        presenceData.state = `Buscando: ${Input.value} [Pagina ${BlogPage.textContent}]`;
                    } else {
                        presenceData.state = `Buscando: ${Input.value}`;                        
                    }
                }
            } else if (Boolean(BlogPage)) {
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
                presenceData.state = `de ${ArticleOwner.textContent} [${ArticleOwnerPoints.textContent} pts] ${ArticleDate.textContent}`
                presenceData.buttons = [{ label: "Ver el Artículo", url: `https://platzi.com${pathname}` }];
            }

        }
        else if (pathname.startsWith("/foro/")) {

            const Input: HTMLInputElement = document.querySelector(".CustomSearchInput-search-input");
            const ForumPage: HTMLElement = document.querySelector(".Paginator-number.is-current");

            presenceData.details = "Viendo el Foro";

            if (Boolean(Input.value)) {
                let rp = Input.value.replace(/[ ]/gi, "");

                if (rp == ""){
                    if (Boolean(ForumPage)) {
                        presenceData.state = `Página ${ForumPage.textContent}`;
                    } else {
                        presenceData.state = "Viendo el Foro";
                        delete presenceData.details;
                    }
                } else {
                    if (Boolean(ForumPage)) {
                        presenceData.state = `Buscando: ${Input.value} [Pagina ${ForumPage.textContent}]`;
                    } else {
                        presenceData.state = `Buscando: ${Input.value}`;                        
                    }
                }
            } else if (Boolean(ForumPage)) {
                presenceData.state = `Página ${ForumPage.textContent}`;
            }
        }
        else if (pathname.startsWith("/precios/")) {
            presenceData.state = `Viendo los planes de compra`;
            delete presenceData.details;
        }
        else if (pathname.startsWith("/empresas/")) {
            presenceData.state = `Viendo el plan para empresas`;
            delete presenceData.details;
        }
        else if (pathname.startsWith("/comprar/")) {
            if (pathname.includes("basic")) {
                presenceData.details = "Comprando un plan";
                presenceData.state = "Basic";
            }  else if (pathname.includes("plus")) {
                presenceData.details = "Comprando un plan";
                presenceData.state = "Expert+";
            }  else if (pathname.includes("expert")) {
                presenceData.details = "Comprando un plan";
                presenceData.state = "Expert";
            }
        }
        else if (pathname.startsWith("/clases/notificaciones/")) {
            presenceData.details = `Viendo sus notificaciones`;

            const NotificationPage = document.querySelector(".Paginator-number.is-current");

            if (Boolean(NotificationPage)) {
                presenceData.state = `Página ${NotificationPage.textContent}`
            }
        }
        else if (pathname.startsWith("/p/")) {

            const UserFullName: HTMLElement = document.querySelector(".ProfileHeader-name");
            const UserPoints: HTMLElement = document.querySelector(".ProfileScore-number.is-green");
            const UserFlag: HTMLElement = document.querySelector("div.ProfileHeader-username > figure > img");
            const UserLink: HTMLAnchorElement = document.querySelector(".UserUrl-link");
            const isUserProfile = [...document.querySelectorAll(".SingleTab")].filter(tab => tab.textContent === "Mi Portafolio");
            let FinalString = "";

            if (Boolean(UserFullName)) FinalString += ` ${UserFullName.textContent} `;
            if (Boolean(UserFlag)) FinalString += ` ${stripPlatziProfileFlags(UserFlag.getAttribute("src"))} `;
            if (Boolean(UserPoints)) FinalString += ` [${UserPoints.textContent} pts] `;
            if (Boolean(UserLink)) {
                presenceData.buttons = [{ label: "Link personal", url: `${UserLink.href}` }];
            }

            presenceData.details = "Viendo el perfil de";

            if (isUserProfile.length > 0) {
                presenceData.details = "Viendo su perfil"
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
            presenceData.buttons = [{ label: "Ver Live", url: `https://platzi.com${pathname}` }];
            delete presenceData.details;

        }
        else if(pathname.includes("/clases/") && pathname.split("/").filter(Boolean).length === 2){
            const course = document.querySelector(".CourseDetail-left-title");
            const teacher = document.querySelector(".TeacherList-full-name");
            const pathNameSplitted = pathname.split("/").filter(Boolean)
            presenceData.state = `de ${teacher.textContent}`
            presenceData.details = course.textContent;
            presenceData.buttons = [{ label: "Curso", url: `https://platzi.com${document.querySelector("#material-view > div > div.MaterialView.MaterialView-type--video > div.MaterialView-video > div.MaterialView-content > div > div.Header.material-undefined > div.Header-course > div.Header-course-info > div > a").getAttribute("href")}` }, { label: "Clase", url: `https://platzi.com${pathname}`}];
            if(available_logos.includes(pathNameSplitted[1])){

                presenceData.largeImageKey = pathNameSplitted[1].toString();
            } else {
                presenceData.largeImageKey = "lg-dark";
            }

        }
        else if(pathname.includes("/clases/") && pathname.split("/").filter(Boolean).length > 2){

            const course = document.querySelector(".Header-course-info-content a h1");
            const pathNameSplitted = pathname.split("/").filter(Boolean);
            const video: HTMLVideoElement = document.querySelector(".vjs-tech");
            const checkPause = document.querySelector(".VideoPlayer > div");
            let timestamps;

            const curso = document.querySelector("#material-view > div > div.MaterialView.MaterialView-type--video > div.MaterialView-video > div.MaterialView-content > div > div.Header.material-undefined > div.Header-class > div.Header-class-title > h2").outerHTML

            const sp = curso.split(">");
            const sp2 = curso.split(">");
            const sp3 = curso.split(">");
            const rp = sp[1].replace("<span", "");
            const rp2 = sp2[2].replace(/[<!-]/gi, "")
            const rp3 = sp3[4].replace(/[/<span]/gi, "");

            presenceData.details = `${rp} [${rp2}/ ${rp3}]`;
            presenceData.state = `${course.textContent}`
            presenceData.buttons = [{ label: "Curso", url: `https://platzi.com${pathname}` }]

            let pathArray: string[] = pathNameSplitted[1].split("-");
            pathArray.shift();
            const pathName = pathArray.join("-");
            
            if(available_logos.includes(pathName)){
                presenceData.largeImageKey = pathName;
            }else{
                presenceData.largeImageKey = "lg-dark";
            }

            if (video !== null && !isNaN(video.duration) && checkPause.className.includes("vjs-playing")) {
                timestamps = presence.getTimestampsfromMedia(video);

                presenceData.startTimestamp = timestamps[0];
                presenceData.endTimestamp = timestamps[1];

            }
        }
        else if(pathname.includes("/cursos/")){
            //NEW UI, SAME PRESENCE /CLASES/
            const pathNameSplitted = pathname.split("/").filter(Boolean);
            if(pathNameSplitted.length >= 2){
                const course = document.querySelector(".Hero-content-title");
                const teacher = document.querySelector(".Hero-teacher-name strong");
                const pathNameSplitted = pathname.split("/").filter(Boolean)
                presenceData.state = `de ${teacher.textContent}`
                presenceData.details = course.textContent;

                if(available_logos.includes(pathNameSplitted[1])){
                    presenceData.largeImageKey = pathNameSplitted[1].toString();
                }else{
                    presenceData.largeImageKey = "lg-dark";
                }
            }else{

                presenceData.state = "Buscando cursos...";
                presenceData.startTimestamp = tiempoEstimado;
                delete presenceData.details;
            }
        }
        else if(pathname.includes("/categorias/")){
            const pathNameSplitted = pathname.split("/").filter(Boolean);
            if(pathNameSplitted.length >= 2){
                const categoryTitle = document.querySelector(".HeroCoursesItem-title span")
                const learningPaths = document.querySelectorAll(".LearningPathItem");
                presenceData.state = categoryTitle.textContent;

                const setPresenceFromEvent = (learning_path: string) => {
                    activeCategory = learning_path
                }


                presenceData.details = activeCategory;

                if(activeCategory !== ""){
                    presenceData.details = activeCategory;
                }


                if(!categoriesEventListener){
                    learningPaths.forEach(learning_path => {
                        learning_path.addEventListener("mouseover", () => setPresenceFromEvent(learning_path.querySelector("h2").textContent))

                    });
                    categoriesEventListener = true;
                }
            }
        }
    }

    presence.setActivity(presenceData);
});
