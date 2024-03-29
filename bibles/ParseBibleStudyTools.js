const puppeteer = require('puppeteer');
const version = 'NVI'
const fs = require('fs')
const fileName = __dirname + '/NVI.json'

let books = [
    /*
    { id: 'GEN', name: 'Génesis', chapters: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26] },
    { id: 'EXO', name: 'Éxodo', chapters: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38] },
    { id: 'LEV', name: 'Levítico', chapters: [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34] },
    { id: 'NUM', name: 'Números', chapters: [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 15, 34, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 39, 17, 54, 42, 56, 29, 34, 13] },
    { id: 'DEU', name: 'Deuteronomio', chapters: [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12] }
    { id: 'JOS', name: 'Josué', chapters: [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33] },
    { id: 'JDG', name: 'Jueces', chapters: [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 21, 20, 31, 13, 31, 30, 48, 25] },
    { id: 'RUT', name: 'Rut', chapters: [22, 23, 18, 22] },
    { id: '1SA', name: '1 Samuel', chapters: [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 43, 15, 23, 28, 23, 44, 25, 12, 25, 11, 31, 13] },
    { id: '2SA', name: '2 Samuel', chapters: [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 25, 22, 51, 39, 25] },
    { id: '1KI', name: '1 Reyes', chapters: [53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 54] },
    { id: '2KI', name: '2 Reyes', chapters: [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30] },
    { id: '1CH', name: '1 Crónicas', chapters: [54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 31, 19, 32, 31, 31, 32, 34, 21, 30] },
    { id: '2CH', name: '2 Crónicas', chapters: [17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 15, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 24, 33, 27, 23] },
   { id: 'EZR', name: 'Esdras', chapters: [11, 70, 13, 24, 17, 22, 28, 36, 15, 44] },
    { id: 'NEH', name: 'Nehemías', chapters: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31] },
    { id: 'EST', name: 'Ester', chapters: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3] },
    { id: 'JOB', name: 'Job', chapters: [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 15, 33, 24, 38, 38, 19, 34, 17] },
    { id: 'PSA', name: 'Salmos', chapters: [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6] },
    { id: 'PRO', name: 'Proverbios', chapters: [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31] },
    { id: 'ECC', name: 'Eclesiastés', chapters: [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14] },
    { id: 'SNG', name: 'Cantares', chapters: [17, 17, 11, 16, 16, 13, 13, 14] },
     { id: 'ISA', name: 'Isaías', chapters: [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24] },
     { id: 'JER', name: 'Jeremías', chapters: [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34] },
     { id: 'LAM', name: 'Lamentaciones', chapters: [22, 22, 66, 22, 22] },
     { id: 'EZK', name: 'Ezequiel', chapters: [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35] },
     { id: 'DAN', name: 'Daniel', chapters: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13] },
     { id: 'HOS', name: 'Oseas', chapters: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 11, 15, 16, 9] },
     { id: 'JOL', name: 'Joel', chapters: [20, 32, 21] },
     { id: 'AMO', name: 'Amós', chapters: [15, 16, 15, 13, 27, 14, 17, 14, 15] },
     { id: 'OBA', name: 'Abdías', chapters: [21] },
     { id: 'JON', name: 'Jonás', chapters: [16, 11, 10, 11] },
     { id: 'MIC', name: 'Miqueas', chapters: [16, 13, 12, 13, 15, 16, 20] },
     { id: 'NAM', name: 'Nahúm', chapters: [15, 13, 19] },
     { id: 'HAB', name: 'Habacuc', chapters: [17, 20, 19] },
     { id: 'ZEP', name: 'Sofonías', chapters: [18, 15, 20] },
     { id: 'HAG', name: 'Ageo', chapters: [15, 23] },
     { id: 'ZEC', name: 'Zacarías', chapters: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 16, 14, 9, 21] },
     { id: 'MAL', name: 'Malaquías', chapters: [14, 17, 18, 6] },
     { id: 'MAT', name: 'Mateo', chapters: [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20] },
     { id: 'MRK', name: 'Marcos', chapters: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20] },
     { id: 'LUK', name: 'Lucas', chapters: [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53] },
     { id: 'JHN', name: 'Juan', chapters: [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25] },
     { id: 'ACT', name: 'Hechos', chapters: [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 40, 38, 40, 30, 35, 27, 27, 32, 44, 31] },
     { id: 'ROM', name: 'Romanos', chapters: [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27] },
     { id: '1CO', name: '1 Corintios', chapters: [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24] },
     { id: '2CO', name: '2 Corintios', chapters: [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13] },
     { id: 'GAL', name: 'Gálatas', chapters: [24, 21, 29, 31, 26, 18] },
     { id: 'EPH', name: 'Efesios', chapters: [23, 22, 21, 32, 33, 24] },
     { id: 'PHP', name: 'Filipenses', chapters: [30, 30, 21, 23] },
     { id: 'COL', name: 'Colosenses', chapters: [29, 23, 25, 18] },
     { id: '1TH', name: '1 Tesalonicenses', chapters: [10, 20, 13, 18, 28] },
     { id: '2TH', name: '2 Tesalonicenses', chapters: [12, 17, 18] },
     { id: '1TI', name: '1 Timoteo', chapters: [20, 15, 16, 16, 25, 21] },
     { id: '2TI', name: '2 Timoteo', chapters: [18, 26, 17, 22] },
     { id: 'TIT', name: 'Tito', chapters: [16, 15, 15] },
     { id: 'PHM', name: 'Filemón', chapters: [25] },
     { id: 'HEB', name: 'Hebreos', chapters: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25] },
     { id: 'JAS', name: 'Santiago', chapters: [27, 26, 18, 17, 20] },
     { id: '1PE', name: '1 Pedro', chapters: [25, 25, 22, 19, 14] },
     { id: '2PE', name: '2 Pedro', chapters: [21, 22, 18] },
     { id: '1JN', name: '1 Juan', chapters: [10, 29, 24, 21, 21] },
     { id: '2JN', name: '2 Juan', chapters: [13] },
     { id: '3JN', name: '3 Juan', chapters: [15] },
     { id: 'JUD', name: 'Judas', chapters: [25] },
     { id: 'REV', name: 'Apocalipsis', chapters: [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21] }
  */
]


const getChapter = async (book, chapter) => {
    let verses = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let ref = book.name.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(' ', '-').toLowerCase();

    let url = `https://www.biblestudytools.com/nvi/${ref}/${chapter + 1}.html`;
    console.log(`loading: ${url}`)
    await page.goto(url, { waitUntil: 'load', timeout: 360000 });

    console.log(`${book.chapters[chapter]} verses in chapter ${chapter + 1}`)
    for (verse = 1; verse <= book.chapters[chapter]; verse++) {

        let selector = `div[data-verse-id="${verse}"]`
        //console.log(`parsing verse ${verse}`);
        let verseDiv = await page.$(selector);

        let verseText = await page.evaluate(verseDiv => verseDiv?.innerText || String.name, verseDiv);

        // Strip out the verse number
        const breakpoint = /\d+\s/

        const split = verseText.split(breakpoint)

        const verseObject = {
            version: version,
            book: book.id,
            chapter: chapter + 1,
            verse: verse,
            text: split[1]
        }

        //console.log(JSON.stringify(verseObject));
        verses.push(verseObject);
        fs.appendFileSync(`${__dirname}/${book.id}.json`, ',' + JSON.stringify(verseObject))
    }

    await browser.close();


    //console.log(JSON.stringify(verses));
    return verses;
}

const getChapters = async (book, chapterNo) => {
    let chapters = [];

    while (chapterNo < book.chapters.length) {
        let chapter = await getChapter(book, chapterNo);
        chapters.push.apply(chapter);
        chapterNo++
    }

    console.log(JSON.stringify(chapters));
    return chapters;
}

const sequential = async (fn, isDone = false) => {
    if (isDone) {
        return
    }

    const book = books.shift()
    if (!book) return

    const promise = await getChapters(book, 0)
    return Promise.resolve(promise).then(sequential(fn, books.length === 0))
}

sequential(getChapters(books.shift()))