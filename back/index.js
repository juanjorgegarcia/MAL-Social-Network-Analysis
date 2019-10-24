const express = require("express");
const app = express();
const mysql = require("mysql");
const port = 5000;
const http = require("http");
const credentials = require("./credentials");
const Jikan = require("jikan-node");
const fetch = require("cross-fetch");
const moment = require('moment');

// const Json2csvParser = require('json2csv').Parser;

let server = http.createServer(app);

let con = mysql.createConnection({
  host: "localhost",
  user: credentials.user,
  password: credentials.pass,
  database: "malDatabase"
});
con.connect();

async function req() {
  let url = "https://api.jikan.moe/v3/anime/";

  for (let index = 0; index < 2000; index++) {
    const res = await fetch(`https://api.jikan.moe/v3/anime/${index}`, {
      method: "GET"
    });

    if (res["status"] === 200) {
      const animeInfo = await res.json();
      // console.log(animeInfo);

      const {
        mal_id,
        title,
        type,
        source,
        episodes,
        status,
        airing,
        aired,
        duration,
        rating,
        score,
        scored_by,
        rank,
        popularity,
        members,
        favorites,
        premiered,
        broadcast,
        related,
        studios,
        genres,
        producers,
        licensors
      } = animeInfo;


      const animeStart = moment(aired['from'], 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD hh:mm:ss')
      const animeFinish = (!airing && type == 'Movie') || airing ? null : moment(aired['to'], 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD hh:mm:ss')

      let idMangas = []
      if (related['Adaptation'] && related['Adaptation'].length > 0) {
        idMangas = related['Adaptation'].filter((el) => el.type === 'manga').map((el) => el.mal_id)

      }
      const idStudios = studios

      let sql = `INSERT INTO Animes (idAnime,
          title,
          animeType,
          derivedFrom ,
          numberEpisodes ,
          airStatus ,
          airing ,
          animeStart ,
          animeFinish ,
          duration,
          rating ,
          score ,
          scored_by ,
          animeRank ,
          popularity ,
          members ,
          favorites ,
          premiered,
          broadcast) values (?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?)`

      const query = con.query(sql, [mal_id,
        title,
        type,
        source,
        episodes,
        status,
        airing,
        animeStart,
        animeFinish,
        duration,
        rating,
        score,
        scored_by,
        rank,
        popularity,
        members,
        favorites,
        premiered,
        broadcast
      ])
      query.on('error', function (err) {
          // Handle error, an 'end' event will be emitted after this as well
          console.log(err)
        })
        .on('end', function () {
          console.log(`${title},${mal_id} has been added to the anime table`)
        });
      const animeId = mal_id

      genres.forEach(e => {
        let sql = `INSERT INTO Genres (idGenre, genreType, genreName) VALUES (?,?,?)`
        const query = con.query(sql, [e.mal_id, e.type, e.name])
        query.on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err)
          })
          .on('end', function () {
            console.log(`${e.name},${e.mal_id} has been added to the Genres table`)
          });


        let sqlAnimeGenre = `INSERT INTO animeGenre (idAnime,
            idGenre
            ) VALUES 
            (?, ?)`
        const animeGenre = con.query(sqlAnimeGenre, [animeId, e.mal_id])
        animeGenre.on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err)
          })
          .on('end', function () {
            console.log(`Genre: ${e.mal_id}, Anime:${animeId} has been added to the animeGenre table`)
          });


      });

      for (let index = 0; index < idMangas.length; index++) {
        const res = await fetch(`https://api.jikan.moe/v3/manga/${idMangas[index]}`, {
          method: "GET"
        });
        if (res["status"] === 200) {
          const mangaInfo = await res.json();
          const {
            mal_id,
            title,
            type,
            volumes,
            chapters,
            publishing,
            published,
            rank,
            score,
            scored_by,
            popularity,
            members,
            favorites,
            genres,
            authors,
            serializations

          } = mangaInfo


          const mangaStart = moment(published['from'], 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD hh:mm:ss')
          const mangaFinish = publishing ? null : moment(published['to'], 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD hh:mm:ss')


          const sqlManga = `INSERT INTO Mangas (idManga,
              title ,
              mangaType ,
              volumes ,
              chapters ,
              publishing ,
              mangaStart ,
              mangaFinish ,
              mangaRank ,
              score ,
              scored_by ,
              popularity ,
              members ,
              favorites) values (?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?)`

          const manga = con.query(sqlManga, [mal_id,
            title,
            type,
            volumes,
            chapters,
            publishing,
            mangaStart,
            mangaFinish,
            rank,
            score,
            scored_by,
            popularity,
            members,
            favorites
          ])
          const mangaId = mal_id
          manga.on('error', function (err) {
              // Handle error, an 'end' event will be emitted after this as well
              console.log(err)
            })
            .on('end', function () {
              console.log(` ${title}, ${mal_id}, has been added to the manga table`)

              const sqlAnimeManga = `INSERT INTO animeManga (idManga,
                idAnime) values (?,
              ?)`

              const animeManga = con.query(sqlAnimeManga, [mal_id, animeId])
              animeManga.on('error', function (err) {
                  // Handle error, an 'end' event will be emitted after this as well
                  console.log(err)
                })
                .on('end', function () {
                  console.log(` Manga: ${mal_id}, Anime: ${animeId}, has been added to the animeManga relation table`)
                });

              serializations.forEach(e => {
                let sql = `INSERT INTO Magazines (idMagazine,magazineType,magazineName) VALUES (?,?,?)`
                const query = con.query(sql, [e.mal_id, e.type, e.name])
                query.on('error', function (err) {
                    // Handle error, an 'end' event will be emitted after this as well
                    console.log(err)
                  })
                  .on('end', function () {
                    console.log(`${e.name},${e.mal_id} has been added to the Magazine table`)
                  });


                let sqlMangaMagazine = `INSERT INTO mangaMagazine (idManga,
                    idMagazine
                    ) VALUES 
                    (?, ?)`
                const mangaMagazine = con.query(sqlMangaMagazine, [mangaId, e.mal_id])
                mangaMagazine.on('error', function (err) {
                    // Handle error, an 'end' event will be emitted after this as well
                    console.log(err)
                  })
                  .on('end', function () {
                    console.log(`Magazine: ${e.mal_id}, Manga:${mangaId} has been added to the mangaMagazine table`)
                  });


              });

              authors.forEach(e => {
                let sql = `INSERT INTO Author (idAuthor,authorType,authorName) VALUES (?,?,?)`
                const query = con.query(sql, [e.mal_id, e.type, e.name])
                query.on('error', function (err) {
                    // Handle error, an 'end' event will be emitted after this as well
                    console.log(err)
                  })
                  .on('end', function () {
                    console.log(`${e.name},${e.mal_id} has been added to the Author table`)
                  });


                let sqlMangaAuthor = `INSERT INTO mangaAuthor (idManga,
                    idAuthor
                    ) VALUES 
                    (?, ?)`
                const mangaAuthor = con.query(sqlMangaAuthor, [mangaId, e.mal_id])
                mangaAuthor.on('error', function (err) {
                    // Handle error, an 'end' event will be emitted after this as well
                    console.log(err)
                  })
                  .on('end', function () {
                    console.log(`Author: ${e.mal_id}, Manga:${mangaId} has been added to the mangaAuthor table`)
                  });


              });

              genres.forEach(e => {
                let sql = `INSERT INTO Genres (idGenre, genreType, genreName) VALUES (?,?,?)`
                const query = con.query(sql, [e.mal_id, e.type, e.name])
                query.on('error', function (err) {
                    // Handle error, an 'end' event will be emitted after this as well
                    if (err.code !== 'ER_DUP_ENTRY') {
                      console.log(err)

                    }
                  })
                  .on('end', function () {
                    console.log(`${e.name},${e.mal_id} has been added to the Genres table`)
                    let sqlMangaGenre = `INSERT INTO mangaGenre (idManga,
                      idGenre
                      ) VALUES 
                      (?, ?)`
                    const mangaGenre = con.query(sqlMangaGenre, [mangaId, e.mal_id])
                    mangaGenre.on('error', function (err) {
                        // Handle error, an 'end' event will be emitted after this as well
                        console.log(err)
                      })
                      .on('end', function () {
                        console.log(`Genre: ${e.mal_id}, Manga:${mangaId} has been added to the mangaGenre table`)
                      });
                  });

              });



            });


        }
      }

      studios.forEach(e => {
        let sql = `INSERT INTO Studios (idStudio,studioType,studioName) VALUES (?,?,?)`
        const query = con.query(sql, [e.mal_id, e.type, e.name])
        query.on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err)
          })
          .on('end', function () {
            console.log(`${e.name},${e.mal_id} has been added to the studio table`)
          });


        let sqlAnimeStudio = `INSERT INTO animeStudio (idAnime,
          idStudio
          ) VALUES 
          (?, ?)`
        const animeStudio = con.query(sqlAnimeStudio, [animeId, e.mal_id])
        animeStudio.on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err)
          })
          .on('end', function () {
            console.log(`Studio: ${e.mal_id}, Anime:${animeId} has been added to the animeStudio table`)
          });


      });

      producers.forEach(e => {
        let sql = `INSERT INTO Producers (idProducer,producerType,producerName) VALUES (?,?,?)`
        const query = con.query(sql, [e.mal_id, e.type, e.name])
        query.on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err)
          })
          .on('end', function () {
            console.log(`${e.name},${e.mal_id} has been added to the Producers table`)
          });


        let sqlAnimeProducer = `INSERT INTO animeProducer (idAnime,
          idProducer
          ) VALUES 
          (?, ?)`
        const animeProducer = con.query(sqlAnimeProducer, [animeId, e.mal_id])
        animeProducer.on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err)
          })
          .on('end', function () {
            console.log(`Producer: ${e.mal_id}, Anime:${animeId} has been added to the animeProducer table`)
          });


      });

      licensors.forEach(e => {
        let sql = `INSERT INTO Licensors (idLicensor,licensorType,licensorName) VALUES (?,?,?)`
        const query = con.query(sql, [e.mal_id, e.type, e.name])
        query.on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err)
          })
          .on('end', function () {
            console.log(`${e.name},${e.mal_id} has been added to the Licensors table`)
          });


        let sqlAnimeLicensor = `INSERT INTO animeLicensor (idAnime,
          idLicensor
          ) VALUES 
          (?, ?)`
        const animeLicensor = con.query(sqlAnimeLicensor, [animeId, e.mal_id])
        animeLicensor.on('error', function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err)
          })
          .on('end', function () {
            console.log(`Licensor: ${e.mal_id}, Anime:${animeId} has been added to the animeLicensor table`)
          });


      });

    }
  }

  return docs;
}
req().then(res => console.log(res));


server.listen(port, () => console.log(`Listening on port ${port}`));

// module.exports = app;