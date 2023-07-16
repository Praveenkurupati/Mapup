const express = require('express');
const turf = require('@turf/turf');
const fs = require('fs');

const app = express();
app.use(express.json());

// POST request handler for finding intersections
app.post('/api/intersections', (req, res) => {
  try {
    const { linestring } = req.body;
    console.log(linestring)

    // Validate the linestring
    if (!linestring || !Array.isArray(linestring[0]?.line?.coordinates)) {
      return res.status(400).json({ error: 'Invalid linestring' });
    }

    // Convert the linestring to a Turf.js LineString object
    const linestringObj = turf.lineString(linestring[0].line.coordinates);

    // Read the lines from the file
    const lines = JSON.parse(fs.readFileSync('lines.json', 'utf8'));

    // Find intersecting lines
    const intersections = lines
      .filter((line) => {
        const lineObj = turf.lineString(line.line.coordinates);
        console.log(turf.booleanIntersects(linestringObj, lineObj))
        return turf.booleanIntersects(linestringObj, lineObj);
      })
      .map((line) => line.id);

    if (intersections.length === 0) {
      return res.json({  message: 'No linestring intersections' });
        } else {
      return res.json(intersections);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
