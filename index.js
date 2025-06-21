let pages = [
    {  
        'Title':"Untitled",
        "Content":" Start writing",
        "id": Date.now()
    },
      {  
        'Title':"Untitled",
        "Content":" Start writing",
        "id": Date.now()
    }
    
]

console.log(pages);

var addPage = document.querySelector('#Addpage');

addPage.addEventListener('click',function(){

    function Createpage(){
        
         var newPageObject = {Title: "Untitled", Content: "Start writing", id: Date.now() };

         pages.push(newPageObject);

         localStorage.setItem("pages", JSON.stringify(pages))
    }
   
    Createpage();
  
  function Render() {
    var pageList = document.querySelector(".page-list");
    pageList.innerHTML = ''; 
    pages.forEach(page => {
        var titleDiv = document.createElement("div");
        titleDiv.textContent = page.Title;
        titleDiv.addEventListener('click', () => {
            currentPageId = page.id;
            Render(); 
        });
        pageList.appendChild(titleDiv);
    });
}

Render();
});






