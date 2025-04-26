import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getCourseMaterials, getFileUrl, getMaterialType } from '../services/fileService';
import './CourseDetail.css';

const CourseDetail = ({ coursePath, courseTitle }) => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCourseSections = async () => {
      try {
        setLoading(true);
        const result = await getCourseMaterials(coursePath);
        
        
        if (result && result.default) {
          let sectionsArray = [];
          
          if (Array.isArray(result.default)) {
            sectionsArray = result.default;
          } else if (result.default.subfolders && Array.isArray(result.default.subfolders) && result.default.subfolders.length > 0) {
            sectionsArray = result.default.subfolders.map(folder => ({
              title: folder.name,
              path: folder.path,
              fullPath: folder.path,
              type: 'section'
            }));
          } else if (result.default.directories && Array.isArray(result.default.directories) && result.default.directories.length > 0) {
            sectionsArray = result.default.directories.map(dir => ({
              title: dir,
              path: `${coursePath}/${dir}`,
              fullPath: `${coursePath}/${dir}`,
              type: 'section'
            }));
          }
          
          setSections(sectionsArray);
          
          if (sectionsArray.length > 0) {
            setSelectedSection(sectionsArray[0]);
          }
          
          setBreadcrumbs([{ name: courseTitle, path: '' }]);
        }
        
        if (result && result.subdirectories) {
        }
      } catch (error) {
        console.error('Lỗi khi tải nội dung khóa học:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (coursePath) {
      loadCourseSections();
    }
  }, [coursePath, courseTitle]);

  const handleSectionClick = async (section) => {
    try {
      setSelectedSection(section);
      setSelectedSubfolder(null);
      setSelectedMaterial(null);
      
  
      
      setBreadcrumbs([
        { name: courseTitle, path: '' },
        { name: section.title, path: section.fullPath || section.path }
      ]);
      
      if (section.path) {
        const sectionResult = await getCourseMaterials(section.fullPath || section.path);
        
        if (sectionResult && sectionResult.default) {
          setSelectedSection({
            ...section,
            files: sectionResult.default.files || [],
            directories: sectionResult.default.directories || [],
            subfolders: sectionResult.default.subfolders || []
          });
        }
        
        if (sectionResult && sectionResult.subdirectories) {
        }
      }
    } catch (error) {
      console.error('Lỗi khi xử lý section:', error);
    }
  };

  const handleSubfolderClick = async (subfolder) => {
    try {
      setSelectedSubfolder(subfolder);
      setSelectedMaterial(null);
      
      
      setBreadcrumbs([
        { name: courseTitle, path: '' },
        { name: selectedSection.title, path: selectedSection.fullPath || selectedSection.path },
        { name: subfolder.name, path: subfolder.path }
      ]);
      
      const subfoldersResult = await getCourseMaterials(subfolder.path);
      
      if (subfoldersResult && subfoldersResult.default) {
        setSelectedSubfolder({
          ...subfolder,
          files: subfoldersResult.default.files || [],
          directories: subfoldersResult.default.directories || [],
          subfolders: subfoldersResult.default.subfolders || []
        });
      }
      
      if (subfoldersResult && subfoldersResult.subdirectories) {
      }
    } catch (error) {
      console.error('Lỗi khi xử lý subfolder:', error);
    }
  };

  const handleNestedSubfolderClick = async (nestedSubfolder, currentSubfolder) => {
    try {
  
      
      const nestedPath = `${currentSubfolder.path}/${nestedSubfolder.name}`;
      
      const newBreadcrumbs = [...breadcrumbs];
      newBreadcrumbs.push({ name: nestedSubfolder.name, path: nestedPath });
      setBreadcrumbs(newBreadcrumbs);
      
      const nestedResult = await getCourseMaterials(nestedPath);
      
      if (nestedResult && nestedResult.default) {
        setSelectedSubfolder({
          name: nestedSubfolder.name,
          path: nestedPath,
          files: nestedResult.default.files || [],
          directories: nestedResult.default.directories || [],
          subfolders: nestedResult.default.subfolders || []
        });
      }
    } catch (error) {
      console.error('Lỗi khi xử lý nested subfolder:', error);
    }
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
  };

  const handleBreadcrumbClick = async (breadcrumb, index) => {
    try {
      
      if (index === 0) {
        setSelectedSection(null);
        setSelectedSubfolder(null);
        setSelectedMaterial(null);
        setBreadcrumbs([breadcrumb]);
        
        const result = await getCourseMaterials(coursePath);
        
        if (result && result.default) {
          let sectionsArray = [];
          
          if (result.default.subfolders && result.default.subfolders.length > 0) {
            sectionsArray = result.default.subfolders.map(folder => ({
              title: folder.name,
              path: folder.path,
              fullPath: folder.path,
              type: 'section'
            }));
          } else if (result.default.directories && result.default.directories.length > 0) {
            sectionsArray = result.default.directories.map(dir => ({
              title: dir,
              path: `${coursePath}/${dir}`,
              fullPath: `${coursePath}/${dir}`,
              type: 'section'
            }));
          }
          
          setSections(sectionsArray);
          
          if (sectionsArray.length > 0) {
            setSelectedSection(sectionsArray[0]);
          }
        }
      } 
      else if (index === 1) {
        setSelectedSubfolder(null);
        setSelectedMaterial(null);
        setBreadcrumbs(breadcrumbs.slice(0, 2));
        
        const sectionObj = sections.find(s => s.title === breadcrumb.name);
        if (sectionObj) {
          await handleSectionClick(sectionObj);
        }
      }
      else if (index >= 2) {
        setSelectedMaterial(null);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        
        const result = await getCourseMaterials(breadcrumb.path);
        
        if (result && result.default) {
          setSelectedSubfolder({
            name: breadcrumb.name,
            path: breadcrumb.path,
            files: result.default.files || [],
            directories: result.default.directories || [],
            subfolders: result.default.subfolders || []
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi xử lý breadcrumb:', error);
    }
  };

  const renderContent = () => {
    if (!selectedMaterial) return null;
    
    const materialType = getMaterialType(selectedMaterial.path);
    const fileUrl = getFileUrl(selectedMaterial.path);
    
    switch (materialType) {
      case 'video':
        return (
          <div className="video-container">
            <video controls>
              <source src={fileUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
          </div>
        );
      case 'document':
        if (selectedMaterial.path.toLowerCase().endsWith('.pdf')) {
          return (
            <div className="pdf-container">
              <iframe src={`${fileUrl}`} title={selectedMaterial.name} />
            </div>
          );
        } else {
          return (
            <div className="document-container">
              <p>Tài liệu: {selectedMaterial.name}</p>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                Tải xuống tài liệu
              </a>
            </div>
          );
        }
      case 'image':
        return (
          <div className="image-container">
            <img src={fileUrl} alt={selectedMaterial.name} />
          </div>
        );
      case 'audio':
        return (
          <div className="audio-container">
            <audio controls>
              <source src={fileUrl} />
              Trình duyệt của bạn không hỗ trợ thẻ audio.
            </audio>
          </div>
        );
      default:
        return (
          <div className="unknown-container">
            <p>Loại tài liệu: {materialType || 'không xác định'}</p>
            <p>Không thể hiển thị nội dung này trực tiếp.</p>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
              Tải xuống
            </a>
          </div>
        );
    }
  };

  const renderBreadcrumbs = () => {
    return (
      <div className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            <span 
              className="breadcrumb-item" 
              onClick={() => handleBreadcrumbClick(crumb, index)}
            >
              {crumb.name}
            </span>
            {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator"> &gt; </span>}
          </span>
        ))}
      </div>
    );
  };

  const renderSections = () => {
    if (!Array.isArray(sections)) {
      return <p>Đang tải phần học...</p>;
    }
    
    return sections.map((section, index) => (
      <div 
        key={index}
        className={`section-item ${selectedSection && selectedSection.title === section.title ? 'selected' : ''}`}
        onClick={() => handleSectionClick(section)}
      >
        <span className="section-title">{section.title}</span>
      </div>
    ));
  };

  const renderSubfolders = () => {
    if (!selectedSection || !selectedSection.subfolders || selectedSection.subfolders.length === 0) {
      return null;
    }
    
    
    return (
      <div className="subfolders-list">
        <h4>Thư mục</h4>
        {selectedSection.subfolders.map((subfolder, index) => (
          <div 
            key={index}
            className={`subfolder-item ${selectedSubfolder && selectedSubfolder.name === subfolder.name ? 'selected' : ''}`}
            onClick={() => handleSubfolderClick(subfolder)}
          >
            <span className="subfolder-icon">📁</span>
            <span className="subfolder-title">{subfolder.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderNestedSubfolders = () => {
    if (!selectedSubfolder || !selectedSubfolder.subfolders || selectedSubfolder.subfolders.length === 0) {
      return null;
    }
    
    
    return (
      <div className="nested-subfolders-list">
        <h4>Thư mục con</h4>
        {selectedSubfolder.subfolders.map((nestedSubfolder, index) => (
          <div 
            key={index}
            className="nested-subfolder-item"
            onClick={() => handleNestedSubfolderClick(nestedSubfolder, selectedSubfolder)}
          >
            <span className="subfolder-icon">📁</span>
            <span className="subfolder-title">{nestedSubfolder.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderMaterials = () => {
    let materials = [];
    
    if (selectedSubfolder && selectedSubfolder.files) {
      materials = selectedSubfolder.files;
    } else if (selectedSection && selectedSection.files) {
      materials = selectedSection.files;
    }
    
    if (!materials || materials.length === 0) {
      return (
        <p className="no-materials">
          Không có tài liệu trong mục này hoặc tài liệu nằm trong thư mục con
        </p>
      );
    }
    
    return (
      <div className="materials-list">
        <h4>Tài liệu ({materials.length})</h4>
        {materials.map((material, index) => (
          <div 
            key={index}
            className={`material-item ${selectedMaterial === material ? 'selected' : ''}`}
            onClick={() => handleMaterialClick(material)}
          >
            <span className="material-icon">
              {getMaterialType(material.path) === 'video' && '🎬'}
              {getMaterialType(material.path) === 'document' && '📄'}
              {getMaterialType(material.path) === 'image' && '🖼️'}
              {getMaterialType(material.path) === 'audio' && '🔊'}
              {getMaterialType(material.path) === 'unknown' && '📎'}
            </span>
            <span className="material-title">{material.name.replace(/\.[^/.]+$/, "")}</span>
            <span className="material-type">{getMaterialType(material.path)}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Đang tải nội dung khóa học...</div>;
  }

  return (
    <div className="course-detail">
      <div className="course-sidebar">
        <h2>{courseTitle}</h2>
        <div className="sections-list">
          {renderSections()}
        </div>
      </div>
      
      <div className="course-content">
        <div className="materials-sidebar">
          {renderBreadcrumbs()}
          <h3>{selectedSubfolder ? selectedSubfolder.name : (selectedSection ? selectedSection.title : 'Chọn phần học')}</h3>
          {renderSubfolders()}
          {renderNestedSubfolders()}
          {renderMaterials()}
        </div>
        
        <div className="content-viewer">
          {selectedMaterial ? (
            <div className="material-content">
              <h3>{selectedMaterial.name.replace(/\.[^/.]+$/, "")}</h3>
              {renderContent()}
            </div>
          ) : (
            <div className="no-material-selected">
              <p>Vui lòng chọn tài liệu để bắt đầu học</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;