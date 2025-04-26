import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CourseDetail from './components/CourseDetail'
import { getCourseMaterials } from './services/fileService'
import './App.css'

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const result = await getCourseMaterials('');
        console.log("Kết quả API trang chủ:", result);
        
        if (result && result.default) {
          let mappedCourses = [];
          
          // Kiểm tra nếu result.default là một mảng
          if (Array.isArray(result.default)) {
            mappedCourses = result.default.map((course, index) => ({
              id: index + 1,
              title: course.title,
              description: `Khóa học TOEIC ${course.title}`,
              path: `course-${index + 1}`, 
              originalPath: course.title
            }));
          } 
          // Nếu result.default không phải mảng mà là đối tượng có subfolders
          else if (result.default.subfolders && Array.isArray(result.default.subfolders)) {
            mappedCourses = result.default.subfolders.map((folder, index) => ({
              id: index + 1,
              title: folder.name,
              description: `Khóa học TOEIC ${folder.name}`,
              path: `course-${index + 1}`,
              originalPath: folder.path
            }));
          }
          // Nếu result.default không phải mảng mà là đối tượng có directories
          else if (result.default.directories && Array.isArray(result.default.directories)) {
            mappedCourses = result.default.directories.map((dir, index) => ({
              id: index + 1,
              title: dir,
              description: `Khóa học TOEIC ${dir}`,
              path: `course-${index + 1}`,
              originalPath: dir
            }));
          }
          
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error('Lỗi khi tải khóa học:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadCourses();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1>Nền tảng học TOEIC</h1>
          </Link>
        </header>
        
        <Routes>
          <Route path="/" element={
            <main className="main-content">
              {loading ? (
                <div className="loading">Đang tải khóa học...</div>
              ) : (
                <div className="courses-grid">
                  {courses.map((course) => (
                    <div key={course.id} className="course-card">
                      <h2>{course.title}</h2>
                      <p>{course.description}</p>
                      <Link to={`/${course.path}`}>
                        <button className="course-button">
                          Bắt đầu học
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </main>
          } />
          
          {courses.map((course) => (
            <Route 
              key={course.id}
              path={`/${course.path}/*`}
              element={<CourseDetail coursePath={course.originalPath} courseTitle={course.title} />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  )
}

export default App