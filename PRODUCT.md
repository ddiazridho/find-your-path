# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
High school students exploring suitable university majors.

## Product Purpose
Find Your Path helps students discover their interests, strengths, and preferences through real-world task simulations, with personalized AI insights to inform study choices.

## Capabilities and Constraints
The Next.js server includes a university recommendation route backed by Qdrant Cloud and OpenAI. It recommends universities from a limited 33-program dataset using hard metadata filters, vector retrieval, weighted scoring, LLM reranking, and generated reasoning. Tuition data has source and coverage limits documented in `data/universities/README.md`. Computer Science offers four working client-side guided simulations: Software, Embedded System, Networking, and Multimedia. Other major tasks remain illustrative previews. Existing legacy Software simulation subroutes remain available. Use reusable global CSS.

## Brand Commitments
Name: FYP (Find Your Path). The user delegates the theme, buttons, icons, and logo design for a hackathon presentation.

## Evidence on Hand
PROJECT.md, the user brief, the implemented Computer Science lessons, and the Excel dataset supplied for university recommendations. Students edit HTML/CSS with a live preview, assemble and test a button-controlled LED circuit, configure a simulated network and send animated pings, or compose and adjust a downloadable poster. University recommendations are a separate server-backed feature and do not evaluate simulation performance.
