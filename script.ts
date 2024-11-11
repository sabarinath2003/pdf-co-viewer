// public/script.js
const socket = io();
let pdfDoc = null;
let currentPage = 1;
let isAdmin = window.location.search.includes("admin=true");

// Load PDF
const url = 'https://drive.google.com/file/d/1nflzOEWDMawaCWkkZa46GXiomsQV5Jby/view?usp=sharing'; // Replace with your PDF URL

pdfjsLib.getDocument(url).promise.then((pdf) => {
  pdfDoc = pdf;
  renderPage(currentPage);
});

function renderPage(pageNum) {
  pdfDoc.getPage(pageNum).then((page) => {
    const canvas = document.getElementById("pdf-canvas");
    const ctx = canvas.getContext("2d");

    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({ canvasContext: ctx, viewport }).promise.then(() => {
      document.getElementById("page-info").textContent = `Page ${currentPage}`;
    });
  });
}

function changePage(newPage) {
  if (newPage >= 1 && newPage <= pdfDoc.numPages) {
    currentPage = newPage;
    renderPage(newPage);
    if (isAdmin) {
      socket.emit("admin-change-page", newPage);
    }
  }
}

document.getElementById("prev-page").addEventListener("click", () => {
  changePage(currentPage - 1);
});

document.getElementById("next-page").addEventListener("click", () => {
  changePage(currentPage + 1);
});

// Real-time synchronization
socket.on("page-change", (page) => {
  if (page !== currentPage) {
    currentPage = page;
    renderPage(page);
  }
});
