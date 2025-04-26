import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getCourseMaterials = async (path) => {
  try {
    const response = await axios.get(`${API_URL}/scan-directory`, {
      params: {
        path: path,
        recursive: true,
        depth: 1
      }
    });
    
    const normalizedData = normalizeApiResponse(response.data, path);
    return normalizedData;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const normalizeApiResponse = (apiResponse, path) => {
  
  const normalizedResult = {
    default: {
      title: path.split('/').pop() || path, 
      files: [],
      directories: [], 
      subfolders: [],
      path: path
    }
  };


  if (!apiResponse.default) {
    normalizedResult.default.files = apiResponse.files || [];
    normalizedResult.default.directories = apiResponse.directories || [];
    
    if (apiResponse.directories && Array.isArray(apiResponse.directories)) {
      normalizedResult.default.subfolders = apiResponse.directories.map(dir => ({
        name: dir,
        path: `${path}/${dir}`,
        type: 'subfolder'
      }));
    }
    
    if (apiResponse.subdirectories) {
      normalizedResult.subdirectories = apiResponse.subdirectories;
    }
  } 
  else {
    normalizedResult.default = {
      ...normalizedResult.default,
      ...apiResponse.default
    };
    
    if (!normalizedResult.default.files) {
      normalizedResult.default.files = apiResponse.default.materials || [];
    }
    
    if (!normalizedResult.default.subfolders && apiResponse.default.directories) {
      normalizedResult.default.subfolders = apiResponse.default.directories.map(dir => ({
        name: dir,
        path: `${path}/${dir}`,
        type: 'subfolder'
      }));
    }
  }
  

  return normalizedResult;
};
/**
 * @param {string} path 
 * @param {boolean} recursive 
 * @param {number} depth 
 * @returns {Promise<{files: Array, directories: Array, subdirectories: Object}>}
 */
const scanDirectory = async (path, recursive = false, depth = -1) => {
  try {
    const url = `http://localhost:3001/api/scan-directory?path=${encodeURIComponent(path)}&recursive=${recursive}&depth=${depth}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error scanning directory:', error);
    return { files: [], directories: [], subdirectories: {} };
  }
};

/**
 * @param {string} path 
 * @param {Array} dirParts 
 * @param {Object} data 
 * @returns {string} 
 */
const handleNestedStructure = (path, dirParts, data) => {
 
  if (
    dirParts.length === 1 && 
    data.subdirectories && 
    data.subdirectories[dirParts[0]] &&
    data.subdirectories[dirParts[0]].directories.includes(dirParts[0])
  ) {
    return `${path}/${dirParts[0]}`;
  }
  return path;
};

/**
 * @param {string} basePath 
 * @param {string} sectionPath
 * @returns {Promise<Array>} 
 */
const getFilesFromRecursiveScan = async (basePath, sectionPath) => {
  try {
    const result = await scanDirectory(sectionPath, true, 1);
    let allFiles = [...result.files];
    
    for (const dirName of result.directories) {
      const subPath = `${sectionPath}/${dirName}`;
      const subResult = await scanDirectory(subPath, false);
      
      allFiles = [...allFiles, ...subResult.files];
    }
    
    return allFiles;
  } catch (error) {
    console.error('Error getting files from recursive scan:', error);
    return [];
  }
};


export const getFileUrl = (path) => {
  return `${API_URL}/file?path=${encodeURIComponent(path)}`;
};


export const getMaterialType = (path) => {
  const extension = path.split('.').pop().toLowerCase();
  
  if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension)) {
    return 'video';
  } else if (['pdf', 'docx', 'doc', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
    return 'document';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
    return 'image';
  } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return 'audio';
  } else {
    return 'unknown';
  }
};


export const getMaterialContent = async (path) => {
  try {
    const response = await axios.get(`${API_URL}/file`, {
      params: {
        path: path
      },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải tài liệu:", error);
    throw error;
  }
};

/**
 * @param {Array} materials 
 * @returns {Object} 
 */
export const organizeCourseMaterials = (materials) => {
  if (!materials || !Array.isArray(materials)) return { videos: [], documents: [], images: [], audio: [] };
  
  return {
    videos: materials.filter(m => getMaterialType(m.path) === 'video'),
    documents: materials.filter(m => getMaterialType(m.path) === 'document'),
    images: materials.filter(m => getMaterialType(m.path) === 'image'),
    audio: materials.filter(m => getMaterialType(m.path) === 'audio')
  };
};