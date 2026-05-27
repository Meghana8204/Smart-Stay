import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addReview } from "../services/reviewService";

const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const QUICK_TAGS = [
  "Clean rooms",
  "Great service",
  "Perfect location",
  "Amazing food",
  "Quiet & peaceful",
  "Good value",
  "Friendly staff",
  "Beautiful views",
];

function ReviewForm({ hotelId, onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const displayRating = hovered || rating;

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fullComment = tags.length
        ? `${comment}\n\nHighlights: ${tags.join(", ")}`
        : comment;
      await addReview(hotelId, { rating, comment: fullComment }, user.token);
      setSuccess(true);
      setRating(0);
      setComment("");
      setTags([]);
      if (onReviewAdded) onReviewAdded();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .rf-root * {
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
        }

        .rf-root {
          background: #fff;
          border: 0.5px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px;
        }

        .rf-heading {
          font-size: 17px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }

        .rf-subtext {
          font-size: 12.5px;
          color: #9ca3af;
          margin: 0 0 20px;
        }

        /* ── Stars ── */
        .rf-stars {
          display: flex;
          gap: 6px;
          align-items: center;
          margin-bottom: 6px;
        }

        .rf-star {
          font-size: 32px;
          cursor: pointer;
          line-height: 1;
          transition: transform 0.15s ease;
          user-select: none;
          filter: grayscale(1) opacity(0.35);
        }

        .rf-star.lit {
          filter: none;
        }

        .rf-star:hover {
          transform: scale(1.2);
        }

        .rf-rating-label {
          font-size: 13px;
          font-weight: 600;
          color: #1a4a8a;
          margin-left: 4px;
          min-width: 80px;
          transition: opacity 0.2s;
        }

        /* ── Quick tags ── */
        .rf-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .rf-tag {
          padding: 5px 12px;
          border-radius: 99px;
          border: 0.5px solid #e5e7eb;
          background: transparent;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.18s;
        }

        .rf-tag:hover {
          border-color: #1a4a8a;
          color: #1a4a8a;
          background: #eef3fb;
        }

        .rf-tag.active {
          background: #1a4a8a;
          border-color: #1a4a8a;
          color: #fff;
        }

        /* ── Textarea ── */
        .rf-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .rf-textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 0.5px solid #e5e7eb;
          background: #f9fafb;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          color: #111827;
          resize: vertical;
          min-height: 100px;
          outline: none;
          line-height: 1.6;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .rf-textarea:focus {
          border-color: #1a4a8a;
          box-shadow: 0 0 0 3px rgba(26,74,138,0.08);
          background: #fff;
        }

        .rf-char-count {
          text-align: right;
          font-size: 11px;
          color: #d1d5db;
          margin-top: 4px;
          margin-bottom: 16px;
        }

        .rf-char-count.warn { color: #f59e0b; }
        .rf-char-count.over { color: #c0392b; }

        /* ── Error / Success ── */
        .rf-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fef5f5;
          border: 0.5px solid #fca5a5;
          border-radius: 9px;
          font-size: 13px;
          color: #c0392b;
          font-weight: 500;
          margin-bottom: 14px;
        }

        .rf-success {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #f0fdf4;
          border: 0.5px solid #86efac;
          border-radius: 9px;
          font-size: 13.5px;
          color: #15803d;
          font-weight: 600;
          margin-bottom: 14px;
        }

        /* ── Submit button ── */
        .rf-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #1a4a8a;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s, opacity 0.2s;
          letter-spacing: 0.2px;
        }

        .rf-submit:hover:not(:disabled) {
          background: #0f2d52;
          transform: translateY(-1px);
        }

        .rf-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .rf-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .rf-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: rf-spin 0.7s linear infinite;
        }

        @keyframes rf-spin {
          to { transform: rotate(360deg); }
        }

        .rf-divider {
          height: 0.5px;
          background: #f3f4f6;
          margin: 18px 0;
        }

        .rf-user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .rf-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1a4a8a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .rf-user-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
        }

        .rf-user-sub {
          font-size: 11.5px;
          color: #9ca3af;
        }
      `}</style>

      <div className="rf-root">
        {/* Header */}
        <h3 className="rf-heading">Write a Review</h3>
        <p className="rf-subtext">Share your experience to help other travellers</p>

        {/* User row */}
        {user && (
          <div className="rf-user-row">
            <div className="rf-avatar">
              {(user?.user?.name || user?.user?.email || "U")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="rf-user-name">
                {user?.user?.name || "Anonymous"}
              </div>
              <div className="rf-user-sub">Posting as verified guest</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Star rating */}
          <label className="rf-label">Your Rating</label>
          <div style={{ marginBottom: "16px" }}>
            <div className="rf-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`rf-star ${star <= displayRating ? "lit" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  role="button"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ⭐
                </span>
              ))}
              <span
                className="rf-rating-label"
                style={{ opacity: displayRating ? 1 : 0 }}
              >
                {RATING_LABELS[displayRating]}
              </span>
            </div>
          </div>

          <div className="rf-divider" />

          {/* Quick tags */}
          <label className="rf-label" style={{ marginBottom: "8px" }}>
            Highlights <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#d1d5db" }}>(optional)</span>
          </label>
          <div className="rf-tags">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rf-tag ${tags.includes(tag) ? "active" : ""}`}
              >
                {tags.includes(tag) ? "✓ " : ""}{tag}
              </button>
            ))}
          </div>

          {/* Comment */}
          <label className="rf-label">Your Review</label>
          <textarea
            className="rf-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your stay — what did you love? What could be better?"
            rows={4}
            maxLength={500}
            required
          />
          <div
            className={`rf-char-count ${
              comment.length > 450 ? "over" : comment.length > 350 ? "warn" : ""
            }`}
          >
            {comment.length} / 500
          </div>

          {/* Error */}
          {error && (
            <div className="rf-error">
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rf-success">
              🎉 Review submitted! Thank you for your feedback.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="rf-submit"
            disabled={loading || comment.trim().length === 0}
          >
            {loading ? (
              <>
                <div className="rf-spinner" />
                Submitting…
              </>
            ) : (
              <>✍️ Submit Review</>
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default ReviewForm;