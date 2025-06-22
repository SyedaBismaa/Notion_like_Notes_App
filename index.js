 function addNewPage(){
  let pages = JSON.parse(localStorage.getItem("pages")) || [];
let currentPageId = null;

const addPageBtn = document.querySelector('#Addpage');
const pageList = document.querySelector('.page-list');
const pageContent = document.querySelector('#page-content');


addPageBtn.addEventListener('click', createPage);


function createPage() {
  const newPageObject = {
    "Title": "New page",
    "Content": "Start writing",
    "id": Date.now()
  };
  pages.push(newPageObject);
  savePages();
  render();
}

function render() {
  pageList.innerHTML = "";
  pages.forEach(page => {
    const titleDiv = document.createElement("div");
    titleDiv.textContent = page.Title;

    titleDiv.addEventListener('click', () => {
      currentPageId = page.id;
      loadPage(page.id);
    });

    pageList.appendChild(titleDiv);
  });
}

function loadPage(pageId) {
  const page = pages.find(p => p.id === pageId);
  if (!page) return;

  pageContent.innerHTML = `
    <h1 contenteditable="true" class="title">${page.Title}</h1>
    <div contenteditable="true" class="content">${page.Content}</div>
  `;

  pageContent.querySelector('.title').addEventListener('input', e => {
    page.Title = e.target.textContent;
    savePages();
    render();
  });

  pageContent.querySelector('.content').addEventListener('input', e => {
    page.Content = e.target.innerHTML;
    savePages();
  });
}

function savePages() {
  localStorage.setItem("pages", JSON.stringify(pages));
}

render();


if (pages.length > 0) {
  currentPageId = pages[0].id;
  loadPage(currentPageId);
}

 }

 addNewPage();