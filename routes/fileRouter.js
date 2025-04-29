const express = require('express');
const { createFile, getFile, editFile, getSingleFile, deleteFile } = require('../controller/fileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(authMiddleware , createFile)

router.route('/project/:projectId')
    .get(authMiddleware, getFile)

router.route('/:fileId')
    .patch(authMiddleware , editFile)
    .get(authMiddleware , getSingleFile)
    .delete(authMiddleware , deleteFile);

module.exports = router;