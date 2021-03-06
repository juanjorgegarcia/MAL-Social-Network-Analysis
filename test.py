from jikanpy import AioJikan
import asyncio
import pymysql
from functools import partial


# def run_db_query(connection, query, args=None):
#     with connection.cursor() as cursor:
#         print('Executando query:')
#         cursor.execute(query, args)
#         for result in cursor:
#             print(result)

# connection = pymysql.connect(
#     host='localhost',
#     user='root',
#     password='',
#     database='sakila')


# db = partial(run_db_query, connection)

loop = asyncio.get_event_loop()


async def main(loop):
    aio_jikan = AioJikan(loop=loop)

    mushishi = await aio_jikan.anime(457)
    # Close the connection to Jikan API
    # print(mushishi)
    # usernames = ['juanjg', 'thundersly', 'terabyte900']
    # jj = await aio_jikan.user(username='juanjg', request='animelist')
    # jj = await aio_jikan.user(username='juanjg')
    # top_anime = await aio_jikan.top(type='anime')
    # try:

    mushishi = await aio_jikan.anime(15000)
    # except:
    #     mushishi = await aio_jikan.anime(1)

    animes_data = []
    # for i in range (5):
    #     animes_data[i]= await aio_jikan.anime(i)

    # jj.keys()
    # print(mushishi)
    print(mushishi.keys())
    # print(mushishi['source'])
    # print(mushishi['related']['Adaptation'])

    # print(mushishi['studios'])

    await aio_jikan.close()


loop.run_until_complete(main(loop))
