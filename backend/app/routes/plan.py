# backend/app/routes/plan.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.auth_utils import get_current_user
import os

try:
    from google import genai
except ImportError:
    genai = None

router = APIRouter()


def calculate_bmr(weight: int, height: int, age: int, gender: str = "male") -> float:
    """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
    if gender == "male":
        return 10 * weight + 6.25 * height - 5 * age + 5
    else:
        return 10 * weight + 6.25 * height - 5 * age - 161


def calculate_tdee(bmr: float, activity_level: str) -> int:
    """Calculate Total Daily Energy Expenditure"""
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9
    }
    return int(bmr * multipliers.get(activity_level, 1.55))


def adjust_calories_for_goal(tdee: int, goal: str) -> int:
    """Adjust calories based on user's goal"""
    if goal == "lose":
        return tdee - 500  # 500 calorie deficit for weight loss
    elif goal == "gain":
        return tdee + 300  # 300 calorie surplus for weight gain
    else:
        return tdee  # maintain


def generate_meal_plan_by_diet(diet: str, goal: str):
    """Generate Mediterranean/Tunisian meal plan based on diet preference"""
    meal_plans = {
        "vegan": [
            {"day": 1, "breakfast": "Harissa Shakshuka with chickpeas", "lunch": "Couscous with roasted vegetables", "dinner": "Tunisian lentil soup (Chorba)"},
            {"day": 2, "breakfast": "Olive oil flatbread with zaatar", "lunch": "Stuffed peppers with quinoa", "dinner": "Mechouia salad with chickpeas"},
            {"day": 3, "breakfast": "Tunisian chickpea stew", "lunch": "Grilled eggplant with tahini", "dinner": "Couscous with seven vegetables"},
            {"day": 4, "breakfast": "Whole grain msemen with honey", "lunch": "Tunisian vegetable tajine", "dinner": "Lentil salad with harissa dressing"},
            {"day": 5, "breakfast": "Fresh figs with almonds", "lunch": "Brik with vegetables (no egg)", "dinner": "White bean stew with harissa"},
            {"day": 6, "breakfast": "Tunisian chickpea soup", "lunch": "Grilled vegetables with couscous", "dinner": "Mechouia with olive oil"},
            {"day": 7, "breakfast": "Dates with nuts and mint tea", "lunch": "Mediterranean veggie wrap", "dinner": "Tunisian vegetable stew"},
        ],
        "keto": [
            {"day": 1, "breakfast": "Tunisian brik with egg and tuna", "lunch": "Grilled sea bass with harissa", "dinner": "Lamb kebabs with mechouia"},
            {"day": 2, "breakfast": "Shakshuka with merguez", "lunch": "Grilled sardines with olive oil", "dinner": "Lamb tajine with vegetables"},
            {"day": 3, "breakfast": "Cheese omelette with harissa", "lunch": "Grilled octopus salad", "dinner": "Tunisian grilled chicken"},
            {"day": 4, "breakfast": "Brik with egg and harissa", "lunch": "Sea bream with lemon", "dinner": "Merguez with mechouia salad"},
            {"day": 5, "breakfast": "Poached eggs with olive oil", "lunch": "Grilled prawns with garlic", "dinner": "Lamb chops with herbs"},
            {"day": 6, "breakfast": "Tunisian egg tajine", "lunch": "Grilled tuna steak", "dinner": "Chicken with preserved lemon"},
            {"day": 7, "breakfast": "Shakshuka with merguez", "lunch": "Mixed seafood grill", "dinner": "Lamb kofta with salad"},
        ],
        "balanced": [
            {"day": 1, "breakfast": "Tunisian breakfast with olive oil and eggs", "lunch": "Couscous with chicken and vegetables", "dinner": "Grilled fish with mechouia salad"},
            {"day": 2, "breakfast": "Brik with egg and tuna", "lunch": "Lamb tajine with prunes", "dinner": "Tunisian chickpea soup"},
            {"day": 3, "breakfast": "Msemen with honey and almonds", "lunch": "Grilled sea bass with couscous", "dinner": "Vegetable tajine"},
            {"day": 4, "breakfast": "Shakshuka with bread", "lunch": "Chicken with preserved lemon", "dinner": "Tunisian salad with tuna"},
            {"day": 5, "breakfast": "Tunisian pastry with dates", "lunch": "Couscous royal (mixed meats)", "dinner": "Grilled sardines with salad"},
            {"day": 6, "breakfast": "Olive oil flatbread with harissa", "lunch": "Fish tagine with vegetables", "dinner": "Lentil soup with bread"},
            {"day": 7, "breakfast": "Fresh figs with yogurt", "lunch": "Lamb couscous", "dinner": "Grilled prawns with salad"},
        ]
    }
    return meal_plans.get(diet, meal_plans["balanced"])


def generate_workout_plan(activity_level: str, goal: str):
    """Generate workout routine based on activity level and goal"""
    if goal == "lose":
        return [
            {"day": 1, "workout": "Cardio - 30 min Running", "duration": 30},
            {"day": 2, "workout": "Strength Training - Full Body", "duration": 45},
            {"day": 3, "workout": "Cardio - 30 min Cycling", "duration": 30},
            {"day": 4, "workout": "Strength Training - Upper Body", "duration": 45},
            {"day": 5, "workout": "Cardio - 30 min Swimming", "duration": 30},
            {"day": 6, "workout": "Strength Training - Lower Body", "duration": 45},
            {"day": 7, "workout": "Active Rest - Yoga or Walking", "duration": 20},
        ]
    elif goal == "gain":
        return [
            {"day": 1, "workout": "Strength Training - Chest & Triceps", "duration": 60},
            {"day": 2, "workout": "Strength Training - Back & Biceps", "duration": 60},
            {"day": 3, "workout": "Light Cardio - 20 min", "duration": 20},
            {"day": 4, "workout": "Strength Training - Legs", "duration": 60},
            {"day": 5, "workout": "Strength Training - Shoulders", "duration": 60},
            {"day": 6, "workout": "Light Cardio - 20 min", "duration": 20},
            {"day": 7, "workout": "Rest", "duration": 0},
        ]
    else:  # maintain
        return [
            {"day": 1, "workout": "Full Body Strength Training", "duration": 45},
            {"day": 2, "workout": "Cardio - 25 min Running", "duration": 25},
            {"day": 3, "workout": "Full Body Strength Training", "duration": 45},
            {"day": 4, "workout": "Cardio - 25 min Cycling", "duration": 25},
            {"day": 5, "workout": "Full Body Strength Training", "duration": 45},
            {"day": 6, "workout": "Active Rest - Yoga", "duration": 30},
            {"day": 7, "workout": "Rest", "duration": 0},
        ]


@router.post("/generate-plan")
async def generate_plan(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate user profile is complete
    if not all([current_user.age, current_user.weight, current_user.height]):
        raise HTTPException(
            status_code=400,
            detail="Please complete your profile (age, weight, height) before generating a plan"
        )

    # Calculate calories
    bmr = calculate_bmr(current_user.weight, current_user.height, current_user.age)
    tdee = calculate_tdee(bmr, current_user.activity_level or "moderate")
    daily_calories = adjust_calories_for_goal(tdee, current_user.goal or "maintain")

    # Try AI-powered plan generation
    try:
        if genai:
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                client = genai.Client(api_key=api_key)
                
                prompt = f"""Generate a personalized 7-day Mediterranean/Tunisian fitness and nutrition plan for a user with the following profile:
- Age: {current_user.age}
- Weight: {current_user.weight} kg
- Height: {current_user.height} cm
- Goal: {current_user.goal or 'maintain'}
- Diet preference: {current_user.diet or 'balanced'}
- Activity level: {current_user.activity_level or 'moderate'}
- Daily calorie target: {daily_calories} kcal
- BMR: {int(bmr)} kcal
- TDEE: {tdee} kcal
{f'- Health conditions: {current_user.health_conditions}' if current_user.health_conditions else ''}

IMPORTANT: Focus on Mediterranean and Tunisian cuisine (couscous, tajine, brik, mechouia, harissa, olive oil, fish, etc.).
Keep meals HEALTHY and aligned with their goal.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{{
  "meal_plan": [
    {{"day": 1, "breakfast": "meal name only", "lunch": "meal name only", "dinner": "meal name only"}},
    ... (7 days total)
  ],
  "workout_routine": [
    {{"day": 1, "workout": "...", "duration": 45}},
    ... (7 days total)
  ],
  "tips": ["tip1", "tip2", "tip3"]
}}

Just provide MEAL NAMES, not recipes or ingredients. Make it Mediterranean/Tunisian focused and healthy."""

                models_to_try = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
                
                for model_name in models_to_try:
                    try:
                        response = client.models.generate_content(
                            model=model_name,
                            contents=prompt
                        )
                        
                        text = response.text
                        print(f"AI plan generation successful with {model_name}")
                        
                        # Parse JSON response
                        import json, re
                        text = re.sub(r'^```json\s*', '', text)
                        text = re.sub(r'\s*```$', '', text)
                        match = re.search(r'\{[\s\S]*\}', text)
                        if match:
                            ai_plan = json.loads(match.group(0))
                            
                            plan = {
                                "daily_calories": daily_calories,
                                "bmr": int(bmr),
                                "tdee": tdee,
                                "goal": current_user.goal or "maintain",
                                "diet": current_user.diet or "balanced",
                                "meal_plan": ai_plan.get("meal_plan", []),
                                "workout_routine": ai_plan.get("workout_routine", []),
                                "tips": ai_plan.get("tips", []),
                                "ai_generated": True
                            }
                            return plan
                    except Exception as e:
                        print(f"Model {model_name} failed: {str(e)}")
                        continue
    except Exception as e:
        print(f"AI plan generation failed: {str(e)}")

    # Fallback to static plans if AI fails
    print("Using fallback static plan generation")
    meal_plan = generate_meal_plan_by_diet(
        current_user.diet or "balanced",
        current_user.goal or "maintain"
    )

    workout_routine = generate_workout_plan(
        current_user.activity_level or "moderate",
        current_user.goal or "maintain"
    )

    plan = {
        "daily_calories": daily_calories,
        "bmr": int(bmr),
        "tdee": tdee,
        "goal": current_user.goal or "maintain",
        "diet": current_user.diet or "balanced",
        "meal_plan": meal_plan,
        "workout_routine": workout_routine,
        "ai_generated": False
    }

    return plan


@router.get("/wellness-score")
async def get_wellness_score(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculate wellness score based on user's activity and profile completeness"""
    score = 0

    # Profile completeness (30 points)
    if current_user.age:
        score += 5
    if current_user.weight:
        score += 5
    if current_user.height:
        score += 5
    if current_user.goal:
        score += 5
    if current_user.diet:
        score += 5
    if current_user.activity_level:
        score += 5

    # Activity tracking (40 points) - check recent activities
    recent_activities = db.query(models.Activity).filter(
        models.Activity.owner_id == current_user.id
    ).limit(7).all()

    score += min(len(recent_activities) * 5, 40)

    # Consistency bonus (30 points)
    if len(recent_activities) >= 5:
        score += 30
    elif len(recent_activities) >= 3:
        score += 20
    elif len(recent_activities) >= 1:
        score += 10

    return {
        "wellness_score": min(score, 100),
        "profile_complete": score >= 30,
        "recent_activities_count": len(recent_activities)
    }


@router.post("/generate-recipe")
async def generate_recipe(
    ingredients: dict,
    current_user: models.User = Depends(get_current_user)
):
    """Generate a healthy Mediterranean/Tunisian recipe from available ingredients"""
    
    ingredients_list = ingredients.get("ingredients", "")
    
    if not ingredients_list:
        raise HTTPException(status_code=400, detail="Please provide ingredients")
    
    try:
        if genai:
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                client = genai.Client(api_key=api_key)
                
                # Include user preferences if available
                dietary_info = ""
                if current_user.diet:
                    dietary_info = f"\n- Diet preference: {current_user.diet}"
                if current_user.goal:
                    dietary_info += f"\n- Health goal: {current_user.goal}"
                if current_user.health_conditions:
                    dietary_info += f"\n- Health conditions: {current_user.health_conditions}"
                
                prompt = f"""Create a healthy Mediterranean/Tunisian recipe using these available ingredients:
{ingredients_list}
{dietary_info}

IMPORTANT Guidelines:
- Focus on Mediterranean/Tunisian cooking style (use harissa, olive oil, cumin, coriander, etc.)
- Make it HEALTHY and nutritious
- Keep it simple and realistic
- Estimate calories and macros

Return ONLY a valid JSON object (no markdown, no code blocks) with this structure:
{{
  "recipe_name": "...",
  "cuisine": "Mediterranean/Tunisian",
  "prep_time": "15 mins",
  "cook_time": "20 mins",
  "servings": 2,
  "ingredients": [
    "ingredient 1 with quantity",
    "ingredient 2 with quantity"
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "nutrition": {{
    "calories": 400,
    "protein_g": 25,
    "carbs_g": 35,
    "fat_g": 15
  }},
  "health_benefits": "Brief description of health benefits"
}}"""

                models_to_try = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
                
                for model_name in models_to_try:
                    try:
                        response = client.models.generate_content(
                            model=model_name,
                            contents=prompt
                        )
                        
                        text = response.text
                        print(f"Recipe generation successful with {model_name}")
                        
                        # Parse JSON response
                        import json, re
                        text = re.sub(r'^```json\s*', '', text)
                        text = re.sub(r'\s*```$', '', text)
                        match = re.search(r'\{[\s\S]*\}', text)
                        if match:
                            recipe = json.loads(match.group(0))
                            return recipe
                    except Exception as e:
                        print(f"Model {model_name} failed: {str(e)}")
                        continue
        
        raise HTTPException(status_code=500, detail="Unable to generate recipe. Please try again.")
                        
    except Exception as e:
        print(f"Recipe generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Recipe generation failed")
