const express = require('express');
const router = express.Router();
const http = require('http');

/**
 * Proxies demo simulation scenarios from dashboard to local collector on port 8001
 */
router.post('/simulate/:scenario', (req, res) => {
  const scenario = req.params.scenario;
  const postData = JSON.stringify({ scenario });

  const options = {
    hostname: 'localhost',
    port: 8001,
    path: '/simulate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 3000
  };

  const clientReq = http.request(options, (collectorRes) => {
    let body = '';
    collectorRes.on('data', chunk => { body += chunk; });
    collectorRes.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        return res.status(collectorRes.statusCode).json(parsed);
      } catch (err) {
        return res.status(collectorRes.statusCode).send(body);
      }
    });
  });

  clientReq.on('error', (err) => {
    return res.status(503).json({
      error: "LOCAL_COLLECTOR_OFFLINE",
      message: `Could not reach local collector on port 8001: ${err.message}`
    });
  });

  clientReq.write(postData);
  clientReq.end();
});

module.exports = router;
