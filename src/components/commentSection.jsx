import React, { useState } from "react";
import "./commentSection.css";

function CommentSection() {
  const [comments, setComments] = useState([]); // 댓글 상태
  const [inputValue, setInputValue] = useState(""); // 입력 필드 상태

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (inputValue.trim()) {
      setComments([...comments, inputValue]); // 새 댓글 추가
      setInputValue(""); // 입력 필드 초기화
    }
  };

  return (
    <div className="comment-section">
      <h3>리뷰</h3>
      {/* 댓글 입력 폼 */}
      <div className="comment-form">
        <input
          type="text"
          placeholder="글을 입력하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="comment-input"
        />
        <button onClick={handleAddComment} className="comment-button">
          등록
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment-item">
              {comment}
            </div>
          ))
        ) : (
          <p>첫 글을 작성해 보세요</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
