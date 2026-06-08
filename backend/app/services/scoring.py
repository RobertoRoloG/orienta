from typing import List, Dict, Any

# Canonical list of dimensions — single source of truth
DIMENSIONS = ["logic", "analytics", "creativity", "social", "structure", "activity", "verbal", "empathy", "manual"]


def calculate_profile(answers: List[int], questions: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculates the UserProfile from the list of answers and questions.
    Each answer is a number (1-5) corresponding to a question in the list.

    Process:
      1. Accumulate raw weighted scores per dimension.
      2. Calculate the maximum possible score per dimension (as if all answers were 5).
      3. Normalize each dimension to a 0-10 scale.

    Formula: dimensionFinal = (rawScore / maxPossible) * 10
    """
    raw_scores = {dim: 0.0 for dim in DIMENSIONS}
    max_scores = {dim: 0.0 for dim in DIMENSIONS}

    for index, question in enumerate(questions):
        if index >= len(answers):
            break

        answer = answers[index]
        weight = question.get("weight", 1.0)
        dimensions = question.get("dimensions", [])

        for dim in dimensions:
            if dim in raw_scores:
                raw_scores[dim] += answer * weight
                max_scores[dim] += 5 * weight  # max answer = 5

    # Normalize to 0-10 scale
    profile = {}
    for dim in DIMENSIONS:
        if max_scores[dim] > 0:
            profile[dim] = round((raw_scores[dim] / max_scores[dim]) * 10, 2)
        else:
            profile[dim] = 0.0

    return profile
