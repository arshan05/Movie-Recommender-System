import { useEffect, useState } from "react";
import React from "react";
import "./App.css";
import movies from "./movie_titles";
import Home from "./components/Home";
import { Switch, Route, Link } from 'react-router-dom'
import Movie from "./components/Movie";

const App = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [recommendations, setRecommendations] = useState([]);
	const [movieName, setMovieName] = useState("");
	const [error, setError] = useState(null)
	const [movieId, setMovieId] = useState(null)

	useEffect(() => {
		const theme = localStorage.getItem('mv-theme')
		const mode = document.getElementById('theme')
		if (theme === 'dark') {
			document.body.classList.add('dark')
			mode.checked = true
			localStorage.setItem('mv-theme', 'dark')
		} else {
			document.body.classList.remove('dark')
			mode.checked = false
			localStorage.setItem('mv-theme', 'light')
		}
		// eslint-disable-next-line
	}, [])

	const getRecommendedMovies = (e, movieName) => {
		e.preventDefault();
		if (movieName === "") return;
		setRecommendations([])
		setIsLoading(true);
		fetch("/api/recommendations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				movieName: movieName,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
				setRecommendations(data);
				// setRecommendations(data.result);
				// setMovieId(data.movieId)
				setIsLoading(false);
				setError(null)
			})
			.catch((err) => {
				setIsLoading(false);
				console.log(err)
				setError('Something went wrong')
			});
	};

	const toggleTheme = () => {
		const theme = localStorage.getItem('mv-theme')
		if (theme === 'dark') {
			document.body.classList.remove('dark')
			localStorage.setItem('mv-theme', 'light')
		} else {
			document.body.classList.add('dark')
			localStorage.setItem('mv-theme', 'dark')
		}
	}

	const currentMovie = recommendations.find(movie => movie.id === movieId)

	return (
		<div className="App">
			<Link to="/" className="home-icon">
				Home
			</Link>
			<div className="switch-wrapper">
				<div className="switch">
					<label className="theme-switch" htmlFor="theme">
						<input type="checkbox" id="theme" onClick={toggleTheme} />
						<div className="slider round"></div>
					</label>
				</div>
			</div>
			<Switch>
				<Route exact path="/movie/:movieId" render={() =>
					<Movie
						movieId={movieId}
						getRecommendedMovies={getRecommendedMovies}
						recommendations={recommendations}
						currentMovie={currentMovie}
					/>} />
				<Route exact path='/' render={() =>
					<Home
						setMovieId={setMovieId}
						movieName={movieName}
						movies={movies}
						getRecommendedMovies={getRecommendedMovies}
						setMovieName={setMovieName}
						isLoading={isLoading}
						recommendations={recommendations}
						error={error}
					/>} />
			</Switch>
		</div>
	);
}

export default App