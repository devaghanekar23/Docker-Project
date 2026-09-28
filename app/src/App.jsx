import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { fetchRecipes, categories } from "./data/recipes";

import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import RecipeCard from "./components/RecipeCard.jsx";
import RecipeDetail from "./components/RecipeDetail.jsx";
import RecipeForm from "./components/RecipeForm.jsx";
import SkeletonCard from "./components/SkeletonCard.jsx";
import Toast from "./components/Toast.jsx";

const FAVORITES_KEY = "hearth-favorites";
const RATINGS_KEY = "hearth-ratings";
const REVIEWS_KEY = "hearth-reviews";

export default function App() {
  /* =========================
     BASIC FILTER STATES
  ========================= */

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");

  const [showFavorites, setShowFavorites] = useState(false);

  const [activeRecipe, setActiveRecipe] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  /* =========================
     DATABASE RECIPES
  ========================= */

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     TOAST
  ========================= */

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({
      message,
      type,
    });
  };

  /* =========================
     FETCH RECIPES FROM MYSQL API
  ========================= */

  const loadRecipes = async () => {
    try {
      setLoading(true);

      const data = await fetchRecipes();

      setRecipes(data);
    } catch (error) {
      console.error(
        "Database se recipes load karne me error aaya:",
        error
      );

      showToast(
        "Recipes database se load nahi ho paayi",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  /* =========================
     FAVORITES
  ========================= */

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  /* =========================
     RATINGS
  ========================= */

  const [ratings, setRatings] = useState(() => {
    try {
      const saved = localStorage.getItem(RATINGS_KEY);

      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(
      RATINGS_KEY,
      JSON.stringify(ratings)
    );
  }, [ratings]);

  /* =========================
     REVIEWS
  ========================= */

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_KEY);

      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(
      REVIEWS_KEY,
      JSON.stringify(reviews)
    );
  }, [reviews]);

  /* =========================
     FAVORITE FUNCTION
  ========================= */

  function toggleFavorite(id) {
    setFavorites((current) => {
      const isFavorite = current.includes(id);

      if (isFavorite) {
        showToast(
          "Removed from saved recipes",
          "info"
        );

        return current.filter(
          (item) => item !== id
        );
      }

      showToast(
        "Added to saved recipes!",
        "success"
      );

      return [...current, id];
    });
  }

  /* =========================
     CATEGORY
  ========================= */

  function selectCategory(category) {
    setActiveCategory(category);
    setShowFavorites(false);
    setNavOpen(false);
  }

  function selectFavorites() {
    setShowFavorites(true);
    setNavOpen(false);
  }

  /* =========================
     ADD / EDIT RECIPE
  ========================= */

  function saveRecipe(recipe) {
    setRecipes((current) => {
      const exists = current.some(
        (item) => item.id === recipe.id
      );

      if (exists) {
        showToast(
          "Recipe updated successfully!",
          "success"
        );

        return current.map((item) =>
          item.id === recipe.id
            ? recipe
            : item
        );
      }

      showToast(
        "New recipe created!",
        "success"
      );

      return [...current, recipe];
    });

    setShowForm(false);
    setEditingRecipe(null);
    setActiveRecipe(recipe);
  }

  function editRecipe(recipe) {
    setEditingRecipe(recipe);
    setShowForm(true);
  }

  /* =========================
     DELETE RECIPE
  ========================= */

  function deleteRecipe(id) {
    setRecipes((current) =>
      current.filter(
        (recipe) => recipe.id !== id
      )
    );

    setFavorites((current) =>
      current.filter(
        (favorite) => favorite !== id
      )
    );

    setActiveRecipe(null);

    showToast(
      "Recipe deleted",
      "info"
    );
  }

  /* =========================
     RATING
  ========================= */

  function rateRecipe(id, rating) {
    setRatings((current) => ({
      ...current,
      [id]: rating,
    }));

    showToast(
      `Rated ${ rating } star${
  rating > 1 ? "s" : ""
} `,
      "success"
    );
  }

  /* =========================
     REVIEWS
  ========================= */

  function addReview(id, review) {
    setReviews((current) => ({
      ...current,
      [id]: [
        ...(current[id] || []),
        review,
      ],
    }));

    showToast(
      "Review submitted!",
      "success"
    );
  }

  /* =========================
     COUNTS
  ========================= */

  const counts = useMemo(() => {
    const map = {
      All: recipes.length,
    };

    categories.forEach((category) => {
      map[category] = recipes.filter(
        (recipe) =>
          recipe.category === category
      ).length;
    });

    return map;
  }, [recipes]);

  /* =========================
     FILTER RECIPES
  ========================= */

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const searchText =
        query.toLowerCase();

      const matchesSearch =
        recipe.title
          ?.toLowerCase()
          .includes(searchText) ||
        recipe.blurb
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        activeCategory === "All" ||
        recipe.category === activeCategory;

      const matchesDifficulty =
        difficulty === "All" ||
        recipe.difficulty === difficulty;

      let matchesTime = true;

      if (timeFilter === "under15") {
        matchesTime = recipe.time < 15;
      }

      if (timeFilter === "15to30") {
        matchesTime =
          recipe.time >= 15 &&
          recipe.time <= 30;
      }

      if (timeFilter === "30to60") {
        matchesTime =
          recipe.time > 30 &&
          recipe.time <= 60;
      }

      if (timeFilter === "60plus") {
        matchesTime = recipe.time > 60;
      }

      const matchesFavorites =
        !showFavorites ||
        favorites.includes(recipe.id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesTime &&
        matchesFavorites
      );
    });
  }, [
    recipes,
    query,
    activeCategory,
    difficulty,
    timeFilter,
    showFavorites,
    favorites,
  ]);

  /* =========================
     PAGE HEADING
  ========================= */

  const heading = showFavorites
    ? "Saved recipes"
    : activeCategory === "All"
    ? "All recipes"
    : activeCategory;

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="shell">
        <div className="grid">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <SkeletonCard key={index} />
            )
          )}
        </div>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */

  return (
    <div className="shell">

      {/* TOAST */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* MOBILE NAV */}

      <button
        className="nav-toggle"
        onClick={() =>
          setNavOpen(
            (current) => !current
          )
        }
      >
        <span />
        <span />
        <span />
      </button>

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
  navOpen ? "is-open" : ""
} `}
      >
        <div className="brand">

          <span className="brand-mark">
            H
          </span>

          <span className="brand-name">
            Hearth
          </span>

          <LanguageSwitcher />

        </div>

        <nav>

          <span className="nav-label">
            Browse
          </span>

          <ul className="nav-list">

            {/* ALL RECIPES */}

            <li>
              <button
                className={
                  activeCategory === "All" &&
                  !showFavorites
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  selectCategory("All")
                }
              >
                <span>
                  All recipes
                </span>

                <span className="nav-count">
                  {counts.All}
                </span>
              </button>
            </li>

            {/* CATEGORIES */}

            {categories.map(
              (category) => (
                <li key={category}>

                  <button
                    className={
                      activeCategory ===
                        category &&
                      !showFavorites
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      selectCategory(
                        category
                      )
                    }
                  >
                    <span>
                      {category}
                    </span>

                    <span className="nav-count">
                      {counts[category]}
                    </span>
                  </button>

                </li>
              )
            )}

          </ul>

          <span className="nav-label">
            Library
          </span>

          <ul className="nav-list">

            {/* SAVED */}

            <li>

              <button
                className={
                  showFavorites
                    ? "is-active"
                    : ""
                }
                onClick={
                  selectFavorites
                }
              >
                <span>
                  Saved
                </span>

                <span className="nav-count">
                  {favorites.length}
                </span>
              </button>

            </li>

            {/* ADD RECIPE */}

            <li>

              <button
                onClick={() => {
                  setShowFavorites(false);
                  setEditingRecipe(null);
                  setShowForm(true);
                }}
              >
                <span>
                  + Add Recipe
                </span>
              </button>

            </li>

          </ul>

        </nav>
      </aside>

      {/* MAIN CONTENT */}

      <main className="content">

        {/* HEADER */}

        <header className="content-header">

          <div>

            <h1>
              {heading}
            </h1>

            <p>
              {filteredRecipes.length} of{" "}
              {recipes.length} recipes
            </p>

          </div>

          {/* SEARCH */}

          <div className="search-wrap">

            <svg
              className="search-icon"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle
                cx="9"
                cy="9"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <path
                d="M14 14L18 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="search"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
            />

          </div>

        </header>

        {/* FILTER BAR */}

        <div className="filter-bar">

          {/* DIFFICULTY */}

          <div className="filter-group">

            <span>
              Difficulty
            </span>

            {[
              "All",
              "Easy",
              "Medium",
              "Hard",
            ].map((item) => (

              <button
                key={item}
                className={
                  difficulty === item
                    ? "filter-active"
                    : ""
                }
                onClick={() =>
                  setDifficulty(item)
                }
              >
                {item}
              </button>

            ))}

          </div>

          {/* COOKING TIME */}

          <div className="filter-group">

            <span>
              Cooking time
            </span>

            <select
              value={timeFilter}
              onChange={(e) =>
                setTimeFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All times
              </option>

              <option value="under15">
                Under 15 min
              </option>

              <option value="15to30">
                15–30 min
              </option>

              <option value="30to60">
                30–60 min
              </option>

              <option value="60plus">
                60+ min
              </option>

            </select>

          </div>

        </div>

        {/* RECIPES */}

        {filteredRecipes.length === 0 ? (

          <div className="empty">

            <p>
              No recipes match
            </p>

            <span>
              Try changing your search
              or filters.
            </span>

          </div>

        ) : (

          <div className="grid">

            {filteredRecipes.map(
              (recipe) => (

                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favorites.includes(
                    recipe.id
                  )}
                  onOpen={() =>
                    setActiveRecipe(
                      recipe
                    )
                  }
                  onToggleFavorite={() =>
                    toggleFavorite(
                      recipe.id
                    )
                  }
                />

              )
            )}

          </div>

        )}

      </main>

      {/* RECIPE DETAIL */}

      {activeRecipe && (

        <RecipeDetail
          recipe={activeRecipe}

          isFavorite={favorites.includes(
            activeRecipe.id
          )}

          onClose={() =>
            setActiveRecipe(null)
          }

          onToggleFavorite={() =>
            toggleFavorite(
              activeRecipe.id
            )
          }

          rating={
            ratings[
              activeRecipe.id
            ] || 0
          }

          reviews={
            reviews[
              activeRecipe.id
            ] || []
          }

          onRate={rateRecipe}

          onAddReview={(review) =>
            addReview(
              activeRecipe.id,
              review
            )
          }

          onDelete={deleteRecipe}

          onEdit={editRecipe}
        />

      )}

      {/* ADD / EDIT FORM */}

      {showForm && (

        <RecipeForm
          recipe={editingRecipe}
          categories={categories}

          onSave={saveRecipe}

          onClose={() => {
            setShowForm(false);
            setEditingRecipe(null);
          }}
        />

      )}

    </div>
  );
}
