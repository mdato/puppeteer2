const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // abre el navegador y muestra lo que va haciendo
  });
  const page = await browser.newPage();
  await page.goto("https://www.amazon.com");

  // captura foto
  //await page.screenshot({ path: 'amazon2.jpg', fullPage: true });

  //cuadro de busqueda rellenando el campo
  await page.type("#twotabsearchtextbox", "python book");
  //await page.screenshot({ path: 'amazon3.jpg', fullPage: true });

  //hago clic en buscar
  await page.click(".nav-search-submit input");
  await page.waitForSelector("[data-component-type=s-search-result]");
  await page.waitForTimeout(2000);
  //await page.screenshot({ path: 'amazon4.jpg', fullPage: true });

  const enlaces = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      "[data-component-type=s-search-result] h2 a"
    );
    const links = [];
    for (let element of elements) {
      links.push(element.href);
    }
    return links;
  });

  //console.log(enlaces.length);

  // creo un array de libros vacios
  const books = [];

  // abre de a una cada pagina y la cierra
  let i = 0;
  for (let enlace of enlaces) {
    if (i < 4) {
      i++;
      await page.goto(enlace);

      // abre una pagina y espera a que cargue el titulo
      await page.waitForSelector("#productTitle");
      const book = await page.evaluate(() => {
        const tmp = {};
        tmp.title = document.querySelector("#productTitle").innerText;
        tmp.author = document.querySelector(".author a").innerText;
        tmp.price = document.querySelector("#newBuyBoxPrice").innerText;
        tmp.stock = document.querySelector("#availability span").innerText;
        return tmp;
      });
      books.push(book);
    }
  }

  console.log(books);
  await browser.close();
})();
