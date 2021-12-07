import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Recommendation from './Recommendation'

const Movie = () => {
    const [movieDetails, setMovieDetails] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const { movieId } = useParams()
    const [currentMovie, setCurrentMovie] = useState({})

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => setMovieDetails(data))
            .catch(error => console.log(error))
        // eslint-disable-next-line
    }, [movieId])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => setCurrentMovie(data))
            .catch(error => console.log(error))
    }, [movieId])

    useEffect(() => {
        setRecommendations([])
        setIsLoading(true);
        if (currentMovie?.original_title) {
            fetch("/api/recommendations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movieName: currentMovie.original_title,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setRecommendations(data);
                    setIsLoading(false);
                    setError(null)
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError('Something went wrong')
                });
        }
    }, [currentMovie, movieId])

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    const genresWithCommas = () => {
        let arr = []
        currentMovie?.genres?.map((genre) => arr.push(genre.name))
        return arr;
    }

    return (
        <div className="movie-details">
            <div className="movie">
                <img src={`https://image.tmdb.org/t/p/w200/${currentMovie?.poster_path}`} alt="Movie poster" className="movie_poster" />
                <div className="details">
                    <h3 className="movie-title">{currentMovie?.original_title}</h3>
                    <p>{currentMovie?.overview}</p>
                    <span>Genres: {genresWithCommas().join(', ')}</span>
                    <p>Budget: {formatter.format(currentMovie.budget)}</p>
                    <p>Release date: {currentMovie?.release_date}</p>
                </div>
            </div>

            <h1>Cast</h1>
            <div className="cast">
                {movieDetails?.cast?.slice(0, 5).map(cast =>
                    <div className="cast-member" key={cast.id}>
                        <img
                            className="cast-image"
                            src={`https://image.tmdb.org/t/p/w200/${cast.profile_path}`}
                            alt={cast.original_name}
                        />
                        <h3>{cast.original_name}</h3>
                    </div>
                )}
            </div>

            <h1>Recommended Movies</h1>
            <Recommendation isLoading={isLoading} error={error} recommendations={recommendations} />
        </div>
    )
}

export default Movie
