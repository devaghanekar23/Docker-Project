export default function RecipeCard({
  recipe,
  isFavorite,
  onOpen,
  onToggleFavorite,
}) {
  return (
    <article className="recipe-card">

      <button
        className="recipe-card-main"
        onClick={onOpen}
      >
        <div className="recipe-image">
          <span className="recipe-icon">
            {recipe.icon}
          </span>

          <span className="recipe-category">
            {recipe.category}
          </span>
        </div>

        <div className="recipe-content">
          <h3>{recipe.title}</h3>

          <p className="recipe-description">
            {recipe.blurb}
          </p>

          <div className="recipe-info">
            <span>
              ◷ {recipe.time} min
            </span>

            <span className="info-divider" />

            <span>
              ✦ {recipe.difficulty}
            </span>
          </div>
        </div>
      </button>

      <button
        className={`favorite-button ${
          isFavorite ? "active" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={
          isFavorite
            ? "Remove favorite"
            : "Add favorite"
        }
      >
        {isFavorite ? "♥" : "♡"}
      </button>
    </article>
  );
}