import { NavigateOptions, useNavigate } from 'react-router-dom';
import { resolvePagePath } from '../lib/navigation';

export function usePageNavigation() {
  const navigate = useNavigate();

  return (page: string, options?: NavigateOptions) => {
    const targetPath = resolvePagePath(page);
    navigate(targetPath, options);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}
