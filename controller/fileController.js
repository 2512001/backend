const File = require('../model/file'); // Adjust the path if needed

exports.createFile = async (req, res) => {
    try {
        const { name, projectId, url, transcript } = req.body;

        if (!name || !projectId || !transcript) {
            return res.status(400).json({ message: "Filename and Project ID are required." });
        }

        const query = { name, projectId, transcript };
        if (url) query.url = url;

        const newFile = await File.create(query);

        res.status(201).json({
            message: "File created successfully.",
            file: newFile
        });
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ message: "Internal server error." });
    }
};



exports.getFile = async (req, res) => {
    try {
        const { projectId } = req.params;
        if(!projectId){
            return res.status(404).json({ message: "no project" });
        }
        let data = await File.find({ projectId }).sort({ createdAt: -1 }).select('name  updatedAt createdAt');
        res.status(200).json({ projects: data })
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.editFile = async (req, res) => {
    try {        
        const { transcript } = req.body;
        const { fileId } = req.params;
        const  userId = req.user.id

        if(!transcript || !fileId){
            return res.status(404).json({ message: "there not content provide content" });
        }

        const file = await File.findById(fileId).populate('projectId');

        if (!file) {
            return res.status(404).json({ message: "File not found." });
        }

        if (!file.projectId) {
            return res.status(404).json({ message: "Project not found for this file." });
        }


        if (file.projectId.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this file." });
        }

        file.transcript = transcript || file.transcript;
        await file.save();

        res.status(200).json({ message: "File updated successfully.", file });

    } catch (error) {
        console.error('Error editing file:', error);
        res.status(500).json({ message: "Internal server error." });
    }
};


exports.getSingleFile = async (req, res) => {
    try {    
                    
        const { fileId } = req.params;
        const userId = req.user.id;
        
        const file = await File.findById(fileId).populate('projectId');

        if (!file) {
            return res.status(404).json({ message: "File not found." });
        }

        if (file.projectId.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to access this file." });
        }

        res.status(200).json({ file });
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ message: "Internal server error." });
    }
};



exports.deleteFile = async (req, res) => {            
    try {
        const { fileId } = req.params;
        if(!fileId){
          return  res.status(401).json({ message : 'file not are there'})
        }
        await File.findByIdAndDelete({ _id: fileId });
        res.status(200).json({ message : 'file deleted'})
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ message: "Internal server error." });
    }
};
