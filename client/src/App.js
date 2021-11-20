import { useState } from "react";
import React from "react";
import "./App.css";
import Autocomplete from "react-autocomplete";
import movies from "./movie_titles";

const App = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [recommendations, setRecommendations] = useState([]);
	const [movieName, setMovieName] = useState("");
	const [error, setError] = useState(null)

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

	return (
		<div className="App">
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
							border: "2px solid rgba(255, 255, 255, 0.175)",
							borderRadius: "6px",
							fontSize: "14px",
							background: "transparent",
							color: "#ffffff",
							outline: "none",
						},
						placeholder: "Enter Movie Name",
					}}
					renderMenu={children => (
						<div className="menu" style={{
							width: '473px',
							maxHeight: "300px",
							position: 'absolute',
							color: '#ffffff',
							backgroundColor: '#28292b',
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