const express = require('express');
const { getLatestProjects, createProject } = require('../controller/projectController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
.get(authMiddleware , getLatestProjects)
.post(authMiddleware , createProject)


module.exports = router;