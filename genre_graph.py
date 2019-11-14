from sql_functions import *
from credentials import connection
import networkx as nx

f = open('animegenre.gml','w+')
# f.write('# -*- coding: utf-8 -*- \n')
f.write('graph [\n  directed 1\n')
contador = 0
for i in all_genres(connection):
    f.write('  node [ id %s type "genre" ]\n' % (contador))
    source = contador
    contador += 1
    for j in anime_from_genre(connection, i[0]):
        try:
            f.write('  node [ id %s type "anime" ]\n' % (contador))
            f.write('  edge [ source %s target %s ]\n' % (source, contador))
            contador += 1
        except:
            pass
f.write(' ]')
f.close()

f = open('mangenre.gml','w+')
f.write('graph [ directed 1	')
contador = 0
for i in all_genres(connection):
    f.write('node [ id %s type "genre" ]' % (contador))
    source = contador
    contador += 1
    for j in manga_from_genre(connection, i[0]):
        try:
            f.write('node [ id %s type "manga" ]' % (contador))
            f.write('edge [ source %s target %s ]' % (source, contador))
            contador += 1
        except:
            pass
f.write(' ]')
f.close()