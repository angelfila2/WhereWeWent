import { useState } from "react";
import "./AddEntry.css";

function AddEntry({ onEntryAdded }) {
  const [placeName, setPlaceName] = useState("");
  const [location, setLocation] = useState("");
  const [timeWeWent, setTimeWeWent] = useState("");
  const [foodScore, setFoodScore] = useState(1);
  const [priceScore, setPriceScore] = useState(1);
  const [locationScore, setLocationScore] = useState(1);
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);

  // Controls whether the form is open or closed
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("placeName", placeName);
    formData.append("location", location);
    formData.append("timeWeWent", timeWeWent);
    formData.append("foodScore", foodScore);
    formData.append("priceScore", priceScore);
    formData.append("locationScore", locationScore);
    formData.append("notes", notes);

    if (photo) {
      formData.append("photo", photo);
      formData.append("photoType", photo.type);
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/entries/create/",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Backend error:", errorData);

        throw new Error("Failed to add entry");
      }

      const newEntry = await response.json();

      console.log("Entry created:", newEntry);

      // Reset form
      setPlaceName("");
      setLocation("");
      setTimeWeWent("");
      setFoodScore(5);
      setPriceScore(5);
      setNotes("");
      setPhoto(null);

      // Close form after successful submission
      setIsOpen(false);

      // Refresh entries
      if (onEntryAdded) {
        onEntryAdded();
      }
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  return (
    <div className="add-entry-card">
      {/* CLICKABLE HEADER */}
      <button
        type="button"
        className="add-entry-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Add New Place</span>

        <span className="toggle-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* ONLY SHOW FORM WHEN OPEN */}
      {isOpen && (
        <form className="add-entry-form" onSubmit={handleSubmit}>
          {/* PLACE NAME */}
          <div className="form-group">
            <label htmlFor="placeName">
              Place Name <span className="required">*</span>
            </label>

            <input
              id="placeName"
              type="text"
              placeholder="Enter place name"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              required
            />
          </div>

          {/* LOCATION */}
          <div className="form-group">
            <label htmlFor="location">
              Location <span className="required">*</span>
            </label>

            <input
              id="location"
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* DATE */}
          <div className="form-group date-group">
            <label htmlFor="timeWeWent">
              When We Went <span className="required">*</span>
            </label>

            <input
              id="timeWeWent"
              type="date"
              value={timeWeWent}
              onChange={(e) => setTimeWeWent(e.target.value)}
              required
            />
          </div>

          {/* FOOD SCORE */}
          <div className="form-group">
            <label htmlFor="foodScore">Food Score</label>
            <i>How good was the food? (1 = Poor, 5 = Excellent)</i>

            <div className="rating-container">
              <input
                id="foodScore"
                className="rating-slider"
                type="range"
                min="1"
                max="5"
                step="1"
                value={foodScore}
                onChange={(e) => setFoodScore(Number(e.target.value))}
              />

              <div className="rating-value">{foodScore}</div>
            </div>
          </div>

          {/* PRICE SCORE */}
          <div className="form-group">
            <label htmlFor="priceScore">Price Score</label>
            <i>
              How would you rate the value for the price(PPV)? (1 = Poor, 5 =
              Excellent)
            </i>
            <div className="rating-container">
              <input
                id="priceScore"
                className="rating-slider"
                type="range"
                min="1"
                max="5"
                step="1"
                value={priceScore}
                onChange={(e) => setPriceScore(Number(e.target.value))}
              />

              <div className="rating-value">{priceScore}</div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="locationScore">Location Score</label>
            <i>Is it easy to get to? Is it aircon? (1 = Poor, 5 = Excellent)</i>
            <div className="rating-container">
              <input
                id="locationScore"
                className="rating-slider"
                type="range"
                min="1"
                max="5"
                step="1"
                value={locationScore}
                onChange={(e) => setLocationScore(Number(e.target.value))}
              />

              <div className="rating-value">{locationScore}</div>
            </div>
          </div>

          {/* NOTES */}
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <i>Description of the meal, the good and the bad!</i>
            <textarea
              id="notes"
              placeholder="Write something about this place..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
            />
          </div>

          {/* PHOTO */}
          <div className="form-group">
            <label htmlFor="photo">Photo</label>

            <div className="photo-input">
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />

              <span className="photo-help">
                Upload a photo (JPG, PNG, etc.)
              </span>
            </div>
          </div>

          {/* SUBMIT */}
          <button className="add-entry-button" type="submit">
            Add Entry
          </button>
        </form>
      )}
    </div>
  );
}

export default AddEntry;
