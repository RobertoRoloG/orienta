import math
from typing import List, Dict, Any

# Dimensions used for matching — must match the scoring dimensions
DIMENSIONS = ["logic", "analytics", "creativity", "social", "structure", "activity", "verbal", "empathy", "manual"]

# Maximum possible Euclidean distance between two profiles on a 0-10 scale
# sqrt(7 * 10^2) ≈ 26.46
MAX_DISTANCE = math.sqrt(len(DIMENSIONS) * (10 ** 2))


def calculate_match(user_profile: Dict[str, float], career_profile: Dict[str, Any]) -> float:
    """
    Calculates the compatibility percentage (0 to 100) between a user profile and a career profile.
    Both profiles should be on a 0-10 scale for each dimension.
    Uses Euclidean distance normalized to a percentage.
    """
    sum_sq = 0.0
    for dim in DIMENSIONS:
        user_val = user_profile.get(dim, 0.0)
        career_val = career_profile.get(dim, 0.0)
        sum_sq += (user_val - career_val) ** 2

    distance = math.sqrt(sum_sq)
    
    # Penalización amplificada para aumentar la dispersión de resultados
    similarity = max(0.0, 100.0 - (distance * 7.5))
    return round(similarity, 2)


def calculate_tastes_score(user_tastes: List[str], career_tags: List[str]) -> float:
    if not user_tastes or not career_tags:
        return 0.0
    
    # Simple overlap calculation (Jaccard-like or just percentage of user tastes found in career tags)
    user_set = set(user_tastes)
    career_set = set(career_tags)
    
    intersection = user_set.intersection(career_set)
    # If the career has all the user's tastes, it gets 100%. 
    # If user selected 3 tastes, and career has 2, it gets 66.6%.
    return (len(intersection) / len(user_set)) * 100.0

def calculate_grades_score(user_grades: List[Dict[str, float]], career_weights: Dict[str, float]) -> float:
    if not user_grades or not career_weights:
        return 0.0
    
    total_weight = 0.0
    earned_score = 0.0
    
    user_grade_dict = {str(g["subject_id"]): g["score"] for g in user_grades}
    
    for subject_id, weight in career_weights.items():
        total_weight += weight
        # If user didn't provide a grade for a required subject, assume a mediocre default (e.g. 5.0) or 0.
        # Let's assume 5.0 to not harshly penalize missing data, or just use what they have.
        # Actually, if they didn't provide it, we could ignore it, but then they get 100% by avoiding bad subjects.
        # We will assume a 5.0 if missing, to encourage filling it out.
        grade = user_grade_dict.get(str(subject_id), 5.0)
        earned_score += (grade / 10.0) * weight
        
    if total_weight == 0:
        return 100.0
        
    return (earned_score / total_weight) * 100.0

def rank_careers(user_profile: Dict[str, float], careers: List[Dict[str, Any]], 
                 user_tastes: List[str] = None, user_grades: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Matches user profile with all careers, applies dynamic weighting for tastes and grades,
    and returns them sorted in descending order of compatibility.
    """
    
    # Determine dynamic weights based on what the user provided
    has_tastes = bool(user_tastes and len(user_tastes) > 0)
    has_grades = bool(user_grades and len(user_grades) > 0)
    
    if has_tastes and has_grades:
        weight_test = 0.70
        weight_tastes = 0.20
        weight_grades = 0.10
    elif has_tastes and not has_grades:
        weight_test = 0.78
        weight_tastes = 0.22
        weight_grades = 0.0
    elif not has_tastes and has_grades:
        weight_test = 0.88
        weight_tastes = 0.0
        weight_grades = 0.12
    else:
        weight_test = 1.0
        weight_tastes = 0.0
        weight_grades = 0.0

    ranked = []
    for career in careers:
        # 1. Test Score (0-100)
        test_score = calculate_match(user_profile, career)
        
        # 2. Tastes Score (0-100)
        tastes_score = 0.0
        if has_tastes:
            tastes_score = calculate_tastes_score(user_tastes, career.get("tags", []))
            
        # 3. Grades Score (0-100)
        grades_score = 0.0
        if has_grades:
            grades_score = calculate_grades_score(user_grades, career.get("academic_weights", {}))
            
        # Final weighted score
        final_match = (test_score * weight_test) + (tastes_score * weight_tastes) + (grades_score * weight_grades)
        
        career_ranked = {
            "name": career["name"], 
            "match": round(final_match, 2),
            "breakdown": {
                "test": test_score,
                "tastes": round(tastes_score, 2),
                "grades": round(grades_score, 2)
            }
        }
        ranked.append(career_ranked)

    ranked.sort(key=lambda x: x["match"], reverse=True)
    return ranked
