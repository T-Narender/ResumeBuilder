// export const BASE_URL = process.env.NODE_ENV === 'production'
//   ? 'https://your-production-api.com'
//   : 'http://localhost:30001';

// export const API_PATHS = {
//   AUTH: {
//     LOGIN: '/api/auth/login',
//     REGISTER: '/api/auth/register',
//     PROFILE: '/api/auth/profile'
//   },
//   RESUME: {
//     CREATE: '/api/resumes/',
//     GET_ALL: '/api/resumes',
//     GET_BY_ID: (id) => `/api/resumes/${id}`,

//     UPDATE: (id) => `/api/resumes/${id}`,
//     DELETE: (id) => `/api/resumes/${id}`,
//     UPLOAD_IMAGES: (id) => `/api/resumes/${id}/upload-images/`
//   },
//   image:{
//     UPLOAD_IMAGE:`/api/auth/upload-image`
//   }
// };

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30001';

export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    GET_PROFILE: '/api/auth/profile',
  },
  RESUME: {
    CREATE: '/api/resumes', 
    GET_ALL: '/api/resumes',
    GET_BY_ID: (id) => `/api/resumes/${id}`,

    UPDATE: (id) => `/api/resumes/${id}`, 
    DELETE: (id) => `/api/resumes/${id}`, 
    UPLOAD_IMAGES: (id) => `/api/resumes/${id}/upload-images`,
  },
  image: {
    UPLOAD_IMAGE: `/api/auth/upload-image`,
  }
};

export { BASE_URL };
