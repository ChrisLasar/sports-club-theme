---
title: "{{ replace .Name "-" " " | title }}"
group: ""  # e.g., U13, U15, Senior, Beginner, Advanced, etc.
sport: ""  # e.g., Football, Tennis, Athletics
season:
  start: "{{ now.Format "2006-01-02" }}"
  end: ""
  status: "active"  # active | off-season | archived
training:
  - day: "Tuesday"
    startTime: "18:00"
    endTime: "19:30"
    venue: "venues/main-field"  # Path to venue content, e.g., venues/main-field
venue: "venues/main-field"  # Path to primary venue content
coaches: []  # Array of member paths, e.g., ["members/jane-doe", "members/john-smith"]
members: []
socialImage: ""  # Filename of image in this page bundle
description: ""
tags: []
---

## About This Team

[Add team description here]

## Training Schedule

See front matter above for training times.

## Contact

For inquiries about this team, contact the team coaches listed above.
