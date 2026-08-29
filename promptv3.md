I have an existing React Three Fiber portfolio site built as a 3D Greco-Roman hall (marble columns, chambers connected by a scroll-driven camera move). I want to add a long water feature running through the hallway — like a Roman nymphaeum canal or reflecting channel running alongside/between the columns.

Feature Requirements

Water

A long, narrow flowing water channel running down the length of the hallway (think Hadrian's Villa's Canopus canal, or a classical impluvium channel) — crystal-clear, blue-turquoise tint, not opaque
Continuous flowing-water animation: scrolling/animated normal maps or a flow-map shader so the surface reads as gently moving water, not a static reflective plane
Realistic surface behavior: Fresnel-based reflectivity (more reflective at grazing angles, more transparent looking straight down), subtle ripples, soft foam/highlight at the channel edges where it meets the marble

Fish

Multiple colorful fish (Mediterranean/koi-style palette — oranges, golds, blues, whites) swimming within the channel
Natural swim motion: schools or individuals following smooth curved paths, gentle turns, varied speed/depth — not fish that all move identically or in straight lines
Fish should be visually simplified/stylized enough to stay performant in numbers, but should read clearly as fish (shape + color + fin motion), not blobs

Light & Shine Effect

Light appears to fall from openings above (as if sunlight is coming through the hall's ceiling/oculus) and hits the water surface
Where light hits the water, produce a shimmering/sparkling highlight effect on the surface (specular sparkle that moves with the flowing water)
Add underwater caustics: the rippling light-pattern effect caustics normally cast on a surface underwater/near water, projected subtly onto the channel bed and the nearby marble floor/columns
The overall effect should feel like walking past a sunlit fountain — light, water motion, and sparkle should all feel connected to the same light source, not layered independently
Placement & Integration
Run the channel through the corridor/hallway chamber (the one representing my Experience section, or wherever the longest straight stretch of hall is) so the camera passes alongside it during the scroll-driven move
Ensure the water doesn't obstruct readability of any text/content overlays passing through that chamber — keep it as an ambient environmental element, not something competing with foreground content
Match the existing color grading/lighting of the scene so it looks like it belongs, not like a pasted-in effect
Suggested Technical Approach
Use a custom water shader (or adapt Three.js's built-in Water example) with a scrolling normal map for flow, Fresnel term for reflectivity, and a subtle color gradient for depth (lighter near edges/shallow, deeper blue toward the channel's visual center)
For caustics, either use a pre-baked scrolling caustics texture projected onto nearby surfaces, or a shader-based caustics approximation — prioritize whichever keeps frame rate stable
Animate fish via a small number of reusable curve paths (e.g., Catmull-Rom splines) that fish instances follow at varied speeds/offsets, using instanced meshes for performance if fish count is high
Keep the whole feature's polycount/shader cost mobile-conscious — provide a simplified version (static water texture, no live fish animation, simpler shine) for the reduced-motion/mobile fallback path already in the project
Anti-Generic Rules
Do NOT use a flat blue plane with a generic Phong shine — the water needs to look like it's actually flowing
Do NOT make the fish look like simple colored ovals with no motion variation
Do NOT add a generic "god rays" post-processing effect disconnected from the actual water shine — the light-on-water sparkle should feel physically tied to the water surface itself
Deliverable

Provide the complete code for the water feature (shader/material, geometry, fish animation system, light/caustics integration) as a self-contained addition to the existing hallway chamber component, plus brief notes on where to tune parameters (flow speed, fish count/speed, sparkle intensity) later.

PROMPT END