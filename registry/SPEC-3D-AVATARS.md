# SPEC-3D-AVATARS.md

## Purpose
Define the required implementation for 3D Office crew characters so Franky builds the Captain-approved character system correctly before further avatar work proceeds.

This spec exists to prevent the three visual layers from being mixed together.

## Captain Clarification — 3 Distinct Layers (Do Not Mix)
The 3D Office character system has **three separate layers** with separate purposes.

### 1. TOP HUD BAR
Small circular avatar icons at the top of the screen.

Requirements:
- These use the existing anime portrait avatars
- Leave this system as-is
- Do not replace these with Minecraft/voxel art
- Do not rebuild this layer as part of the 3D character-body work

Decision:
**Out of scope for this spec except for compatibility. No visual or behavioral changes required.**

### 2. 3D CHARACTER BODIES
These are the actual in-world characters inside the office scene.

Requirements:
- Must be true 3D voxel / Minecraft-style characters
- Must be built from real geometry with depth using Three.js / React Three Fiber
- Must not be flat billboard sprites
- Must support sitting, standing, and walking/movement states
- Brook's Minecraft-style images are reference art for colors, features, silhouette cues, and accessories only

Decision:
**This is the primary build scope of this spec.**

### 3. HOVER POPUP
When the user hovers over a 3D character, the popup should show the regular anime portrait.

Requirements:
- Use the existing anime portraits already in public/avatars/ (
ami.png, ranky.png, etc.)
- Do not use the Minecraft reference images for the hover popup
- Smooth fade in / fade out required
- Must trigger from hovering the in-world 3D character body

Decision:
**Hover popup stays anime-style, even though the in-world body is voxel/3D.**

## Problem Statement
The current implementation direction risks mixing three different visual systems:
- top HUD anime portraits
- in-world 3D characters
- hover popups

That is incorrect.

The Captain-approved vision is:
- anime portraits remain in the top HUD bar
- real 3D voxel characters exist in the office scene as physical bodies
- anime portraits appear on hover popup

Brook's Minecraft-style images define how the **3D body should look**, not what appears in the hover popup and not what appears in the top HUD.

## Scope
This spec covers:
- 3D character body construction
- Character identity mapping from Brook's Minecraft reference art
- Pose states
- Movement / walk behavior expectations
- Basic pathing expectations
- State-color integration at the feet/base
- Scale and scene fit
- Hover popup compatibility and behavior
- Acceptance criteria for build sign-off

This spec does not require:
- Changes to the top HUD bar portrait system
- Skeletal animation
- High-poly models
- Facial rigging
- Complex navmesh/pathfinding stack
- Physics-based cloth or hair simulation
- Rebuilding desks/chairs except for fit corrections needed for proper sitting/walking placement

## Core Requirement
All crew members in the 3D Office scene must be implemented as true voxel-style 3D characters using Three.js / React Three Fiber geometry.

### Explicitly Required
- Use real mesh geometry with depth
- Build bodies primarily from box geometry primitives
- Characters must cast and receive shadows where current lighting supports it
- Characters must visually occupy 3D space from all camera angles
- Characters must remain readable in the isometric diorama view
- Characters must support movement states including walking around the office

### Explicitly Forbidden
- Flat sprite billboards as the character body
- Single-plane cutouts used to fake a full body
- Using Brook's Minecraft reference images as literal in-world body sprites
- Replacing hover anime portraits with Minecraft portraits
- Replacing the top HUD anime portraits with Minecraft portraits
- Character representation that visually collapses when the camera rotates

## Character Geometry Standard
Each crew member must use a shared voxel body rig composed primarily of box-based parts.

### Minimum body parts
1. Head: 1 cube
2. Torso: 1 rectangular box
3. Left arm: 1 thin rectangular box
4. Right arm: 1 thin rectangular box
5. Left leg: 1 thin rectangular box
6. Right leg: 1 thin rectangular box

### Permitted additional geometry
Additional simple geometry is allowed to express identity, provided the overall look remains voxel / Minecraft-like:
- Hair blocks
- Hats
- Antlers
- Staff / book props
- Shoulder/chest details
- Shoes
- Small accessory blocks
- Rounded geometry only where specifically approved below (Brook afro sphere is allowed)

### Rig / assembly expectations
- Body parts must be separate logical meshes or grouped submeshes so pose changes and walk cycles are possible
- Pivot placement should support sitting, standing, and walking without rebuilding meshes
- Geometry should remain low-complexity and performant for continuous scene rendering

## Character Identity Mapping
Brook's Minecraft-style reference images define the visual identity targets for the 3D bodies. Franky must translate them into 3D voxel geometry and materials.

### Nami
Required identity markers:
- Orange hair block / voxel hair shape
- Orange top
- Blue jeans
- Clima-Tact staff accessory

Implementation notes:
- Hair should be visibly distinct from the head cube
- Staff may be attached to hand, side, or near desk if seated pose requires readability
- Color palette should prioritize strong orange/blue contrast for quick recognition

### Franky
Required identity markers:
- Blue pompadour built as a tall box / stacked box form on head
- Metal / silver chest treatment
- Star emblem visible on torso / chest

Implementation notes:
- Pompadour must read instantly in isometric view
- Metallic chest can use flat material color rather than realistic metal shader if needed for style consistency
- Torso should feel broader / stronger than other crew members within proportional scene limits

### Chopper
Required identity markers:
- Smaller body scale than adult crew members
- Pink hat with cross
- Blue nose dot
- Antlers built from thin box geometry

Implementation notes:
- Chopper must be visibly shorter and smaller than Nami, Franky, Robin, and Brook
- Hat must remain readable from top-down/isometric angle
- Antlers may use simplified angular voxel branches so long as they are clearly antlers

### Robin
Required identity markers:
- Dark hair
- Lavender outfit
- Book accessory

Implementation notes:
- Hair silhouette should be elegant but still voxel-simple
- Book can be held, placed on lap, or rest on desk during seated pose as long as it remains associated with Robin

### Brook
Required identity markers:
- White skull face using white cube head with dark eye sockets
- Black top hat on head
- Afro as dark sphere or dark rounded volume above/around head
- Suit

Implementation notes:
- Brook is the only approved exception to strict box-only geometry for the afro; a dark sphere or rounded mass is acceptable if it reads cleanly in the scene
- Skull face must still feel voxel-adjacent, not realistic
- Top hat must be clearly readable in silhouette

## Pose and Animation Requirements
Every in-world 3D character must support the following pose/animation states.

### 1. Sitting at desk (default working)
Required behavior:
- Character is aligned with assigned chair/desk position
- Legs and torso are posed so the character reads as seated, not hovering awkwardly
- Arms may rest naturally, angle slightly forward, or remain simple if desk obscures detail
- This is the default pose for active desk occupancy

### 2. Standing (idle)
Required behavior:
- Character stands upright beside or slightly behind the chair/desk position as defined by scene layout
- Weight balance should appear stable
- Must read clearly from default camera without manual adjustment

### 3. Idle walk cycle / walk state
Required behavior:
- Character can enter a walking state and visibly move through the office
- Walk animation can be simple and stylized: alternating arm/leg swing is sufficient
- Motion must clearly read as walking, not sliding a static statue across the floor
- Animation can be lightweight and procedural; no skeletal rig required

### 4. Slight bounce / thinking
Required behavior:
- Subtle vertical bob and/or slight torso/head motion
- Motion must be restrained and readable, not cartoonishly large
- Animation should preserve environment alignment and avoid noticeable clipping

## Movement and Pathing Requirements
Captain requirement: the 3D bodies must be able to walk around the office.

### Minimum movement support
The implementation must support simple walk behavior between meaningful scene anchors.

Required anchor examples:
- Desk position
- Meeting / conference table position
- Idle standing spot near desk

### Required movement behavior
- Character can transition between anchors using simple path movement
- Minimum viable implementation may use predefined waypoints / direct movement paths
- Full navmesh/pathfinding system is **not required**
- Movement must avoid obviously walking through major furniture where a simple route can reasonably avoid it
- Character orientation should generally face travel direction while walking
- On arrival, character should transition cleanly into the appropriate standing or sitting pose

### Acceptable implementation approaches
Any of the following are acceptable:
- waypoint-based movement between defined scene nodes
- simple deterministic route definitions per character
- lightweight office path graph

### Not required
- Dynamic obstacle avoidance
- Crowd simulation
- Advanced pathfinding solver
- Complex multi-agent collision resolution

## Status Integration
A colored glow, disc, or ring under each character's feet / base must indicate agent state.

### Required mapping
- Green = active
- Blue = working / busy
- Yellow = thinking / attention-needed / intermediate state
- Gray = offline / idle / unavailable

### Requirements
- Indicator must sit at floor level under the character
- Indicator must remain visible in the default isometric camera
- Indicator must not visually overpower the character model
- Glow/ring behavior must stay compatible with current live state wiring

## Scale and Environment Fit
Characters must be scaled proportionally to the existing desks and chairs in the current 3D Office scene.

### Required outcomes
- Heads do not tower unrealistically above desk height
- Torso/leg lengths allow believable seated positioning
- Chopper is visibly smaller than the rest
- Franky may read broader/larger, but not so large that he breaks desk/chair fit
- Brook's height can read slightly tall and lanky, but still must fit the scene composition

### Fit checks
- No character clips badly through chair backs, desk surfaces, or floor in default poses
- Walk routes do not cause obvious clipping through major furniture
- Feet/base align with floor plane
- Shadows land naturally on floor/chair area where lighting allows

## Hover Popup Requirements
The existing hover interaction must remain intact, but the popup content is explicitly defined.

### Required behavior
- Hovering the in-world 3D character triggers the popup
- Popup content uses the regular anime portrait from public/avatars/
- Popup does **not** use the Minecraft reference art
- Smooth fade in and fade out required
- Transition to voxel bodies must not regress popup behavior

### Implementation note
Hover detection may be attached to:
- the full character group
- upper torso/head area
- a dedicated invisible interaction wrapper

## Top HUD Compatibility
The top HUD bar must remain compatible with the new 3D body system.

### Requirements
- Existing small circular anime portrait icons remain unchanged
- 3D body implementation must not overwrite, replace, or repurpose the HUD avatar assets
- Any shared data model should keep HUD portraits and hover portraits pointing to anime assets, while 3D bodies use voxel geometry + Brook reference mapping

## Rendering / Technical Guidance
Implementation should favor simplicity, readability, and maintainability.

### Recommended approach
- Shared voxel humanoid component with configurable proportions/colors/accessories
- Character-specific config objects for palette, accessories, proportions, and special geometry
- Group-based pose switching for sitting / standing / thinking / walking
- Simple office anchor/waypoint movement system for desk-to-table or desk-to-idle transitions
- Reuse existing live state and hover systems where possible

### Performance guidance
- Keep geometry low-poly and primitive-based
- Avoid unnecessary material proliferation
- Reuse materials where practical
- Maintain smooth browser performance at current scene scale

## Out of Scope / Non-Goals
The following are not required for acceptance unless separately specified:
- Changes to top HUD portrait visuals
- Finger articulation
- Facial animation
- Fully custom sculpted meshes
- Complex navmesh implementation
- Crowd behaviors
- Lip sync
- Cloth simulation
- High-detail PBR realism

## Acceptance Criteria
Franky's implementation passes only if all items below are true.

### A. Layer separation acceptance
- [ ] Top HUD bar still uses existing anime portraits unchanged
- [ ] In-world characters are true voxel-style 3D bodies, not flat sprites
- [ ] Hover popup uses regular anime portraits, not Minecraft reference art
- [ ] The three layers (HUD, in-world body, hover popup) are not conflated in assets or behavior

### B. Geometry acceptance
- [ ] No crew character uses a flat sprite billboard as its primary body
- [ ] Every character has visible 3D depth from multiple viewing angles
- [ ] Each character includes head, torso, two arms, and two legs as distinct box-based body parts
- [ ] Characters cast/read shadows appropriately within scene lighting

### C. Identity acceptance
- [ ] Nami reads clearly via orange hair, orange top, blue jeans, and Clima-Tact
- [ ] Franky reads clearly via blue pompadour, metallic/silver chest, and star emblem
- [ ] Chopper reads clearly via smaller scale, pink hat with cross, blue nose, and antlers
- [ ] Robin reads clearly via dark hair, lavender outfit, and book
- [ ] Brook reads clearly via skull face, top hat, afro, and suit
- [ ] Brook reference art is used as appearance guidance for 3D bodies, not as flat in-world body art and not as hover popup art

### D. Pose and movement acceptance
- [ ] Sitting pose exists and looks natural at desks
- [ ] Standing pose exists and is readable in scene
- [ ] Walking state exists and visibly reads as walking
- [ ] Thinking state includes subtle bounce/motion without bad clipping
- [ ] Characters can move between at least desk and meeting-table/idle anchors
- [ ] Arrival transitions resolve cleanly into standing or sitting pose

### E. State integration acceptance
- [ ] Floor-level glow/ring exists under each character
- [ ] Colors map correctly to green / blue / yellow / gray states
- [ ] Status indicator remains legible in isometric view

### F. Scale acceptance
- [ ] Characters are proportionate to desks/chairs
- [ ] Chopper is visibly smaller than adult crew members
- [ ] No major clipping, floating, or route-through-furniture issues in normal movement

### G. Interaction acceptance
- [ ] Hovering a 3D character shows the anime portrait popup
- [ ] Popup fade in/out is smooth
- [ ] Hover behavior is not regressed by the 3D body transition

## Build Decision Rule
Franky should not proceed with any further character-body implementation using sprite billboards as the primary in-world representation.

Approved implementation direction:
- top HUD bar remains anime portraits
- in-world characters become true voxel / Minecraft-style 3D geometry bodies
- hover popup continues to use regular anime portraits with smooth fade
- movement support includes simple walk behavior between office anchors

## Handoff Note to Franky
Build three layers, not one mess:
- HUD portraits stay anime and stay untouched
- in-world crew become real blocky 3D office bodies with movement
- hover popup stays anime

Brook's Minecraft images tell you how the 3D bodies should look. They do not replace the HUD and they do not replace the hover portraits.
