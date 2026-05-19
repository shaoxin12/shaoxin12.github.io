# Personal Website Design — 杨少新

## Overview
Neo-brutalist personal website for 杨少新. Three sections: 生活 (Life), 投机 (Speculation), 项目 (Projects). Language toggle (中/EN) in top-left.

## Visual Style
- **Neo-brutalist**: bold black borders (3px), hard box-shadows (no blur), zero border-radius
- **Colors**: black `#000`, white `#FFF`, red accent `#E00000`
- **Typography**: system sans-serif for Chinese, JetBrains Mono for code/numbers, weights 700-800
- **No gradients, no blur, no rounded corners**

## Layout
- Fixed left sidebar (~160px) with 3px black right border
- Sidebar: name at top, orange dot, three nav items with box-shadow buttons
- Language toggle at sidebar top
- Right content area: scrollable, section-based

## Sections
Each section: uppercase title + black divider + article card list
- Cards: 3px border, 3px/3px box-shadow, title + date, hover slightly darkens

## Tech
- Pure HTML + CSS + JS (single file each)
- i18n via data attributes + JS toggle
- No frameworks, no build step

## Content
Placeholder articles in each section, easily editable HTML.
