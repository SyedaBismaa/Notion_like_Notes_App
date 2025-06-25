// ======================= PAGE MANAGEMENT ==========================
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

  window.loadPage = loadPage;

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

// ======================= CANVAS FUNCTION ==========================
function canvasDisplay() {
  const canvasBtn = document.querySelector('.canvas');
  const mainPart = document.querySelector('.main-part');
  const originalContent = mainPart.innerHTML;

  canvasBtn.addEventListener('click', function () {
    mainPart.innerHTML = `
      <div class="drawing-area">
        <h2>Draw here</h2>
        <canvas id="drawing-canvas"></canvas>
        <button class='backbtn'>Go Back</button>
      </div>
    `;

    const drawingCanvas = document.querySelector('#drawing-canvas');
    initializeCanvas(drawingCanvas);

    const backBtn = document.querySelector('.backbtn');
    backBtn.addEventListener('click', function () {
      mainPart.innerHTML = originalContent;

      // ✅ Hide toolbar
      if (toolbar) {
        toolbar.style.display = 'none';
      }

      canvasDisplay();
    });
  });
}
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

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = fontSize;

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
canvasDisplay();

// ======================= DRAWING TOOLS ==========================
var toolbar = document.querySelector('.drawing-toolbar');
const canvas = document.querySelector('.canvas');
var clearbtn = document.querySelector('#clearbtn');

let strokeColor = '#000000';
let fontSize = 12;

function drawExample(ctx, text) {
  ctx.strokeStyle = strokeColor;
  ctx.strokeText(text, 80, 80);
  ctx.globalAlpha = 1.0;
}

canvas.addEventListener('click', function () {
  toolbar.style.display = 'flex';

  const colors = document.querySelectorAll('.color');
  const fontSizeInput = document.querySelector('#font-size');

  colors.forEach(colorBtn => {
    colorBtn.addEventListener('click', e => {
      strokeColor = e.target.getAttribute('data-color');
    });
  });

  fontSizeInput.addEventListener('change', e => {
    fontSize = parseInt(e.target.value);
  });

  const drawingCanvas = document.querySelector('#drawing-canvas');
  if (drawingCanvas) {
    const ctx = drawingCanvas.getContext('2d');
    drawExample(ctx, '');
  }
});

clearbtn.addEventListener('click', function () {
  const drawingCanvas = document.querySelector('#drawing-canvas');
  if (drawingCanvas) {
    const ctx = drawingCanvas.getContext('2d');
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }
  canvasDisplay();
});

// CALENDAR FUNCTION ==========================
function calender() {
  const mainPart = document.querySelector('.main-part');
  const originalContent = mainPart.innerHTML;

  const calenderBtn = document.querySelector('.Calender');

  calenderBtn.addEventListener('click', () => {
    mainPart.innerHTML = `
      <div class="calendar-view">
        <h2>My Calendar</h2>
       <button class="backbtn">Go Back</button>
        <div id="calendar"></div>
      </div>
    `;

    initializeCalendar();

    const backBtn = document.querySelector('.backbtn');
    backBtn.addEventListener('click', function () {
      mainPart.innerHTML = originalContent;
      calender();
    });
  });
}
function initializeCalendar() {
  const savedEvents = JSON.parse(localStorage.getItem('calendarEvents')) || [];
  const calEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calEl, {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    events: savedEvents,
    dateClick: function (info) {
      const title = prompt('Enter Event Title:');
      if (title) {
        const newEvent = {
          title: title,
          start: info.dateStr,
        };
        calendar.addEvent(newEvent);
        saveEvents(calendar);
      }
    },
    eventChange: function () {
      saveEvents(calendar);
    }
  });
  calendar.render();
}
function saveEvents(calendar) {
  const updatedEvents = calendar.getEvents().map(event => {
    return {
      title: event.title,
      start: event.startStr,
      end: event.endStr || null,
    };
  });
  localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
}
calender();

// SEARCH FUNCTION ==========================
function Search() {
  const searchInput = document.querySelector('#searchinput');
  const searchButton = document.querySelector('#Searchbtn');

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const pages = JSON.parse(localStorage.getItem('pages')) || [];
    const matchingPage = pages.find(page => page.Title.toLowerCase() === query);

    if (matchingPage) {
      const loadPageFunction = window.loadPage || null;
      if (loadPageFunction) {
        loadPageFunction(matchingPage.id);
      }
      searchInput.value = ""; 
      return;

    } else if (query === 'calendar' || query === 'calender') {
      const calenderBtn = document.querySelector('.Calender');
      calenderBtn.click();
      searchInput.value = ""; 
      return;

    } else if (query === 'canvas') {
      const canvasBtn = document.querySelector('.canvas');
      canvasBtn.click();
      searchInput.value = ""; 
      return;

    } else {
      alert("No matching page found");
    }
  }

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
  searchButton.addEventListener('click', handleSearch);
}
Search();

//  THEME TOGGLE ==========================
function theme() {
  const themeBtn = document.querySelector('.theme button');

 themeBtn.addEventListener('click', () => {
  if (document.body.classList.contains('light-theme')) {
    // Switch to Dark Theme
    document.body.classList.remove('light-theme');
    document.body.style.backgroundColor = '#2f3437';
    document.body.style.color = '#d1d5db';
    document.querySelector('.navbar').style.backgroundColor = '#2f3437';
    document.querySelector('.sidebar').style.backgroundColor = '#373c3f';
  } else {
    document.body.classList.add('light-theme');
    document.body.style.backgroundColor = '#FAFAFA';
    document.body.style.color = '#333333';
    document.querySelector('.navbar').style.backgroundColor = '#FFFFFF';
    document.querySelector('.sidebar').style.backgroundColor = '#F3F3F3';
  }
});
}
theme();



