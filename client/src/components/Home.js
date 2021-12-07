import React from 'react'
import AutoComplete from './AutoComplete'
import Recommendation from './Recommendation'

const Home = (props) => {
    return (
        <React.Fragment>
            <div className="search">
                <h1 className="title">Movie Recommender System</h1>
                <AutoComplete
                    movieName={props.movieName}
                    setMovieName={props.setMovieName}
                    movies={props.movies}
                />
                <button className="button" onClick={(e) => props.getRecommendedMovies(e, props.movieName)}>
                    Recommend
                </button>
            </div>

            <Recommendation
                setMovieId={props.setMovieId}
                isLoading={props.isLoading}
                error={props.error}
                recommendations={props.recommendations}
            />
        </React.Fragment>
    )
}

export default Home
