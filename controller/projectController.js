const Project = require('../model/project');
const mongoose = require('mongoose');

exports.createProject = async (req, res) => {
  try {    
    const { title } = req.body;
    const userId = req.user;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newProject = new Project({ title, userId : new mongoose.Types.ObjectId(userId)});
    const savedProject = await newProject.save();
   
    res.status(201).json({ message: 'Project created successfully', project: savedProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getLatestProjects = async (req, res) => {
  try {    
    const id = req.user;
    const projects = await Project.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'files',
          localField: '_id',
          foreignField: 'projectId',
          as: 'files'
        }
      },
      {
        $addFields: {
          fileCount: { $size: '$files' }
        }
      },
      {
        $project: {
          title: 1,
          createdAt: 1,
          fileCount: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


