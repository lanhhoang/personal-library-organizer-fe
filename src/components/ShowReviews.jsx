import React, { useState, useEffect } from "react";

const ShowReviews = ({ isbn }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewer, setReviewer] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState({
    reviewId: "",
    bookISBN: "",
    reviewer: "",
    reviewText: "",
  });

  useEffect(() => {
    // Fetch reviews from API or database
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Make an API call to fetch books
      const response = await fetch(`/api/Reviews/${isbn}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  const createReview = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to create a new book
      const response = await fetch("/api/Reviews", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: "TBA",
          bookISBN: isbn,
          reviewText: reviewText,
          reviewer: reviewer,
        }),
      });
      const createdReview = await response.json();
      setReviews([...reviews, createdReview]);
      setReviewer("");
      setReviewText("");
    } catch (error) {
      console.error("Error creating review: ", error);
    }
  };

  const handleEdit = (review) => {
    setIsEditing(true);
    setEditedReview({
      reviewId: review.reviewId,
      bookISBN: review.bookISBN,
      reviewer: review.reviewer,
      reviewText: review.reviewText,
    });
  };

  const handleSave = async (reviewId) => {
    try {
      // Make an API call to update the review text
      await fetch(`/api/Reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: editedReview.reviewId,
          bookISBN: editedReview.bookISBN,
          reviewer: editedReview.reviewer,
          reviewText: editedReview.reviewText,
        }),
      });

      // Update the reviews state with the edited review text
      const updatedReviews = reviews.map((review) => {
        if (review.reviewId === reviewId) {
          return { ...review, reviewText: editedReview.reviewText };
        }
        return review;
      });

      setReviews(updatedReviews);

      // Clear the editedReview state
      setIsEditing(false);
      setEditedReview({
        reviewId: "",
        bookISBN: "",
        reviewer: "",
        reviewText: "",
      });
    } catch (error) {
      console.error("Error updating review: ", error);
    }
  };

  const deleteReview = async (e, isbn, id) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/Reviews/${isbn}/${id}`, {
        method: "DELETE",
        headers: { accept: "*/*" },
      });
      
      if (response.status === 204) {
        // Book deleted successfully
        // Modify the books state by filtering out the deleted book
        const updatedReviews = reviews.filter(
          (review) => review.reviewId !== id
        );
        setReviews(updatedReviews);

        // Fetch reviews again to update the book list
        fetchReviews();
      } else {
        // Handle other response codes
        console.error("Error deleting review. Status: ", response.status);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  return (
    <div>
      <h2>Create Review</h2>
      <form onSubmit={createReview}>
        <label>
          <strong>Reviewer: </strong>
        </label>
        <input
          type="text"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
        />
        <br />
        <label>
          <strong>Content: </strong>
        </label>
        <input
          type="text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <br />
        <button type="submit">Create</button>
      </form>

      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>Review List is empty</p>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.reviewId}>
              {isEditing && editedReview.reviewId === review.reviewId ? (
                <div>
                  <input
                    type="text"
                    value={editedReview.reviewText}
                    onChange={(e) =>
                      setEditedReview({
                        ...editedReview,
                        reviewText: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => handleSave(review.reviewId)}>
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>{review.reviewer}: </strong>
                    {review.reviewText}
                    <button onClick={() => handleEdit(review)}>Edit</button>
                    <button
                      type="button"
                      onClick={(e) => deleteReview(e, review.bookISBN, review.reviewId)}
                    >
                      Delete
                    </button>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowReviews;
