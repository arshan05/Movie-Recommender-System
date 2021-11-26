import { useEffect, useState } from "react";
import React from "react";
import "./App.css";
import Autocomplete from "react-autocomplete";
import movies from "./movie_titles";

const App = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [recommendations, setRecommendations] = useState([]);
	const [movieName, setMovieName] = useState("");
	const [error, setError] = useState(null)

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

	const getRecommendedMovies = (e) => {
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

	return (
		<div className="App">
			<div className="switch">
				<label className="theme-switch" htmlFor="theme">
					<input type="checkbox" id="theme" onClick={toggleTheme} />
					<div className="slider round"></div>
				</label>
			</div>
			<div className="search">
				<h1 className="title">Movie Recommender System</h1>
				<Autocomplete
					value={movieName}
					items={movies}
					getItemValue={(item) => item}
					renderItem={(item, isHighlighted) => (
						<div
							className={`item ${isHighlighted ? "selected-item" : ""}`}
						>
							{item}
						</div>
					)}
					onChange={(event) => setMovieName(event.target.value)}
					onSelect={(value) => setMovieName(value)}
					shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.toLowerCase()) > -1}
					inputProps={{
						style: {
							width: "450px",
							height: "48px",
							padding: "0 10px",
							border: "2px solid var(--input-border-color)",
							borderRadius: "6px",
							fontSize: "14px",
							background: "transparent",
							color: "var(--text-color)",
							outline: "none",
						},
						placeholder: "Enter Movie Name",
					}}
					renderMenu={children => (
						<div className="menu" style={{
							width: '473px',
							maxHeight: "300px",
							position: 'absolute',
							color: 'var(--text-color)',
							backgroundColor: 'var(--menu-bg)',
							overflow: 'auto',
							top: '145px',
							left: '0',
						}}>
							{children.slice(0, 100)}
						</div>
					)}
				/>
				<button className="button" onClick={getRecommendedMovies}>
					Recommend
				</button>
			</div>

			{isLoading && <h1 className="loader">Loading ...</h1>}
			{error && <h1 style={{ color: 'white' }}>{error}</h1>}

			<div className="recommendations">
				{recommendations.map((movie, index) => (
					<div className="recommendation" key={index}>
						<img src={movie.poster} alt={movie.title} />
						<h3>{movie.title}</h3>
					</div>
				))}
			</div>

		</div>
	);
}

export default App