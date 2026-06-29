# Downloads Section — Plan

> A dedicated Downloads page on the Cosmic Channeling website for users to download spiritual/cosmic content.

## Status: 🚧 Planned

## Content Ideas

### Audio Downloads
- [ ] Guided meditations (MP3)
- [ ] Cosmic ambient sounds
- [ ] Binaural beats for meditation
- [ ] Affirmation recordings

### Visual Downloads
- [ ] Cosmic wallpapers (desktop + mobile)
- [ ] Mandala coloring pages
- [ ] Constellation charts
- [ ] Moon phase calendars

### Reading Downloads
- [ ] Cosmic wisdom PDFs
- [ ] Meditation guides
- [ ] Dream journal templates
- [ ] Spiritual practice worksheets

### Digital Products
- [ ] Printable affirmation cards
- [ ] Cosmic journaling prompts
- [ ] Star gaze tracking sheets

## Technical Implementation

### Approach
The Downloads section can be implemented as:
1. **New React page** at `/downloads` route
2. **Static file serving** — files stored in `client/public/downloads/`
3. **File listing API** — optionally, an API endpoint that lists available downloads

### Route
```
/downloads — Downloads page with categories and file links
```

### Frontend Components Needed
- `client/src/pages/Downloads.tsx` — Main downloads page
- Download card component (for individual files)
- Category filter/sort component

### Page Added to Header
Add "Downloads" link to the navigation in `Header.tsx`

## Adding Content
Drop files into `Website/client/public/downloads/` categorized by type:
```
client/public/downloads/
├── audio/       # .mp3, .wav files
├── images/      # .jpg, .png wallpapers
├── pdfs/        # .pdf guides
└── printables/  # .pdf worksheets
```
