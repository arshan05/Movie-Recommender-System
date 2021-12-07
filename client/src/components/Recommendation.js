import React from 'react'
import { Link } from 'react-router-dom'

const Recommendation = (props) => {
    return (
        <React.Fragment>
            {props.isLoading && <h1 className="loader">Loading ...</h1>}
            {props.error && <h1 className="error">{props.error}</h1>}

            {!props.isLoading && !props.error &&
                <div className="recommendations">
                    {props.recommendations.map((movie, index) => (
                        <Link to={`/movie/${movie.id}`} className="recommendation" key={index}>
                            <img src={movie.poster} alt={movie.title} />
                            <h3>{movie.title}</h3>
                        </Link>
                    ))}
                </div>}
        </React.Fragment>
    )
}

export default Recommendation
