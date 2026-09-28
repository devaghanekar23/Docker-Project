import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  category: "Breakfast",
  icon: "🍳",
  time: 15,
  difficulty: "Easy",
  servings: 2,
  blurb: "",
  ingredients: [
    {
      qty: 1,
      unit: "",
      item: "",
    },
  ],
  steps: [""],
};

export default function RecipeForm({
  recipe,
  categories,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    recipe || emptyForm
  );

  useEffect(() => {
    setForm(recipe || emptyForm);
  }, [recipe]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateIngredient(index, field, value) {
    setForm((current) => {
      const ingredients = [...current.ingredients];

      ingredients[index] = {
        ...ingredients[index],
        [field]:
          field === "qty"
            ? Number(value)
            : value,
      };

      return {
        ...current,
        ingredients,
      };
    });
  }

  function addIngredient() {
    setForm((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        {
          qty: 1,
          unit: "",
          item: "",
        },
      ],
    }));
  }

  function removeIngredient(index) {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function updateStep(index, value) {
    setForm((current) => {
      const steps = [...current.steps];

      steps[index] = value;

      return {
        ...current,
        steps,
      };
    });
  }

  function addStep() {
    setForm((current) => ({
      ...current,
      steps: [...current.steps, ""],
    }));
  }

  function removeStep(index) {
    setForm((current) => ({
      ...current,
      steps: current.steps.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter recipe name.");
      return;
    }

    if (!form.blurb.trim()) {
      alert("Please enter recipe description.");
      return;
    }

    const validIngredients =
      form.ingredients.filter(
        (ingredient) =>
          ingredient.item.trim()
      );

    const validSteps = form.steps.filter(
      (step) => step.trim()
    );

    if (validIngredients.length === 0) {
      alert("Add at least one ingredient.");
      return;
    }

    if (validSteps.length === 0) {
      alert("Add at least one cooking step.");
      return;
    }

    const recipeData = {
      ...form,

      id:
        recipe?.id ||
        `custom-${Date.now()}`,

      title: form.title.trim(),

      time: Number(form.time),

      servings: Number(form.servings),

      ingredients: validIngredients,

      steps: validSteps,

      isCustom: true,
    };

    onSave(recipeData);
  }

  return (
    <div
      className="form-overlay"
      onClick={onClose}
    >
      <div
        className="recipe-form-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="form-header">
          <div>
            <span className="section-eyebrow">
              {recipe
                ? "UPDATE RECIPE"
                : "NEW RECIPE"}
            </span>

            <h2>
              {recipe
                ? "Edit recipe"
                : "Create a recipe"}
            </h2>
          </div>

          <button
            className="form-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="recipe-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <label>
              Recipe name
              <input
                value={form.title}
                onChange={(e) =>
                  updateField(
                    "title",
                    e.target.value
                  )
                }
                placeholder="e.g. Creamy Pasta"
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target.value
                  )
                }
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Icon
              <input
                value={form.icon}
                onChange={(e) =>
                  updateField(
                    "icon",
                    e.target.value
                  )
                }
                placeholder="🍝"
              />
            </label>

            <label>
              Cooking time
              <input
                type="number"
                min="1"
                value={form.time}
                onChange={(e) =>
                  updateField(
                    "time",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Difficulty
              <select
                value={form.difficulty}
                onChange={(e) =>
                  updateField(
                    "difficulty",
                    e.target.value
                  )
                }
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>

            <label>
              Servings
              <input
                type="number"
                min="1"
                value={form.servings}
                onChange={(e) =>
                  updateField(
                    "servings",
                    e.target.value
                  )
                }
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              rows="3"
              value={form.blurb}
              onChange={(e) =>
                updateField(
                  "blurb",
                  e.target.value
                )
              }
              placeholder="Describe your recipe..."
            />
          </label>

          {/* Ingredients */}

          <div className="form-section">
            <div className="form-section-title">
              <h3>Ingredients</h3>

              <button
                type="button"
                className="small-add"
                onClick={addIngredient}
              >
                + Add ingredient
              </button>
            </div>

            <div className="form-rows">
              {form.ingredients.map(
                (ingredient, index) => (
                  <div
                    className="ingredient-form-row"
                    key={index}
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      value={ingredient.qty}
                      onChange={(e) =>
                        updateIngredient(
                          index,
                          "qty",
                          e.target.value
                        )
                      }
                      placeholder="Qty"
                    />

                    <input
                      value={ingredient.unit}
                      onChange={(e) =>
                        updateIngredient(
                          index,
                          "unit",
                          e.target.value
                        )
                      }
                      placeholder="Unit"
                    />

                    <input
                      value={ingredient.item}
                      onChange={(e) =>
                        updateIngredient(
                          index,
                          "item",
                          e.target.value
                        )
                      }
                      placeholder="Ingredient"
                    />

                    <button
                      type="button"
                      className="remove-row"
                      onClick={() =>
                        removeIngredient(
                          index
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Steps */}

          <div className="form-section">
            <div className="form-section-title">
              <h3>Method</h3>

              <button
                type="button"
                className="small-add"
                onClick={addStep}
              >
                + Add step
              </button>
            </div>

            <div className="form-rows">
              {form.steps.map(
                (step, index) => (
                  <div
                    className="step-form-row"
                    key={index}
                  >
                    <span>
                      {index + 1}
                    </span>

                    <textarea
                      rows="2"
                      value={step}
                      onChange={(e) =>
                        updateStep(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Step ${
                        index + 1
                      }`}
                    />

                    <button
                      type="button"
                      className="remove-row"
                      onClick={() =>
                        removeStep(index)
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-recipe-btn"
            >
              {recipe
                ? "Update Recipe"
                : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}