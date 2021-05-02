const presence = new Presence({
    clientId: "834628404233240628",
  }),
  estimatedTime = Math.floor(Date.now() / 1000);

let available_logos: Array<string>, schools: Array<string>;

let titleToID: object;

let categoriesEventListener: boolean = false;
let activeCategory: string = "";

fetch("https://cdn.jsdelivr.net/gh/brunoocal/PlatziPreMID/fake-api-data.json")
  .then((res) => res.json())
  .then((data) => {
    available_logos = data.available_logos;
    schools = data.schools;
    titleToID = data.titleToID;

    //I tried unstructuring the data object but it throws an error, whatever xD
  });

const stripPlatziProfileFlags = (url: string) => {
  return url
    .replace("https://static.platzi.com/media/flags/", "")
    .replace(".png", "");
};

const setPresenceFromEvent = (learning_path: string) => {
  activeCategory = learning_path;
};

const getIDByTitle = (title: string) => {
  const keys = Object.keys(titleToID);
  const values = Object.values(titleToID);
  const keyOfTitle = keys.find((key) => key === title);

  if (Boolean(keyOfTitle)) {
    const iKey = keys.indexOf(keyOfTitle);
    return values[iKey];
  }

  return "";
};

presence.on("UpdateData", async () => {
  const presenceData: PresenceData = {
    details: "Pagina desconocida",
    largeImageKey: "lg-dark",
  };

  console.log("act");

  const pathname = document.location.pathname;

  if (pathname.includes("/home")) {
    const SearchInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      ".SearchBar input"
    );

    const InputValues: String[] = [...SearchInputs]
      .map((input) => input.value)
      .filter(Boolean);

    presenceData.state = "Página de inicio";
    delete presenceData.details;

    if (InputValues.length > 0) {
      const rp: string = InputValues[0].replace(/[ ]/gi, "");

      presenceData.state = "Página de inicio";
      delete presenceData.details;

      if (rp !== "") {
        presenceData.details = "Página de inicio";
        presenceData.state = `Buscando: ${InputValues[0]}`;
      }
    }
  } else if (pathname.includes("/blog/buscar")) {
    const Input: HTMLInputElement = document.querySelector(".Search-input");
    const BlogPage: HTMLElement = document.querySelector(
      "a.Pagination-number.is-current"
    );

    presenceData.details = "Viendo el Blog";

    if (Boolean(Input.value)) {
      const rp: string = Input.value.replace(/[ ]/gi, "");

      presenceData.state = "Viendo el Blog";
      delete presenceData.details;

      if (Boolean(BlogPage)) {
        presenceData.state = `Página ${BlogPage.textContent}`;
      }

      if (rp !== "") {
        Boolean(BlogPage)
          ? (presenceData.state = `Buscando: ${Input.value} [Pagina ${BlogPage.textContent}]`)
          : (presenceData.state = `Buscando: ${Input.value}`);
      }
    } else if (Boolean(BlogPage)) {
      presenceData.state = `Página ${BlogPage.textContent}`;
    }
  } else if (pathname.startsWith("/blog/")) {
    presenceData.details = "Viendo el Blog";

    const splittedPathname: string[] = pathname.split("/").filter(Boolean);

    if (splittedPathname.length > 1) {
      const ArticleTitle: HTMLHeadingElement = document.querySelector(
        ".Discussion-title h1"
      );
      const ArticleOwner: HTMLAnchorElement = document.querySelector(
        ".DiscussionInfo-user a"
      );
      const ArticleOwnerPoints: HTMLSpanElement = document.querySelector(
        ".DiscussionInfo span"
      );
      const ArticleDate: HTMLParagraphElement = document.querySelector(
        ".DiscussionInfo-time"
      );

      presenceData.details = `Blog: ${ArticleTitle.textContent}`;
      presenceData.state = `de ${ArticleOwner.textContent} [${ArticleOwnerPoints.textContent} pts] ${ArticleDate.textContent}`;
      presenceData.buttons = [
        { label: "Ver el Artículo", url: `https://platzi.com${pathname}` },
      ];
    }
  } else if (pathname.startsWith("/foro/")) {
    const Input: HTMLInputElement = document.querySelector(
      ".CustomSearchInput-search-input"
    );
    const ForumPage: HTMLAnchorElement = document.querySelector(
      ".Paginator-number.is-current"
    );

    presenceData.details = "Viendo el Foro";

    if (Boolean(Input.value)) {
      const rp: string = Input.value.replace(/[ ]/gi, "");

      presenceData.state = "Viendo el Foro";
      delete presenceData.details;

      if (Boolean(ForumPage)) {
        presenceData.state = `Página ${ForumPage.textContent}`;
      }

      if (rp !== "") {
        Boolean(ForumPage)
          ? (presenceData.state = `Buscando: ${Input.value} [Pagina ${ForumPage.textContent}]`)
          : (presenceData.state = `Buscando: ${Input.value}`);
      }
    } else if (Boolean(ForumPage)) {
      presenceData.state = `Página ${ForumPage.textContent}`;
    }
  } else if (pathname.startsWith("/precios/")) {
    presenceData.state = `Viendo los planes de compra`;
    delete presenceData.details;
  } else if (pathname.startsWith("/empresas/")) {
    presenceData.state = `Viendo el plan para empresas`;
    delete presenceData.details;
  } else if (pathname.startsWith("/comprar/")) {
    const planName = document.querySelector(".Details-name");

    presenceData.details = "Comprando un plan...";
    presenceData.state = planName.textContent;
  } else if (pathname.startsWith("/clases/notificaciones/")) {
    presenceData.details = `Viendo sus notificaciones`;

    const NotificationPage = document.querySelector(
      ".Paginator-number.is-current"
    );

    if (Boolean(NotificationPage)) {
      presenceData.state = `Página ${NotificationPage.textContent}`;
    }
  } else if (pathname.startsWith("/p/")) {
    const UserFullName: HTMLElement = document.querySelector(
      ".ProfileHeader-name"
    );
    const UserPoints: HTMLElement = document.querySelector(
      ".ProfileScore-number.is-green"
    );
    const UserFlag: HTMLElement = document.querySelector(
      "div.ProfileHeader-username > figure > img"
    );
    const UserLink: HTMLAnchorElement = document.querySelector(".UserUrl-link");
    const isUserProfile = [...document.querySelectorAll(".SingleTab")].filter(
      (tab) => tab.textContent === "Mi Portafolio"
    );
    let FinalString: string = "";

    if (Boolean(UserFullName)) FinalString += ` ${UserFullName.textContent} `;
    if (Boolean(UserFlag))
      FinalString += ` ${stripPlatziProfileFlags(
        UserFlag.getAttribute("src")
      )} `;
    if (Boolean(UserPoints)) FinalString += ` [${UserPoints.textContent} pts] `;
    if (Boolean(UserLink)) {
      presenceData.buttons = [
        { label: "Link personal", url: `${UserLink.href}` },
      ];
    }

    presenceData.details = "Viendo el perfil de";

    if (isUserProfile.length > 0) {
      presenceData.details = "Viendo su perfil";
    }

    presenceData.state = FinalString;
  } else if (pathname == "/agenda/") {
    presenceData.state = "Viendo la Agenda";
    delete presenceData.details;
  } else if (pathname == "/live/") {
    presenceData.state = "Viendo Platzi Live";
    presenceData.startTimestamp = estimatedTime;
    presenceData.buttons = [
      { label: "Ver Live", url: `https://platzi.com${pathname}` },
    ];
    delete presenceData.details;
  } else if (
    pathname.includes("/clases/") &&
    pathname.split("/").filter(Boolean).length === 2
  ) {
    const course: HTMLHeadingElement = document.querySelector(
      ".CourseDetail-left-title"
    );
    const teacher: HTMLSpanElement = document.querySelector(
      ".TeacherList-full-name"
    );
    const pathNameSplitted: string[] = pathname.split("/").filter(Boolean);
    presenceData.state = `de ${teacher.textContent}`;
    presenceData.details = course.textContent;
    presenceData.buttons = [
      {
        label: "Ver curso",
        url: `https://platzi.com${pathname}`,
      },
    ];
    if (available_logos.includes(pathNameSplitted[1])) {
      presenceData.largeImageKey = pathNameSplitted[1].toString();
    } else {
      presenceData.largeImageKey = "lg-dark";
    }
  } else if (
    pathname.includes("/clases/") &&
    pathname.split("/").filter(Boolean).length > 2 &&
    !pathname.includes("examen")
  ) {
    const pathNameSplitted: Array<String> = pathname.split("/").filter(Boolean);
    const course: HTMLAnchorElement = document.querySelector(
      ".Header-course-info-content a"
    );
    const episodeNameHTML: string = document.querySelector(
      ".Header-class-title h2"
    ).outerHTML;
    const video: HTMLVideoElement = document.querySelector(".vjs-tech");
    const checkPause: HTMLElement = document.querySelector(
      ".VideoPlayer > div"
    );
    let timestamps: number[];

    const episodeNameHTMLSplitted: string[] = episodeNameHTML.split(">");
    const episodeName: string = episodeNameHTMLSplitted[1].replace("<span", "");
    const actualEpisode: string = episodeNameHTMLSplitted[2].replace(
      /[<!-]/gi,
      ""
    );
    const finalEpisode: string = episodeNameHTMLSplitted[4].replace(
      /[/<span]/gi,
      ""
    );

    presenceData.details = `${episodeName} [${actualEpisode}/ ${finalEpisode}]`;
    presenceData.state = `${course.children[0].textContent}`;
    presenceData.buttons = [
      {
        label: "Ver Curso",
        url: `https://platzi.com${course.getAttribute("href")}`,
      },
      { label: "Ver Clase", url: `https://platzi.com${pathname}` },
    ];

    let pathArray: string[] = pathNameSplitted[1].split("-");
    pathArray.shift();
    const pathName = pathArray.join("-");

    if (available_logos.includes(pathName)) {
      presenceData.largeImageKey = pathName;
    } else {
      presenceData.largeImageKey = "lg-dark";
    }

    if (
      video !== null &&
      !isNaN(video.duration) &&
      checkPause.className.includes("vjs-playing")
    ) {
      timestamps = presence.getTimestampsfromMedia(video);

      presenceData.startTimestamp = timestamps[0];
      presenceData.endTimestamp = timestamps[1];
    }
  } else if (pathname.includes("/cursos/")) {
    //NEW UI, SAME PRESENCE /CLASES/
    const pathNameSplitted: string[] = pathname.split("/").filter(Boolean);
    if (pathNameSplitted.length >= 2) {
      const course: HTMLHeadingElement = document.querySelector(
        ".Hero-content-title"
      );
      const teacher: HTMLElement = document.querySelector(
        ".Hero-teacher-name strong"
      );
      const pathNameSplitted: string[] = pathname.split("/").filter(Boolean);
      presenceData.state = `de ${teacher.textContent}`;
      presenceData.details = course.textContent;

      if (available_logos.includes(pathNameSplitted[1])) {
        presenceData.largeImageKey = pathNameSplitted[1].toString();
      } else {
        presenceData.largeImageKey = "lg-dark";
      }
    } else {
      presenceData.state = "Buscando cursos...";
      presenceData.startTimestamp = estimatedTime;
      delete presenceData.details;
    }
  } else if (pathname.includes("/categorias/")) {
    const pathNameSplitted: string[] = pathname.split("/").filter(Boolean);
    if (pathNameSplitted.length >= 2) {
      const categoryTitle: HTMLSpanElement = document.querySelector(
        ".HeroCoursesItem-title span"
      );
      const learningPaths: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
        ".LearningPathItem"
      );
      presenceData.state = categoryTitle.textContent;

      presenceData.details = activeCategory;

      if (activeCategory !== "") {
        presenceData.details = activeCategory;
      }

      if (!categoriesEventListener) {
        learningPaths.forEach((learning_path) => {
          learning_path.addEventListener("mouseover", () =>
            setPresenceFromEvent(learning_path.querySelector("h2").textContent)
          );
        });
        categoriesEventListener = true;
      }
    }
  } else if (pathname.includes("/tutoriales/")) {
    const CourseName: HTMLAnchorElement = document.querySelector(
      ".Breadcrumb-desktop span:nth-child(2) a"
    );
    const SplittedHref: Array<string> = CourseName.getAttribute("href")
      .split("/")
      .filter(Boolean);

    delete presenceData.details;

    if (available_logos.includes(SplittedHref[1])) {
      presenceData.largeImageKey = SplittedHref[1];
    } else {
      presenceData.largeImageKey = "lg-dark";
    }

    presenceData.details = CourseName.textContent;
    presenceData.state = "Viendo un tutorial...";
  } else if (
    schools.includes(pathname.replace(/[/]/gi, "")) &&
    pathname.split("/").filter(Boolean).length === 1
  ) {
    const SchoolName: string = pathname.replace(/[/]/gi, "");
    const SchoolHeading: HTMLHeadingElement = document.querySelector(
      ".Hero-route-title h1"
    );

    presenceData.state = SchoolHeading.textContent;
    presenceData.details = "Viendo la escuela de";
    presenceData.largeImageKey = SchoolName;
  } else if (pathname.split("/").filter(Boolean).includes("examen")) {
    presenceData.largeImageKey = "lg-dark";

    if (pathname.includes("tomar_examen")) {
      const CourseName: HTMLHeadingElement = document.querySelector(
        ".ExamProgress-top-title"
      );
      const QuestionNumbers: string[] = document
        .querySelector(".ExamProgress-top-count > span")
        .textContent.replace(/de /gi, "")
        .split(" ");

      const Question: HTMLHeadingElement = document.querySelector(
        ".QuestionSelector-title"
      );

      presenceData.details = CourseName.textContent;
      presenceData.state = `${Question.textContent} [${QuestionNumbers.join(
        "-"
      )}]`;

      if (available_logos.includes(getIDByTitle(CourseName.textContent))) {
        presenceData.largeImageKey = getIDByTitle(CourseName.textContent);
      }
    } else {
      if (pathname.includes("review")) {
        const CourseName: HTMLHeadingElement = document.querySelector(
          ".ExamProgress-top-title"
        );
        presenceData.details = CourseName.textContent;
        presenceData.state = `Revisando sus respuestas...`;

        if (available_logos.includes(getIDByTitle(CourseName.textContent))) {
          presenceData.largeImageKey = getIDByTitle(CourseName.textContent);
        }
      } else if (pathname.includes("resultados")) {
        const CourseName: HTMLParagraphElement = document.querySelector(
          ".CourseRow-title"
        );
        const Score: number = parseFloat(
          document.querySelector(".ExamResults-score-grade").textContent
        );
        const Questions: string = document
          .querySelector(".ExamResults-score-answers")
          .textContent.split("/")[1];

        presenceData.details = CourseName.textContent;
        presenceData.state = `Examen ${
          Score >= 9 ? "aprovado" : "no aprovado"
        }. [${Score} en ${Questions} preguntas]`;

        if (available_logos.includes(getIDByTitle(CourseName.textContent))) {
          presenceData.largeImageKey = getIDByTitle(CourseName.textContent);
        }
      } else {
        const CourseName: HTMLHeadingElement = document.querySelector(
          ".StartExamOverview-course-title"
        );
        const ExamQuestions: HTMLLIElement = document.querySelector(
          ".StartExamOverview-list-item:nth-child(2) > strong"
        );

        presenceData.details = CourseName.textContent;
        presenceData.state = `Empezando el exámen [${ExamQuestions.textContent}]`;

        if (available_logos.includes(getIDByTitle(CourseName.textContent))) {
          presenceData.largeImageKey = getIDByTitle(CourseName.textContent);
        }
      }
    }
  }

  presence.setActivity(presenceData);
});
