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

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30001';
const BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
};

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
    EXTRACT_TEXT: '/api/resumes/extract-text',
  },
  image: {
    UPLOAD_IMAGE: `/api/auth/upload-image`,
  },
  AI: {
    GENERATE: '/api/ai/generate',
    IMPROVE_BULLET: '/api/ai/improve-bullet',
    SKILL_GAP: '/api/ai/skill-gap',
    INTERVIEW: {
      START: '/api/ai/interview/start',
      EVALUATE: '/api/ai/interview/evaluate',
      EVALUATE_SESSION: '/api/ai/interview/evaluate-session',
      SAVE: '/api/ai/interview/save'
    }
  }
};

export { BASE_URL };
