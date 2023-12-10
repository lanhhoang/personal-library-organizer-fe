import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

const apiUrl = process.env.REACT_APP_API_URL;

const Reviews = ({ isbn }) => {
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
      const response = await fetch(
        `${apiUrl}/Reviews/${isbn}`
      );
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
      const response = await fetch(`${apiUrl}/Reviews`, {
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
      await fetch(`${apiUrl}/Reviews/${reviewId}`, {
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
      const response = await fetch(
        `${apiUrl}/Reviews/${isbn}/${id}`,
        {
          method: "DELETE",
          headers: { accept: "*/*" },
        }
      );
      
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
    <>
      <h2>Create Review</h2>
      <Form onSubmit={createReview}>
        <Row className="align-items-center">
          <Col xs="1">
            <Form.Label>
              <strong>Reviewer: </strong>
            </Form.Label>
          </Col>

          <Col xs="5">
            <Form.Control
              type="text"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Row className="align-items-center">
          <Col xs="1">
            <Form.Label>
              <strong>Content: </strong>
            </Form.Label>
          </Col>
          <Col xs="5">
            <Form.Control
              type="text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Button type="submit" variant="success">
          Create
        </Button>
      </Form>

      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>Review List is empty</p>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.reviewId}>
              {isEditing && editedReview.reviewId === review.reviewId ? (
                <Row className="align-items-center">
                  <Col xs="6">
                    <Form.Control
                      type="text"
                      value={editedReview.reviewText}
                      onChange={(e) =>
                        setEditedReview({
                          ...editedReview,
                          reviewText: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="success"
                      onClick={() => handleSave(review.reviewId)}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              ) : (
                <div>
                  <p>
                    <strong>{review.reviewer}: </strong> {review.reviewText}
                    <Button
                      className="mx-2"
                      type="button"
                      variant="primary"
                      onClick={() => handleEdit(review)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="mx-2"
                      type="button"
                      variant="danger"
                      onClick={(e) =>
                        deleteReview(e, review.bookISBN, review.reviewId)
                      }
                    >
                      Delete
                    </Button>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Reviews;
