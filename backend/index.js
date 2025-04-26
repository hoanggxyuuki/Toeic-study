const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

/**
 * @param {string} basePath 
 * @param {string} dirPath 
 * @param {number} depth 
 * @param {number} maxDepth 
 * @returns {Promise<{files: Array, directories: Array, subdirectories: Object}>}
 */
async function scanDirectoryRecursive(basePath, dirPath, depth = 0, maxDepth = -1) {
  const fullPath = path.join(basePath, dirPath);
  const result = {
    files: [],
    directories: [],
    subdirectories: {}
  };

  try {
    const items = await fs.readdir(fullPath);

    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      const relativePath = path.join(dirPath, item).replace(/\\/g, '/');
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        result.directories.push(item);

        if (maxDepth === -1 || depth < maxDepth) {
          result.subdirectories[item] = await scanDirectoryRecursive(
            basePath,
            relativePath,
            depth + 1,
            maxDepth
          );
        }
      } else {
        result.files.push({
          name: item,
          path: relativePath,
          type: getFileType(item)
        });
      }
    }

    return result;
  } catch (error) {
    console.error(`Error scanning directory ${fullPath}:`, error);
    return result;
  }
}

app.get('/api/scan-directory', async (req, res) => {
  try {
    const directoryPath = req.query.path || '';
    const maxDepth = parseInt(req.query.depth || '-1', 10);
    const recursive = req.query.recursive === 'true';
    
    const basePath = path.join(__dirname, 'public', 'study');
    const fullPath = path.join(basePath, directoryPath);
    
    if (!fullPath.startsWith(basePath)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    try {
      const stats = await fs.stat(fullPath);
      
      if (!stats.isDirectory()) {
        return res.status(400).json({ error: 'Not a directory' });
      }
    } catch (error) {
      return res.status(404).json({ error: 'Directory not found' });
    }
    
    if (recursive) {
      const result = await scanDirectoryRecursive(basePath, directoryPath, 0, maxDepth);
      res.json(result);
    } else {
      const items = await fs.readdir(fullPath);
      
      const result = {
        files: [],
        directories: []
      };
      
      for (const item of items) {
        const itemPath = path.join(fullPath, item);
        const itemStat = await fs.stat(itemPath);
        
        const relativePath = path.join(directoryPath, item).replace(/\\/g, '/');
        
        if (itemStat.isDirectory()) {
          result.directories.push(item);
        } else {
          result.files.push({
            name: item,
            path: relativePath,
            type: getFileType(item)
          });
        }
      }
      
      res.json(result);
    }
  } catch (error) {
    console.error('Error scanning directory:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

function getFileType(filename) {
  const extension = path.extname(filename).toLowerCase().slice(1);
  
  const typeMap = {
    mp4: 'video',
    pdf: 'document',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    docx: 'document',
    mp3: 'audio'
  };
  
  return typeMap[extension] || 'unknown';
}
app.get('/api/file', async (req, res) => {
    try {
      const filePath = req.query.path;
      console.log('Requested file path:', filePath);
      
      const rootDirectory = path.join(__dirname, 'public', 'study');
      
      const normalizedPath = path.normalize(filePath);
      console.log('Normalized path:', normalizedPath);
      
      const fullPath = path.join(rootDirectory, normalizedPath);
      console.log('Full path:', fullPath);
      
      try {
        await fs.access(fullPath);
        res.sendFile(fullPath);
      } catch (error) {
        console.error('File not found:', fullPath);
        res.status(404).send('File not found');
      }
    } catch (error) {
      console.error('Error serving file:', error);
      res.status(500).send('Server error');
    }
  });
app.use('/study', express.static(path.join(__dirname, 'public', 'study')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});