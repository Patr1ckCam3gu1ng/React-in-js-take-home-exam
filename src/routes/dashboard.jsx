const questions = `${process.env.PUBLIC_URL}/questions`;
const forms = `${process.env.PUBLIC_URL}/forms`;
const search = `${process.env.PUBLIC_URL}/search`;
const formsById = `${process.env.PUBLIC_URL}/forms/:id`;
const formVersions = `${process.env.PUBLIC_URL}/forms/:id/formVersions/:id`;

const sections = `${
  process.env.PUBLIC_URL
}/forms/:id/formVersions/:id/sections/:id`;

const sectionSettings = `${
  process.env.PUBLIC_URL
}/forms/:id/formVersions/:id/sections/:id/sectionSettings/:id`;

const dashboardRoutes = [
  {
    path: questions,
    sidebarName: "Questions Details",
    navbarName: "Search Questions",
    component: "Questions"
  },
  {
    path: sectionSettings,
    sidebarName: "Section Settings",
    navbarName: "Section Settings",
    component: "sectionSettings"
  },
  {
    path: sections,
    sidebarName: "Sections",
    navbarName: "Sections",
    component: "Sections"
  },
  {
    path: formVersions,
    sidebarName: "Form Versions",
    navbarName: "Form Versions",
    component: "FormVersions"
  },
  {
    path: formsById,
    sidebarName: "Forms By Id",
    navbarName: "Forms By Id",
    component: "FormsById"
  },
  {
    path: forms,
    sidebarName: "Forms",
    navbarName: "Forms",
    component: "Forms"
  },
  {
    path: search,
    sidebarName: "Search",
    navbarName: "Search",
    component: "Search"
  },
  { redirect: true, path: "/", to: questions, navbarName: "Redirect" }
];

export default dashboardRoutes;
