import React from "react";
import "../index.css";

function Movie({ rank, title, poster_path, vote_average }) {
  return (
    <div className="movie-container"> {/* 상대 위치 기준 컨테이너 */}
      <div className="movie-rank">{rank}</div> {/* 순위 표시 */}
      <img src={poster_path} alt={title} className="movie-poster" />
      <h4>{title}</h4>
      <span>⭐ {vote_average}/10</span>
    </div>
  );
}

export default Movie;
