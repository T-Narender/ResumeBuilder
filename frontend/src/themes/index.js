import { minimalTheme } from './minimal';
import { modernTheme } from './modern';
import { classicTheme } from './classic';
import { studentTheme } from './student';

export { minimalTheme, modernTheme, classicTheme, studentTheme };

export const getTheme = (themeName) => {
  switch (themeName?.toLowerCase()) {
    case 'minimal': return minimalTheme;
    case 'modern': return modernTheme;
    case 'classic': return classicTheme;
    case 'student': return studentTheme;
    default: return modernTheme;
  }
};
