import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CookingTimer from "./CookingTimer.jsx";
import DeleteModal from "./DeleteModal.jsx";

function formatQty(qty) {
  if (qty === 0) return "";

  const rounded = Math.round(qty * 100) / 100;

  if (Number.isInteger(rounded)) {
    return String(rounded);
  }

  const fractions = {
    0.25: "¼",
    0.5: "½",
    0.75: "¾",
    0.33: "⅓",
    0.67: "⅔",
  };

  const nearest = Object.keys(fractions).find(
    (f) => Math.abs(rounded - f) < 0.05
  );

  if (nearest) {
    return fractions[nearest];
  }

  return rounded
    .toFixed(2)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

export default function RecipeDetail({
  recipe,
  isFavorite,
  onClose,
  onToggleFavorite,
  rating,
  reviews,
  onRate,
  onAddReview,
  onDelete,
  onEdit,
}) {
  const { t } = useTranslation();
  const [servings, setServings] = useState(recipe.servings);
  const [checked, setChecked] = useState({});
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(rating || 0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setServings(recipe.servings);
    setChecked({});
    setSelectedRating(rating || 0);
  }, [recipe, rating]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") {
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
        } else {
          onClose();
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, isDeleteModalOpen]);

  const scale = servings / recipe.servings;

  function submitReview(event) {
    event.preventDefault();

    if (!reviewText.trim()) {
      return;
    }

    onAddReview({
      text: reviewText.trim(),
      rating: selectedRating || 5,
      date: new Date().toLocaleDateString(),
    });

    setReviewText("");
  }

  function handleConfirmDelete() {
    setIsDeleteModalOpen(false);
    onDelete(recipe.id);
  }

  return (
    <>
      <div className="recipe-overlay" onClick={onClose}>
        <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>

          {/* HEADER */}
          <div className="modal-hero">
            <div className="modal-icon">{recipe.icon}</div>
            <span className="modal-category">{recipe.category}</span>
            <h2>{recipe.title}</h2>
            <p>{recipe.blurb}</p>

            <div className="modal-meta">
              <span>◷ {recipe.time} min</span>
              <span>•</span>
              <span>✦ {recipe.difficulty}</span>
            </div>

            <div className="detail-actions">
              <button
                className={`modal-save ${isFavorite ? "saved" : ""}`}
                onClick={onToggleFavorite}
              >
                {isFavorite ? `♥ ${t("recipe.saved")}` : `♡ ${t("recipe.save")}`}
              </button>

              <button className="edit-recipe-btn" onClick={() => onEdit(recipe)}>
                ✏ {t("recipe.edit")}
              </button>

              {recipe.isCustom && (
                <button
                  className="delete-recipe-btn"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  🗑 {t("recipe.delete")}
                </button>
              )}
            </div>
          </div>

          <div className="modal-body">
            {/* LEFT COLUMN */}
            <div>
              <section className="ingredients-section">
                <div className="section-header">
                  <div>
                    <span className="section-eyebrow">{t("recipe.whatYouNeed")}</span>
                    <h3>{t("recipe.ingredients")}</h3>
                  </div>

                  <div className="servings-control">
                    <button onClick={() => setServings((s) => Math.max(1, s - 1))}>
                      −
                    </button>
                    <span>
                      {servings} {servings !== 1 ? t("recipe.servings") : t("recipe.serving")}
                    </span>
                    <button onClick={() => setServings((s) => s + 1)}>+</button>
                  </div>
                </div>

                <div className="ingredient-list">
                  {recipe.ingredients.map((ingredient, index) => {
                    const id = `${recipe.id}-${index}`;
                    const qty = ingredient.qty
                      ? formatQty(ingredient.qty * scale)
                      : "";

                    return (
                      <label
                        key={id}
                        className={`ingredient-item ${
                          checked[id] ? "checked" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!checked[id]}
                          onChange={() =>
                            setChecked((current) => ({
                              ...current,
                              [id]: !current[id],
                            }))
                          }
                        />
                        <span className="custom-checkbox">
                          {checked[id] && "✓"}
                        </span>
                        <span className="ingredient-text">
                          {qty && (
                            <strong>
                              {qty} {ingredient.unit}{" "}
                            </strong>
                          )}
                          {ingredient.item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>

              <CookingTimer initialMinutes={recipe.time} />
            </div>

            {/* RIGHT COLUMN */}
            <div>
              <section className="method-section">
                <div className="section-header">
                  <div>
                    <span className="section-eyebrow">{t("recipe.stepByStep")}</span>
                    <h3>{t("recipe.method")}</h3>
                  </div>
                </div>

                <div className="method-list">
                  {recipe.steps.map((step, index) => (
                    <div className="method-step" key={index}>
                      <div className="step-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="step-content">
                        <p>{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* RATING */}
              <section className="rating-section">
                <span className="section-eyebrow">{t("recipe.yourRating")}</span>
                <h3>{t("recipe.howWasIt")}</h3>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={star <= selectedRating ? "selected" : ""}
                      onClick={() => {
                        setSelectedRating(star);
                        onRate(recipe.id, star);
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </section>

              {/* REVIEWS */}
              <section className="reviews-section">
                <div className="section-header">
                  <div>
                    <span className="section-eyebrow">{t("recipe.community")}</span>
                    <h3>
                      {t("recipe.reviews")}
                      {reviews.length > 0 && ` (${reviews.length})`}
                    </h3>
                  </div>
                </div>

                <form className="review-form" onSubmit={submitReview}>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t("recipe.reviewPlaceholder")}
                    rows="3"
                  />
                  <button type="submit">{t("recipe.addReview")}</button>
                </form>

                <div className="review-list">
                  {reviews.length === 0 ? (
                    <p className="no-reviews">
                      {t("recipe.noReviews")}
                    </p>
                  ) : (
                    reviews.map((review, index) => (
                      <div className="review-item" key={index}>
                        <div className="review-top">
                          <strong>{t("recipe.you")}</strong>
                          <span>{"★".repeat(review.rating)}</span>
                        </div>
                        <p>{review.text}</p>
                        <small>{review.date}</small>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        recipeTitle={recipe.title}
      />
    </>
  );
}