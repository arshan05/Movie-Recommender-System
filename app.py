import pickle
import requests
import sys


def fetch_poster(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US".format(
        movie_id)
    data = requests.get(url)
    data = data.json()
    poster_path = data['poster_path']
    full_path = "https://image.tmdb.org/t/p/w500/" + poster_path
    return full_path


def recommend(movie):
    index = movies[movies['title'] == movie].index[0]
    distances = sorted(
        list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommended_movie_names = []
    recommended_movie_posters = []
    recommended_movie_id = []
    for i in distances[1:6]:
        movie_id = movies.iloc[i[0]].movie_id
        recommended_movie_posters.append(fetch_poster(movie_id))
        recommended_movie_names.append(
            movies.iloc[i[0]].title.replace(', ', '-'))
        recommended_movie_id.append(movie_id)

    return recommended_movie_names, recommended_movie_posters, recommended_movie_id


movies = pickle.load(open('movie_list.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))


def main():
    # current_movie_id = movies[movies['title'] == sys.argv[1]]['movie_id']
    recommended_movie_names, recommended_movie_posters, recommended_movie_id = recommend(
        sys.argv[1])
    print(recommended_movie_names)
    print(recommended_movie_posters)
    print(recommended_movie_id)
    # print(current_movie_id)


if __name__ == '__main__':
    main()
