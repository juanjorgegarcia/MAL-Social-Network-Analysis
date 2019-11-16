from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import NMF
from sklearn.datasets import fetch_20newsgroups
from unidecode import unidecode
import numpy as np

import pymysql
from functools import partial

def run_db_query(connection, query, args=None):
    ret_list = []
    with connection.cursor() as cursor:
        print('Executando query:')
        cursor.execute(query, args)
        for result in cursor:
            ret_list.append(result[0])
    return ret_list

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    database='maldatabase')

db = partial(run_db_query, connection)

n_features = 4000
n_components = 100
n_top_words = 20

anime_synopsis = db('SELECT synopsis FROM animes where synopsis is not NULL')
manga_synopsis = db('SELECT synopsis FROM mangas where synopsis is not NULL')
anime_scores = db('SELECT score FROM animes where synopsis is not NULL')
manga_scores = db('SELECT score FROM mangas where synopsis is not NULL')
anime_title = db('SELECT title FROM animes where synopsis is not NULL')
manga_title = db('SELECT title FROM mangas where synopsis is not NULL')


#################### ANIMES ####################

anime_tf_vectorizer = TfidfVectorizer(max_df=0.90, min_df=5,
                                max_features=n_features,
                                stop_words='english')

anime_tf_vectorizer.fit(anime_synopsis)


anime_tf_count = anime_tf_vectorizer.transform(anime_synopsis)

anime_nmf = NMF(n_components=50, random_state=1, alpha=0.1, l1_ratio=0.5)

anime_nmf.fit(anime_tf_count)

f = open('animetopic.gml','w+', encoding="ascii")
f.write('graph [\n  directed 1\n')
contador = 0
for i in range(50): 
    f.write('  node [ id %s title "" topic -1 type "topic" score %f ]\n' % (i, 0.0))

for i in range(len(anime_synopsis)):
    anime_arr = anime_nmf.transform(anime_tf_vectorizer.transform([anime_synopsis[i]]))
    anime_topic = np.where(anime_arr[0] == np.amax(anime_arr[0]))[0][0]

    # print(np.amax(anime_arr[0]), anime_arr[0][0])

    if np.amax(anime_arr[0]) == anime_arr[0][0]:
        anime_topic = np.where(anime_arr[0] == np.sort(anime_arr[0])[-2])[0][0]
        

    if anime_scores[i] is None:
        f.write('  node [ id %s title "%s" topic %d type "anime" score 0.0 ]\n' % (i+50, (unidecode(anime_title[i]).replace('"', "")).replace("'", ""), anime_topic))
        f.write('  edge [ source %s target %s ]\n' % (anime_topic, i+50))
    else:
        f.write('  node [ id %s title "%s" topic %d type "anime" score %f ]\n' % (i+50, (unidecode(anime_title[i]).replace('"', "")).replace("'", ""), anime_topic, anime_scores[i]))
        f.write('  edge [ source %s target %s ]\n' % (anime_topic, i+50))

f.write(' ]')
f.close()

#################### MANGAS ####################

manga_tf_vectorizer = TfidfVectorizer(max_df=0.90, min_df=5,
                                max_features=n_features,
                                stop_words='english')

manga_tf_vectorizer.fit(manga_synopsis)


manga_tf_count = manga_tf_vectorizer.transform(manga_synopsis)

manga_nmf = NMF(n_components=50, random_state=1, alpha=0.1, l1_ratio=0.5)

manga_nmf.fit(manga_tf_count)

f = open('mangatopic.gml','w+', encoding="ascii")
f.write('graph [\n  directed 1\n')
contador = 0
for i in range(50):
    f.write('  node [ id %s title "" topic -1 type "topic" score %f ]\n' % (i, 0.0))

for i in range(len(manga_synopsis)):
    manga_arr = manga_nmf.transform(manga_tf_vectorizer.transform([manga_synopsis[i]]))
    manga_topic = np.where(manga_arr[0] == np.amax(manga_arr[0]))[0][0]

    if np.amax(manga_arr[0]) == manga_arr[0][0]:
        manga_topic = np.where(manga_arr[0] == np.sort(manga_arr[0])[-2])[0][0]

    if manga_scores[i] is None:
        f.write('  node [ id %s title "%s" topic %d type "manga" score 0.0 ]\n' % (i+50, (unidecode(manga_title[i]).replace('"', "")).replace("'", ""), manga_topic))
        f.write('  edge [ source %s target %s ]\n' % (manga_topic, i+50))
    else:
        f.write('  node [ id %s title "%s" topic %d type "manga" score %f ]\n' % (i+50, (unidecode(manga_title[i]).replace('"', "")).replace("'", ""), manga_topic, manga_scores[i]))
        f.write('  edge [ source %s target %s ]\n' % (manga_topic, i+50))

f.write(' ]')
f.close()



# def print_top_words(model, feature_names, n_top_words):
#     for topic_idx, topic in enumerate(model.components_):
#         message = "Topic #%d: " % topic_idx
#         message += " ".join([feature_names[i]
#                              for i in topic.argsort()[:-n_top_words - 1:-1]])
#         print(message)
#     print()

# tfidf_feature_names = tf_vectorizer.get_feature_names()
# print_top_words(nmf, tfidf_feature_names, 20)