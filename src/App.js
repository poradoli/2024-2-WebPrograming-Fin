import React, { useEffect, useState } from "react";
import Movie from "./components/Movie";
import CommentSection from "./components/commentSection";
import "./index.css";

// API URL 설정
const API_URL =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc";
const API_KEY = "0ef554526a5bb06036e8b2765099d625"; // API 키

// API 요청 옵션 설정
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZWY1NTQ1MjZhNWJiMDYwMzZlOGIyNzY1MDk5ZDYyNSIsIm5iZiI6MTczMTc1OTY5My41NDQsInN1YiI6IjY3Mzg4ZTRkYTE4MWE3MTdlYWM4OTgyNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.auhHFFC9l76aDVdW55xx9JdmZodnGNQnpu8U16W2A2Q`,
  },
};

function App() {
  const [movies, setMovies] = useState([]); // 영화 데이터를 저장할 state
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화 데이터
  const [movieCredits, setMovieCredits] = useState(null); // 감독과 배우 데이터

  // 영화 데이터를 가져오는 함수
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 영화 크레딧 데이터를 가져오는 함수
  const fetchMovieCredits = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMovieCredits(data); // 감독 및 배우 정보 저장
    } catch (error) {
      setError(error.message);
    }
  };

  // 포스터 클릭 핸들러
  const handlePosterClick = async (movie) => {
    setSelectedMovie(movie);
    await fetchMovieCredits(movie.id); // 클릭한 영화의 크레딧 정보 가져오기
  };

  // 컴포넌트가 마운트될 때 fetchMovies 실행
  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">에러 발생: {error}</div>;
  }

return (
  <div className="app-container">
    {selectedMovie ? (
      <div className="movie-details">
        <div className="movie-details-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
            className="movie-poster"
          />
          <div className="poster-info">
            <h2>{selectedMovie.title}</h2>
            <div className="rating">⭐ {selectedMovie.vote_average}/10</div>
          </div>
        </div>
        <div className="movie-text">
          <h2>작품 설명</h2>
          <p>{selectedMovie.overview}</p>
          {movieCredits && (
            <>
              <h3>감독</h3>
              <p>
                {movieCredits.crew
                  .filter((person) => person.job === "Director")
                  .map((director) => director.name)
                  .join(", ")}
              </p>
              <h3>출연 배우</h3>
              <div className="actors">
                {movieCredits.cast.slice(0, 5).map((actor) => (
                  <div key={actor.id} className="actor">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="actor-photo"
                    />
                    <p>{actor.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* 댓글 섹션 추가 */}
        <CommentSection />
        <button onClick={() => setSelectedMovie(null)}>뒤로 가기</button>
      </div>
    ) : (
      movies.length > 0 ? (
        movies.map((item, index) => (
          <div
            key={item.id}
            className="movie-container"
            onClick={() => handlePosterClick(item)}
          >
            <Movie
              rank={index + 1}
              title={item.title}
              poster_path={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              vote_average={item.vote_average}
            />
          </div>
        ))
      ) : (
        <div className="no-data">영화를 찾을 수 없습니다.</div>
      )
    )}
  </div>
);

}

export default App;
