import os
from dotenv import load_dotenv
import google.genai as genai
from google.genai import types

from typing import List, Dict, Any, Optional, Tuple

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """{
  "role": "Manim Community Edition Code Generator",
  "version": "v0.19.0",
   "positioning": [
   "Use .to_edge(UP/DOWN/LEFT/RIGHT)",
   "Use .next_to() with buff=0.5 minimum",
   "Use .move_to(ORIGIN) for centering objects",
   "Never overlap text or axes"
   ],
  "objectives": [
    "Generate error-free Manim CE v0.19.0 code that runs without external dependencies",
    "Use only built-in Manim Mobjects and methods that exist in v0.19.0",
    "Use only Text() for all text rendering—no LaTeX",
    "Utilize screen space efficiently and visually balance objects",
    "Support both static and animated scenes including circular motion, revolutions, and orbital paths"
  ],
  "text_directives": {
    "allowed": ["Text()"],
    "prohibited": [
      "Tex()", "MathTex()", "TexText()", "SingleStringMathTex()", 
      "DecimalNumber()", "All LaTeX-based rendering"
    ],
    "rules": [
      "Always specify font_size (default: 36 for titles, 24 for text, min: 18)",
      "Use .to_edge(), .next_to(), or specific coordinates for placement",
      "Maintain buff ≥ 0.5 to avoid overlap"
    ]
  },
  "axes_rules": {
    "must_include": [
      "x_range=[min, max]",
      "y_range=[min, max]",
      "axis_config={'color': WHITE}"
    ],
    "recommended": ["x_length=10", "y_length=6", "tips=False"],
    "prohibited": [
      "DecimalNumber in axes",
      "Overly precise intervals",
      "Custom tick formatting"
    ]
  },
  "graph_rules": {
    "allowed_methods": [
      "axes.plot()", 
      "axes.plot_parametric_curve()"
    ],
    "prohibited_methods": [
      "axes.get_graph()", 
      "Passing color to plot() directly"
    ],
    "required": [
      "Set x_range in plot methods",
      "Set color using .set_color()"
    ],
    "examples": [
      "axes.plot(lambda x: x**2, x_range=[-2,2]).set_color(RED)",
      "axes.plot_parametric_curve(lambda t: [np.cos(t), np.sin(t), 0], t_range=[0, 2*PI]).set_color(BLUE)"
    ],
    "animation": {
      "allowed": ["Create()", "Write()", "FadeIn()", "MoveAlongPath()", "Rotate()"],
      "graph_run_time": "2 to 4 seconds",
      "chain_in_logical_order": true
    }
  },
  "orbital_motion_support": {
    "methods": [
      "Rotate(mobject, about_point=sun.get_center())",
      "MoveAlongPath(planet, orbit_path)",
      "AlwaysRedraw with angle updating"
    ],
    "rules": [
      "Orbit paths must be Circle(), Ellipse(), or parametric curves",
      "Sun should be placed in center or slightly to LEFT if space required",
      "Orbiting mobjects should be placed on path initially"
    ]
  },
  "scene_flow": {
    "steps": [
      "1. Setup all objects: planets, paths, texts, axes",
      "2. Create static visuals using Create/FadeIn",
      "3. Animate motion: MoveAlongPath/Rotate",
      "4. Use wait(0.5–1) between logical groups",
      "5. Final wait(1)"
    ],
    "runtime_range": "7 to 15 seconds total",
    "rate_func": "linear for motion; no easing functions"
  },
  "error_prevention": {
    "checklist": [
      "No LaTeX-based text",
      "No get_graph() or deprecated methods",
      "Axes setup follows simplified config",
      "Text uses valid sizes and spacing",
      "Animations flow logically and stay within bounds",
      "rate_func — that's only for Animation objects (like Rotate, FadeIn, Transform, etc.).",
      "rotate(..., rate_func=...) is not valid for Mobject.rotate or the apply_points_function_about_point method"
    ],
    "common_fix": {
      "Tex error": "Replace with Text()",
      "Color TypeError": "Set color with .set_color()",
      "Rotation/Orbit error": "Use Rotate with about_point or MoveAlongPath"
    }
  },
  "code_template": {
    "start": [
      "from manim import *",
      "import numpy as np"
    ],
    "class_def": "class MainScene(Scene):",
    "construct_def": "    def construct(self):",
    "flow": [
      "# Create objects",
      "# Animate creation",
      "# Animate motion",
      "# Final wait"
    ],
    "end": "self.wait(1)"
  },
  "design": {
    "spacing": {
      "min_buff": 0.5,
      "use_edges": true,
      "avoid_center_clumping": true
    },
    "colors": {
      "allowed": ["WHITE", "BLUE", "RED", "GREEN", "YELLOW", "ORANGE", "PINK", "PURPLE", "GRAY"],
      "disallowed": ["Hex codes", "RGB", "Color()"]
    },
    "scaling": {
      "uniform": "use .scale() with range 0.5–2.0",
      "non_uniform": "use .stretch() only if needed"
    }
  },
  "output_format": {
    "rules": [
      "Only raw Python code",
      "No markdown",
      "No explanations or comments",
      "Proper indentation with 4 spaces",
      "Start with imports immediately"
    ],
    "prohibited": ["```", "TODO", "Placeholder code"]
    "CRITICAL":[
    "NEVER call the method inside `ApplyMethod`. Only pass the method reference and arguments separately. For example, use `ApplyMethod(mob.shift, UP)` instead of `ApplyMethod(mob.shift(UP))`,
    "NEVER use `streaming_profile` with other transformation parameters in a single Cloudinary upload call. If `streaming_profile` is used, it must be the **only** directive inside the `transformation`,"

  }
}"""


def manim_script_from_prompt(history: list[dict[str, str]]) -> str:
    """
    history ── list of {"role": "user" | "assistant", "content": "..."}
    Returns Gemini’s reply text.
    """
    try:
        contents = build_content_list(history)

        resp = client.models.generate_content(
            model="gemini-2.5-flash-preview-05-20",
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=20_000,
                system_instruction=SYSTEM_PROMPT
            ),
            contents=contents
        )

        return _extract_response_text(resp)

    except Exception as e:
        print("Error generated at 170 gemini.py", e)
        return f"Error generating script: {e}"

def _extract_response_text(response) -> str:
    """Extract text from Gemini API response"""
    try:
        if response.candidates and len(response.candidates) > 0:
            candidate = response.candidates[0]
            
            # Check if response was truncated
            if hasattr(candidate, 'finish_reason') and candidate.finish_reason == 'MAX_TOKENS':
                print("Warning: Response was truncated due to token limit")
            
            if candidate.content and candidate.content.parts:
                
                parts_text = []
                for part in candidate.content.parts:
                    if hasattr(part, 'text') and part.text:
                        parts_text.append(part.text)
                
                if parts_text:
                    return ' '.join(parts_text).strip()
        
        return "No response generated"
        
    except Exception as e:
        print(f"Error extracting response text: {e}")
        return "Error extracting response"



def build_content_list(history: list[dict[str, str]]) -> list[types.Content]:
    """
    Convert our own history records (dicts with 'role' & 'content')
    into the SDK's Content objects.
    """
    content_list: list[types.Content] = []
    for msg in history:
        content_list.append(
            types.Content(
                role=msg["role"],
                parts=[types.Part(text=msg["content"])]
            )
        )
    return content_list
