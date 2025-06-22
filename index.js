function addNewPage() {
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
      const pageItem = document.createElement("div");
      pageItem.classList.add("page-item");

      const titleDiv = document.createElement("span");
      titleDiv.textContent = page.Title;
      titleDiv.classList.add("page-title");
      titleDiv.addEventListener('click', () => {
        currentPageId = page.id;
        loadPage(page.id);
      });

      const trashBtn = document.createElement('button');
      trashBtn.innerHTML = '🗑️';
      trashBtn.classList.add("trash-button");
      trashBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deletePage(page.id);
      });

      pageItem.appendChild(titleDiv);
      pageItem.appendChild(trashBtn);
      pageList.appendChild(pageItem);
    });
  }

  function deletePage(pageId) {
    pages = pages.filter(page => page.id !== pageId);
    savePages();

    if (currentPageId == pageId) {
      currentPageId = null;
      pageContent.innerHTML = "";
    }
    render();
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

  // Initial Load
  render();
  if (pages.length > 0) {
    currentPageId = pages[0].id;
    loadPage(currentPageId);
  }
}


addNewPage();


function canvasDisplay() {
  var canvasbtn = document.querySelector('.canvas');
  const mainPart = document.querySelector('.main-part');

  canvasbtn.addEventListener('click', function() {
    mainPart.innerHTML = `
      <div class="drawing-area">
        <h2>Draw Here</h2>
        <canvas id="drawing-canvas"></canvas>
      </div>
    `;
    const drawingCanvas = document.querySelector('#drawing-canvas');
    initializeCanvas(drawingCanvas);
  });  


  function initializeCanvas(drawingCanvas) {
  const ctx = drawingCanvas.getContext('2d');

  function resizeCanvas() {
    drawingCanvas.width = drawingCanvas.clientWidth;
    drawingCanvas.height = drawingCanvas.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let isDrawing = false;

  drawingCanvas.addEventListener('mousedown', e => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  drawingCanvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });
  drawingCanvas.addEventListener('mouseup', e => {
    isDrawing = false;
  });
  drawingCanvas.addEventListener('mouseleave', e => {
    isDrawing = false;
  });
}

}

canvasDisplay();
