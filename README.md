# Adonis Hb Screen V1

Standalone mobile-first haemoglobin screening prototype using a photograph of the lower palpebral conjunctiva.

## Scope
- Independent from Adonis Respira
- Patient name/ID, age, sex
- Camera capture with live camera where HTTPS permits
- Automatic fallback to the phone's native camera
- Gallery selection
- Basic image quality checks
- Prototype image-derived Hb estimate in g/dL
- Screening observation
- Share report / print or save PDF
- Local browser history

## Critical clinical limitation
The Hb estimate in this V1 is a research/prototype heuristic, not a clinically validated haemoglobin measurement. It must not be used alone for diagnosis or treatment. Before clinical deployment, replace the heuristic with a properly validated and appropriately licensed conjunctival-image Hb model/API and complete the required clinical/regulatory validation.

## Camera
For live in-app camera, serve the app over HTTPS. On mobile browsers without getUserMedia support or without a secure context, the app automatically falls back to the native camera capture input.
