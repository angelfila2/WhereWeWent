import "./EntryCard.css";
import { useState } from "react";

function EntryCard({ entry, onEntryUpdated }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // Temporary editable values
  const [editPlaceName, setEditPlaceName] = useState(entry.placeName);
  const [editLocation, setEditLocation] = useState(entry.location);
  const [editTimeWeWent, setEditTimeWeWent] = useState(
    entry.timeWeWent ? entry.timeWeWent.split("T")[0] : "",
  );
  const [editFoodScore, setEditFoodScore] = useState(entry.foodScore);
  const [editPriceScore, setEditPriceScore] = useState(entry.priceScore);
  const [editLocationScore, setEditLocationScore] = useState(
    entry.locationScore,
  );
  const [editNotes, setEditNotes] = useState(entry.notes || "");

  const renderStars = (score) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={index < score ? "star star-filled" : "star star-empty"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleEdit = () => {
    // Reset edit fields to current entry values
    setEditPlaceName(entry.placeName);
    setEditLocation(entry.location);

    setEditTimeWeWent(entry.timeWeWent ? entry.timeWeWent.split("T")[0] : "");

    setEditFoodScore(entry.foodScore);
    setEditPriceScore(entry.priceScore);
    setEditLocationScore(entry.locationScore);
    setEditNotes(entry.notes || "");

    setIsEditing(true);
    setMenuOpen(false);
  };

  const handleCancel = () => {
    // Throw away anything the user typed
    setEditPlaceName(entry.placeName);
    setEditLocation(entry.location);

    setEditTimeWeWent(entry.timeWeWent ? entry.timeWeWent.split("T")[0] : "");

    setEditFoodScore(entry.foodScore);
    setEditPriceScore(entry.priceScore);
    setEditLocationScore(entry.locationScore);
    setEditNotes(entry.notes || "");

    setIsEditing(false);
  };

  const handleSave = async () => {
    const editedEntry = {
      placeName: editPlaceName,
      location: editLocation,
      timeWeWent: editTimeWeWent,
      foodScore: editFoodScore,
      priceScore: editPriceScore,
      locationScore: editLocationScore,
      notes: editNotes,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/entries/${entry.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedEntry),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        console.error("Backend error:", errorData);

        return;
      }

      const updatedEntry = await response.json();

      console.log("Updated entry:", updatedEntry);

      // GET all entries again from Django
      await onEntryUpdated();

      // Then close edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/entries/${entry.id}/`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        console.error("Failed to delete entry");
        return;
      }

      console.log("Entry deleted");

      // Refetch entries from Django
      await onEntryUpdated();

      // Close menu
      setMenuOpen(false);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };
  return (
    <div className="entry-card">
      {/* LEFT - PHOTO */}
      <div className="entry-photo-container">
        {!photoError ? (
          <img
            className="entry-photo"
            src={`http://127.0.0.1:8000/api/entries/${entry.id}/photo/`}
            alt={entry.placeName}
            onError={() => setPhotoError(true)}
          />
        ) : (
          <div className="no-photo">No Photo</div>
        )}
      </div>

      {/* RIGHT - DETAILS */}
      <div className="entry-details">
        {/* TITLE */}
        <div className="entry-title-row">
          {isEditing ? (
            <input
              className="edit-title-input"
              type="text"
              value={editPlaceName}
              onChange={(e) => setEditPlaceName(e.target.value)}
            />
          ) : (
            <h2 className="entry-place-name">{entry.placeName}</h2>
          )}

          {/* THREE DOT MENU */}
          {!isEditing && (
            <div className="entry-menu-container">
              <button
                className="entry-menu"
                type="button"
                aria-label="Entry options"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ⋮
              </button>

              {menuOpen && (
                <div className="entry-menu-dropdown">
                  <button type="button" onClick={handleEdit}>
                    Edit Entry
                  </button>

                  <button type="button" onClick={handleDelete}>
                    Delete Entry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* LOCATION */}
        <div className="entry-info-row">
          <span className="entry-icon">📍</span>

          {isEditing ? (
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
            />
          ) : (
            <span>{entry.location}</span>
          )}
        </div>

        {/* DATE */}
        <div className="entry-info-row">
          <span className="entry-icon">📅</span>

          {isEditing ? (
            <input
              type="date"
              value={editTimeWeWent}
              onChange={(e) => setEditTimeWeWent(e.target.value)}
            />
          ) : (
            <span>{formatDate(entry.timeWeWent)}</span>
          )}
        </div>

        {/* RATINGS */}
        <div className="ratings-section">
          {/* FOOD SCORE */}
          <div className="rating-row">
            <span className="rating-label">Food Score</span>

            {isEditing ? (
              <>
                <input
                  className="edit-rating-slider"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={editFoodScore}
                  onChange={(e) => setEditFoodScore(Number(e.target.value))}
                />

                <span className="score-text">{editFoodScore} / 5</span>
              </>
            ) : (
              <>
                <div className="star-pill">{renderStars(entry.foodScore)}</div>

                <span className="score-text">{entry.foodScore} / 5</span>
              </>
            )}
          </div>

          {/* PRICE SCORE */}
          <div className="rating-row">
            <span className="rating-label">Price Score</span>

            {isEditing ? (
              <>
                <input
                  className="edit-rating-slider"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={editPriceScore}
                  onChange={(e) => setEditPriceScore(Number(e.target.value))}
                />

                <span className="score-text">{editPriceScore} / 5</span>
              </>
            ) : (
              <>
                <div className="star-pill">{renderStars(entry.priceScore)}</div>

                <span className="score-text">{entry.priceScore} / 5</span>
              </>
            )}
          </div>

          <div className="rating-row">
            <span className="rating-label">Location Score</span>

            {isEditing ? (
              <>
                <input
                  className="edit-rating-slider"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={editLocationScore}
                  onChange={(e) => setEditLocationScore(Number(e.target.value))}
                />

                <span className="score-text">{editLocationScore} / 5</span>
              </>
            ) : (
              <>
                <div className="star-pill">
                  {renderStars(entry.locationScore)}
                </div>

                <span className="score-text">{entry.locationScore} / 5</span>
              </>
            )}
          </div>
        </div>

        {/* NOTES */}
        <div className="entry-notes">
          <div className="notes-title">
            <span>📝</span>
            <strong>Notes</strong>
          </div>

          {isEditing ? (
            <textarea
              className="edit-notes"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows="4"
            />
          ) : (
            entry.notes && <p>{entry.notes}</p>
          )}
        </div>

        {/* EDIT BUTTONS */}
        {isEditing && (
          <div className="edit-actions">
            <button
              className="save-edit-button"
              type="button"
              onClick={handleSave}
            >
              Save
            </button>

            <button
              className="cancel-edit-button"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntryCard;
