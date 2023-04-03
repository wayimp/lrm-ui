//Reina Valera 1909 - 592420522e16049f-01
//Spanish Bible, Palabla de Dios para ti - 48acedcf8595c754-01
//The Holy Bible in Simple Spanish - b32b9d1b64b4ef29-01
//The New Testament in Spanish, Free Bible Version - 482ddd53705278cc-01
//Versión Biblia Libre - 482ddd53705278cc-02

const fs = require('fs')
const axios = require('axios')
const flatten = require('lodash.flatten')
const apiKey = 'abe1c86651b3f72bfdc3ff60319d3b7b'
const fileName = __dirname + '/RV1909Verses.json'
const bibleId = '482ddd53705278cc-02' // Versión Biblia Libre
let books = []
let chapters = []
let chapterMap = []

const getVerses = async chapterId => {
  try {
    console.log(chapterId)

    const verseQuery = await axios({
      method: 'get',
      url: `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${chapterId}/verses`,
      headers: {
        accept: 'application/json',
        'api-key': apiKey
      }
    }).then(response => response.data.data)

    chapterMap.push({ chapterId, count: verseQuery.length })
  } catch (err) {
    console.log(err)
  }
}

const sequential = async (fn, isDone = false) => {
  if (isDone) {
    fs.writeFileSync(fileName, JSON.stringify(chapterMap))
    return
  }
  const chapter = chapters.shift()
  if (!chapter) return

  const promise = await getVerses(chapter)
  return Promise.resolve(promise).then(sequential(fn, chapters.length === 0))
}

const getBooks = async () => {
  const books = await axios({
    method: 'get',
    url: `https://api.scripture.api.bible/v1/bibles/${bibleId}/books?include-chapters=true`,
    headers: {
      accept: 'application/json',
      'api-key': apiKey
    }
  }).then(response => response.data.data)

  const chapterIds = []

  await books.map(book =>
    chapterIds.push(book.chapters.map(chapter => chapter.id))
  )

  chapters = flatten(chapterIds)

  // Start the actual processing
  sequential(getVerses(chapters.shift()))
}

getBooks()
